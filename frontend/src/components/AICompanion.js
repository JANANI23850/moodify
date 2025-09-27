import React, { useState, useEffect } from 'react';
import './AICompanion.css';

const AICompanion = ({ currentEmotion, isDetecting, onSuggestAction }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [companionMood, setCompanionMood] = useState('neutral');

  // AI Companion messages based on emotions and states
  const messages = {
    welcome: [
      "Hi there! I'm Kira, your AI emotion companion! 🤖",
      "Ready to explore your emotions together? Let's start!",
      "I'm here to help you understand your feelings better!"
    ],
    detecting: [
      "Analyzing your expression... 🔍",
      "Reading your emotions... Almost there!",
      "Processing your facial features... Hold still!"
    ],
    happy: [
      "Wow! Your happiness is contagious! 😊 Keep spreading those positive vibes!",
      "I love seeing you smile! Your joy brightens my circuits! ✨",
      "Happiness detected! You're radiating pure sunshine today! 🌟"
    ],
    sad: [
      "I notice you're feeling down. It's okay to feel sad sometimes. 💙",
      "Your emotions are valid. Would you like some uplifting music to help? 🎵",
      "Sadness is part of being human. I'm here to support you through this. 🤗"
    ],
    angry: [
      "I sense some frustration. Take a deep breath with me... inhale... exhale... 🌬️",
      "Anger can be powerful when channeled right. Let's find some energetic music! 🔥",
      "Feeling heated? Let's cool down with some calming techniques. 🧘‍♀️"
    ],
    surprise: [
      "Whoa! Something caught you off guard! I love surprises too! 😲",
      "Your surprise expression is fascinating! What happened? ⚡",
      "Unexpected moments make life interesting, don't they? 🎯"
    ],
    fear: [
      "I detect some worry. Remember, courage isn't the absence of fear. 💪",
      "You're braver than you think! Let's find some comforting music. 🛡️",
      "Fear is natural. I'm here with you - you're not alone. 🌟"
    ],
    disgust: [
      "Something doesn't feel right? Trust your instincts! 🛡️",
      "Your intuition is speaking. Let's find something more pleasant! 🌸",
      "Sometimes we need to step away from what bothers us. That's wisdom! 💭"
    ],
    neutral: [
      "You seem calm and balanced. Perfect state for reflection! 🧘‍♀️",
      "Neutral emotions are beautiful too. Inner peace is powerful! ☯️",
      "A calm mind is like still water - it reflects everything clearly. 🌊"
    ],
    encouragement: [
      "Try capturing your emotion! I'm excited to see what we discover! 📸",
      "Don't be shy! Every emotion tells a beautiful story. 📖",
      "Ready for some musical magic based on your mood? 🎭"
    ]
  };

  // Update companion mood based on user emotion
  useEffect(() => {
    if (currentEmotion) {
      setCompanionMood(currentEmotion);
      const emotionMessages = messages[currentEmotion] || messages.neutral;
      const randomMessage = emotionMessages[Math.floor(Math.random() * emotionMessages.length)];
      updateMessage(randomMessage);
    }
  }, [currentEmotion, messages]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = messages.welcome[Math.floor(Math.random() * messages.welcome.length)];
    updateMessage(welcomeMessage);
    
    // Show encouragement after 5 seconds if no emotion detected
    const encouragementTimer = setTimeout(() => {
      if (!currentEmotion) {
        const encourageMessage = messages.encouragement[Math.floor(Math.random() * messages.encouragement.length)];
        updateMessage(encourageMessage);
      }
    }, 5000);

    return () => clearTimeout(encouragementTimer);
  }, [currentEmotion, messages.welcome, messages.encouragement]);

  // Update message when detecting
  useEffect(() => {
    if (isDetecting) {
      const detectingMessage = messages.detecting[Math.floor(Math.random() * messages.detecting.length)];
      updateMessage(detectingMessage);
    }
  }, [isDetecting, messages.detecting]);

  const updateMessage = (newMessage) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMessage(newMessage);
      setIsAnimating(false);
    }, 300);
  };

  const getCompanionExpression = () => {
    const expressions = {
      happy: '😊',
      sad: '😔',
      angry: '😤',
      surprise: '😮',
      fear: '😰',
      disgust: '🤔',
      neutral: '🤖',
      detecting: '🔍'
    };
    return expressions[isDetecting ? 'detecting' : companionMood] || '🤖';
  };

  const handleCompanionClick = () => {
    const tips = [
      "Tip: Make sure you're well-lit for better emotion detection! 💡",
      "Fun fact: I can detect 7 different emotions! 🎭",
      "Did you know? Music can actually change your mood! 🎵",
      "Pro tip: Try different expressions to see how I respond! 😄",
      "Remember: All emotions are valid and important! 💝"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    updateMessage(randomTip);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <div className="ai-companion-minimized" onClick={toggleVisibility}>
        <div className="companion-icon">🤖</div>
      </div>
    );
  }

  return (
    <div className={`ai-companion ${companionMood}`}>
      <div className="companion-header">
        <div className="companion-avatar">
          <div className="avatar-circle">
            <span className="companion-face">{getCompanionExpression()}</span>
            <div className="pulse-ring"></div>
          </div>
          <div className="companion-name">
            <h4>Kira AI</h4>
            <span className="status">
              {isDetecting ? 'Analyzing...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="companion-controls">
          <button 
            className="minimize-btn" 
            onClick={toggleVisibility}
            title="Minimize companion"
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
      </div>

      <div className="companion-body">
        <div 
          className={`message-bubble ${isAnimating ? 'animating' : ''}`}
          onClick={handleCompanionClick}
        >
          <p>{currentMessage}</p>
          <div className="message-tail"></div>
        </div>

        <div className="companion-actions">
          {currentEmotion && (
            <button 
              className="action-btn primary"
              onClick={() => onSuggestAction && onSuggestAction('music')}
            >
              <i className="fas fa-music"></i>
              Get Music
            </button>
          )}
          
          <button 
            className="action-btn secondary"
            onClick={() => {
              const encourageMessage = messages.encouragement[Math.floor(Math.random() * messages.encouragement.length)];
              updateMessage(encourageMessage);
            }}
          >
            <i className="fas fa-lightbulb"></i>
            Tip
          </button>
        </div>
      </div>

      <div className="companion-mood-indicator">
        <div className={`mood-bar ${companionMood}`}></div>
      </div>
    </div>
  );
};

export default AICompanion;