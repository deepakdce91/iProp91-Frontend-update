
import { Routes, Route } from "react-router-dom";
import Links from "./SafeLinks";
import Documents from "../DealingPages/Documents"
import Handbook from "../DealingPages/Handbook"
import Loans from "../DealingPages/Loan"
import Rental from "../DealingPages/Rental"
import RecentUpdates from "../DealingPages/RecentUpdates"
import PropDetails from "../DealingPages/PropDetails"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export default function Conci() {
  const [properyname, setPropertyName] = useState("");
  const [PropId, setPropId] = useState("");;
  useEffect(() => {
    const fetchPropertyName = async () => {
      const propertyId = window.location.pathname.split("/")[3];
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);
      // ${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/IPP00002?userId=IPU0008
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}?userId=${user.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPropertyName(data.project);
          setPropId(data._id);
          console.log("Fetched", data);
        }
      } catch (err) {
        toast.error("Error fetching data");
        console.log(err);
      }
    };
    fetchPropertyName();
  }
  , []);

  return (
    <>
      <div className="flex flex-col text-white z-50 ">
        <div className="w-full  pt-2">
          <Links />
        </div>
        <div className="w-full text-black">
          <Routes>
            <Route path="/*" element={<PropDetails />} />
            <Route path="/Documents/*" element={<Documents PropId={PropId} PropName={properyname} />} />
            <Route path="/Handbook" element={<Handbook />} />
            <Route path="/Loans" element={<Loans />} />
            <Route path="/Rental" element={<Rental />} />
            <Route path="/RecentUpdates" element={<RecentUpdates />} />
          </Routes>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
