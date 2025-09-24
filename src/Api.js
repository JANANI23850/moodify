// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const detectEmotion = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API_URL}/detect-emotion`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 20000,
  });
};

export const getRecommendations = (emotion, num_songs = 50) => {
  return axios.post(`${API_URL}/recommendations`, null, {
    params: { emotion, num_songs },
    timeout: 20000,
  });
};
