import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-black text-white h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">Your Trusted <br /> Real State Manager</h1>

        <p className="text-gray-400 text-xl">Let's manage your all real state differently</p> <br />
        <button className="bg-white text-black font-semibold py-4 px-8 rounded-full mt-4 hover:bg-gray-200 transition">
          Start your journey →
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
