
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ConciergeLink = [
  { name: "My Properties", link: "/concierge" },
  { name: "Relationship Manager", link: "/concierge/relations" },
  { name: "Property Management", link: "/concierge/property" },
  { name: "Legal Support", link: "/concierge/legal" },
  { name: "Finance Assistance", link: "/concierge/finance" },
];

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
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
  }, []);

  const currentLink =
    ConciergeLink.find((link) => link.link === location.pathname) ||
    ConciergeLink[0];

  return (
    <>
      <div className="flex w-full lg:hidden px-8 gap-2">
        <div className="relative block text-left z-40" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex h-12 items-center justify-center gap-3 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 w-[240px]  bg-[#f5f5f5]"
          >
            <span style={{ pointerEvents: "none" }}>{currentLink.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {ConciergeLink.map((link, index) => (
                  <Link
                    key={index}
                    to={link.link}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link to="/dash/addproperty">
          <button className="mt-auto mb-auto inactive  text-black hover:text-white border-black flex ml-auto border-2 sm:px-20 px-4 py-4 rounded-xl gap-2">
            <img
              alt="plus"
              loading="lazy"
              width="12"
              height="12"
              decoding="async"
              data-nimg="1"
              className="mt-auto mb-auto"
              style={{ color: "transparent" }}
              src="/svgs/plus.aef96496.svg"
            />{" "}
          </button>
        </Link>
      </div>

      <div
        className="justify-normal lg:!justify-start gap-5 overflow-y-scroll no-scrollbar rounded-md  p-1 text-muted-foreground px-8 hidden lg:!flex"
        style={{ outline: "none" }}
      >
        {ConciergeLink.map((item, index) => (
          <Link
            to={item.link}
            className={`justify-center whitespace-nowrap rounded-lg px-4 border-2 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              item.link === location.pathname
                ? "border-simple"
                : "border-transparent"
            }`}
            key={index}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
