import React from "react";
import {Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-black p-10 mt-10 w-full lg:w-9/12 mx-auto">

      <div className="flex flex-col lg:flex-row justify-between mb-4 w-full px-4 mx-auto">
        <div className="flex justify-center my-1">
          <h1 className='font-semibold text-primary text-2xl'>iProp91</h1>
        </div>
        <div className="flex justify-center space-x-4 my-1">
          <Link href="#" aria-label="LinkedIn">
            <i className="fab fa-linkedin text-2xl text-black  hover:text-primary "></i>
          </Link>
          <Link href="#" aria-label="Facebook">
            <i className="fab fa-facebook text-2xl text-black hover:text-primary "></i>
          </Link>
          <Link href="#" aria-label="Instagram">
            <i className="fab fa-instagram text-2xl text-black hover:text-primary "></i>
          </Link>
          <Link href="#" aria-label="Twitter">
            <i className="fab fa-twitter text-2xl text-black  hover:text-primary "></i>
          </Link>
          <Link href="#" aria-label="YouTube">
            <i className="fab fa-youtube text-2xl text-black  hover:text-primary "></i>
          </Link>
        </div>
      </div>
      <div className=" mx-auto flex flex-col lg:flex-row ">

        {/* Left Section */}
        <div className='w-full lg:w-2/5 my-2 lg:px-4'>
          <h2 className="text-3xl font-semibold mb-4">
            You are building India’s future, we would like to build yours.
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Our weekly expert newsletter on stories that matter to your money.
          </p>
          <div className="flex items-center border text-xs border-gold rounded-full overflow-hidden w-full lg:w-72">
            <input
              type="email"
              placeholder="Email address"
              className=" text-gray-400 px-3 py-2 w-full outline-none placeholder-gray-500"
            />
            <button className="bg-gold text-black px-3 py-2 font-[400] rounded-full">
              Subscribe
            </button>
          </div>
        </div>

        {/* Middle Section */}
        <div className='w-full lg:w-1/5 my-2'>
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Knowledge Repository</h3>
          <ul className="text-xs">
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Bonds</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">IPA</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Mutual Funds</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Portfolio Management Services</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Wealth Monitor</Link></li>
          </ul>
        </div>
        <div className='w-full lg:w-1/5 my-2'>
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">About</h3>
          <ul className="text-xs">
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Team</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Careers</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">FAQs</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Blog</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Investment Philosophy</Link></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className='w-full lg:w-1/5 my-2'>
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">Legal</h3>
          <ul className="text-xs">
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Contact</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Disclaimer</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">ODR Portal</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Privacy</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Returns & Cancellation</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Security</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Terms & Disclosure</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">KYC Check</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Scheme documents</Link></li>
            <li className="my-2"><Link href="/" className=" hover:text-primary ">Fraud Notice</Link></li>
          </ul>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
