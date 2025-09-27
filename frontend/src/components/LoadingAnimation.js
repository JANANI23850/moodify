import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ isVisible, message = "Processing...", type = "emotion" }) => {
  if (!isVisible) return null;

  const getLoadingIcon = () => {
    switch (type) {
      case 'emotion':
        return '🎭';
      case 'music':
        return '🎵';
      case 'chat':
        return '💬';
      default:
        return '✨';
    }
  };

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        {/* Animated Background */}
        <div className="loading-bg">
          <div className="loading-orb loading-orb-1"></div>
          <div className="loading-orb loading-orb-2"></div>
          <div className="loading-orb loading-orb-3"></div>
        </div>

        {/* Main Loading Content */}
        <div className="loading-content">
          {/* Animated Icon */}
          <div className="loading-icon">
            <span className="loading-emoji">{getLoadingIcon()}</span>
            <div className="loading-ring">
              <div className="loading-ring-segment"></div>
              <div className="loading-ring-segment"></div>
              <div className="loading-ring-segment"></div>
              <div className="loading-ring-segment"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="loading-text">
            <h3>{message}</h3>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="loading-progress">
            <div className="loading-progress-bar">
              <div className="loading-progress-fill"></div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="loading-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="loading-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Component
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-header"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-line-long"></div>
              <div className="skeleton-line skeleton-line-medium"></div>
              <div className="skeleton-line skeleton-line-short"></div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="skeleton-text">
            <div className="skeleton-line skeleton-line-long"></div>
            <div className="skeleton-line skeleton-line-medium"></div>
          </div>
        );
      case 'image':
        return <div className="skeleton-image"></div>;
      default:
        return <div className="skeleton-default"></div>;
    }
  };

  return (
    <div className="skeleton-container">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// Pulse Loading Component
const PulseLoader = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`pulse-loader pulse-${size} pulse-${color}`}>
      <div className="pulse-dot pulse-dot-1"></div>
      <div className="pulse-dot pulse-dot-2"></div>
      <div className="pulse-dot pulse-dot-3"></div>
    </div>
  );
};

// Spinner Loading Component
const SpinnerLoader = ({ size = 'medium', variant = 'ring' }) => {
  return (
    <div className={`spinner-loader spinner-${size}`}>
      {variant === 'ring' && (
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {variant === 'dots' && (
        <div className="spinner-dots">
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
      )}
      {variant === 'wave' && (
        <div className="spinner-wave">
          <div className="spinner-bar"></div>
          <div className="spinner-bar"></div>
          <div className="spinner-bar"></div>
          <div className="spinner-bar"></div>
          <div className="spinner-bar"></div>
        </div>
      )}
    </div>
  );
};

export { LoadingAnimation, SkeletonLoader, PulseLoader, SpinnerLoader };