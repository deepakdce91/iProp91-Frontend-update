import React, { useEffect, useState } from "react";
import GetStartedForm from "./GetStartedForm";
import Auth from "../User/Login/Auth";
import useAuthToken from "../../hooks/useAuthToken";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // {{ edit_1 }}


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

  // Custom hook to manage JWT token
  useAuthToken(navigate);

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
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden">
     <div className="text-center">
       <motion.h1 // {{ edit_2 }}
         className="text-4xl lg:text-7xl font-bold py-4 text-white"
         initial={{ opacity: 0, y: -50 }} // {{ edit_3 }}
         animate={{ opacity: 1, y: 0 }} // {{ edit_4 }}
         transition={{ duration: 1 }} // {{ edit_5 }}
       >
         Your Trusted <br /> Real Estate Manager
       </motion.h1>
       <motion.p // {{ edit_6 }}
         className="text-gray-400 text-md lg:text-xl"
         initial={{ opacity: 0, y: -50 }} // {{ edit_7 }}
         animate={{ opacity: 1, y: 0 }} // {{ edit_8 }}
         transition={{ duration: 1, delay: 0.5 }} // {{ edit_9 }}
       >
         For the exclusive few who appreciate their most valued asset and its
         value!
       </motion.p>
       <br />
       <button
         onClick={() => navigate('/journey')}
         className="text-black text-sm lg:text-lg font-semibold py-2 px-4 lg:py-4 lg:px-8 rounded-full transition-all hover:scale-105 animate-shimm bg-[linear-gradient(110deg,#ffffff,45%,#000000,55%,#ffffff)] bg-[length:200%_100%]"
       >
         Start your journey
       </button>
     </div>
      {/* Form Modal */}
     {/* {form && <GetStartedForm close={closeFormModal} openAuth={openAuthModal} />} */}
      {/* Auth Modal */}
     {/* {auth && <Auth onClose={closeAuthModal} setIsLoggedIn={handleSuccessfulLogin} properties={" top-[15%] z-20 right-10 w-[400px] md:right-24 lg:right-16 "} />} */} 
   </div>
  );
};

export default HeroSection;
