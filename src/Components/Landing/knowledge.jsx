import React from 'react';

const Knowledge = () => {
  return (
    <div className="flex flex-col items-center justify-center  p-6">
      <h1 className="text-3xl text-center md:text-6xl font-semibold text-black py-6 text-primary">
        We encourage to empower <br /> your choice with knowledge
      </h1>
      <div className="flex flex-wrap gap-10">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-800  mx-auto  rounded-xl overflow-hidden shadow-lg">
            <img
              src="images/image.jpg"
              alt="Library"
              className="object-cover w-full h-48 opacity-70"
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
