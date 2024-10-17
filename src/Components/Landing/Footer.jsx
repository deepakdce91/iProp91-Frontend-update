import React from 'react';
import SimpleInput from "../CompoCards/InputTag/simpleinput"
import GoldButton from '../CompoCards/GoldButton/Goldbutton'
const Footer = () => {
  return (
    <footer className="bg-red-300 text-black p-10 ">
      <div className=" mx-auto flex flex-col lg:flex-row ">
        
        {/* Left Section */}
        <div className='w-full lg:w-2/5 my-2 lg:px-4'>
          <h2 className="text-3xl font-bold mb-4">
            You are building India’s future, we would like to build yours.
          </h2>
          <p className="text-gray-600 mb-4">
            Our weekly expert newsletter on stories that matter to your money.
          </p>
          <div className="flex ">
            <SimpleInput
            type="email"
            placeholder={"email address"}
            />
            <GoldButton
            btnname={"Submit"}
            bgcolor={"gold ml-2"}
            />
          </div>
        </div>

        {/* Middle Section */}
          <div className='w-full lg:w-1/5 my-2'>
            <h3 className="font-semibold mb-2">Knowledge Repository</h3>
            <ul className="">
              <li><a href="#" className="hover:underline">Bonds</a></li>
              <li><a href="#" className="hover:underline">IPA</a></li>
              <li><a href="#" className="hover:underline">Mutual Funds</a></li>
              <li><a href="#" className="hover:underline">Portfolio Management Services</a></li>
              <li><a href="#" className="hover:underline">Wealth Monitor</a></li>
            </ul>
          </div>
          <div className='w-full lg:w-1/5 my-2'>
            <h3 className="font-semibold mb-2">About</h3>
            <ul className="">
              <li><a href="#" className="hover:underline">Team</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
              <li><a href="#" className="hover:underline">Investment Philosophy</a></li>
            </ul>
          </div>

        {/* Right Section */}
        <div className='w-full lg:w-1/5 my-2'>
          <h3 className="font-semibold mb-2">Legal</h3>
          <ul className="">
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Disclaimer</a></li>
            <li><a href="#" className="hover:underline">ODR Portal</a></li>
            <li><a href="#" className="hover:underline">Privacy</a></li>
            <li><a href="#" className="hover:underline">Returns & Cancellation</a></li>
            <li><a href="#" className="hover:underline">Security</a></li>
            <li><a href="#" className="hover:underline">Terms & Disclosure</a></li>
            <li><a href="#" className="hover:underline">KYC Check</a></li>
            <li><a href="#" className="hover:underline">Scheme documents</a></li>
            <li><a href="#" className="hover:underline">Fraud Notice</a></li>
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center space-x-4 mt-10">
        <a href="#" aria-label="LinkedIn">
          <i className="fab fa-linkedin text-2xl text-black hover:text-gray-700"></i>
        </a>
        <a href="#" aria-label="Facebook">
          <i className="fab fa-facebook text-2xl text-black hover:text-gray-700"></i>
        </a>
        <a href="#" aria-label="Instagram">
          <i className="fab fa-instagram text-2xl text-black hover:text-gray-700"></i>
        </a>
        <a href="#" aria-label="Twitter">
          <i className="fab fa-twitter text-2xl text-black hover:text-gray-700"></i>
        </a>
        <a href="#" aria-label="YouTube">
          <i className="fab fa-youtube text-2xl text-black hover:text-gray-700"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
