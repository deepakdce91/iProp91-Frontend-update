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
        className="flex flex-col items-center justify-center  bg-black text-white  min-h-screen m-auto py-20"
      >
        {/* <div className="hidden md:!flex md:!flex-row justify-between w-full md:px-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden mr-16`}
          />
        </div> */}
        <div className="flex flex-row items-center justify-center w-full px-10 mt-10">
          {/* <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-32 h-32' : 'w-24 h-24'} rounded-full md:!block hidden`}
          /> */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            <p className="text-xl md:text-3xl text-white transition-colors duration-500">
              {scrolled ? 'Talk With an' : 'Talk With an'}
            </p>
            <p
              className={`text-6xl font-bold transition-colors duration-500 ${
                scrolled ? 'text-white' : 'text-white'
              }`}
            >
              {scrolled ? 'Expert' : 'Expert'}
            </p>
            <div className="flex my-4 gap-4 w-full flex-col lg:flex-row min-w-64">
              <Button btnname={"Drop Your Number"} bgcolor={"bg-black rounded-full  hover:shadow-gold"} />
              <Button btnname={"Call with an expert"} bgcolor={"bg-black rounded-full  hover:shadow-gold"} />
            </div>
          </div>
          {/* <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden`}
          /> */}
        </div>
        {/* <div className="hidden md:!flex md:!flex-row justify-between w-full px-10 mt-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden mr-16`}
          />
        </div> */}
        <p className="mt-10 md:text-xl font-400 text-center text-sm transition-colors duration-500">
          {scrolled ? 'Just book a boom short demo we will contact you supasoon!' : 'Just book a boom short demo we will contact you supasoon!'}
        </p>
      </div>
    </>
  );
};

export default ExpertContact;
