import React from "react";
import { useNavigate } from "react-router-dom";

import "./CoverPage.css";

const CoverPage = () => {
  const navigate = useNavigate();
  const handleScroll = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

  const emotions = [
    { name: "Angry", icon: "😡", desc: "High-energy tracks to channel frustration and let it out." },
    { name: "Disgust", icon: "🤢", desc: "Cleansing, uplifting music to shift your focus and mood." },
    { name: "Fear", icon: "😨", desc: "Calm and reassuring tracks that bring comfort and courage." },
    { name: "Happy", icon: "😊", desc: "Upbeat, lively songs to amplify your joy and excitement." },
    { name: "Sad", icon: "😢", desc: "Soothing, reflective tracks to ease your heart and comfort you." },
    { name: "Surprise", icon: "😲", desc: "Dynamic and unexpected beats to match your astonishment." },
    { name: "Neutral", icon: "😐", desc: "Balanced, versatile playlists to accompany your steady state." },
  ];

  return (
   <>

      {/* Navbar */}
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
 <div className="landing-container">
     <section className="intro-section">
  <div className="intro-wrapper">
    {/* Left Content */}
    <div className="intro-left">
      <h1>
        Discover <span className="gradient-text">Music That Feels You</span>
      </h1>
      <p>
        Moodify reads your facial expressions in real-time and curates a personalized playlist 
        that matches your mood. Happiness, sadness, surprise, or calm—our AI finds the perfect soundtrack.
      </p>
      <div className="intro-buttons">
        <button className="btn btn-primary" onClick={() => navigate("/detection")}>
          <i className="fas fa-camera"></i> Try Emotion Detection
        </button>
        <button className="btn btn-secondary" onClick={() => handleScroll("features")}>
          <i className="fas fa-info-circle"></i> How It Works
        </button>
      </div>
    </div>

    {/* Right Animated Visual */}
    <div className="intro-right">
      <div className="emoji-circle">
        {["😊","😢","😡","😲","😐"].map((emo, i) => (
          <span key={i} className="floating-emoji">{emo}</span>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* How It Works */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three steps to turn your emotions into music</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-camera feature-icon"></i>
            <h3>1. Capture</h3>
            <p>Use your webcam or upload a picture. Moodify identifies your emotion instantly.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-brain feature-icon"></i>
            <h3>2. Analyze</h3>
            <p>Our AI model interprets your expression and detects your current mood.</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-music feature-icon"></i>
            <h3>3. Listen</h3>
            <p>Get curated songs tailored to match your emotions—personalized every time.</p>
          </div>
        </div>
      </section>

      {/* Emotion Summary */}
      <section className="emotion-summary">
        <div className="section-header">
          <h2>Emotions We Detect</h2>
          <p>Each emotion has a playlist designed to match its unique vibe</p>
        </div>
        <div className="summary-grid">
          {emotions.map((emotion) => (
            <div key={emotion.name} className="summary-card">
              <span className="emoji">{emotion.icon}</span>
              <h3>{emotion.name}</h3>
              <p>{emotion.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Perfect Playlist?</h2>
          <p>Let AI analyze your mood and discover music that speaks to your soul</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate("/detection")}>
            <i className="fas fa-play"></i> Start Your Musical Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="logo">
            <i className="fas fa-music"></i>
            <span>Moodify</span>
          </div>
          <p>Connecting emotions with music through AI-powered technology.</p>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Moodify | Feel the Music, Feel the Mood</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default CoverPage;
