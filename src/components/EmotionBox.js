import React from "react";
import "./EmotionBox.css";

const EmotionBox = ({ emotion, confidence }) => {
  const emojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprise: "😮",
    disgust: "🤢",
    fear: "😨",
    neutral: "😐",
  };

  const emotionTexts = {
    happy: "You seem cheerful today! Keep smiling! 😄",
    sad: "Feeling a bit down? It's okay to take a break. 💛",
    angry: "Take a deep breath. Calm moments help! 🌿",
    surprise: "Wow! Something caught you off guard! 😲",
    disgust: "Something seems off. Stay positive! 💪",
    fear: "Take courage, everything will be fine! 🌟",
    neutral: "Feeling calm and balanced. Keep it up! 🙂",
  };

  return (
    <div className="emotion-container">
      {/* Left Box: Emoji + Emotion + Confidence */}
      <div className="emotion-box left-box">
        <div className="emoji">{emojis[emotion] || "❔"}</div>
        <h3>{emotion.toUpperCase()}</h3>
        <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
      </div>

      {/* Right Box: Description */}
      <div className="emotion-box right-box">
        <p>{emotionTexts[emotion] || "Emotion detected!"}</p>
      </div>
    </div>
  );
};

export default EmotionBox;
