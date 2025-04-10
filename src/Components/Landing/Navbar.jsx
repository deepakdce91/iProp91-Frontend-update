import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Profile from "../User/Profile/profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";
import {
  Home,
  Shield,
  Users,
  Lightbulb,
  BookOpen,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  Lock,
  LogOut,
  Key,
  Gift, // Added Gift icon for Rewards
} from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({setIsLoggedIn}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for auth modal
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [isDarkBg, setIsDarkBg] = useState(true);
  const location = useLocation();
  
  // Define routes that should have specific backgrounds
  const specificRoutes = {
    '/nri': false,      // true means dark background
    '/lend': false,
    '/advice': false,  // false means light background
    '/case-laws': false,
    '/library': false,
    '/faqs': false,
    '/laws': false,
    '/laws/statelaw': false,
    '/laws/centrallaw': false,
    '/': true,
    '/property-journey': false,
    '/rewards': true,  // Added rewards route with dark background
  };
  
  const SidebarIcons = {
    Concierge: { icon: Home, link: "/concierge" },
    "iProp91 Safe": { icon: Key, link: "/safe" },
    "Owners' Club": { icon: Users, link: "/family" },
    "Real Insights": { icon: Lightbulb, link: "/realinsight" },
    "Advice": { icon: BookOpen, link: "/advice" },
    "Lend": { icon: RefreshCw, link: "/lend" },
    "NRI": { icon: Home, link: "/nri" },
    "Rewards": { icon: Gift, link: "/rewards" }, // Added Rewards to mobile menu
    "Listing Page": { icon: Home, link: "/property-for-sale" },
  };

  // Check if current route should override background detection
  const shouldOverrideBackground = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/library')) {
      return false; // All library routes default to light background
    }
    return currentPath in specificRoutes ? specificRoutes[currentPath] : null;
  };

  // Function to check background color
  const checkBackgroundColor = () => {
    const routeOverride = shouldOverrideBackground();
    
    // If route has specific background setting, use that
    if (routeOverride !== null) {
      setIsDarkBg(routeOverride);
      return;
    }

    // Otherwise use automatic detection
    const element = document.body;
    const bgColor = window.getComputedStyle(element).backgroundColor;
    
    const rgb = bgColor.match(/\d+/g);
    if (rgb) {
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      setIsDarkBg(brightness < 128);
    }
  };

  // Check background on route change
  useEffect(() => {
    checkBackgroundColor();
  }, [location.pathname]);

  useEffect(() => {
    checkBackgroundColor();
    const observer = new MutationObserver(checkBackgroundColor);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenid = jwtDecode(token);
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuser/${tokenid.userId}?userId=${tokenid.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": token,
              },
            }
          );
          if (response.ok) {
            const user = await response.json();
            localStorage.setItem("userPhone", user.phone);
            localStorage.setItem("userId", user._id);

            return;
          }
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchUser();
    }
  }, []);

  // Custom hook to manage JWT token
  useAuthToken(navigate);

  const modalRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening modal
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

        setUser(response.data); // Update user state with fetched data
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

useEffect(() => {
    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        setIsVisible(currentScrollPos < scrollPos);
        setScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
}, [scrollPos]);

useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'unset'; // Restore scrolling
    }
  }, [isAuthModalOpen]);

  return (
    <nav
    className={`flex items-center justify-between px-10 py-4 ${
      isDarkBg 
        ? `${location.pathname.startsWith("/rewards") ? "bg-black bg-opacity-10 text-black" : "bg-white bg-opacity-10 text-white"}` 
        : "bg-black bg-opacity-10 text-black"
    } backdrop-blur-sm fixed top-0 w-11/12 mx-auto rounded-xl left-0 right-0 z-20 transition-all duration-300 border ${
      isDarkBg ? "border-white" : "border-black"
    } ${
      isVisible ? "transform translate-y-4" : "transform -translate-y-[6rem]"
    }`}
    >
      {/* Logo */}
      <Link to={"/"} className="text-2xl flex justify-center items-center gap-2 font-bold text-primary">
        <img
          className="w-12 h-12 scale-125"
          src="/images/Logo1.png"
          alt="logo"
        />
        <p>iProp91</p>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8">
        <Link to="/services" className="hover:text-white/80">
          Services
        </Link>
        <Link to="/nri" className="hover:text-white/80">
          NRI
        </Link>
        <Link to="/advice" className="hover:text-white/80">
          Advice
        </Link>
        <Link to="/lend" className="hover:text-white/80">
          Lend
        </Link>
        <Link to="/rewards" className="hover:text-white/80">
          Rewards
        </Link>

        {user ? (
          <Profile />
        ) : (
          <button onClick={openAuthModal} className="">
            Member login
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center z-[100]">
        <button onClick={toggleMobileMenu} className="text-gray-400 text-2xl">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <motion.div 
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="z-[100] fixed  h-screen w-screen -top-4 -left-5  lg:hidden text-white transform transition-transform duration-300 ease-in-out"
      >
        <div
          className="w-full h-full flex flex-col z-[100]"
          style={{
            backgroundImage: `url(/images/sidebarbg.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-75"></div>
          <div className="flex justify-end px-3 py-2 z-[110]">
            <button onClick={toggleMobileMenu} className="p-2 bg-gold rounded-full mt-4">
              <img
                alt="close"
                loading="lazy"
                width="14"
                height="14"
                src="/svgs/cross.c0162762.svg"
              />
            </button>
          </div>
          <nav className="flex flex-col justify-evenly text-white z-[110]">
            {Object.keys(SidebarIcons).map((key, index) => (
              <Link
                key={index}
                to={SidebarIcons[key].link}
                className="flex gap-2 px-7 py-4 rounded-xl ml-auto mr-auto"
                onClick={toggleMobileMenu}
              >
                <p className="text-xl my-3 md:my-5">{key}</p>
              </Link>
            ))}
          </nav> 
        </div>
      </motion.div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <Auth 
          onClose={closeAuthModal} 
          setIsLoggedIn={setIsLoggedIn} 
          properties={`lg:mt-[1%] top-[60%] md:top-[55%] right-20 md:right-24 lg:right-44 z-50 transition-transform transform ${isAuthModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
        />
      )}
    </nav>
  ); 
}; 

export default Navbar;