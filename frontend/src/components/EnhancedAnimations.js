import React, { useEffect, useState } from 'react';
import './EnhancedAnimations.css';

// Animated Background Orbs
const AnimatedOrbs = ({ emotion, intensity = 'medium' }) => {
  const [orbs, setOrbs] = useState([]);

  useEffect(() => {
    const orbCount = intensity === 'low' ? 3 : intensity === 'high' ? 8 : 5;
    const newOrbs = [];

    for (let i = 0; i < orbCount; i++) {
      newOrbs.push({
        id: i,
        size: Math.random() * 200 + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10
      });
    }

    setOrbs(newOrbs);
  }, [intensity]);

  const getOrbColor = () => {
    const colors = {
      happy: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
      sad: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
      angry: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
      surprise: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)',
      fear: 'linear-gradient(135deg, #6b7280, #4b5563, #374151)',
      disgust: 'linear-gradient(135deg, #059669, #047857, #065f46)',
      neutral: 'linear-gradient(135deg, #667eea, #764ba2, #667eea)',
      detecting: 'linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="animated-orbs">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`orb emotion-${emotion}`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: getOrbColor(),
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// Morphing Shapes
const MorphingShapes = ({ isActive = true }) => {
  if (!isActive) return null;

  return (
    <div className="morphing-shapes">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>
    </div>
  );
};

// Animated Text Reveal
const AnimatedTextReveal = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`animated-text-reveal ${isVisible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Floating Action Buttons with Trail Effect
const FloatingActionButton = ({ icon, onClick, emotion = 'neutral', children }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
    if (onClick) onClick();
  };

  return (
    <button 
      className={`floating-action-btn emotion-${emotion} ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      <div className="btn-ripple"></div>
      <div className="btn-content">
        <i className={icon}></i>
        {children && <span>{children}</span>}
      </div>
      <div className="btn-trail"></div>
    </button>
  );
};

// Magnetic Cursor Effect
const MagneticCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updatePosition);
    
    // Add magnetic effect to interactive elements
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      magneticElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div 
      className={`magnetic-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="cursor-dot"></div>
      <div className="cursor-ring"></div>
    </div>
  );
};

// Staggered Animation Container
const StaggeredContainer = ({ children, staggerDelay = 100, className = '' }) => {
  return (
    <div className={`staggered-container ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div 
          className="staggered-item"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Parallax Scroll Effect
const ParallaxElement = ({ children, speed = 0.5, className = '' }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      className={`parallax-element ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};

// Glitch Effect
const GlitchText = ({ children, isActive = false }) => {
  return (
    <div className={`glitch-text ${isActive ? 'active' : ''}`}>
      <span className="glitch-text-main">{children}</span>
      <span className="glitch-text-copy" data-text={children}>{children}</span>
      <span className="glitch-text-copy" data-text={children}>{children}</span>
    </div>
  );
};

// Liquid Button Effect
const LiquidButton = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`liquid-button liquid-${variant}`} onClick={onClick}>
      <span className="liquid-button-text">{children}</span>
      <div className="liquid-button-liquid">
        <div className="liquid-button-bubble"></div>
        <div className="liquid-button-bubble"></div>
        <div className="liquid-button-bubble"></div>
      </div>
    </button>
  );
};

export {
  AnimatedOrbs,
  MorphingShapes,
  AnimatedTextReveal,
  FloatingActionButton,
  MagneticCursor,
  StaggeredContainer,
  ParallaxElement,
  GlitchText,
  LiquidButton
};