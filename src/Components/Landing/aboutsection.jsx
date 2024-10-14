import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



function ProfileCard() {
    return (
      <div className="flex  p-4 bg-black text-white rounded-lg space-x-4 max-w-xs">
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

  // Custom splitText function
  const splitText = (text) => {

    return text.split('').map((char, index) => (
      <span key={index} className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
    ));
  };

  useEffect(() => {
    const chars = textRef.current.children; // Use children directly from the textRef

    // Animate each character on scroll
    gsap.fromTo(
      chars,
      { color: '#333333', opacity: 1 }, // Start with gray and fully visible
      {
        color: '#ffffff', // Change to white
        opacity: 1, // Keep fully visible
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 90%', // Start when text enters viewport
          end: 'bottom 70%', // End when text leaves viewport
          scrub: true, // Smooth color transition
        },
        stagger: 0.05, // Stagger the animation for each character
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error aliquam architecto quod reprehenderit, veritatis atque voluptatibus inventore saepe iste itaque earum ut culpa.";

  return (
    <>
    <div className=" bg-black flex flex-col items-center h-[1200px] ">
      <h1 ref={textRef} className="lg:text-7xl font-[500] w-6/12 text-4xl">
        {splitText(text)}
      </h1>
      <br /><br />
    <ProfileCard />
    </div>
    </>
  );
};

export default GsapTextColorChange;
