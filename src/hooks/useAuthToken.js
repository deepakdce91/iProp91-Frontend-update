import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useAuthToken = (navigate) => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Only redirect if we're not on the authentication or landing page or knowledge center
      if (!(location.pathname === "/authenticate" || location.pathname === "/" || location.pathname.includes("/laws") || location.pathname.includes("/faqs") || location.pathname.includes("/library") || location.pathname.includes("/case-laws") || location.pathname.includes("/nri") || location.pathname.includes("/lend") || location.pathname.includes("/advice"))) {
        console.log("No token found, redirecting to login.");
        navigate("/");
      }
    }
  }, [navigate, location]);
};

export default useAuthToken;
