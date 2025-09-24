// src/components/WebcamCapture.js
import React, { useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onCaptureDataUrl, enabled = false }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCaptureDataUrl(imageSrc);
    }
  };

  if (!enabled) return null; // hide webcam if not enabled

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ width: 480, height: 360, facingMode: "user" }}
        style={{
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
          marginBottom: 10,
        }}
      />
      <br />
      <button
        onClick={capture}
        style={{
          padding: "10px 20px",
          borderRadius: 12,
          border: "1px solid #00f2fe",
          background: "#1f1f1f",
          color: "#00f2fe",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Capture Photo
      </button>
    </div>
  );
};

export default WebcamCapture;
