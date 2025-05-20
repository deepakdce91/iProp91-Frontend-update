import React, { useLayoutEffect, useState, useRef } from "react";
import Calculator from "./calculator.jsx";
import { Features } from "./features.jsx";
import { Hero } from "./hero.jsx";
import Profile from "../User/Profile/profile.jsx";

const Lend = () => {
  const [hasToken, setHasToken] = useState(false);
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    // Check token
    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };
    checkToken();

    // Scroll to hero section
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div ref={heroRef}>
        <Hero />
      </div>
      <Calculator />
      <Features />
    </div>
  );
};

export default Lend;