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
    <div className="w-full min-h-screen justify-center items-center flex bg-black p-4">
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
            <button onClick={fetchStateLaws} className="relative flex py-2 w-2/4 items-center justify-center overflow-hidden rounded-full bg-white border-[2px] border-white text-black shadow-2xl duration-300 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-black before:duration-500 before:ease-out hover:shadow-black hover:text-white hover:before:h-56 hover:before:w-56 ">
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
            <button onClick={fetchCentralLaws} className="relative flex py-2 w-2/4 items-center justify-center overflow-hidden rounded-full bg-white border-[2px] border-white text-black shadow-2xl duration-300 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-black before:duration-500 before:ease-out hover:shadow-black hover:text-white hover:before:h-56 hover:before:w-56 ">
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
