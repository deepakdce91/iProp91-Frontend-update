import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FcLock } from "react-icons/fc";
import { toast } from "react-toastify";

// Link list for sidebar items
const Linklist = {
  Concierge: {
    icon: "/svgs/concierge.3b98be7e.svg",
    link: "/concierge",
  },
  "iProp91 Safe": {
    icon: "/svgs/safe.4c0ab81e.svg",
    link: "/safe",
  },
  "Owners' Club": {
    icon: "/svgs/family.0aba885d.svg",
    link: "/family",
  },
  "Real Insights": {
    icon: "/svgs/insight.f81afa5c.svg",
    link: "/realinsight",
  },
  "Buy/Sell": {
    icon: "/svgs/buyselllease.708aab01.svg",
    link: "/buysell",
  },
  "NRI": {
    icon: "/svgs/buyselllease.708aab01.svg",
    link: "/nri",
  },
  Lend: {
    icon: "/svgs/lend.610c2e62.svg",
    link: "/lend",
  },
  Advice: {
    icon: "/svgs/advice.ad7002e7.svg",
    link: "/advice",
  },
};

// SmallSidebar component
const SmallSidebar = ({ onClose }) => {
  return (
    <div className="fixed top-0 inset-0 z-[100] lg:hidden  text-white bg-opacity-75  transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="w-full bg-primary h-full flex flex-col z-[100]">
        <div className="flex justify-end px-3 py-2">
          <button onClick={onClose} className="p-2">
            <img
              alt="close"
              loading="lazy"
              width="14"
              height="14"
              src="/svgs/cross.c0162762.svg"
            />
          </button>
        </div>
        <nav className="flex  flex-col justify-evenly text-white">
          {Object.keys(Linklist).map((key, index) => (
            <Link
              key={index}
              to={Linklist[key].link}
              className="flex gap-2 px-7 py-4 rounded-xl ml-auto mr-auto"
              onClick={onClose} // Close sidebar on link click
            >
              <p className="mt-auto mb-auto">{key}</p>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Main Sidebar component
const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("/concierge");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [isSafeLocked, setIsSafeLocked] = useState(true); // Separate state for Safe
  const [isFamilyLocked, setIsFamilyLocked] = useState(true); // Separate state for Family

  const addActive = (link) => {
    setActiveLink(link);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      
      // Fetch communities for the Family route
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers?userId=${decoded.userId}`,
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then((response) => {
          if (response.data.data.length > 0) {
            setIsFamilyLocked(false); // Unlock Family if communities exist
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // Fetch properties for the Safe route
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallpropertiesForUser?userId=${decoded.userId}`,
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then((response) => {
          const approvedProperties = response.data.filter(property => property.applicationStatus === "approved");
          if (approvedProperties.length > 0) {
            setIsSafeLocked(false); // Unlock Safe if there are approved properties
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <>
      <div className="sticky top-0  bottom-0  border-r-[1px] border-r-white/20">
        <div className="hidden lg:!flex h-screen flex-col z-50 w-44 justify-start shadow-xl gap-3 overflow-y-scroll p-2 no-scrollbar">
          <img
            alt=""
            loading="lazy"
            width="75"
            height="69"
            className="h-10 mt-5 w-10 ml-auto mr-auto"
            src="/svgs/iPropLogo.6ed8e014.svg"
          />
          {Object.keys(Linklist).map((key, index) => (
            <div key={index} className="w-full">
              {Linklist[key].link === "/safe" ? (
                isSafeLocked ? (
                  <button
                    className={` w-full active text-black bg-white grid grid-cols-[10%,90%] gap-4 px-4 py-3 rounded-xl border-b-4 border-[1px] ${
                      location.pathname.includes(Linklist[key].link)
                        ? "border-simple "
                        : ""
                    } hover:!border-simple`}
                    onClick={() => toast("Add a property to unlock this feature.")}
                  >
                    <FcLock />
                    <p className="text-sm text-left mb-auto mt-auto">{key}</p>
                  </button>
                ) : (
                  <Link
                    to={Linklist[key].link}
                    className={` w-full active text-black bg-white grid grid-cols-[10%,90%] gap-4 px-4 py-3 rounded-xl border-b-4 border-[1px] ${
                      location.pathname.includes(Linklist[key].link)
                        ? "border-simple "
                        : ""
                    } hover:!border-simple`}
                    onClick={() => addActive(Linklist[key].link)}
                  >
                    <img
                      alt={key}
                      loading="lazy"
                      width="12"
                      height="13"
                      className="mt-auto mb-auto ml-auto"
                      src={Linklist[key].icon}
                    />
                    <p className="text-sm text-left mb-auto mt-auto">{key}</p>
                  </Link>
                )
              ) : Linklist[key].link === "/family" ? (
                isFamilyLocked ? (
                  <button
                    className={` w-full active text-black bg-white grid grid-cols-[10%,90%] gap-4 px-4 py-3 rounded-xl border-b-4 border-[1px] ${
                      location.pathname.includes(Linklist[key].link)
                        ? "border-simple "
                        : ""
                    } hover:!border-simple`}
                    onClick={() => toast("You need to join a community to unlock this feature.")}
                  >
                    <FcLock />
                    <p className="text-sm text-left mb-auto mt-auto">{key}</p>
                  </button>
                ) : (
                  <Link
                    to={Linklist[key].link}
                    className={` w-full active text-black bg-white grid grid-cols-[10%,90%] gap-4 px-4 py-3 rounded-xl border-b-4 border-[1px] ${
                      location.pathname.includes(Linklist[key].link)
                        ? "border-simple "
                        : ""
                    } hover:!border-simple`}
                    onClick={() => addActive(Linklist[key].link)}
                  >
                    <img
                      alt={key}
                      loading="lazy"
                      width="12"
                      height="13"
                      className="mt-auto mb-auto ml-auto"
                      src={Linklist[key].icon}
                    />
                    <p className="text-sm text-left mb-auto mt-auto">{key}</p>
                  </Link>
                )
              ) : (
                <Link
                  to={Linklist[key].link}
                  className={` w-full active text-black bg-white grid grid-cols-[10%,90%] gap-4 px-4 py-3 rounded-xl border-b-4 border-[1px] ${
                    location.pathname.includes(Linklist[key].link)
                      ? "border-simple "
                      : ""
                  } hover:!border-simple bg-black`}
                  onClick={() => addActive(Linklist[key].link)}
                >
                  <img
                    alt={key}
                    loading="lazy"
                    width="12"
                    height="13"
                    className="mt-auto mb-auto ml-auto"
                    src={Linklist[key].icon}
                  />
                  <p className="text-sm text-left mb-auto mt-auto">{key}</p>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Small screen sidebar toggle button */}
        <div className="lg:!hidden h-[10svh] align-middle  sticky top-0 bg-white justify-between !flex px-4 py-2 z-[100]">
          <div>
            <img
              alt="logo"
              loading="lazy"
              width="47"
              height="47"
              style={{ color: "transparent" }}
              src="/svgs/Logo1.d23bdd41.svg"
            />
          </div>
          <button
            className="rounded-md mt-auto mb-auto p-2"
            onClick={toggleSidebar}
          >
            <img
              alt="hamburger"
              loading="lazy"
              width="32"
              height="32"
              style={{ color: "transparent" }}
              src="/svgs/hamburger.8fe0d723.svg"
            />
          </button>
        </div>

        {/* Small sidebar */}
        {sidebarOpen && (
          <SmallSidebar isLocked={isFamilyLocked} onClose={toggleSidebar} />
        )}
      </div>
    </>
  );
};

export default Sidebar;
