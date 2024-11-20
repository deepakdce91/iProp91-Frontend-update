import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom"; // Added useLocation
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./aboutsection";
import Knowledge from "./knowledge";
import Testimonials from "./Testimonials";
import Insight from "./Insight";
import Comparision from "./Comparision";
import Number from "./Number";
import Footer from "./Footer";
import Library from "../Library/library";
import Faq from "../Faq/faq";
import Laws from "../Laws/laws";
import ChatScreen from "../Ownerclub/ChatArea/ChatScreen";
import { jwtDecode } from "jwt-decode";
import CaseLaws from "../CaseLaws/caselaws";
import ContactUs from "../CompoCards/contactus/ContactUs";
import BrandMarquee from "./BrandMarquee";
import NRI from "../NRI/nri";
import Advice from "../advice/advice";
import Lend from "../Lend/Lend";
import WeDoMore from "./WeDoMore";
import MobileScreen from "./MobileScreen";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Number />
      <Comparision />
      <MobileScreen />
      <BrandMarquee />
      <Knowledge />
      <WeDoMore />
      <Insight />
      <Testimonials />
      <ContactUs />
    </>
  );
}

const TypingLandingPage = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (hasVisited) {
      // Skip animation if user has already visited
      setShowMessage(false);
      setShowNavbar(true);
    } else {
      // First visit: Show animation and set 'hasVisited' in localStorage
      localStorage.setItem("hasVisited", "true");
      const messageTimeout = setTimeout(() => setShowMessage(false), 3000);
      const navbarTimeout = setTimeout(() => setShowNavbar(true), 3000);

      return () => {
        clearTimeout(messageTimeout);
        clearTimeout(navbarTimeout);
      };
    }
  }, []);

  const welcomeMessage = "Welcome to iProp91";
  const animatedText = welcomeMessage.split("").map((char, index) => (
    <span key={index} style={{ "--char-index": index }}>
      {char}
    </span>
  ));

  return (
    <>
      {showNavbar && <LandingPage />}
      {!showNavbar && (
        <div className="flex justify-center items-center h-screen">
          {showMessage && (
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold text-gold fade-in-text">
                {animatedText}
              </h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};

function Landing() {
  const [userId, setUserId] = useState();
  const [userToken, setUserToken] = useState();
  const location = useLocation(); // Hook to get current route

  useEffect(() => {
    try {
      let token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
        setUserToken(token);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/*" element={<TypingLandingPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/case-laws" element={<CaseLaws />} />
        <Route path="/laws" element={<Laws />} />
        <Route path="/nri" element={<NRI />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/lend" element={<Lend />} />
        <Route path="/chats" element={<ChatScreen userId={userId} userToken={userToken} />} />
      </Routes>
      {location.pathname !== "/advice" && <Footer />}
    </>
  );
}

export default Landing;
