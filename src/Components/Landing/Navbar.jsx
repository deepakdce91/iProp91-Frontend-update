import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../User/Profile/profile";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for auth modal
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
  }, [isLoggedIn]);

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

  return (
    <nav
      className={`flex items-center justify-between px-10 py-4 bg-white bg-opacity-10  backdrop-blur-sm fixed top-0 w-11/12 m-auto rounded-xl left-0 right-0 z-20 transition-transform duration-300 border border-white ${
        isVisible ? "transform translate-y-4" : "transform -translate-y-[6rem]"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl flex justify-center items-center gap-2 font-bold text-primary">
        <img
          className="w-12 h-12 scale-125"
          src="/images/logo1.png"
          alt="logo"
        />
        <p>iProp91</p>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex text-white space-x-8 ">
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
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-gray-400 text-2xl">
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-full bg-black bg-opacity-60 backdrop-blur-lg z-10 flex justify-center items-start rounded-xl">
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
          <button onClick={openAuthModal} className="text-black">
            Member login
          </button>
        )}
              
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && <Auth onClose={closeAuthModal} setIsLoggedIn={setIsLoggedIn} properties={"lg:mt-[1%] top-[55%] right-20 md:right-24 lg:right-44"}/>}
    </nav>
  );
};

export default Navbar;
