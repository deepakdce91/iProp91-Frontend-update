
import { Routes, Route } from "react-router-dom";
import NameHeader from "./Nameheader";
import Links from "./Buylinks";
import Buy from "./Pages/Buy";
import Qeury from "./Pages/Query";

export default function Conci() {
  return (
    <>
      <div className="flex flex-col lg:h-screen ">
        <NameHeader />

        <div class=" mt-5 w-full">
          <div className="w-full">
            <Links />
          </div>
          <div className="w-full mt-10">
            <Routes>
              <Route path="/*" element={<Buy />} />
              <Route path="/sell" element={<Buy />} />
              <Route path="/Query" element={<Qeury />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
