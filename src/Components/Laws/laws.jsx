import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const breadcrumbItems =
    view === "main"
      ? [{ label: "Knowledge Center", link: "/" }, { label: "Laws" }]
      : view === "state"
      ? [
          { label: "Knowledge Center", link: "/" },
          { label: "Laws", link: "/laws" },
          { label: "State Laws" },
        ]
      : [
          { label: "Knowledge Center", link: "/" },
          { label: "Laws", link: "/laws" },
          { label: "Central Laws" },
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
        <Breadcrumb items={breadcrumbItems} onBack={handleBack} className={"flex z-50 items-center space-x-2 text-white text-sm lg:text-base absolute top-28 lg:left-24 left-[5%]"} />

        <main className="mt-10 ">
          {view === "main" && (
            <div className=" h-screen flex-col flex gap-6 items-center justify-center">
              <p className="lg:text-2xl text-xl font-semibold text-white">
                Learn the essentials of real estate laws to navigate property
                transactions with confidence.
              </p>
              <div className="flex  flex-col lg:flex-row gap-6 items-center justify-center">

                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                      State Laws
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                      Explore property laws specific to your state, including
                      zoning regulations and local property taxes.
                    </p>
                    <button
                      onClick={fetchStateLaws}
                      className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-black/70 transition-colors duration-300 focus:outline-none focus:ring-2  focus:ring-opacity-50"
                    >
                      View State Laws
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
                  <div className="p-6">
                    
                    <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
                      Central Laws
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                      Understand federal real estate regulations that apply
                      across the country, such as fair housing laws.
                    </p>
                    <button
                      onClick={fetchCentralLaws}
                      className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-black/70 transition-colors duration-300 focus:outline-none  focus:ring-opacity-50"
                    >
                      View Central Laws
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "state" && <StateLaw onBack={handleBack} data={lawData} />}
          {view === "central" && (
            <CentralLaw onBack={handleBack} data={lawData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Law;
