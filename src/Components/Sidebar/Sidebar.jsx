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
  Lock 
} from "lucide-react";

const SidebarIcons = {
  "Concierge": { icon: Home, link: "/concierge" },
  "iProp91 Safe": { icon: Shield, link: "/safe" },
  "Owners' Club": { icon: Users, link: "/family" },
  "Real Insights": { icon: Lightbulb, link: "/realinsight" },
  "Advice": { icon: BookOpen, link: "/advice" },
  "Lend": { icon: RefreshCw, link: "/lend" },
  "NRI": { icon: Home, link: "/nri" },
  "listingPage": { icon: Home, link: "/property-for-sale" }
};

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isSafeLocked, setIsSafeLocked] = useState(true);
  const [isFamilyLocked, setIsFamilyLocked] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      
      axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers?userId=${decoded.userId}`,
        { headers: { "auth-token": token } }
      )
      .then(response => {
        setIsFamilyLocked(response.data.data.length === 0);
      })
      .catch(console.error);

      axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallpropertiesForUser?userId=${decoded.userId}`,
        { headers: { "auth-token": token } }
      )
      .then(response => {
        const approvedProperties = response.data.filter(property => property.applicationStatus === "approved");
        setIsSafeLocked(approvedProperties.length === 0);
      })
      .catch(console.error);
    }
  }, []);

  const renderLink = (key) => {
    const { icon: Icon, link } = SidebarIcons[key];
    const isLocked = (link === "/safe" && isSafeLocked) || (link === "/family" && isFamilyLocked);

    const linkClass = `
      flex items-center p-2  rounded-lg 
      ${location.pathname.includes(link) ? "bg-primary text-white" : "hover:bg-primary"}
      ${expanded ? "w-full" : "w-10 justify-center"}
    `;

    if (isLocked) {
      return (
        <button 
          key={key} 
          className={linkClass} 
          onClick={() => toast(
            link === "/safe" 
              ? "Add a property to unlock this feature." 
              : "You need to join a community to unlock this feature."
          )}
        >
          <Lock className="h-5 w-5" />
          {expanded && <span className="ml-3 truncate">{key}</span>}
        </button>
      );
    }

    return (
      <Link 
        key={key} 
        to={link} 
        className={linkClass}
      >
        <Icon className={`h-5 w-5 ${expanded ? "text-black" : "text-white"}`} />
        {expanded && <span className="ml-3 truncate">{key}</span>}
      </Link>
    );
  };

  return (
    <aside 
      className={`
        h-screen p-4  relative bg-black
        ${expanded ? "w-64 bg-white border-r-[1px] border-r-black/50  " : "w-16"}
        transition-all duration-300 ease-in-out
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <nav className="h-full flex flex-col">
        <div className="flex items-center justify-center mb-12 mt-5">
          <img 
            src="/svgs/iPropLogo.6ed8e014.svg" 
            alt="Logo" 
            className={`
               
              ${expanded ? "mr-4 h-14 w-14" : "h-8 w-8"}
              transition-all duration-300
            `} 
          />
        </div>

        <div className="flex-1 space-y-2">
          {Object.keys(SidebarIcons).map(renderLink)}
        </div>
      </nav>

      {/* Expand Button on the Right Border */}
      <div 
        className={`
          absolute top-0 right-0 h-full w-2 
          cursor-col-resize ${expanded ? "bg-white" : "bg-black"}
          transition-all duration-300 ease-in-out
        `}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {showTooltip && (
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded">
            Resize
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;