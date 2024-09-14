import React from "react";

const BackgroundTextOverlay = ({ backgroundImage, title, subtitle ,middle}) => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4">{title}</h1>
        <h1 className="text-4xl md:text-7xl font-bold mb-4">{middle}</h1>

        <p className="w-1/2 m-auto text-xs md:text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default BackgroundTextOverlay;
