import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Logging Out.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative mr-10 inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2"
        >
          <span className="flex h-10 w-10 border-2 border-gold overflow-hidden rounded-full">
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
        </button>

        {/* Dropdown menu */}
        <div
          className={`absolute right-0 mt-2  bg-white border border-gray-200 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="px-4 py-2">
            <p className=" text-bold my-3">Account</p>
            {dataloaded && (
              <div className="flex gap-2 items-center justify-center ">
                <span className="flex h-10 w-10 border-2 border-gold overflow-hidden rounded-full">
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
                <div className="">
                <p className="font-semibold text-sm">{user.data.name}</p>
                <p className="text-xs text-gray-500">{user.data.email}</p>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200"></div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Manage Profile
          </Link>
          <div
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
}
