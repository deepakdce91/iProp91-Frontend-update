import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ProfileCard() {
    return (
      <div className="flex p-4 bg-black text-white rounded-lg space-x-4 max-w-xs">
        <img
          className="w-12 h-12 rounded-full"
          src="/images/1.png" // Replace with the actual image URL
          alt="Sandeep Jethwani"
        />
        <div>
          <h2 className="text-xl font-[700]">Ashwani</h2>
          <p className="text-sm text-gray-400">Founder, iProp91</p>
        </div>
      </div>
    );
}

const GsapTextColorChange = () => {
  const textRef = useRef(null);

  // Custom splitText function that splits by words instead of characters
  const splitText = (text) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="inline-block">{word}&nbsp;</span> // Add space after each word
    ));
  };

  useEffect(() => {
    const words = textRef.current.children; // Use children directly from the textRef

    // Animate each word on scroll
    gsap.fromTo(
      words,
      { color: 'gray', opacity: 1 }, // Start with gray and fully visible
      {
        color: 'black', // Change to black
        opacity: 1, // Keep fully visible
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 90%', // Start when text enters viewport
          end: 'bottom 70%', // End when text leaves viewport
          scrub: true, // Smooth color transition
        },
        stagger: 0.1, // Stagger the animation for each word
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const text = "Traditional wealth management is broken & you need a better way to manage your money. Using unbiased data driven decisions, we ensure your investment journey is successful so you can focus on what matters most to you.";

  return (
    <>
    <div className="flex flex-col items-center lg:h-[900px] h-screen ">
      <h1 ref={textRef} className="lg:text-5xl font-[500] w-10/12 lg:w-6/12 text-2xl text-justify">
        {splitText(text)}
      </h1>
      <br /><br />
      <ProfileCard />
      
    </div>
    <div className="flex flex-col lg:hidden w-full">

        <h2 className=" text-primary text-3xl font-semibold flex flex-col items-center justify-center">
         How iProp91 does <br /> things differently
        </h2>

      </div>
    </>
  );
};

export default GsapTextColorChange;
