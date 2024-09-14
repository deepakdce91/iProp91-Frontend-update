
import { Routes, Route } from "react-router-dom";
import Links from "./SafeLinks";
import Documents from "../DealingPages/Documents"
import Handbook from "../DealingPages/Handbook"
import Loans from "../DealingPages/Loan"
import Rental from "../DealingPages/Rental"
import RecentUpdates from "../DealingPages/RecentUpdates"
import PropDetails from "../DealingPages/PropDetails"
export default function Conci() {
  return (
    <>
      <div className="flex flex-col  z-50 ">
          <div className="w-full z-40 ">
            <Links />
          </div>
          <div className="w-full mt-10">
            <Routes>
                <Route path="/*" element={<PropDetails />} />
                <Route path="/Documents/*" element={<Documents />} />
                <Route path="/Handbook" element={<Handbook />} />
                <Route path="/Loans" element={<Loans />} />
                <Route path="/Rental" element={<Rental />} />
                <Route path="/RecentUpdates" element={<RecentUpdates />} />
            </Routes>
          </div>
        </div>
    </>
  );
}
