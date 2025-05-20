import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Landing/Navbar";

function Landing() {
  const navigate = useNavigate();

  const handleExploreProperties = () => {
    navigate("/search-properties");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16 container mx-auto px-4">
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore properties across India with our interactive map
          </p>
          <button
            onClick={handleExploreProperties}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Explore Properties
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing; 