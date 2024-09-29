import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
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
        //   console.log(tokenid);
        //   console.log(token);
          try {
            const response = await fetch(`http://localhost:3300/api/users/getuserdetails?userId=${tokenid.userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": token,
              },
            });
            const data = await response.json();
            console.log(data);
            setUser(data);
            setDataloaded(true);
          }
          catch (error) {
            console.log(error);
          }
        }
        fetchUser();
      }, []);

      
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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <>
            <div
                ref={dropdownRef}
                className="absolute right-10 inline-block border bg-white rounded-3xl border-gold"
            >
                <button
                    onClick={toggleDropdown}
                    className="px-1 py-1 flex mt-auto mb-auto"
                >
                    <span className="relative flex h-10 w-10 shrink-0 border-2 border-gold overflow-hidden rounded-full mt-auto mb-auto mr-1">
                        <img
                            className="aspect-square h-full w-full "
                            alt="profilePic"
                            src={dataloaded && user.data.profilePicture}
                        />
                    </span>
                    <p className="mt-auto mb-auto text-sm mx-1">
                        {dataloaded && user.data.name.split(' ')[0]}
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down mt-auto mb-auto h-4"
                    >
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>

                {/* Dropdown menu */}
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <Link
                        to="/profile"
                        className="block px-4 p-2 m-1 text-center text-sm text-gray-700 hover:bg-gray-100 rounded-3xl"
                    >
                        Profile
                    </Link>
                    <div
                        onClick={handleLogout}
                        className="block px-4 p-2 m-1 text-center text-sm text-gray-700 hover:bg-gray-100 rounded-3xl"
                    >
                        Logout
                    </div>
                </div>
            </div>
        </>
    );
}
