import React, { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Lazy load components
const HeroSection = lazy(() => import("./HeroSection"));
const AboutSection = lazy(() => import("./aboutsection"));
const Knowledge = lazy(() => import("./knowledge"));
const Testimonials = lazy(() => import("./Testimonials"));
const Insight = lazy(() => import("./Insight"));
const Comparision = lazy(() => import("./Comparision"));
const Number = lazy(() => import("./Number"));
const BrandMarquee = lazy(() => import("./BrandMarquee"));
const ListingCompo = lazy(() => import("./ListingCompo"));
const WeDoMore = lazy(() => import("./WeDoMore"));
const MobileScreen = lazy(() => import("./MobileScreen"));
const Call = lazy(() => import("../CompoCards/Call"));

// Lazy load route components
const Map = lazy(() => import("../map/map"));
const PropertyListing = lazy(() => import("../propertyListing/listing"));
const PropertyDetails = lazy(() => import("../listingpage/id/page"));
const Library = lazy(() => import("../Library/library"));
const Faq = lazy(() => import("../Faq/faq"));
const CaseLaws = lazy(() => import("../CaseLaws/caselaws"));
const Law = lazy(() => import("../Laws/laws"));
const StateLaw = lazy(() => import("../Laws/components/StateLaw"));
const CentralLaw = lazy(() => import("../Laws/components/CentralLaw"));
const NRI = lazy(() => import("../NRI/nri"));
const Advice = lazy(() => import("../advice/advice"));
const Lend = lazy(() => import("../Lend/Lend"));
const SiteFaqs = lazy(() => import("../site-faqs/page"));
const RedeemRewards = lazy(() => import("../redeemRewards/Index"));
const PropertyJouneyPage = lazy(() => import("../PropertyJourneyPage/page"));
const ServConci = lazy(() => import("../services/Concierge")); 
const ServOwnerClub = lazy(() => import("../services/ownersClub"));
const ServSafe = lazy(() => import("../services/safe"));
const ServListingCompo = lazy(() => import("../services/listing"));
const AboutUs = lazy(() => import("../FrontendPages/AboutUs"));
const PrivacyPolicy = lazy(() => import("../FrontendPages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../FrontendPages/TermsAndConditions"));
const ChatScreen = lazy(() => import("../Ownerclub/ChatArea/ChatScreen"));
const JourneyPage = lazy(() => import("../getstartedForm/getStartedForm"));
const Stage1Form = lazy(() => import("../Journey/Stage1Form"));
const Stage2Form = lazy(() => import("../Journey/Stage2Form"));
const BlogPost = lazy(() => import("../Library/BlogPost"));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,#111c2c_10%,#111c2c_50%,#0b0d1e_100%)]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function LandingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="bg-[radial-gradient(circle_at_center,#111c2c_10%,#111c2c_50%,#0b0d1e_100%)]">
        <HeroSection />
        <AboutSection />
      </div>
      
      <Comparision />
      <WeDoMore/>
      <MobileScreen />
      <Number />
      <BrandMarquee />
      <Knowledge />
      <ListingCompo />

      <div className="bg-[radial-gradient(circle_at_center,#111c2c_10%,#111c2c_50%,#0b0d1e_100%)]">
        <Insight />
        <Testimonials />
        <Call />
      </div>
    </Suspense>
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
      {showNavbar && showFooter && <LandingPage  />}
      {!showNavbar &&
        !showFooter &&
        hasVisited === null && ( // Only show message if hasVisited is null
          <div className="flex justify-center items-center h-screen bg-[radial-gradient(circle_at_center,#111c2c_10%,#111c2c_50%,#0b0d1e_100%)]"> 
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
  const location = useLocation();

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
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<TypingLandingPage />} />
          <Route path="/search-properties" element={<Map />} />
          <Route path="/property-listing" element={<PropertyListing />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route path="/library" element={<Library />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/case-laws" element={<CaseLaws />} />
          <Route path="/laws" element={<Law />} />
          <Route path="/laws/statelaw" element={<StateLaw />} />
          <Route path="/laws/centrallaw" element={<CentralLaw />} />
          <Route path="/nri" element={<NRI />} />
          <Route path="/advice" element={<Advice />} />
          <Route path="/lend" element={<Lend />} />
          <Route path="/site-faqs" element={<SiteFaqs />} />
          <Route path="/rewards" element={<RedeemRewards />} />
          <Route path="/property-journey" element={<PropertyJouneyPage />} />
          <Route path="/services/concierge" element={<ServConci />} />
          <Route path="/services/owners-club" element={<ServOwnerClub />} />
          <Route path="/services/safe" element={<ServSafe />} />
          <Route path="/services/verified-listings" element={<ServListingCompo />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsAndConditions" element={<TermsAndConditions />} />
          <Route path="/chats" element={<ChatScreen userId={userId} userToken={userToken} />} />
          <Route path="/journey" element={<JourneyPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/stage1Form" element={<Stage1Form setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/stage2Form" element={<Stage2Form setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/library/:title" element={<BlogPost />} />
        </Routes>
      </Suspense>
      {(location.pathname !== "/advice" ||
        location.pathname !== "/journey" ||
        location.pathname !== "/stage1Form" ||
        location.pathname !== "/stage2Form") && <Footer />}
    </>
  );
}

export default Landing;
