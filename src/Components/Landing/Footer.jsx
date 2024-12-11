import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle subscribe button click
  const handleSubscribe = () => {
    if (validateEmail(email)) {
      toast.success("Subscribed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setEmail(""); // Clear the input field
    } else {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <footer className="text-white p-10 border-t-[1px] border-t-white/20 w-full mx-auto bg-black shadow-lg ">
        <div className="flex flex-col lg:flex-row justify-between mb-4 w-full px-4 mx-auto">
          <div className="flex justify-center my-1">
            <h1 className="font-semibold text-primary text-2xl">iProp91</h1>
          </div>
          <div className="flex justify-center space-x-4 my-1">
            <Link to="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin text-2xl text-black hover:text-primary"></i>
            </Link>
            <Link to="#" aria-label="Facebook">
              <i className="fab fa-facebook text-2xl text-black hover:text-primary"></i>
            </Link>
            <Link to="#" aria-label="Instagram">
              <i className="fab fa-instagram text-2xl text-black hover:text-primary"></i>
            </Link>
            <Link to="#" aria-label="Twitter">
              <i className="fab fa-twitter text-2xl text-black hover:text-primary"></i>
            </Link>
            <Link to="#" aria-label="YouTube">
              <i className="fab fa-youtube text-2xl text-black hover:text-primary"></i>
            </Link>
          </div>
        </div>
        <div className="mx-auto flex flex-col lg:flex-row">
          {/* Left Section */}
          <div className="w-full lg:w-2/5 my-2 lg:px-4">
            <h2 className="text-3xl font-semibold mb-4">
              Exclusive Opportunities, Exclusive Access, Exclusive You!
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter
            </p>
            <div className="flex items-center text-xs rounded-full overflow-hidden w-full bg-white lg:w-72">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black px-3 py-2 w-full outline-none placeholder-gray-800"
              />
              <button
                className="bg-gold text-black px-3 py-2 font-[400] rounded-full"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Middle Section */}
          <div className="w-full lg:w-1/5 my-2">
            <h3 className="font-semibold mb-2 text-gray-600 text-sm">
              Quick Links
            </h3>
            <ul className="text-xs">
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Site FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full lg:w-1/5 my-2">
            <h3 className="font-semibold mb-2 text-gray-600 text-sm">
              Our Services
            </h3>
            <ul className="text-xs">
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  iProp91 Safe
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  iProp91 Owner&apos;s Club
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  iProp91 Real Insight
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  iProp91 Lend
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  iProp91 Advice
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/5 my-2">
            <h3 className="font-semibold mb-2 text-gray-600 text-sm">
              Knowledge Center
            </h3>
            <ul className="text-xs">
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Case-Laws
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Library
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="hover:text-primary">
                  Laws
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
