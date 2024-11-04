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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Assuming userId is stored within the token

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchAllActiveCentralLaws?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveStates?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
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
            <button onClick={fetchStateLaws} className="relative cursor-pointer flex py-2 w-48 items-center justify-center overflow-hidden rounded-full bg-black border-[2px] border-black text-white shadow-2xl duration-300 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gold before:duration-500 before:ease-out hover:shadow-white hover:text-black hover:before:h-56 hover:before:w-56">
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
            <button onClick={fetchCentralLaws} className="relative cursor-pointer flex py-2 w-48 items-center justify-center overflow-hidden rounded-full bg-black border-[2px] border-black text-white shadow-2xl duration-300 before:absolute before:h-0 before:w-0 before:rounded-full before:bg-gold before:duration-500 before:ease-out hover:shadow-white hover:text-black hover:before:h-56 hover:before:w-56">
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
