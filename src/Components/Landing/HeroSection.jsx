import React from "react";

const HeroSection = () => {
  return (
    <div className="  h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl lg:text-7xl font-bold py-4 text-primary">Your Trusted <br /> Real State Manager</h1>

        <p className="text-gray-400 text-md lg:text-xl">Let's manage your all real state differently</p> <br />
        <button className="bg-gold text-white text-sm lg:text-lg font-semibold py-2 px-4 lg:py-4 lg:px-8 rounded-full  hover:bg-gray-200 transition">
          Start your journey
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
