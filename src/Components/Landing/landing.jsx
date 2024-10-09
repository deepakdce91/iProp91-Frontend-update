import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./aboutsection";

function Landing() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
    </>
  );
}

const TypingLandingPage = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    // Hide the message after 3000ms and show the navbar
    const messageTimeout = setTimeout(() => setShowMessage(false), 3000);
    const navbarTimeout = setTimeout(() => setShowNavbar(true), 3000);

    // Clear timeouts if component unmounts before they complete
    return () => {
      clearTimeout(messageTimeout);
      clearTimeout(navbarTimeout);
    };
  }, []);

  // Split the welcome message into individual letters and wrap each in a <span>
  const welcomeMessage = "Welcome to iProp91";
  const animatedText = welcomeMessage.split("").map((char, index) => (
    <span key={index} style={{ "--char-index": index }}>
      {char}
    </span>
  ));

  return (
    <>
      {showNavbar && <Landing />}
      <div className="flex justify-center items-center h-screen">
        {showMessage && (
          <div className="flex flex-col items-center">
            {/* <img src="./images/logo.svg" alt="" /> */}
            <h1 className="text-4xl font-bold text-gold fade-in-text">
              {animatedText}
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default TypingLandingPage;
