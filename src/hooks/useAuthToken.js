import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useAuthToken = (navigate) => {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Only redirect if we're not on the authentication or landing page or knowledge center
      if (
        !(
          location.pathname === "/authenticate" ||
          location.pathname === "/" ||
          location.pathname.includes("/laws") ||
          location.pathname.includes("/faqs") ||
          location.pathname.includes("/library") ||
          location.pathname.includes("/rewards") ||
          location.pathname.includes("/case-laws") ||
          location.pathname.includes("/nri") ||
          location.pathname.includes("/lend") ||
          location.pathname.includes("/advice") ||
          location.pathname.includes("/journey") ||
          location.pathname.includes("/stage1Form") ||
          location.pathname.includes("/stage2Form") ||
          location.pathname.startsWith("/invite") ||
          location.pathname.startsWith("/welcome") ||
          location.pathname.includes("site-faqs") ||
          location.pathname.includes("/property-journey") ||
          location.pathname.includes("/search-properties") ||
          location.pathname.includes("/property-listing") ||
          location.pathname.includes("/property-details") ||
          location.pathname.includes("/aboutUs") ||
          location.pathname.includes("/termsAndConditions") ||
          location.pathname.includes("/privacyPolicy") ||
          location.pathname.includes("/services")  ||
          location.pathname.includes("/property-for-sale") 
        )
      ) {
        console.log("No token found, redirecting to login.");
        navigate("/");
      }
    }
  }, [navigate, location]);
};

export default useAuthToken;
