import FirstSafe from "./FirstSafe/FirstSafe";
import Dealing from "./Dealing/Dealing";
import { Routes, Route, useLocation } from "react-router-dom";

export default function Safe() {
  const location = useLocation();
  
  return (
    <>
      <div className="h-screen overflow-y-scroll no-scrollbar bg-white ">
        <Routes>
          <Route path="*" element={<FirstSafe />} />
          <Route path="/Dealing/:propid/*" element={<Dealing location={location} />} />
        </Routes>
      </div>
    </>
  );
}
