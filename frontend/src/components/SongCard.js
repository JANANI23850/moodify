// src/components/SongCard.js
import React, { useState } from "react";
import "./SongCard.css";

const SongCard = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const embedUrl = song.spotify_uri
    ? `https://open.spotify.com/embed/track/${song.spotify_uri.split(":").pop()}`
    : null;

  const handlePreview = () => {
    if (song.preview_url) {
      // Handle preview playback logic here
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="song-card">
      <div className="song-info">
        <div className="song-details">
          <h3>{song.name}</h3>
          <p className="artist">{song.artist}</p>
          <span className="language">{song.language}</span>
        </div>
      </div>
      
      {embedUrl && (
        <iframe
          src={embedUrl}
          className="spotify-embed"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${song.name} by ${song.artist}`}
        ></iframe>
      )}
      
      <div className="song-actions">
        {song.spotify_url && (
          <a 
            href={song.spotify_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="song-link"
          >
            <i className="fas fa-external-link-alt"></i>
            Open in Spotify
          </a>
        )}
        
        {song.preview_url && (
          <button 
            className="preview-button"
            onClick={handlePreview}
            title={isPlaying ? "Pause Preview" : "Play Preview"}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SongCard;
