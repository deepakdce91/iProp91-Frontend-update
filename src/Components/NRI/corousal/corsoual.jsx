import React, { useState, useEffect, useRef } from 'react';
import Button from '../../CompoCards/GoldButton/Goldbutton';

const ExpertContact = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (visible && window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.9 } // Adjust this threshold as needed
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
        
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center  bg-white max-w-[1500px] m-auto"
      >
        <div className="hidden md:!flex md:!flex-row justify-between w-full md:px-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden mr-16`}
          />
        </div>
        <div className="flex flex-row items-center justify-between w-full px-10 mt-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden`}
          />
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            <p className="text-xl md:text-3xl text-black transition-colors duration-500">
              {scrolled ? 'Oops you forgot to call us' : 'Talk With an'}
            </p>
            <p
              className={`text-6xl font-bold transition-colors duration-500 ${
                scrolled ? 'text-black' : 'text-primary'
              }`}
            >
              {scrolled ? 'Call?' : 'Expert'}
            </p>
            <div className="flex m-2 w-full flex-col lg:flex-row min-w-64">
              <Button btnname={"Drop Your Number"} bgcolor={"bg-gold"} />
              <Button btnname={"Request a Call"} bgcolor={"bg-gold"} />
            </div>
          </div>
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden`}
          />
        </div>
        <div className="hidden md:!flex md:!flex-row justify-between w-full px-10 mt-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-16 h-16'} rounded-full md:!block hidden mr-16`}
          />
        </div>
        <p className="mt-10 md:text-xl font-400 text-center text-sm transition-colors duration-500">
          {scrolled ? 'No need to worry you can do it now' : 'Just book a boom short demo we will contact you supasoon!'}
        </p>
      </div>
      <div className="min-h-96"></div>
    </>
  );
};

export default ExpertContact;
