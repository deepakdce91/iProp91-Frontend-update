
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ConciergeLink = [
  // { name: "Property Details", link: "/" },
  { name: "Documents", link: "/Documents" },
  // { name: "Handbook", link: "/Handbook" },
  // { name: "Loans", link: "/Loans" },
  // { name: "Rental", link: "/Rental" },
  // { name: "Recent Updates", link: "/RecentUpdates" },
];

export default function Links() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  // take property id from the url
  const propid = location.pathname.split("/")[3];
  // console.log("propid=", propid);
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

  const currentLink = ConciergeLink.find((link) => link.link === "/"+window.location.pathname.split('/')[4] ) || ConciergeLink[0];  

  return (
    <>
      <div className="flex w-full lg:hidden z-40 px-8 gap-2 justify-between">
        <div className="relative block text-left "  ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex h-12 items-center justify-center gap-3 rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 w-[240px] text-black bg-[#f5f5f5]"
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
            <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white border text-black border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 " >
              <div className="py-1">
                {ConciergeLink.map((link, index) => (
                  <Link
                    key={index}
                    to={"/safe/Dealing/"+propid+link.link}
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
      </div>

      <div
        className="justify-normal lg:!justify-start gap-5 overflow-y-scroll no-scrollbar rounded-md  p-1 text-muted-foreground px-8 hidden lg:!flex border-b-[1px] border-b-white/20 "
        style={{ outline: "none" }}
      >
        {ConciergeLink.map((item, index) => (
          <Link
            to={"/safe/Dealing/"+propid+item.link}
            className={`justify-center whitespace-nowrap rounded-lg px-4 border-2 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-black  ${
              // if location.pathname include  item.link then add border-simple else add border-transparent
              location.pathname === "/safe/Dealing/"+propid+item.link
                ? "border-simple shadow-md shadow-gold"
                : "border-black/20 hover:border-gold hover:shadow-sm shadow-gold"
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
