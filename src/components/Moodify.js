import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import SongCard from "./SongCard";
import Filters from "./Filters";
import EmotionBox from "./EmotionBox";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "http://127.0.0.1:5000";

function Moodify() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [songs, setSongs] = useState([]);
  const [numSongs, setNumSongs] = useState(10);
  const [langFilter, setLangFilter] = useState([]);
  const [artistFilter, setArtistFilter] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [artists, setArtists] = useState([]);
  const [method, setMethod] = useState("upload");
  const [loading, setLoading] = useState(false);

  // Detect emotion function
  const detectEmotion = async (imgData) => {
    if (!imgData) return;
    setLoading(true);
    try {
      const blob = await (await fetch(imgData)).blob();
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const res = await fetch(`${API_URL}/detect-emotion`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.error) {
        setEmotion(data.emotion);
        setConfidence(data.confidence);
        fetchSongs(data.emotion);
      } else alert(data.error);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  // Fetch songs function
  const fetchSongs = async (detectedEmotion) => {
    if (!detectedEmotion) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: detectedEmotion, num_songs: 50 }),
      });
      const data = await res.json();
      if (!data.error) {
        const fetchedSongs = data.songs || [];
        setSongs(fetchedSongs);
        const langs = [...new Set(fetchedSongs.map((s) => s.language))];
        const arts = [...new Set(fetchedSongs.map((s) => s.artist))];
        setLanguages(langs);
        setArtists(arts);
        setLangFilter(langs);
        setArtistFilter(arts);
      } else {
        alert(data.error);
        setSongs([]);
      }
    } catch (err) {
      alert(err);
      setSongs([]);
    }
    setLoading(false);
  };

  const filteredSongs =
    songs &&
    songs.length > 0 &&
    langFilter.length > 0 &&
    artistFilter.length > 0
      ? songs
          .filter(
            (s) => langFilter.includes(s.language) && artistFilter.includes(s.artist)
          )
          .slice(0, numSongs)
      : [];

  return (
    <div className="app-container">
      {/* CoverPage-style Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("/")}>
            <i className="fas fa-music"></i>
            <span>Moodify</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate("/home")}>
              Home
            </button>
            <button className="nav-link" onClick={() => navigate("/detection")}>
              Detect Emotion
            </button>
            <button className="nav-link" onClick={() => navigate("/mood_companion")}>
              Mood Companion
            </button>
          </div>
        </div>
      </nav>

      {/* Page Header */}
     <header className="moodify-header">
  <div className="header-content">
    <div className="header-text">
      <h1>
        🎵 Moodify: <span className="gradient-text">Music That Feels You</span>
      </h1>
     <p>✨ Experience AI-powered music recommendations based on your mood ✨</p>
      
    </div>
    
  </div>
</header>

      {/* Image upload/webcam */}
      <div className="input-method">
        <button
          onClick={() => setMethod("upload")}
          className={method === "upload" ? "active" : ""}
        >
          Upload Image
        </button>
        <button
          onClick={() => setMethod("webcam")}
          className={method === "webcam" ? "active" : ""}
        >
          Use Webcam
        </button>
      </div>

      <div className="image-input">
        {method === "upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setImage(reader.result);
              reader.readAsDataURL(file);
            }}
          />
        )}
        {method === "webcam" && (
          <WebcamCapture enabled={!image} onCaptureDataUrl={setImage} />
        )}
      </div>

      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
          <button onClick={() => detectEmotion(image)} disabled={loading}>
            {loading ? "Detecting..." : "Detect Emotion"}
          </button>
        </div>
      )}

      {emotion && <EmotionBox emotion={emotion} confidence={confidence} />}

      {/* Filters */}
      {songs && songs.length > 0 && (
        <Filters
          languages={languages}
          artists={artists}
          langFilter={langFilter}
          setLangFilter={setLangFilter}
          artistFilter={artistFilter}
          setArtistFilter={setArtistFilter}
          numSongs={numSongs}
          setNumSongs={setNumSongs}
        />
      )}

      {loading && <p className="loading-text">Fetching songs...</p>}

      {/* Songs */}
      <div className="song-grid">
        {filteredSongs.map((s, i) => (
          <SongCard key={i} song={s} />
        ))}
        {filteredSongs.length === 0 && songs.length > 0 && (
          <p>No songs match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Moodify;
