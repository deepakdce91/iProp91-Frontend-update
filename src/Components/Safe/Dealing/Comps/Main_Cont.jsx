
import { Routes, Route } from "react-router-dom";
import Links from "./SafeLinks";
import Documents from "../DealingPages/Documents"
import Handbook from "../DealingPages/Handbook"
import Loans from "../DealingPages/Loan"
import Rental from "../DealingPages/Rental"
import RecentUpdates from "../DealingPages/RecentUpdates"
import PropDetails from "../DealingPages/PropDetails"
import { useEffect } from 'react';
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "@material-tailwind/react";


export default function Conci() {
  const [SafeData, setSafeData] = useState([]);
  const [safeid, setSafeId] = useState("");
  useEffect(() => {
      // get property id from url
      const propertyId = window.location.pathname.split('/')[3];
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);
      // get data from api
      const fetchSafeDate = async () => {

          try {
              const response = await fetch(`http://localhost:3300/api/documents/fetchdocumentsafebypropertyid/${propertyId}?userId=${user.userId}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'auth-token': token
                  }
              });
              if (response.ok) {
                  const data = await response.json();
                  setSafeData(data);
                  setSafeId(data.data._id);
                  console.log("SafeData",data);
              }
          }
          catch (err) {
              toast.error("Error fetching data");
              console.log(err);
          }
      }
      fetchSafeDate();
  }, []);
  return (
    <>
      <div className="flex flex-col  z-50 ">
          <div className="w-full  ">
            <Links />
          </div>
          <div className="w-full mt-10">
            <Routes>
                <Route path="/*" element={<PropDetails />} />
                <Route path="/Documents/*" element={<Documents />} />
                <Route path="/Handbook" element={<Handbook />} />
                <Route path="/Loans" element={
                  SafeData.data ? (
                    <Loans data={SafeData} safeid={safeid} />
                  ) : (
                    <div className="relative top-10 w-full backdrop-blur-sm  flex justify-center items-center" >
                    <Spinner color="amber" className="h-16 w-16" />
                </div>
                  )
                } />
                <Route path="/Rental" element={<Rental />} />
            <Route
              path="/RecentUpdates"
              element={
                SafeData.data && SafeData.data.recentUpdates ? (
                  <RecentUpdates data={SafeData}  safeid={safeid}  />
                ) : (
                  <div className="relative top-10 w-full backdrop-blur-sm  flex justify-center items-center" >
                  <Spinner color="amber" className="h-16 w-16" />
              </div> 
                )
              }/>
            </Routes>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
