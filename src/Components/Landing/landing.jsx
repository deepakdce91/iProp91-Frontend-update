import React, { useState, useEffect } from "react";

const TypingLandingPage = () => {
    const [showMessage, setShowMessage] = useState(true);
  
    useEffect(() => {
      setTimeout(() => setShowMessage(false), 3000);
    }, []);
  
    // Split the welcome message into individual letters and wrap each in a <span>
    const welcomeMessage = "Welcome to iProp91";
    const animatedText = welcomeMessage.split("").map((char, index) => (
      <span key={index} style={{ "--char-index": index }}>
        {char}
      </span>
    ));
  
    return (
      <div className="flex justify-center items-center h-screen ">
        {showMessage && (
          <h1 className="text-4xl font-bold text-gold fade-in-text">
            {animatedText}
          </h1>
        )}
      </div>
    );
  };
  
  export default TypingLandingPage;
  