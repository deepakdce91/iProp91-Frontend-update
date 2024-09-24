// import Sidebar from "./Components/Sidebar/Sidebar";\
import AllPage from "./Components/Allpages/allpages.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AskForLogin from "./Components/User/Login/askforlogin.jsx";
import Auth from "./Components/User/Login/Auth.jsx";
import AskName from "./Components/User/Login/AskName.jsx";
import UpdateUser from "./Components/User/Update/UpdateUser.jsx";
function App() {
  return (
    <>
      <Router>
        <div className="Poppins">
          {/* <Footer /> */}
          <Routes>
            <Route path="/" element={<AskForLogin />} />
            <Route path="/authenticate" element={<Auth />} />
            <Route path="/name" element={<AskName />} />
            <Route path="/update" element={<UpdateUser />} />
            {/* <User/> */}
            {/* <Sidebar /> */}
            {/* <NRI/> */}
            {/* <Advice/> */}
            <Route path="/*" element={<AllPage />} />
            {/* <Footer/> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
