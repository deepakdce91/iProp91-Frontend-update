import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Home,
  Shield,
  Users,
  Lightbulb,
  BookOpen,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  Lock,
  LogOut,
  Key, // Add LogOut icon
} from "lucide-react";

import { motion } from "framer-motion";

const SidebarIcons = {
  Concierge: { icon: Home, link: "/concierge" },
  "iProp91 Safe": { icon: Key, link: "/safe" },
  "Owners' Club": { icon: Users, link: "/family" },
  "Real Insights": { icon: Lightbulb, link: "/realinsight" },
  "Advice": { icon: BookOpen, link: "/advice" },
  "Lend": { icon: RefreshCw, link: "/lend" },
  "NRI": { icon: Home, link: "/nri" },
  "Listing Page": { icon: Home, link: "/property-for-sale" },
};

// SmallSidebar component
const SmallSidebar = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="z-[100] fixed h-screen w-screen top-0 inset-0 lg:hidden text-white transform transition-transform duration-300 ease-in-out"
    >
      <div
        className="w-full h-full flex flex-col z-[100]"
        style={{
          backgroundImage: `url(/images/sidebarbg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-75"></div>
        <div className="flex justify-end px-3 py-2 z-[110]">
          <button onClick={onClose} className="p-2 bg-gold rounded-full mt-4">
            <img
              alt="close"
              loading="lazy"
              width="14"
              height="14"
              src="/svgs/cross.c0162762.svg"
            />
          </button>
        </div>
        <nav className="flex flex-col justify-evenly text-white z-[110]">
          {Object.keys(SidebarIcons).map((key, index) => (
            <Link
              key={index}
              to={SidebarIcons[key].link}
              className="flex gap-2 px-7 py-4 rounded-xl ml-auto mr-auto"
              onClick={onClose}
            >
              <p className="text-xl my-3 md:my-5">{key}</p>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isSafeLocked, setIsSafeLocked] = useState(true);
  const [isFamilyLocked, setIsFamilyLocked] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers?userId=${decoded.userId}`,
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          setIsFamilyLocked(response.data.data.length === 0);
        })
        .catch(console.error);

      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallpropertiesForUser?userId=${decoded.userId}`,
          { headers: { "auth-token": token } }
        )
        .then((response) => {
          const approvedProperties = response.data.filter(
            (property) => property.applicationStatus === "approved"
          );
          setIsSafeLocked(approvedProperties.length === 0);
        })
        .catch(console.error);
    }
  }, []);

  const renderLink = (key) => {
    const { icon: Icon, link } = SidebarIcons[key];
    const isLocked =
      (link === "/safe" && isSafeLocked) ||
      (link === "/family" && isFamilyLocked);
      const isActive = location.pathname.includes(link);

      const linkClass = `
        flex text-sm items-center p-1 rounded-xl w-full  
        ${isActive ? "border-gold text-black" : "hover:border-gold"}
        ${expanded 
          ? "w-full flex-row border-[2px] border-b-[4px] p-3" 
          : `w-16 justify-center flex-col ${isActive ? "bg-gold" : ""}`
        }
      `;

    if (isLocked) {
      return (
        <button
          key={key}
          className={linkClass}
          onClick={() =>
            toast(
              link === "/safe"
                ? "Add a property to unlock this feature."
                : "You need to join a community to unlock this feature."
            )
          }
        >
          <Lock className={`"h-5 w-5"  ${expanded ? "text-black" : "text-gold"}`} />
          {expanded ? (
            <span className="ml-3 truncate">{key}</span>
          ) : (
            <span className="text-xs mt-1 text-center text-white">{key}</span>
          )}
        </button>
      );
    }

    return (
      <Link key={key} to={link} className={linkClass}>
        <Icon className={`h-5 w-5 ${expanded ? "text-black" : "text-white"}`} />
        {expanded ? (
          <span className="ml-3 truncate">{key}</span>
        ) : (
          <span className="text-[10px] mt-1 text-center text-white w-12 truncate">{key}</span>
        )}
      </Link>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Logging Out.");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
     <aside
        className={`
        h-[99%]  rounded-xl  my-1 ml-1 top-0 bottom-0 sticky bg-black
        ${expanded ? "w-64 bg-white border-r-[1px] border-r-black/50 p-4" : "w-20"}
        transition-all duration-300 ease-in-out hidden lg:!flex
      `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <nav className="h-full flex flex-col w-full gap-5">
          <div className="flex items-center justify-center mb-12 mt-5">
            <img
              src="/svgs/iPropLogo.6ed8e014.svg"
              alt="Logo"
              className={`
                ${expanded ? "mr-4 h-14 w-14" : "h-8 w-8"}
                transition-all duration-300
              `}
            />

            <button
              onClick={() => setExpanded(!expanded)}
              className={`"p-2 absolute   rounded-full  " ${expanded ?  "top-24 -right-3 bg-gold " : "top-20 bg-gold -right-2"}`}
            >
              {expanded ? (
                <ChevronsLeft className="text-white" />
              ) : (
                <ChevronsRight className="text-white" />
              )}
            </button>
          </div>

          <div className="flex-1 space-y-2 w-full">
            {Object.keys(SidebarIcons).map(renderLink)}
          </div>

          <div
            onClick={handleLogout}
            className={`flex ${expanded ? "flex-row" : "flex-col"} items-center p-2 rounded-lg hover:bg-gold cursor-pointer `}
          >
            <LogOut className={`h-5 w-5 ${expanded ? "text-black" : "text-white"}`} />
            {expanded ? (
              <span className="ml-3 truncate">Logout</span>
            ) : (
              <span className="text-xs mt-1  text-white">Logout</span>
            )}
          </div>
        </nav>
      </aside>

      {/* Small screen sidebar toggle button */}
      <div className="lg:!hidden w-full h-[10svh] align-middle z-[100] sticky top-0 bg-white justify-between !flex px-4 py-2 ">
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

     
    </>
  );
};

export default Sidebar;