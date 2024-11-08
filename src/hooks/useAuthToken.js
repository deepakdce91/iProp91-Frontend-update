import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useAuthToken = (navigate) => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Only redirect if we're not on the authentication or landing page
      if (!(location.pathname === "/authenticate" || location.pathname === "/")) {
        console.log("No token found, redirecting to login.");
        navigate("/");
      }
    }
  }, [navigate, location]);
};

export default useAuthToken;
