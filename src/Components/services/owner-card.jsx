import React from "react";
import Card from "./card";

const OwnerCard = ({ list, title, discription, imageNumber }) => {
  return (
    <>
      <section className="mt-8 lg:mt-[10vh]">
        <h1 className="font-bold text-start capitalize text-2xl lg:text-3xl mb-8 lg:mb-15 text-left">
          {title}
        </h1>
        <p className="text-base lg:text-lg text-left">{discription}</p>
        <ul className="mt-6 lg:mt-8">
          {list.map((items, index) => (
            <Card
              key={index}
              heading={items.heading}
              content={items.content}
              image={items.image}
              index={index}
            />
          ))}
        </ul>
        <div className="mt-10 w-full flex justify-center mx-auto lg:mt-8">
          <img
            src={`/owner-club/${imageNumber}.png`}
            alt="image"
            className="w-full mt-5"
          />
        </div>
      </section>
    </>
  );
};

export default OwnerCard;
