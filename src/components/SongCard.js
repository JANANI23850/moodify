// src/components/SongCard.js
import React from "react";
import "./SongCard.css";

const SongCard = ({ song }) => {
  const embedUrl = song.spotify_uri
    ? `https://open.spotify.com/embed/track/${song.spotify_uri.split(":").pop()}`
    : null;

  return (
    <div className="song-card">
      <div className="song-info">
        <div>
          <h4>{song.name}</h4>
          <p>👤 {song.artist}</p>
          <p>🌐 {song.language}</p>
        </div>
        {song.spotify_url && !embedUrl && (
          <a href={song.spotify_url} target="_blank" rel="noreferrer">
            Listen on Spotify
          </a>
        )}
      </div>
      {embedUrl && (
        <iframe
          src={embedUrl}
          className="spotify-embed"
          frameBorder="0"
          allow="encrypted-media"
          title={song.name}
        ></iframe>
      )}
    </div>
  );
};

export default SongCard;
