// src/components/WebcamCapture.js
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCaptureDataUrl, enabled = true }) => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = () => {
    if (!webcamRef.current) return;
    
    setIsCapturing(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCaptureDataUrl(imageSrc);
      }
      setIsCapturing(false);
    }, 200);
  };

  if (!enabled) return null;

  const webcamStyle = {
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    border: "2px solid rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
    filter: isCapturing ? "brightness(1.2)" : "brightness(1)",
  };

  const containerStyle = {
    textAlign: "center",
    marginBottom: "32px",
    padding: "24px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    maxWidth: "600px",
    margin: "0 auto 32px auto",
  };

  const buttonStyle = {
    padding: "14px 28px",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    marginTop: "16px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ 
          color: "#f8fafc", 
          marginBottom: "8px", 
          fontSize: "1.25rem",
          fontWeight: "600"
        }}>
          📸 Live Camera Feed
        </h3>
        <p style={{ 
          color: "#cbd5e1", 
          margin: "0",
          fontSize: "0.95rem"
        }}>
          Position yourself in the frame and capture your emotion
        </p>
      </div>
      
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ 
          width: 640, 
          height: 480, 
          facingMode: "user" 
        }}
        style={webcamStyle}
      />
      
      <button
        onClick={capture}
        disabled={isCapturing}
        style={{
          ...buttonStyle,
          opacity: isCapturing ? 0.7 : 1,
          transform: isCapturing ? "scale(0.95)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!isCapturing) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 30px rgba(102, 126, 234, 0.6)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isCapturing) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
          }
        }}
      >
        <i className={`fas ${isCapturing ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
        {isCapturing ? "Capturing..." : "Capture Photo"}
      </button>
    </div>
  );
};

export default WebcamCapture;
