"use client";

import React, { useEffect, useState } from "react";
import { ParallaxProvider, useParallax } from "react-scroll-parallax";

const TextSection = ({ children, speed = 0 }) => {
  const { ref } = useParallax({
    speed: speed,
    translateY: [0, 0],
    opacity: [1, 0],
    shouldAlwaysCompleteAnimation: true,
  });

  return (
    <div ref={ref} className="h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

const BackgroundTextOverlay = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 960);
    };

    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };

    checkScreenSize();
    checkToken();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <ParallaxProvider>
      <div className="relative h-0">
        {/* Fixed Background */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            // backgroundImage: `url("./images/nribg.png")`,
            zIndex: -1,
            left: isLargeScreen && hasToken ? "175px" : "0",
            width: isLargeScreen && hasToken ? "calc(100% - 175px)" : "100%",
          }}
        />

       
      </div>
    </ParallaxProvider>
  );
};

export default BackgroundTextOverlay;
