import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import StateLaw from "./components/StateLaw";
import CentralLaw from "./components/CentralLaw";
import Breadcrumb from "../Landing/Breadcrumb";

const Law = () => {
  const [view, setView] = useState("main");
  const [lawData, setLawData] = useState([]);

  const handleBack = () => {
    console.log("Back button clicked");
    setView("main");
    setLawData([]);
  };

  const breadcrumbItems = view === "main" 
    ? [
        { label: "Knowledge Center", link: "/" },
        { label: "Laws" }
      ]
    : view === "state"
    ? [
        { label: "Knowledge Center", link: "/" },
        { label: "Laws", link: "/laws" },
        { label: "State Laws" }
      ]
    : [
        { label: "Knowledge Center", link: "/" },
        { label: "Laws", link: "/laws" },
        { label: "Central Laws" }
      ];

  // Function to fetch data for central laws
  const fetchCentralLaws = async () => {
    try {

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchAllActiveCentralLaws`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLawData(response.data);
      setView("central");
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    }
  };

  // Function to fetch data for State laws
  const fetchStateLaws = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveStates`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLawData(response.data);
      setView("state");
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-black p-4">
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} onBack={handleBack} />
        
        <main className="mt-10 ">
          {view === "main" && (
            <div className="flex h-screen flex-col lg:flex-row gap-6 items-center justify-center">
              <div className="flex flex-col gap-3 items-center justify-center transition-all py-5 rounded-full">
                <img
                  onClick={fetchStateLaws}
                  className="w-[40%] cursor-pointer hover:opacity-90 transition-opacity"
                  src="/images/statelaw.png"
                  alt="State Laws"
                />
                <button 
                  onClick={fetchStateLaws} 
                  className="w-[60%] rounded-full border-b-[4px] border-b-gold hover:shadow-lg hover:shadow-gold bg-gray-100 text-black hover:scale-105 transition-all py-2"
                >
                  <span className="relative z-10 capitalize">State Laws</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 items-center justify-center transition-all py-5 rounded-full">
                <img
                  onClick={fetchCentralLaws}
                  className="lg:w-[40%] w-[30%] cursor-pointer hover:opacity-90 transition-opacity"
                  src="/images/centrallaw.png"
                  alt="Central Laws"
                />
                <button onClick={fetchCentralLaws} className="w-[60%] rounded-full border-b-[4px] border-b-gold hover:shadow-lg hover:shadow-gold bg-gray-100 text-black hover:scale-105 transition-all py-2 ">
                  <span className="relative z-10 capitalize">Central Laws</span>
                </button>
              </div>
            </div>
          )}

          {view === "state" && <StateLaw onBack={handleBack} data={lawData} />}
          {view === "central" && <CentralLaw onBack={handleBack} data={lawData} />}
        </main>
      </div>
    </div>
  );
};

export default Law;
