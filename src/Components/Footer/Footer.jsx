import React from "react";
import Input from "../CompoCards/InputTag/simpleinput";
import Goldbutton from "../CompoCards/GoldButton/Goldbutton";
import { Link } from "react-router-dom";

const QuizLinks = {
  Features: {
    Concierge: {
      to: "/concierge",
    },
    Safe: {
      to: "/safe",
    },
    Family: {
      to: "/family",
    },
    "Real Insight": {
      to: "/realinsight",
    },
    "Buy/Sell/Lease": {
      to: "/buysell",
    },
    Lend: {
      to: "/lend",
    },
    Advice: {
      to: "/advise",
    },
  },
  "Quick Links": {
    Home: {
      to: "/",
    },
    "About Us": {
      to: "/about",
    },
    "Contact Us": {
      to: "/contact",
    },
    "Privacy Policy": {
      to: "/privacy",
    },
    "Terms & Conditions": {
      to: "/terms",
    },
    "FAQ's": {
      to: "/faq",
    },
  },
  "FAQ's": {
    "FAQ's": {
      to: "/faq",
    },
    Laws: {
      to: "/law",
    },
    "Case Laws": {
      to: "/caselaw",
    },
    Library: {
      to: "/library",
    },
  },
};
const Footer = () => {

  return (
    <footer className="bg-white py-10">
      <div className="max-w-[1500px]  mx-auto flex flex-col md:flex-row justify-between ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm m-2 w-full md:w-1/3 text-center md:text-start">
          {/* map quicklinks */}
          {Object.keys(QuizLinks).map((key) => {
            return (
              <div>
                <h3 className="text-primary text-base mb-4">{key}</h3>
                <ul>
                    {Object.keys(QuizLinks[key]).map((subkey) => {
                        return (
                        <li className="my-2">
                            <Link
                            to={QuizLinks[key][subkey].to}
                            className="text-gray-600 hover:text-gray-900 text-xs"
                            >
                            {subkey}
                            </Link>
                        </li>
                        );
                    })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className=" flex flex-col w-full">
          <div className="text-center md:text-end">
            <p className="text-xl md:text-5xl m-2">
              Exclusive Opportunities, <br /> Exclusive Access, Exclusive You!
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-center md:text-right">
            <div className="text-center md:text-end">
              <p className="text-sm m-2 font-semibold">Subscribe to Newsletter</p>
            </div>
            <form className="flex justify-center flex-col md:flex-row md:justify-end">
              <div className="md:w-3/6 mx-2">
                <Input
                  type={"text"}
                  placeholder={"Enter your email"}
                  value={""}
                  setValue={""}
                />
              </div>
              <div className=" md:w-64 mx-2">
                <Goldbutton
                  bgcolor={""}
                  btnname={"Subscribe"}
                  onclick={""}
                ></Goldbutton>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-[1500px] mx-auto mt-10 border-t border-black pt-6 text-center">
        <p className="text-gray-500 text-xs">
          © 2024 iProp91. All rights reserved.
        </p>
      </div>

      
    </footer>
  );
};

export default Footer;
