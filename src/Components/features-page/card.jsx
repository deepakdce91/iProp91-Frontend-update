import React from "react";

const Card = (props) => {
  return (
    <>
      <div
        className={
          props.index % 2 == 0
            ? "flex flex-col lg:flex-row-reverse gap-5 mb-8"
            : "flex flex-col lg:flex-row gap-5 mb-8"
        }
      >
        <div className="mt-4 shadow-lg shadow-[#e8e8e8] p-4 lg:p-5 flex flex-col gap-6 lg:gap-10">
          <h1 className="font-bold text-xl lg:text-2xl text-gray-500 capitalize">
            {props.heading}
          </h1>
          <p className="text-base lg:text-lg">{props.content}</p>
        </div>
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <img src={props.image} alt="image" className="w-full lg:w-auto" />
        </div>
      </div>
    </>
  );
};

export default Card;
