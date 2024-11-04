import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import React, { useEffect, useState } from 'react';

const BrandMarquee = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming userId is stored within the token

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/OwnersFrom/fetchAllActiveOwnersFrom?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

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
    <div className="relative flex flex-col w-full items-center px-5 md:px-16 pb-24 overflow-hidden">
      {/* First Row - Left to Right */}
      <div className="relative flex max-w-[100vw] overflow-hidden py-5">
        <div className="flex gap-5 animate-marquee [--duration:30s] hover:[animation-play-state:paused]">
          {[...data, ...data].map((item, index) => (
            <div key={index} className="h-full px-2.5">
              <div className="w-[12rem]">
                <img src={item.url} alt="img" className="w-40 h-40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="relative flex max-w-[100vw] overflow-hidden py-5">
        <div className="flex gap-5 animate-marquee-reverse [--duration:30s] hover:[animation-play-state:paused]">
          {[...data, ...data].map((item, index) => (
            <div key={index} className="h-full px-2.5">
              <div className="w-[12rem]">
                <img src={item.url} alt="img" className="w-40 h-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandMarquee;
