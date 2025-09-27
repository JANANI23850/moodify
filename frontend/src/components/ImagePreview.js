import React from 'react';
import { FloatingActionButton } from './EnhancedAnimations';
import './ImagePreview.css';

const ImagePreview = ({ 
  image, 
  onDetectEmotion, 
  onClearImage, 
  loading = false,
  emotion = null,
  confidence = null 
}) => {
  if (!image) return null;

  return (
    <div className="image-preview-wrapper">
      <div className="image-preview-card magnetic">
        <div className="image-container">
          <img src={image} alt="Uploaded preview" className="preview-image" />
          <button 
            className="clear-image-btn"
            onClick={onClearImage}
            title="Remove image"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="image-info">
          <h3>📸 Image Ready for Analysis</h3>
          <p>Click the button below to detect your emotion</p>
          
          {emotion && confidence && (
            <div className="detection-result">
              <div className="result-badge">
                <span className="emotion-text">{emotion}</span>
                <span className="confidence-text">
                  {(confidence * 100).toFixed(1)}% confident
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="image-actions">
          <FloatingActionButton
            icon={loading ? "fas fa-spinner fa-spin" : "fas fa-search"}
            onClick={onDetectEmotion}
            emotion={loading ? "detecting" : "surprise"}
          >
            {loading ? "🔍 Analyzing..." : "🎭 Detect Emotion"}
          </FloatingActionButton>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;