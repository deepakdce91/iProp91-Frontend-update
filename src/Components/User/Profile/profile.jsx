import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Edit, X } from "lucide-react";
import { motion } from "framer-motion";

// LogoutConfirmationModal component
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Confirm Logout</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-6">Are you sure you want to logout from your account?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null); // Create a reference for the dropdown
  const [user, setUser] = useState({});
  const [dataloaded, setDataloaded] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      let tokenid = jwtDecode(token);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        setUser(data);
        setDataloaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false); // Close the dropdown when opening the modal
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    toast("Logging Out.");
    setShowLogoutModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative mr-10 inline-block text-left ">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2"
        >
          <span className="flex h-10 scale-125 w-10 border-2 border-gold overflow-hidden rounded-full">
            <img
              className="h-full w-full object-cover"
              alt="profilePic"
              src={
                dataloaded
                  ? user.data?.profilePicture === ""
                    ? "/dummyPFP.jpg"
                    : user.data?.profilePicture
                  : "/dummyPFP.jpg"
              }
            />
          </span>
        </button>

        {/* Dropdown menu */}
        <div
          className={`absolute right-0 mt-2 px-5 py-3 bg-white border border-gray-200 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out min-w-[300px] ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="px-4 py-2">
            <p className=" text-bold my-3">Account</p>
            {dataloaded && user.data && (
              <div className="flex gap-3 items-center  ">
                <span className="flex h-14 w-14 border-2 border-gold overflow-hidden rounded-full">
                  <img
                    className="h-full w-full object-cover"
                    alt="profilePic"
                    src={
                      dataloaded
                        ? user.data.profilePicture === ""
                          ? "/dummyPFP.jpg"
                          : user.data.profilePicture
                        : "/dummyPFP.jpg"
                    }
                  />
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{user.data.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.data.email ? (
                      user.data.email.replace(
                        /^(.{2}).*(.{2})(@.*)$/,
                        "$1****$2$3"
                      )
                    ) : (
                      <span className="flex items-center text-xs space-x-1 cursor-pointer text-blue-500 hover:underline">
                        <Edit className="w-4 h-4" />
                        <span>Update</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200"></div>
          <Link
            to="/profile"
            className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100"
          >
            Manage Profile
          </Link>
          <div
            onClick={handleLogoutClick}
            className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}