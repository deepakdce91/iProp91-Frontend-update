import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaCaretDown, FaCaretUp, FaTimes } from "react-icons/fa";
import { PiHandCoinsFill } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Profile from "../User/Profile/profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";
import { useAuth } from "../../context/AuthContext";
import { IoSearch } from "react-icons/io5";
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
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";
import { set } from "lodash";

const Navbar = ({ setIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [isDarkBg, setIsDarkBg] = useState(true);
  const location = useLocation();
  const [serviceDown, setServiceDown] = useState(false);
  const mobileMenuRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const dropdownTimeoutRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Define routes that should have specific backgrounds
  const specificRoutes = {
    "/nri": false, // true means dark background
    "/lend": false,
    "/advice": false, // false means light background
    "/case-laws": false,
    "/library": false,
    "/faqs": true,
    "/laws": false,
    "/laws/statelaw": false,
    "/laws/centrallaw": false,
    "/": true,
    "/aboutUs": false,
    "/privacyPolicy": false,
    "/termsAndConditions": false,
    "/property-journey": false,
    "/services/concierge": false,
    "/services/owners-club": false,
    "/services/safe": false,
    "/services/verified-listings": false,
    "/rewards": true, // Added rewards route with dark background
    "/rewards/": true,
    "/property-listing/": false,
  };

  // Define routes where the floating "Get Started" button should appear
  const floatingButtonRoutes = [
    "/services/concierge",
    "/services/safe",
    "/services/owners-club"
  ];

  // Check if current route should show the floating button
  const shouldShowFloatingButton = () => {
    return floatingButtonRoutes.includes(location.pathname);
  };

  const SidebarIcons = {
    Concierge: { icon: Home, link: "/services/concierge", requiresAuth: false },
    "iProp91 Safe": { icon: Key, link: "/services/safe", requiresAuth: false },
    "Owners' Club": { icon: Users, link: "/services/owners-club", requiresAuth: false },
    // "Real Insights": { icon: Lightbulb, link: "/realinsight" },
    Advice: { icon: BookOpen, link: "/advice", requiresAuth: false },
    Lend: { icon: RefreshCw, link: "/lend", requiresAuth: false },
    NRI: { icon: Home, link: "/nri", requiresAuth: false },
    Rewards: { icon: Gift, link: "/rewards", requiresAuth: false },
    // "Verified Listings": {
    //   icon: Home,
    //   link: "/property-for-sale",
    //   requiresAuth: false,
    // },
  };

  const [isServiceClickOpen, setIsServiceClickOpen] = useState(false);

  // Check if current route should override background detection
  const shouldOverrideBackground = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/library")) {
      return false; // All library routes default to light background
    }
    return currentPath in specificRoutes ? specificRoutes[currentPath] : null;
  };

  function handleServicesDropdown() {
    setIsServiceClickOpen(!isServiceClickOpen);
    setServiceDown(!serviceDown);
  }

  // Function to handle closing dropdown with delay
  const handleCloseDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServiceDown(false);
      setIsServiceClickOpen(false);
    }, 500);
  };

  // Function to cancel dropdown closing if needed
  const handleCancelCloseDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  // Function to handle service clicks that require authentication
  const handleServiceClick = (serviceName, link, requiresAuth) => {
    setServiceDown(false);
    setIsServiceClickOpen(false);

    if (requiresAuth && !user) {
      openAuthModal();
    } else {
      navigate(link);
    }
  };

  // Function to handle mobile service clicks
  const handleMobileServiceClick = (serviceName, link, requiresAuth) => {
    if (requiresAuth && !user) {
      toggleMobileMenu();
      openAuthModal();
    } else {
      toggleMobileMenu();
      navigate(link);
    }
  };

  // Function to handle floating button click
  const handleFloatingButtonClick = () => {
    if (!user) {
      openAuthModal();
    }
  };

  // Function to handle desktop search
  const handleDesktopSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim() !== "") {
        navigate(`/property-listing?q=${searchQuery}`);
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    }
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
      const brightness =
        (parseInt(rgb[0]) * 299 +
          parseInt(rgb[1]) * 587 +
          parseInt(rgb[2]) * 114) /
        1000;
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
      attributeFilter: ["style", "class"],
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

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }

    // For services dropdown, we'll use onBlur instead of this click handler
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

  // Clean up any pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || isAuthModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Add styles to lock the body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Get the scroll position from body top property
      const scrollY = document.body.style.top;
      // Remove styles
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    } 
  }, [isMobileMenuOpen, isAuthModalOpen]);

  // Helper function to get navbar styles based on current route
  const getNavbarStyles = () => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith("/rewards")) {
      return {
        background: "bg-[#0E1424] bg-opacity-10",
        text: "text-black",
        border: "border-[#0E1424]"
      };
    }
    
    if (currentPath.startsWith("/property-listing")) {
      return {
        background: "bg-[#0E1424] bg-opacity-10",
        text: "text-black", 
        border: "border-[#0E1424]"
      };
    }
    
    // Default styling based on isDarkBg
    if (isDarkBg) {
      return {
        background: "bg-white bg-opacity-10",
        text: "text-white",
        border: "border-white"
      };
    } else {
      return {
        background: "bg-[#0E1424] bg-opacity-10",
        text: "text-black", 
        border: "border-[#0E1424]"
      };
    }
  };

  const navbarStyles = getNavbarStyles();

  // Helper function to get search input styles
  const getSearchInputStyles = () => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith("/rewards") || currentPath.startsWith("/property-listing") || !isDarkBg) {
      return {
        background: "bg-white bg-opacity-90",
        text: "text-black",
        placeholder: "placeholder-gray-500",
        border: "border-gray-300 focus:border-black",
        icon: "text-gray-600"
      };
    } else {
      return {
        background: "bg-white bg-opacity-20",
        text: "text-white",
        placeholder: "placeholder-gray-300",
        border: "border-white border-opacity-30 focus:border-white",
        icon: "text-white"
      };
    }
  };

  const searchInputStyles = getSearchInputStyles();

  return (
    <>
      <nav
        className={`flex items-center justify-between px-10 py-4 ${navbarStyles.background} ${navbarStyles.text} backdrop-blur-sm fixed top-0 w-11/12 mx-auto rounded-xl left-0 right-0 z-20 transition-all duration-300 border ${navbarStyles.border} ${
          isVisible ? "transform translate-y-4" : "transform -translate-y-[6rem]"
        }`}
      >
        {/* Logo */}
        <Link
          to={"/"}
          className="text-2xl flex justify-center items-center gap-2 font-bold text-primary"
        >
          <img
            className="w-12 h-12 scale-125"
            src="/images/Logo1.png"
            alt="logo"
          />
          <p>iProp91</p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 lg:space-x-8 text-sm lg:text-base items-center">
          {/* Desktop Search Bar */}
          <div className="relative">
            <div className={`flex items-center ${searchInputStyles.background} rounded-full px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
              isSearchFocused ? 'w-64' : 'w-48'
            }`}>
              <input
                type="text"
                placeholder="Search Properties"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleDesktopSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={` ${searchInputStyles.text} ${searchInputStyles.placeholder} border-none outline-none w-full text-sm bg-transparent`}
              />
              <button
                onClick={handleDesktopSearch}
                className={`ml-2 ${searchInputStyles.icon} hover:opacity-80 transition-opacity`}
              >
                <IoSearch className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            className="hover:text-white/80 relative"
            ref={servicesDropdownRef}
            onBlur={handleCloseDropdown}
            tabIndex={0}
          >
            <div
              className="flex items-center cursor-pointer gap-1"
              onClick={() => handleServicesDropdown()}
              onMouseEnter={() => {
                handleCancelCloseDropdown();
                setServiceDown(true);
              }}
            >
              <span className="whitespace-nowrap font-medium">Services</span>
              <span>{serviceDown ? <FaCaretUp /> : <FaCaretDown />}</span>
            </div>

            {/* Services Dropdown - Shows on hover or click with animation */}
            <div
              className={`absolute top-8 left-0 z-10 transition-all duration-300 ease-in-out transform
                ${
                  serviceDown
                    ? "opacity-100 translate-y-2 pointer-events-auto"
                    : "opacity-0 translate-y-0 pointer-events-none"
                }`}
              onMouseEnter={() => {
                handleCancelCloseDropdown();
                setServiceDown(true);
              }}
              onMouseLeave={() => {
                // Use the delayed close
                handleCloseDropdown();
              }}
            >
              <div className="bg-white rounded-md shadow-lg overflow-hidden w-48">
                <div className="p-3 lg:p-4 text-black flex flex-col gap-3 text-base">
                  <button
                    onClick={() =>
                      handleServiceClick("Concierge", "/services/concierge", false)
                    }
                    className="hover:text-gray-600 transition-colors duration-200 text-left"
                  >
                    Concierge
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() =>
                      handleServiceClick(
                        "Owners' Club",
                        "/services/owners-club",
                        false
                      )
                    }
                    className="hover:text-gray-600 transition-colors duration-200 text-left"
                  >
                    Owners' Club
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() =>
                      handleServiceClick("iProp91 Safe", "/services/safe", false)
                    }
                    className="hover:text-gray-600 transition-colors duration-200 text-left"
                  >
                    Safe
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <Link
                    to="/services/verified-listings"
                    className="hover:text-gray-600 transition-colors duration-200"
                    onClick={() => {
                      setServiceDown(false);
                      setIsServiceClickOpen(false);
                    }}
                  >
                    Listing
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link to="/nri" className="hover:text-white/80 font-medium">
            NRI
          </Link>
          <Link to="/advice" className="hover:text-white/80 font-medium">
            Advice
          </Link>
          <Link to="/lend" className="hover:text-white/80 font-medium">
            Lend
          </Link>
          <Link
            to="/rewards"
            className="hover:text-white/80 flex items-center font-medium"
          >
            <PiHandCoinsFill className="text-lg lg:text-xl" />
          </Link>

          {user ? (
            <Profile />
          ) : (
            <button
              onClick={openAuthModal}
              className="whitespace-nowrap font-medium"
            >
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
            className="z-[100] fixed h-screen w-screen -top-5 -left-5 lg:hidden text-white transform transition-transform duration-300 ease-in-out"
            ref={mobileMenuRef}
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
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 bg-gold rounded-full mt-4"
                >
                  <img
                    alt="close"
                    loading="lazy"
                    width="14"
                    height="14"
                    src="/svgs/cross.c0162762.svg"
                  />
                </button>
              </div>
              <nav className="flex flex-col justify-evenly text-white z-[110] overflow-y-auto">
                {/* Added Login/Profile Button for Mobile */}
                <div className="mt-6 px-7 py-4">
                  {user ? (
                    <button
                      onClick={() => {
                        toggleMobileMenu();
                        navigate("/profile");
                      }}
                      className="flex items-center gap-2 text-xl py-3 px-5 bg-gold text-black rounded-xl w-full justify-center"
                    >
                      My Profile
                    </button>
                  ) : (
                    <>
                      <div className="flex items-center pr-3 bg-gray-50 rounded-full justify-center  gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Search Properties"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              toggleMobileMenu();
                              navigate(`/property-listing?q=${searchQuery}`);
                              setSearchQuery(""); // Clear the search query after navigating
                            }
                          }}
                          className="flex h-14 items-center gap-2 text-xl  py-3 px-5  text-black rounded-full w-[80%] justify-start"
                        />

                        <button
                          onClick={() => {
                            if (searchQuery.trim() !== "") {
                              toggleMobileMenu();
                              navigate(`/property-listing?q=${searchQuery}`);
                              setSearchQuery(""); // Clear the search query after navigating
                            }
                          }}
                        >
                          <IoSearch className="h-12 w-12  px-2 bg-gray-800 hover:bg-gray-900 rounded-xl" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          toggleMobileMenu();
                          openAuthModal();
                        }}
                        className="flex items-center gap-2 text-xl py-3  px-5 bg-gray-900 border border-1 border-b-gray-100 text-white rounded-full w-full justify-center"
                      >
                        Member Login
                      </button>
                    </>
                  )}
                </div>

                {Object.keys(SidebarIcons).map((key, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleMobileServiceClick(
                        key,
                        SidebarIcons[key].link,
                        SidebarIcons[key].requiresAuth
                      )
                    }
                    className="flex gap-2 px-7 py-1 rounded-xl ml-auto mr-auto text-left"
                  >
                    <p className="text-xl my-3 md:my-5">{key}</p>
                  </button>
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
            properties={`lg:mt-[1%] top-[55%] md:top-[52%] right-14  md:right-24 lg:right-44 z-50 transition-transform transform ${
              isAuthModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          />
        )}
      </nav>

      {/* Floating Get Started Button - Only show on specific routes and when user is not logged in */}
      {shouldShowFloatingButton() && !isAuthModalOpen && !user && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={handleFloatingButtonClick}
          className="fixed bottom-6 right-6 z-30 bg-black text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
          style={{
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          }}
        >
          Get Started
        </motion.button>
      )}
    </>
  );
};

export default Navbar;