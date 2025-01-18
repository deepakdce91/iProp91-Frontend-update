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
import JourneyPage from "../getstartedForm/getStartedForm";
import Call from "../CompoCards/Call";
import Stage1Form from "../Journey/Stage1Form";
import Law from "../Laws/laws";
import CentralLaw from "../Laws/components/CentralLaw";
import StateLaw from "../Laws/components/StateLaw";
import BlogPost from "../Library/BlogPost";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Comparision />
      <MobileScreen />
      <Number />
      <BrandMarquee />
      <Knowledge />
      <WeDoMore />
      <Insight />
      <Testimonials />
      <Call />

      {/* <ContactUs /> */}
    </>
  );
}

const TypingLandingPage = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const hasVisited = localStorage.getItem("hasVisited"); // Check if user has visited

  useEffect(() => {
    const checkVisit = async () => {
      const visitTime = localStorage.getItem("visitTime");
      const currentTime = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

      if (hasVisited && visitTime && currentTime - visitTime < thirtyMinutes) {
        // Skip animation if user has already visited within 30 minutes
        setShowMessage(false);
        setShowNavbar(true);
        setShowFooter(true);
      } else {
        // First visit or session expired: Show animation
        const messageTimeout = setTimeout(() => setShowMessage(false), 5000);
        const navbarTimeout = setTimeout(() => setShowNavbar(true), 5000);
        const footerTimeout = setTimeout(() => setShowFooter(true), 5000);

        // Wait for the animation to complete
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Set 'hasVisited' in localStorage after animation
        localStorage.setItem("hasVisited", "true");
        localStorage.setItem("visitTime", currentTime); // Store current time

        clearTimeout(messageTimeout);
        clearTimeout(navbarTimeout);
        clearTimeout(footerTimeout);
      }
    };

    checkVisit();
  }, [hasVisited]); // Add hasVisited to dependencies

  const welcomeMessage = "Welcome to iProp91";
  const animatedText = welcomeMessage.split("").map((char, index) => (
    <span key={index} style={{ "--char-index": index }}>
      {char}
    </span>
  ));

  return (
    <>
      {showNavbar && showFooter && <LandingPage />}
      {!showNavbar &&
        !showFooter &&
        hasVisited === null && ( // Only show message if hasVisited is null
          <div className="flex justify-center items-center h-screen bg-black">
            {showMessage && (
              <div className="flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white fade-in-text">
                  {animatedText}
                </h1>
              </div>
            )}
          </div>
        )}
    </>
  );
};

function Landing({ setIsLoggedIn }) {
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
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/*" element={<TypingLandingPage />} />

        <Route path="/library" element={<Library />} />
        <Route path="/faqs" element={<Faq />} />
        <Route path="/case-laws" element={<CaseLaws />} />

        <Route path="/laws" element={<Law />} />
        <Route path="/laws/statelaw" element={<StateLaw />} />
        <Route path="/laws/centrallaw" element={<CentralLaw />} />
        <Route path="/nri" element={<NRI />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/lend" element={<Lend />} />
        <Route
          path="/chats"
          element={<ChatScreen userId={userId} userToken={userToken} />}
        />
        <Route path="/journey" element={<JourneyPage />} />

        <Route
          path="/stage1Form"
          element={<Stage1Form setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route path="/library/:title" element={<BlogPost />} />
      </Routes>
      {location.pathname !== "/advice" ||
        location.pathname !== "/journey" ||
        (location.pathname !== "/stage1Form" && <Footer />)}
      <Footer />
    </>
  );
}

export default Landing;
