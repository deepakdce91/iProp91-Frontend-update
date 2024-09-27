import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Create a reference for the dropdown

    
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
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
                        <img
                            className="aspect-square h-full w-full"
                            alt="profilePic"
                            src="https://images.unsplash.com/photo-1523560220134-8f26a720703c?q=80&amp;w=1854&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        />
                    </span>
                    <p className="mt-auto mb-auto text-sm mx-1">Jatin</p>
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
