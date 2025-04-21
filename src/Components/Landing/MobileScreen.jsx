import React, { useEffect, useState } from "react";
import Carousel from "./Carousel";
import axios from "axios";

const MobileScreen = () => {
  const [data, setData] = useState([]);

  const servicesRoutes = [
    "/service/listing",
    "/service/concierge",
    "/service/safe",
    "/service/owner-club",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/mobileTiles/fetchAllEnabledMobileTiles`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response data:", response.data);
        setData(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);
  return (
    <section className="w-full">
      <section className="relative z-10 w-full">
        <div className="w-full flex items-center justify-center bg-white  ">
          <div className="flex flex-col w-full min-h-screen py-20 gap-10 justify-center items-center">
            <div className="text-black w-full text-4xl md:text-6xl lg:text-7xl font-semibold flex flex-col items-center justify-center text-center">
              <p className="md:py-2 md:hidden">
                How iProp91 does things differently
              </p>
              <p className="md:py-2 hidden md:block">How iProp91 does</p>
              <p className="md:py-2 hidden md:block">things differently</p>
            </div>
            <Carousel data={data} />
          </div>
        </div>
      </section>
    </section>
  );
};

export default MobileScreen;
