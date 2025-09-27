import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background(2).jpg"; // <-- your background image

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleSignIn = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) =>
        user.email === formData.email && user.password === formData.password
    );

    if (user) {
      alert("Sign in successful!");
      navigate("/home");
    } else {
      alert("Invalid email or password. Please sign up first.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      padding: "20px",
      backgroundImage: `linear-gradient(rgba(20,20,20,0.7), rgba(15,15,15,0.75)), url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    formBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(16px)",
      padding: "40px 45px",
      borderRadius: "25px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
      width: "100%",
      maxWidth: "460px",
      minHeight: "480px",
      color: "#fff",
      gap: "20px",
    },
    title: {
      fontSize: "34px",
      fontWeight: "700",
      color: "#4facfe",
      marginBottom: "10px",
      textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
    },
    subtitle: {
      fontSize: "16px",
      color: "#ddd",
      lineHeight: "1.6",
      marginBottom: "25px",
    },
    input: {
      width: "90%",
      padding: "12px",
      borderRadius: "50px",
      border: "none",
      outline: "none",
      fontSize: "15px",
      marginBottom: "12px",
      background: "rgba(255,255,255,0.15)",
      color: "#fff",
      textAlign: "center",
    },
    button: {
      width: "95%",
      padding: "14px",
      borderRadius: "50px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      color: "#fff",
      marginTop: "10px",
      transition: "0.3s ease-in-out",
      boxShadow: "0 5px 18px rgba(0,0,0,0.4)",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    },
    extraText: {
      fontSize: "14px",
      color: "#ccc",
      marginTop: "15px",
      lineHeight: "1.5",
    },
    highlightText: {
      color: "#6a11cb",
      cursor: "pointer",
    },
    linkText: {
      color: "#2575fc",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.title}>👤 Sign In</h1>
        <p style={styles.subtitle}>
          Welcome back! Sign in to continue your personalized Moodify experience.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={styles.input}
        />

        <button
          style={{ ...styles.button, ...(hover ? styles.buttonHover : {}) }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <p style={styles.extraText}>
          New here?{" "}
          <span style={styles.highlightText} onClick={() => navigate("/signup")}>
            Create an account
          </span>
          <br />
          By signing in, you agree to our{" "}
          <span style={styles.linkText}>Terms & Privacy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
