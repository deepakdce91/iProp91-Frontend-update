// import Sidebar from "./Components/Sidebar/Sidebar";\
import AllPage from "./Components/Allpages/allpages.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AskForLogin from "./Components/Login/askforlogin.jsx";
import Signup from "./Components/Login/Signup.jsx";
import Login from "./Components/Login/Login.jsx";
function App() {
  return (
    <>
      <Router>
        <div className="Poppins">
          {/* <Footer /> */}
          <Routes>
            <Route path="/" element={<AskForLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* <User/> */}
            {/* <Sidebar /> */}
            {/* <NRI/> */}
            {/* <Advice/> */}
            <Route path="/dash/*" element={<AllPage />} />
            {/* <Footer/> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
