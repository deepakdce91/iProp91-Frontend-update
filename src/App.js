// import Sidebar from "./Components/Sidebar/Sidebar";\
import AllPage from "./Components/Allpages/allpages.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AskForLogin from "./Components/User/Login/askforlogin.jsx";
import Auth from "./Components/User/Login/Auth";
import AskName from "./Components/User/Login/AskName.jsx";
import Landing from "./Components/Landing/landing.jsx";
import { useEffect, useState } from "react";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            setIsLoggedIn(true);
        }
      
    }, [isLoggedIn])
    

    
  return (
    <>
      <Router>
        <div className="Poppins">
          {" "}
          {/* <Footer /> */}{" "}
          <Routes>
            {isLoggedIn === false && <Route path="/*" element={<Landing />} /> }{" "}
            {/* <Route path="/auth" element={<AskForLogin />} />{" "} */}
            <Route path="/authenticate" element={<Auth setIsLoggedIn = {setIsLoggedIn} />} />{" "}
            <Route path="/name" element={<AskName />} />
            {/* <User/> */} {/* <Sidebar /> */} {/* <NRI/> */} {/* <Advice/> */}{" "}
            {isLoggedIn === true && <Route path="/*" element={<AllPage setIsLoggedIn = {setIsLoggedIn}/>} />} {/* <Footer/> */}{" "}
          </Routes>{" "}
        </div>{" "}
      </Router>{" "}
    </>
  );
}

export default App;
