// import Sidebar from "./Components/Sidebar/Sidebar";
import AllPage from "./Components/Allpages/allpages.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AskForLogin from "./Components/User/Login/askforlogin.jsx";
import Auth from "./Components/User/Login/Auth";
import AskName from "./Components/User/Login/AskName.jsx";
import Landing from "./Components/Landing/landing.jsx";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthToken from "./hooks/useAuthToken.js";
import { ToastContainer } from "react-toastify";
import InvitationPage from "./Components/Invitation/InvitationPage.jsx";
import WelcomePage from "./Components/Welcome/WelcomePage.jsx";
import PropertyDetail from "./Components/listingpage/id/page.jsx";
import { AuthProvider } from "./context/AuthContext";

// Custom Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 min-h-screen bg-[radial-gradient(circle_at_center,#111c2c_10%,#111c2c_50%,#0b0d1e_100%)] flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <div className="text-white text-lg font-medium animate-pulse">
          Loading...
        </div>
        
        {/* Optional: Progress dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle route changes with loading state
  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 300); // Minimum loading time for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const tokenid = jwtDecode(token);
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuser/${tokenid.userId}?userId=${tokenid.userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": token,
              },
            }
          );
          if (response.ok) {
            const user = await response.json();
            localStorage.setItem("userPhone", user.phone);
            localStorage.setItem("userId", user._id);
          }
        } catch (error) {
          console.error(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  // Custom hook to manage JWT token
  useAuthToken(navigate);

  // Show loading screen during initial load or route changes
  if (isLoading || routeLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <div className="app">
        <div className="Poppins">
          <Routes>
            {/* Public routes accessible to all */}
            <Route path="/welcome/:token" element={<WelcomePage />} />
            <Route path="/invite/:token" element={<InvitationPage />} />
            
            {/* Unauthenticated routes */}
            {isLoggedIn === false && (
              <Route
                path="/*"
                element={<Landing setIsLoggedIn={setIsLoggedIn} />}
              />
            )}
            <Route
              path="/authenticate"
              element={<Auth setIsLoggedIn={setIsLoggedIn} authPage={true} />}
            />
            <Route path="/name" element={<AskName />} />
            
            {/* Protected routes */}
            {isLoggedIn === true && (
              <Route
                path="/*"
                element={<AllPage setIsLoggedIn={setIsLoggedIn} />}
              />
            )}
          </Routes>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </AuthProvider>
  );
}

export default App;