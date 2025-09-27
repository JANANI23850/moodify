import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AICompanion from "./AICompanion";
import { ParticleSystem, BackgroundWaves } from "./FloatingElements";
import { AnimatedOrbs, MorphingShapes, AnimatedTextReveal, FloatingActionButton, MagneticCursor, StaggeredContainer, ParallaxElement } from "./EnhancedAnimations";
import "./CoverPage.css";

const CoverPage = () => {
  const navigate = useNavigate();
  const [showEffects, setShowEffects] = useState(true);
  
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleCompanionAction = (action) => {
    if (action === 'music') {
      navigate("/detection");
    }
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
      {/* Enhanced Background Effects */}
      <MagneticCursor />
      <AnimatedOrbs emotion="neutral" intensity="low" />
      <MorphingShapes isActive={showEffects} />
      <ParticleSystem theme="dark" intensity="low" />
      <BackgroundWaves emotion="neutral" isActive={showEffects} />

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
            <button 
              className="nav-link" 
              onClick={() => setShowEffects(!showEffects)}
              title="Toggle effects"
            >
              {showEffects ? "🎭" : "✨"}
            </button>
          </div>
        </div>
      </nav>
 <div className="landing-container">
     <section className="intro-section">
  <div className="intro-wrapper">
    {/* Left Content */}
    <div className="intro-left">
      <AnimatedTextReveal delay={300}>
        <h1>
          Discover <span className="gradient-text">Music That Feels You</span>
        </h1>
      </AnimatedTextReveal>
      <AnimatedTextReveal delay={600}>
        <p>
          Moodify reads your facial expressions in real-time and curates a personalized playlist 
          that matches your mood. Happiness, sadness, surprise, or calm—our AI finds the perfect soundtrack.
        </p>
      </AnimatedTextReveal>
      <AnimatedTextReveal delay={900}>
        <div className="intro-buttons">
          <FloatingActionButton
            icon="fas fa-camera"
            onClick={() => navigate("/detection")}
            emotion="happy"
          >
            Try Emotion Detection
          </FloatingActionButton>
          <FloatingActionButton
            icon="fas fa-info-circle"
            onClick={() => handleScroll("features")}
            emotion="neutral"
          >
            How It Works
          </FloatingActionButton>
        </div>
      </AnimatedTextReveal>
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
      <ParallaxElement speed={0.3}>
        <section className="features" id="features">
          <div className="section-header">
            <AnimatedTextReveal delay={200}>
              <h2>How It Works</h2>
            </AnimatedTextReveal>
            <AnimatedTextReveal delay={400}>
              <p>Three steps to turn your emotions into music</p>
            </AnimatedTextReveal>
          </div>
          <StaggeredContainer className="features-grid" staggerDelay={200}>
            <div className="feature-card magnetic">
              <i className="fas fa-camera feature-icon"></i>
              <h3>1. Capture</h3>
              <p>Use your webcam or upload a picture. Moodify identifies your emotion instantly.</p>
            </div>
            <div className="feature-card magnetic">
              <i className="fas fa-brain feature-icon"></i>
              <h3>2. Analyze</h3>
              <p>Our AI model interprets your expression and detects your current mood.</p>
            </div>
            <div className="feature-card magnetic">
              <i className="fas fa-music feature-icon"></i>
              <h3>3. Listen</h3>
              <p>Get curated songs tailored to match your emotions—personalized every time.</p>
            </div>
          </StaggeredContainer>
        </section>
      </ParallaxElement>

      {/* Emotion Summary */}
      <ParallaxElement speed={0.2}>
        <section className="emotion-summary">
          <div className="section-header">
            <AnimatedTextReveal delay={200}>
              <h2>Emotions We Detect</h2>
            </AnimatedTextReveal>
            <AnimatedTextReveal delay={400}>
              <p>Each emotion has a playlist designed to match its unique vibe</p>
            </AnimatedTextReveal>
          </div>
          <StaggeredContainer className="summary-grid" staggerDelay={100}>
            {emotions.map((emotion) => (
              <div key={emotion.name} className="summary-card magnetic">
                <span className="emoji">{emotion.icon}</span>
                <h3>{emotion.name}</h3>
                <p>{emotion.desc}</p>
              </div>
            ))}
          </StaggeredContainer>
        </section>
      </ParallaxElement>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <AnimatedTextReveal delay={200}>
            <h2>Ready to Find Your Perfect Playlist?</h2>
          </AnimatedTextReveal>
          <AnimatedTextReveal delay={400}>
            <p>Let AI analyze your mood and discover music that speaks to your soul</p>
          </AnimatedTextReveal>
          <AnimatedTextReveal delay={600}>
            <FloatingActionButton
              icon="fas fa-play"
              onClick={() => navigate("/detection")}
              emotion="happy"
            >
              Start Your Musical Journey
            </FloatingActionButton>
          </AnimatedTextReveal>
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

    {/* AI Companion for Home Page */}
    <AICompanion 
      currentEmotion="neutral"
      isDetecting={false}
      onSuggestAction={handleCompanionAction}
    />
    </>
  );
};

export default CoverPage;
