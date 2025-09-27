import React, { useEffect, useState } from 'react';
import './FloatingElements.css';

const FloatingElements = ({ emotion, isActive = true }) => {
  const [elements, setElements] = useState([]);

  // Emotion-based floating elements
  const emotionElements = {
    happy: ['✨', '🌟', '💫', '⭐', '🎉', '🎊', '💖', '🌈'],
    sad: ['💧', '🌧️', '☔', '💙', '🌊', '💔', '😢', '🌫️'],
    angry: ['🔥', '⚡', '💥', '🌋', '⭐', '💢', '🔴', '🌪️'],
    surprise: ['❗', '❓', '💥', '⚡', '🎯', '🎪', '🎭', '🎨'],
    fear: ['👻', '🌙', '⭐', '🌟', '💫', '🔮', '🌌', '✨'],
    disgust: ['🌿', '🍃', '🌱', '🌸', '🌺', '🌻', '🌷', '🌹'],
    neutral: ['⚪', '⚫', '🔘', '⭕', '🔵', '🟣', '🟢', '🟡'],
    detecting: ['🔍', '🔎', '📡', '🎯', '⚙️', '🔧', '⚡', '💫']
  };

  useEffect(() => {
    if (!isActive) {
      setElements([]);
      return;
    }

    const currentElements = emotionElements[emotion] || emotionElements.neutral;
    const newElements = [];

    // Create 8-12 floating elements
    const count = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < count; i++) {
      const element = currentElements[Math.floor(Math.random() * currentElements.length)];
      newElements.push({
        id: i,
        emoji: element,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 15,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5
      });
    }

    setElements(newElements);

    // Clean up elements after animation
    const cleanup = setTimeout(() => {
      setElements([]);
    }, 20000);

    return () => clearTimeout(cleanup);
  }, [emotion, isActive, emotionElements]);

  if (!isActive || elements.length === 0) return null;

  return (
    <div className="floating-elements-container">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`floating-element emotion-${emotion}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`
          }}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  );
};

// Particle system for background ambiance
const ParticleSystem = ({ theme = 'dark', intensity = 'medium' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = intensity === 'low' ? 20 : intensity === 'high' ? 60 : 40;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 30,
        delay: Math.random() * 10
      });
    }

    setParticles(newParticles);
  }, [intensity]);

  return (
    <div className={`particle-system ${theme}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Animated background waves
const BackgroundWaves = ({ emotion, isActive = true }) => {
  if (!isActive) return null;

  const getWaveColor = () => {
    const colors = {
      happy: 'rgba(251, 191, 36, 0.1)',
      sad: 'rgba(59, 130, 246, 0.1)',
      angry: 'rgba(239, 68, 68, 0.1)',
      surprise: 'rgba(139, 92, 246, 0.1)',
      fear: 'rgba(107, 114, 128, 0.1)',
      disgust: 'rgba(5, 150, 105, 0.1)',
      neutral: 'rgba(102, 126, 234, 0.1)',
      detecting: 'rgba(6, 182, 212, 0.1)'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="background-waves">
      <div 
        className="wave wave-1" 
        style={{ '--wave-color': getWaveColor() }}
      />
      <div 
        className="wave wave-2" 
        style={{ '--wave-color': getWaveColor() }}
      />
      <div 
        className="wave wave-3" 
        style={{ '--wave-color': getWaveColor() }}
      />
    </div>
  );
};

export { FloatingElements, ParticleSystem, BackgroundWaves };