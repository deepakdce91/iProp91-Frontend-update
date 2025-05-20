import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BrandMarquee = () => {
  // Using placeholder data for demonstration
  const [data, setData] = useState([
    { url: "/api/placeholder/160/80", name: "Brand 1" },
    { url: "/api/placeholder/120/80", name: "Brand 2" },
    { url: "/api/placeholder/200/80", name: "Brand 3" },
    { url: "/api/placeholder/140/80", name: "Brand 4" },
    { url: "/api/placeholder/180/80", name: "Brand 5" },
    { url: "/api/placeholder/100/80", name: "Brand 6" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Actual fetch would go here - using mock for the artifact
        // console.log("Would fetch data from API in real implementation");
        // In actual implementation:
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
    <div className="relative bg-white border-y border-y-white/20 flex flex-col w-full items-center justify-center h-[60vh] px-5 md:px-16 overflow-hidden">
      <p className="text-center text-xl lg:text-3xl font-semibold text-yellow-600">
        Trusted by
      </p>
      <p className="text-center text-3xl lg:text-6xl font-semibold text-black mb-10">
        Verified owners from
      </p>
      
      {/* Marquee container */}
      <div className="relative flex max-w-full overflow-hidden py-5">
        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused]">
          {[...data, ...data].map((item, index) => (
            <div key={index} className="flex items-center justify-center h-16 md:h-24 px-2.5">
              <img 
                src={item.url} 
                alt={`Brand ${item.name}`} 
                className="h-full w-auto object-contain max-w-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandMarquee;