import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background(2).jpg"; // <-- your background image

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const handleSignUp = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      alert("User already exists. Please sign in.");
    } else {
      users.push(formData);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Sign up successful! Please sign in.");
      navigate("/signin");
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
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(14px)",
      padding: "35px 40px",
      borderRadius: "22px",
      boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
      width: "100%",
      maxWidth: "450px",
      minHeight: "480px",
      color: "#fff",
      gap: "18px",
      textAlign: "center",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#4facfe",
      marginBottom: "10px",
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
      padding: "12px",
      borderRadius: "50px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      color: "#fff",
      marginTop: "10px",
      transition: "0.3s ease-in-out",
    },
    buttonHover: {
      background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
    },
    extraText: {
      fontSize: "14px",
      color: "#ccc",
      marginTop: "15px",
      lineHeight: "1.5",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.title}>📝 Create Account</h1>
        <p style={styles.subtitle}>
          Join Moodify to personalize your experience and uplift your mood!
        </p>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={styles.input}
        />
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
          onClick={handleSignUp}
        >
          Sign Up
        </button>

        <p style={styles.extraText}>
          Already have an account?{" "}
          <span style={{ color: "#6a11cb", cursor: "pointer" }} onClick={() => navigate("/signin")}>
            Sign In
          </span>
          <br />
          By signing up, you agree to our <span style={{ color: "#2575fc", cursor: "pointer" }}>Terms & Privacy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
