# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import os
from tensorflow.keras.models import load_model
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import uuid
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

# ------------------- Load environment variables -------------------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# ------------------- OpenAI Setup -------------------
try:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    print("✅ OpenAI client initialized")
except Exception as e:
    print(f"❌ OpenAI error: {e}")
    openai_client = None

# ------------------- Pinecone Setup -------------------
embeddings = OpenAIEmbeddings(model="text-embedding-3-small", api_key=OPENAI_API_KEY)
journal_index_name = "moodtunes-journal"

try:
    journal_store = PineconeVectorStore.from_existing_index(index_name=journal_index_name, embedding=embeddings)
    print("✅ Pinecone VectorStore connected")
except Exception as e:
    print(f"❌ Pinecone VectorStore error: {e}")
    journal_store = None

# ------------------- Fallback in-memory storage -------------------
journal_store_data = []

# ------------------- Flask App Setup -------------------
app = Flask(__name__)
CORS(app)

# ------------------- Model Setup -------------------
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "ResNet50V2_Model_Checkpoint.keras"))
model = load_model(MODEL_PATH, compile=False)
class_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

# ------------------- Spotify Setup -------------------
CLIENT_ID = "3fb14b9181c64aa7920dff7a3347754d"
CLIENT_SECRET = "d81284bfe7744907986e8c6da80d26d4"

def get_spotify_client():
    return spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET))

emotion_to_genre = {
    "happy": "pop",
    "sad": "acoustic",
    "angry": "rock",
    "surprise": "dance",
    "fear": "ambient",
    "disgust": "metal",
    "neutral": "chill"
}

# ------------------- Journal Functions -------------------
def save_journal_entry(entry_text, emotion, username="guest", title="Untitled"):
    entry_id = f"{username}-{uuid.uuid4()}"
    metadata = {
        "username": username,
        "emotion": emotion,
        "title": title,
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
    }
    if journal_store:
        journal_store.add_texts(texts=[entry_text], metadatas=[metadata], ids=[entry_id])
    journal_store_data.append({
        "id": entry_id,
        "text": entry_text,
        "title": title,
        "emotion": emotion,
        "date": metadata["date"],
        "username": username
    })
    return entry_id

def search_journal_entries(query, username="guest", top_k=5):
    results = []
    if journal_store:
        results = journal_store.similarity_search(query=query, k=top_k, filter={"username": username})
        return [
            {
                "id": doc.metadata.get("id", ""),
                "text": doc.page_content,
                "emotion": doc.metadata.get("emotion", ""),
                "date": doc.metadata.get("date", "")
            } for doc in results
        ]
    # fallback in-memory search
    return [
        e for e in journal_store_data
        if e["username"] == username and query.lower() in e["text"].lower()
    ][:top_k]

# ------------------- Endpoints -------------------

@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    try:
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400
        np_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (224, 224)).astype("float32") / 255.0
        img_resized = np.expand_dims(img_resized, axis=0)
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

@app.route('/chat', methods=['POST'])
def chat():
    if not openai_client:
        return jsonify({"error": "OpenAI not configured"}), 500
    try:
        data = request.get_json()
        user_message = data.get("message")
        current_user_emotion = data.get("emotion", "neutral")
        context = ""
        relevant_entries = search_journal_entries(user_message) if journal_store else []
        if relevant_entries:
            context = "Based on your journal: " + " ".join([e["text"] for e in relevant_entries[:2]])
        system_prompt = f"""
        You are MoodBot, a compassionate AI companion. The user is currently feeling {current_user_emotion}.
        {context}
        Follow safety guidelines: Show empathy, avoid harmful instructions, suggest safe coping strategies.
        """
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=150,
        )
        bot_reply = response.choices[0].message.content
        if len(user_message) > 20:
            save_journal_entry(f"Chat: {user_message}", current_user_emotion)
        return jsonify({"reply": bot_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/save_journal", methods=["POST"])
def save_journal():
    data = request.get_json()
    entry_id = save_journal_entry(
        data.get("entry"),
        data.get("emotion", "neutral"),
        data.get("username", "guest"),
        data.get("title", "Untitled")
    )
    return jsonify({"success": True, "entry_id": entry_id})

@app.route("/get_journal_entries")
def get_journal_entries():
    username = request.args.get("username", "guest")
    journals = [
        e for e in journal_store_data
        if e["username"] == username
    ]
    journals.sort(key=lambda x: x["date"], reverse=True)
    return jsonify({"entries": journals})

@app.route("/search_journal", methods=["POST"])
def search_journal():
    data = request.get_json()
    query = data.get("query", "")
    username = data.get("username", "guest")
    entries = [
        e for e in journal_store_data
        if e["username"] == username and query.lower() in e["title"].lower()
    ]
    return jsonify({"entries": entries})

@app.route("/delete_journal/<entry_id>", methods=["DELETE"])
def delete_journal(entry_id):
    global journal_store_data
    journal_store_data = [e for e in journal_store_data if e["id"] != entry_id]
    return jsonify({"success": True})


# ------------------- Run Server -------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
