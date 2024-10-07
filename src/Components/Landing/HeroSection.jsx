import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-black text-white h-96 flex items-center">
      <div className="ml-16">
        <div className="text-[90px] font-semibold mb-8"><p>Your Trusted</p> <p>Real State Manager</p>  </div>
        <p className="mb-4 text-gray-400 text-lg">Let's manage all your real state differently</p>
        <button className="bg-white text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition">
          Start your journey →
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
