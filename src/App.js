// import Sidebar from "./Components/Sidebar/Sidebar";\
import Login from "./Components/Login/loginask.jsx";
import AllPage from "./Components/Allpages/allpages.jsx";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <div className="Poppins">
          {/* <Footer /> */}
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
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
