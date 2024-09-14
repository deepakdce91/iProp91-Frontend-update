import FirstSafe from "./FirstSafe/FirstSafe";
import Dealing from "./Dealing/Dealing";
import { Routes, Route } from "react-router-dom";
export default function Safe() {
  return (
    <>
      <div className="h-screen overflow-y-scroll no-scrollbar bg-[#F9F9F9]">
        <Routes>
          <Route path="*" element={<FirstSafe />} />
          <Route path="/Dealing/*" element={<Dealing />} />
        </Routes>
      </div>
    </>
  );
}
