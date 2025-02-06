import axios from 'axios';

import React, { useEffect, useState } from 'react';

const BrandMarquee = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/OwnersFrom/fetchAllActiveOwnersFrom`,
          {
            headers: {
              "Content-Type": "application/json",
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
    <div className="relative bg-white border-y-[1px] border-y-white/20  flex flex-col w-full items-center justify-center h-[60vh] px-5 md:px-16  overflow-hidden">
      <p className="text-center text-xl lg:text-3xl lg:max-w-5xl font-semibold text-gold "> Trusted by
      </p>
      <p className="text-center text-3xl lg:text-6xl lg:max-w-5xl font-semibold text-black mb-10 "> Verified owners from
      </p>
      {/* First Row - Left to Right */}
      <div className="relative flex max-w-[100vw] overflow-hidden py-5 ">
        <div className="flex gap-5 animate-marquee [--duration:30s] hover:[animation-play-state:paused]">
          {[...data, ...data].map((item, index) => (
            
            <div key={index} className="h-full px-2.5">
              <div className="w-[7rem] lg:w-[9rem]">
                <img src={item.url} alt="img" className="md:w-36 md:h-36 w-24 h-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default BrandMarquee;
