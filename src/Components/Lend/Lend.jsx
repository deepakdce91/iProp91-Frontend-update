import React, { useEffect, useState } from "react";

import  Calculator  from "./calculator.jsx";
import { Features } from "./features.jsx";
import { Hero } from "./hero.jsx";
import Profile from "../User/Profile/profile.jsx";

const Lend = () => {
  const [hasToken, setHasToken] = useState(false); // State for token presence

  useEffect(() => {

    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token")); // Check for token in localStorage
    };

    checkToken();
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Profile Header */}
      {hasToken && (
        <div className="fixed z-50 top-4 right-4 bg-white p-2 rounded shadow">
          <Profile  />
        </div>
      )}
    <Hero />
    <Calculator />
    <Features />
  </main>
  );
};

export default Lend;
