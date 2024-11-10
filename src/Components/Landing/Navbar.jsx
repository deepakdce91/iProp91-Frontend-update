import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Profile from "../User/Profile/profile";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);
  const [user, setUser] = useState();
  const [dataloaded, setDataloaded] = useState(false);
  const modalRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming userId is stored within the token

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setDataloaded(true);
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // useEffect(() => {
  //     const handleScroll = () => {
  //         const currentScrollPos = window.scrollY;
  //         setIsVisible(currentScrollPos < scrollPos);
  //         setScrollPos(currentScrollPos);
  //     };
  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  // }, [scrollPos]);

  return (
    <nav
      className={`flex items-center justify-between px-10 py-4 bg-white bg-opacity-20 text-black backdrop-blur-sm fixed top-0 w-11/12 m-auto rounded-xl left-0 right-0 z-20 transition-transform duration-300 border border-gold  ${
        isVisible ? "transform translate-y-4" : "transform -translate-y-[6rem]"
      }`}
    >
      {/* Left side - Logo */}
      <div className="text-2xl flex justify-center items-center gap-2 font-bold text-primary">
        <img className="w-12 h-12 scale-125" src="/images/logo1.png" alt="logo" />
        <p>iProp91</p>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8">
        <Link to="/services" className="text-gray-400 hover:text-black">
          Services
        </Link>
        {/* <Link to="/auth" className="text-gray-400 hover:text-black">
                    Our Team
                </Link> */}

        {user ? (
          // Display Profile Card when user is logged in
          <Profile/>
        ) : (
          // Display login link if no user data
          <Link to="/authenticate" className="text-gray-400 hover:text-black">
            Member login
          </Link>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-gray-400 text-2xl">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-full bg-black bg-opacity-60 backdrop-blur-lg z-10 flex justify-center items-start rounded-xl ">
          <div
            ref={modalRef}
            className="bg-white rounded-lg w-full border border-gold p-6 shadow-lg pb-10"
          >
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-primary">iProp91</span>
              <button
                onClick={toggleMobileMenu}
                className="text-xl text-gray-600 hover:bg-gray-100 font-[500] rounded-lg p-1 px-2"
              >
                &#10005;
              </button>
            </div>
            {/* Menu Links */}
            <div className="space-y-4">
              <a
                href="#products"
                onClick={toggleMobileMenu}
                className="flex justify-between items-center text-lg font-semibold text-gray-400 hover:text-black"
              >
                Services{" "}
                <span>
                  <img
                    decoding="async"
                    src="https://framerusercontent.com/images/CEcnOZ0GAMxkderVtnnXkheUQ.svg"
                    alt="Arrow Icon"
                    className="w-6 h-6 ml-2"
                  />
                </span>
              </a>
              <hr className="border-gray-200" />
              {/* <a
                                href="#team"
                                onClick={toggleMobileMenu}
                                className="flex justify-between items-center text-lg font-semibold text-gray-400 hover:text-black"
                            >
                                Our Team{" "}
                                <span>
                                    <img
                                        decoding="async"
                                        src="https://framerusercontent.com/images/CEcnOZ0GAMxkderVtnnXkheUQ.svg"
                                        alt="Arrow Icon"
                                        className="w-6 h-6 ml-2"
                                    />
                                </span>
                            </a> */}
              <hr className="border-gray-200" />
              {user ? (
                <Profile/> ) :
                (<a
                    href="#login"
                    onClick={toggleMobileMenu}
                    className="flex justify-between items-center text-lg font-semibold text-gray-400 hover:text-black"
                  >
                    Member login{" "}
                    <span>
                      <img
                        decoding="async"
                        src="https://framerusercontent.com/images/CEcnOZ0GAMxkderVtnnXkheUQ.svg"
                        alt="Arrow Icon"
                        className="w-6 h-6 ml-2"
                      />
                    </span>
                  </a>)
               }
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
