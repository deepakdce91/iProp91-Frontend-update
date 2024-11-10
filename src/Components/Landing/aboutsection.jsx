import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "./Carousel";

gsap.registerPlugin(ScrollTrigger);

export default function GsapTextColorChange() {
  const textRef = useRef(null);
  const heroRef = useRef(null);

  // Custom splitText function that splits by words instead of characters
  const splitText = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="inline-block opacity-20">
        {word}&nbsp;
      </span> // Add space after each word
    ));
  };



  useEffect(() => {
    const words = textRef.current.children;

    // Animate each word on scroll
    gsap.fromTo(
      words,
      { opacity: 0.2, y: 20 }, // Start with words at low opacity and slightly lower
      {
        opacity: 1, // Fade to full opacity
        y: 0, // Slide up to original position
        stagger: 0.1, // Stagger effect for each word
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%", // Start animation when text enters viewport
          end: "bottom 60%", // End when text leaves viewport
          scrub: true, // Smooth scroll animation
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const text =
    "Traditional wealth management is broken & you need a better way to manage your money. Using unbiased data-driven decisions, we ensure your investment journey is successful so you can focus on what matters most to you.";

  return (
    <div className="relative">
      <section
        ref={heroRef}
        className="sticky top-[30%] flex  items-center justify-center"
      >
        <div className="sticky flex flex-col items-center h-screen">
          <p
            ref={textRef}
            className="lg:text-5xl font-[500] w-10/12 lg:w-8/12 text-2xl text-center text-gold"
          >
            {splitText(text)}
          </p>
        </div>
      </section>

      <section className="relative z-10">
        <div
          className="w-full flex items-center justify-center bg-white rounded-t-[50%] lg:mt-20"
          style={{
            zIndex: 10,
            boxShadow: "0 -100px 100px -100px gold",
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
          }}
        >
          <div className="flex flex-col w-full min-h-screen py-20 gap-10 justify-center items-center">
            <div className="text-primary text-4xl md:text-6xl lg:text-7xl font-semibold flex flex-col items-center justify-center ">
              <p className="py-2">How iProp91 does</p>
              <p className="py-2">things differently</p>
            </div>
            <Carousel />
          </div>
        </div>
           
            
      </section>
    </div>
  );
}
