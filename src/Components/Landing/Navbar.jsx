import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [scrollPos, setScrollPos] = useState(0);
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

    return (
        <nav
            className={`flex items-center justify-between px-10 py-8 text-white backdrop-blur-sm fixed top-0 w-11/12 m-auto rounded-xl left-0 right-0 z-20 transition-transform duration-300 ${
                isVisible ? "transform translate-y-10" : "transform -translate-y-[6rem]"
            }`}
        >
            {/* Left side - Logo */}
            <div className="text-2xl font-bold">iProp91</div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8">
                <a href="#products" className="text-gray-400 hover:text-white">
                    Products
                </a>
                <a href="#team" className="text-gray-400 hover:text-white">
                    Our Team
                </a>
                <a href="#login" className="text-gray-400 hover:text-white">
                    Member login
                </a>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center">
                <button onClick={toggleMobileMenu} className="text-white text-2xl">
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Modal */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 w-full bg-black bg-opacity-60 backdrop-blur-lg z-10 flex justify-center items-start">
                    <div ref={modalRef} className="bg-white rounded-lg w-full p-6 shadow-lg pb-10">
                        {/* Close Button */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-primary">iProp91</span>
                            <button onClick={toggleMobileMenu} className="text-xl text-gray-600 hover:bg-gray-100 font-[500] rounded-lg p-1 px-2">
                            &#10005;
                            </button>
                        </div>
                        {/* Menu Links */}
                        <div className="space-y-4">
                            <a
                                href="#products"
                                onClick={toggleMobileMenu}
                                className="flex justify-between items-center text-lg font-semibold text-gray-800 hover:text-black"
                            >
                                Products{" "}
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
                            <a
                                href="#team"
                                onClick={toggleMobileMenu}
                                className="flex justify-between items-center text-lg font-semibold text-gray-800 hover:text-black"
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
                            </a>
                            <hr className="border-gray-200" />
                            <a
                                href="#login"
                                onClick={toggleMobileMenu}
                                className="flex justify-between items-center text-lg font-semibold text-gray-800 hover:text-black"
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
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
