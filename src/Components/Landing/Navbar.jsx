import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Profile from "../User/Profile/profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";

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

    '/': true
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
        ? "bg-white bg-opacity-10 text-white" 
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
      <div className="hidden md:flex  space-x-8 ">
        <Link to="/services" className="hover:text-white/80 ">
          Services
        </Link>
        <Link to="/nri" className=" hover:text-white/80">
          NRI
        </Link>
        <Link to="/advice" className=" hover:text-white/80">
          Advice
        </Link>
        <Link to="/lend" className="hover:text-white/80 ">
          Lend
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
        <div className="fixed inset-0 w-full bg-black bg-opacity-60 backdrop-blur-lg  flex justify-center items-start rounded-xl z-[100]">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-full border border-gold p-6 shadow-lg pb-10"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary">iProp91</span>
              <button
                onClick={toggleMobileMenu}
                className="text-xl text-gray-600 hover:bg-gray-100 font-[500] rounded-lg p-1 px-2"
              >
                &#10005;
              </button>
            </div>
            <div className="space-y-4 text-black">
              <Link
                to="/services"
                onClick={toggleMobileMenu}
                className="flex justify-between items-center text-lg font-semibold  hover:text-white/80"
              >
                Services
              </Link>
              
            </div>
            <div className="space-y-4 text-black">
              <Link
                to="/nri"
                onClick={toggleMobileMenu}
                className="flex justify-between items-center text-lg font-semibold  hover:text-white/80"
              >
                NRI
              </Link>
              
            </div>
            <div className="space-y-4 text-black">
              <Link
                to="/advice"
                onClick={toggleMobileMenu}
                className="flex justify-between items-center text-lg font-semibold  hover:text-white/80"
              >
                Advice
              </Link>
              
            </div>
            <div className="space-y-4 text-black">
              <Link
                to="/lend"
                onClick={toggleMobileMenu}
                className="flex justify-between items-center text-lg font-semibold  hover:text-white/80"
              >
                Lend
              </Link>
              
            </div>
            <div className="space-y-4 text-black">
            {user ? (
          <Profile />
        ) : (
          <button onClick={openAuthModal} className="text-black text-lg font-semibold ">
            Member login
          </button>
        )}
              
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <Auth 
          onClose={closeAuthModal} 
          setIsLoggedIn={setIsLoggedIn} 
          properties={`lg:mt-[1%] top-[60%] md:top-[55%] right-20 md:right-24 lg:right-44 transition-transform transform ${isAuthModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
        />
      )}
    </nav>
  ); 
}; 

export default Navbar;
