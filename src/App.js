// import Sidebar from "./Components/Sidebar/Sidebar";\
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

// import { FcLock } from "react-icons/fc";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthProvider>
      <div className="app">
        <div className="Poppins">
          {" "}
          {/* <Footer /> */}{" "}
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
            {/* <Footer/> */}{" "}
          </Routes>{" "}
        </div>{" "}
        <ToastContainer
          position="top-center"
          autoClose={2000} // Ensure toasts auto-close
          hideProgressBar={false} // Show the progress bar
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
