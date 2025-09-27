import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AICompanion from "./AICompanion";
import { ParticleSystem } from "./FloatingElements";

export default function ChatJournal() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const username = "guest";
  const [currentMood] = useState("neutral");

  const handleCompanionAction = (action) => {
    if (action === 'music') {
      navigate("/detection");
    }
  };

  // Fetch journal entries
  const fetchJournals = async () => {
    try {
      const res = await fetch(`http://localhost:5000/get_journal_entries?username=${username}`);
      const data = await res.json();
      if (data.entries) setJournalEntries(data.entries);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  // Chat send
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, emotion: "neutral" }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply || "No response" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save entire chat as one journal with title
  const handleSaveJournal = async () => {
    if (messages.length === 0) return;

    const title = prompt("Enter a title for your journal:");
    if (!title) return alert("Journal title is required!");

    const chatText = messages
      .map((msg) => `${msg.sender === "user" ? "You" : "Bot"}: ${msg.text}`)
      .join("\n");

    try {
      await fetch("http://localhost:5000/save_journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entry: chatText,
          title,
          emotion: "neutral",
          username,
        }),
      });
      alert("Chat saved as journal!");
      setMessages([]); // clear chat for fresh session
      fetchJournals(); // refresh journal list
    } catch (err) {
      console.error(err);
    }
  };

  // Delete journal
  const handleDelete = async (id) => {
    if (!id) return console.error("Journal ID is missing!");
    try {
      await fetch(`http://localhost:5000/delete_journal/${id}`, { method: "DELETE" });
      fetchJournals();
    } catch (err) {
      console.error(err);
    }
  };

  // Search journals by title
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchJournals();
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/search_journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, username }),
      });
      const data = await res.json();
      if (data.entries) setJournalEntries(data.entries);
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <>
      {/* Background Effects */}
      <ParticleSystem theme="dark" intensity="low" />
   
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("/")}>
            <i className="fas fa-music"></i>
            <span>Moodify</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate("/home")}>Home</button>
            <button className="nav-link" onClick={() => navigate("/detection")}>Detect Emotion</button>
            <button className="nav-link" onClick={() => navigate("/mood_companion")}>Mood Companion</button>
          </div>
        </div>
      </nav>
 <div style={styles.container}>
      <div style={styles.chatBox}>
        <h2>Chatbot</h2>
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                background: msg.sender === "user" ? "#007bff" : "#2c2c2c",
                color: "#fff",
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p>Thinking...</p>}
        </div>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button style={styles.button} onClick={handleSend}>Send</button>
          <button style={styles.buttonAlt} onClick={handleSaveJournal}>Save Journal</button>
        </div>
      </div>

      {/* Journal Section */}
      <div style={styles.journalBox}>
        <h2>Saved Journals</h2>
        <div style={styles.searchRow}>
          <input
            style={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal by title..."
          />
          <button style={styles.buttonAlt} onClick={handleSearch}>Search</button>
        </div>
        <div style={styles.entries}>
          {journalEntries.length === 0 && <p style={{ color: "#555" }}>No journal entries</p>}
          {journalEntries.map((entry, i) => (
            <div key={i} style={styles.entry}>
              <p>
                <b>{entry.title}</b>{" "}
                <span style={{ fontSize: "0.8em", color: "#666" }}>({entry.date})</span>
              </p>
              <pre style={{ color: "#fff" }}>{entry.text}</pre>
              <button style={styles.deleteButton} onClick={() => handleDelete(entry.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* AI Companion for Chat */}
    <AICompanion 
      currentEmotion={currentMood}
      isDetecting={loading}
      onSuggestAction={handleCompanionAction}
    />
     </>
  );
}

// Styles

const styles = {
   navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
   
    background: "#1e1e1e",
    borderBottom: "1px solid #333",
    marginBottom: "20px",
  },
  
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#00f2fe",
    cursor: "pointer",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: "5px",
    transition: "0.3s",
  },
  container: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    background: "#121212",
    color: "#fff",
    height: "80vh",
    boxSizing: "border-box",
  },
  chatBox: {
    flex: 1,
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    background: "#1e1e1e",
    height: "100%",
  },
  journalBox: {
    flex: 1,
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    background: "#1e1e1e",
    height: "100%",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "70%",
  },
  inputRow: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#2c2c2c",
    color: "#fff",
  },
  button: {
    padding: "10px 15px",
    background: "#00f2fe",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  buttonAlt: {
    padding: "10px 15px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  searchRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  entries: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  entry: {
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#2c2c2c",
    color: "#4facfe",
  },
  deleteButton: {
    marginTop: "5px",
    padding: "5px 10px",
    background: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
