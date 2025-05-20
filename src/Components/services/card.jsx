import React from "react";

const Card = ({ heading, content, image, index, isMobile }) => {
  return (
    <li className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col items-center justify-between gap-4 md:gap-8`}>
      <div className={`flex-1 ${isMobile ? 'w-full' : 'w-auto'}`}>
        <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-4">{heading}</h3>
        <p className="text-sm md:text-base">{content}</p>
      </div>
      <div className={`flex-1 ${isMobile ? 'w-1/2' : 'w-auto'}`}>
        <img 
          src={image} 
          alt={heading} 
          className={`${isMobile ? 'max-w-[120px]' : 'max-w-[100px]'} mx-auto`}
        />
      </div>
    </li>
  );
};

export default Card;
