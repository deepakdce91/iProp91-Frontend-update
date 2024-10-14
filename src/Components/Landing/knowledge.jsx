import React from 'react';

const Knowledge = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black min-h-screen p-6">
      <h1 className="text-4xl md:text-6xl font-semibold text-white mb-10 text-center">
        We encourage to empower <br /> your choice with knowledge
      </h1>
      <div className="flex flex-wrap gap-10">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <img
              src="images/image.jpg"
              alt="Library"
              className="object-cover w-full h-72 opacity-70"
            />
            <div className="z-50 flex items-center text-center justify-center">
              <p className="text-white text-xl  font-semibold">Law</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Knowledge;
