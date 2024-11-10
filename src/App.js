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

// import { FcLock } from "react-icons/fc";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

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

            return;
          }
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  // Custom hook to manage JWT token
  useAuthToken(navigate);

  return (
    <div className="app">
      <div className="Poppins">
        {" "}
        {/* <Footer /> */}{" "}
        <Routes>
          {isLoggedIn === false && <Route path="/*" element={<Landing />} />}{" "}

          <Route
            path="/authenticate"
            element={<Auth setIsLoggedIn={setIsLoggedIn} />}
          />{" "}
          
          <Route path="/name" element={<AskName />} />
    
          {isLoggedIn === true && (
            <Route
              path="/*"
              element={<AllPage setIsLoggedIn={setIsLoggedIn} />}
            />

            
          )}{" "}
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
  );
}

export default App;
