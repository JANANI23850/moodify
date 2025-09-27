import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import backgroundImage from "../assets/background.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = (response) => {
    const decoded = jwtDecode(response.credential);
    alert(`Welcome, ${decoded.name}!`);
    navigate("/home");
  };

  const styles = {
    landingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: `linear-gradient(rgba(20, 20, 20, 0.7), rgba(15, 15, 15, 0.75)), url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "20px",
      boxSizing: "border-box",
    },
    contentBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(16px)",
      padding: "30px 40px",
      borderRadius: "25px",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "460px",
      minHeight: "420px",
      color: "#4facfe",
      animation: "fadeIn 1s ease-in-out",
      gap: "20px",
    },
    title: {
      fontSize: "34px",
      fontWeight: "700",
      margin: "0",
      letterSpacing: "1px",
      textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
    },
    subtitle: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#e0e0e0",
      margin: "0 0 15px 0",
    },
    buttonRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
      width: "100%",
    },
    buttonWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    smallText: {
      fontSize: "13px",
      fontWeight: "500",
      color: "#ccc",
      marginBottom: "8px",
      textAlign: "center",
    },
    actionButton: {
      background: "linear-gradient(135deg, #8e2de2, #4a00e0)",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 5px 18px rgba(0,0,0,0.4)",
      width: "100%",
    },
    actionButtonHover: {
      background: "linear-gradient(135deg, #4a00e0, #8e2de2)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    },
    googleLogin: {
      marginTop: "18px",
      textAlign: "center",
      width: "100%",
    },
  };

  return (
    <div style={styles.landingContainer}>
      <div style={styles.contentBox}>
        <h1 style={styles.title}>✨ Welcome to Moodify</h1>
        <p style={styles.subtitle}>
          Discover personalized experiences and elevate your mood with our
          platform.
        </p>

        {/* Sign Up & Sign In side by side */}
        <div style={styles.buttonRow}>
          <div style={styles.buttonWrapper}>
            <p style={styles.smallText}>🆕 New user? Register</p>
            <button
              onClick={() => navigate("/signup")}
              style={styles.actionButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #4a00e0, #8e2de2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #8e2de2, #4a00e0)")
              }
            >
              Register
            </button>
          </div>

          <div style={styles.buttonWrapper}>
            <p style={styles.smallText}>👤 Already a user? Login</p>
            <button
              onClick={() => navigate("/signin")}
              style={styles.actionButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #4a00e0, #8e2de2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #8e2de2, #4a00e0)")
              }
            >
              Login
            </button>
          </div>
        </div>

        {/* Google Login */}
        <div style={styles.googleLogin}>
          <p style={styles.smallText}>⚡ Quick login with Google</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google Sign-In failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
