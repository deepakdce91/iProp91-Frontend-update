import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import StateLaw from "./components/StateLaw";
import CentralLaw from "./components/CentralLaw";

const Law = () => {
  const [view, setView] = useState("main");
  const [lawData, setLawData] = useState([]);

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

  //fucntion for back btn
  const handleBack = () => {
    setView("main");
    setLawData([]);
  };

  return (
    <div className="w-full min-h-screen justify-center items-center flex bg-gray-50 p-4">
      {view === "main" && (
        <div className="flex  h-full flex-col lg:flex-row gap-6 items-center justify-center ">
          <div
            className="flex flex-col gap-3 items-center justify-center    transition-all py-5  rounded-full"
            
          >
            <img
            onClick={fetchStateLaws}
              className="w-[40%] cursor-pointer "
              src="/images/statelaw.png"
              alt="statelaw"
            />
            <button onClick={fetchStateLaws} className="text-xl text-black font-serif px-5 py-2 border-b-[5px] border-b-gold hover:shadow-md hover:shadow-gold hover:scale-105 transition-all bg-gray-200 rounded-xl w-[50%] border ">
              <span className="relative z-10 capitalize">State Laws</span>
            </button>
          </div>

          <div
            className="flex flex-col gap-3 items-center justify-center    transition-all py-5  rounded-full"
            
          >
            <img
            onClick={fetchCentralLaws}
              className="lg:w-[40%] w-[30%] cursor-pointer "
              src="/images/centrallaw.png"
              alt="statelaw"
            />
            <button onClick={fetchCentralLaws} className="text-xl text-black font-serif px-5 py-2 border-b-[5px] border-b-gold hover:shadow-md hover:shadow-gold hover:scale-105 transition-all bg-gray-200 rounded-xl md:w-[60%] w-[80%] border ">
              <span className="relative z-10 capitalize">Central Laws</span>
            </button>
          </div>
        </div>
      )}

      {view === "state" && <StateLaw onBack={handleBack} data={lawData} />}

      {view === "central" && <CentralLaw onBack={handleBack} data={lawData} />}
    </div>
  );
};

export default Law;
