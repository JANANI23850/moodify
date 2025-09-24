import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoverPage from "./components/CoverPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Moodify from "./components/Moodify";
import LandingPage from "./components/LandingPage";
import { GoogleOAuthProvider } from "@react-oauth/google";



function App() {
  return (
   
      <GoogleOAuthProvider clientId="955368993073-oq4b6s3fbs5v50ics1tsdngek1qn2gvl.apps.googleusercontent.com">
        <Router>
          <Routes>
            <Route path="/home" element={<CoverPage />} />
            <Route path="/detection" element={<Moodify />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<LandingPage />} />
      
          </Routes>
        </Router>
      </GoogleOAuthProvider>
   
  );
}

export default App;
