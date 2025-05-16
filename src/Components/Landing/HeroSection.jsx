import React, { useEffect, useState } from "react";
import GetStartedForm from "./GetStartedForm";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [form, setForm] = useState(false);
  const [auth, setAuth] = useState(false);
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

  useAuthToken(navigate);

  useEffect(() => {
    // Preload background images
    const preloadImages = () => {
      const images = [
        "/images/landing.png",
        // Add other images that need to be preloaded
      ];
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    preloadImages();
  }, []);

  const openFormModal = () => {
    setForm(true);
  };

  const closeFormModal = () => {
    setForm(false);
  };

  const openAuthModal = () => {
    setAuth(true);
  };

  const closeAuthModal = () => {
    setAuth(false);
  };

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
    closeAuthModal();
    navigate("/concierge");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-transparent overflow-hidden sm:h-[100vh]">
      <div className="text-center">
        <motion.h1
          className="text-4xl lg:text-7xl font-bold py-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Your Trusted <br /> Real Estate Manager
        </motion.h1>
        <motion.p
          className="text-gray-300 text-md lg:text-xl sm:p-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          For the exclusive few who appreciate their most valued asset and its
          value!
        </motion.p>
        <br />
        <motion.button
          onClick={() => navigate("/journey")}
          className="text-black text-sm lg:text-lg font-semibold py-2 px-4 lg:py-4 lg:px-8 rounded-full transition-all hover:scale-105 animate-shimm bg-[linear-gradient(110deg,#ffffff,45%,#000000,55%,#ffffff)] bg-[length:200%_100%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start your journey
        </motion.button>
      </div>
      {/* Form Modal */}
      {/* {form && <GetStartedForm close={closeFormModal} openAuth={openAuthModal} />} */}
      {/* Auth Modal */}
      {/* {auth && <Auth onClose={closeAuthModal} setIsLoggedIn={handleSuccessfulLogin} properties={" top-[15%] z-20 right-10 w-[400px] md:right-24 lg:right-16 "} />} */}
    </div>
  );
};

export default HeroSection;
