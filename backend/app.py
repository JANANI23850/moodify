# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import os
from tensorflow.keras.models import load_model
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# ------------------- App Setup -------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ------------------- Model Setup -------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "ResNet50V2_Model_Checkpoint.keras")
MODEL_PATH = os.path.abspath(MODEL_PATH)

# Load model (no need to compile for inference)
model = load_model(MODEL_PATH, compile=False)

# Classes
class_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

# ------------------- Spotify Setup -------------------
CLIENT_ID = "3fb14b9181c64aa7920dff7a3347754d"
CLIENT_SECRET = "d81284bfe7744907986e8c6da80d26d4"

def get_spotify_client():
    return spotipy.Spotify(auth_manager=SpotifyClientCredentials(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    ))

emotion_to_genre = {
    "happy": "pop",
    "sad": "acoustic",
    "angry": "rock",
    "surprise": "dance",
    "fear": "ambient",
    "disgust": "metal",
    "neutral": "chill"
}

# ------------------- Endpoints -------------------
@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400

        # Read file
        np_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Preprocess
        img_resized = cv2.resize(img_rgb, (224, 224)).astype("float32") / 255.0
        img_resized = np.expand_dims(img_resized, axis=0)  # shape (1,224,224,3)

        # Predict
        preds = model.predict(img_resized)
        idx = int(np.argmax(preds))
        emotion = class_labels[idx]
        confidence = float(np.max(preds))

        return jsonify({"emotion": emotion, "confidence": confidence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recommendations", methods=["POST"])
def recommendations():
    try:
        data = request.get_json()
        if not data or "emotion" not in data:
            return jsonify({"error": "Emotion not provided"}), 400

        emotion = data["emotion"]
        num_songs = int(data.get("num_songs", 20))

        sp = get_spotify_client()
        genre = emotion_to_genre.get(emotion.lower(), "pop")
       
        languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Punjabi", "Gujarati"]


        songs = []
        for lang in languages:
            query = f"{genre} {lang} mood"
            results = sp.search(q=query, type="track", limit=num_songs)
            for item in results["tracks"]["items"]:
                songs.append({
                    "name": item["name"],
                    "artist": item["artists"][0]["name"],
                    "language": lang,
                    "spotify_url": item["external_urls"]["spotify"],
                    "spotify_uri": item["uri"],
                    "preview_url": item.get("preview_url")
                })

        return jsonify({"emotion": emotion, "songs": songs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
