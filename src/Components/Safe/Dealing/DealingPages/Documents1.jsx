import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const NameHeader = () => {
  return (
    <>
      <h1 className="text-2xl p-10  px-36">Mahira Homes 98</h1>
    </>
  );
};

const Links = () => {
  // Reference to the navigation container
  const navRef = useRef(null);

  // Scroll left by a certain amount
  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: -150, // Adjust this value to control scroll distance
        behavior: "smooth",
      });
    }
  };

  // Scroll right by a certain amount
  const scrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: 150, // Adjust this value to control scroll distance
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center justify-betwee">
      {/* Left Arrow */}
      <button onClick={scrollLeft} className="text-gray-400 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Navigation Links */}
      <div
        ref={navRef}
        className="flex space-x-6 overflow-x-auto no-scrollbar mx-24"
      >
        <Link
          href="#"
          className="text-orange-500 font-semibold whitespace-nowrap"
        >
          RERA Documents
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Occupation Certificate
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
        <Link
          href="#"
          className="text-gray-400 hover:text-black whitespace-nowrap"
        >
          Lorem Ipsum
        </Link>
      </div>

      {/* Right Arrow */}
      <button onClick={scrollRight} className="text-gray-400 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const DocumentCard = ({ title, subtitle, uploadDate }) => {
  return (
    <div className="bg-white  shadow rounded-xl p-4 w-80">
      <div className="flex flex-row justify-between">
        <div className="">
          <h2 className="text-2xl font-[400]">{title}</h2>
          <p className="">{subtitle}</p>
        </div>
        <div className="">
          <p className=" text-sm ">Uploaded: </p>
          <p className="text-sm ">{uploadDate}</p>
        </div>
      </div>
      <button className="mt-4 w-full bg-gray-100 text-black font-[400] py-2 px-4 rounded-xl">
        View Document
      </button>
    </div>
  );
};

const DocumentSection = ({name}) => {
  return (
    <div className="flex w-full justify-between ">
      {/* Left Side Title */}
      <div className="mr-8">
        <h1 className="text-gray-500 text-xl">{name}</h1>
      </div>

      {/* Right Side Cards */}
      <div className="flex space-x-6">
        <DocumentCard
          title="Layout plan"
          subtitle="Mahira Home-68"
          uploadDate="27/08/2024"
        />
        <DocumentCard
          title="Layout plan"
          subtitle="Mahira Home-68"
          uploadDate="27/08/2024"
        />
        {/* Add more DocumentCard components as needed */}
      </div>
    </div>
  );
};

export default function Documents() {
  return (
    <>
      <div className="w-full">
        <NameHeader />
        <Links />
        <DocumentSection name="Pre-RERA Approval" />
        <DocumentSection name="RERA Application" />
        <DocumentSection name="RERA Approval" />
        <DocumentSection name="Post-RERA Approval" />
      </div>
    </>
  );
}
