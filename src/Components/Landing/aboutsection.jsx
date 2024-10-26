import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextAnimation";

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

export default function GsapTextColorChange() {
  const textRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Custom splitText function that splits by words instead of characters
  const splitText = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="inline-block">
        {word}&nbsp;
      </span> // Add space after each word
    ));
  };

  useEffect(() => {
    const words = textRef.current.children; // Use children directly from the textRef

    // Animate each word on scroll
    gsap.fromTo(
      words,
      { color: "black", opacity: 1 }, // Start with gray and fully visible
      {
        color: "black", // Change to black
        opacity: 1, // Keep fully visible
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 90%", // Start when text enters viewport
          end: "bottom 70%", // End when text leaves viewport
          scrub: true, // Smooth color transition
        },
        stagger: 0.1, // Stagger the animation for each word
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const text = "Traditional wealth management is broken & you need a better way to manage your money. Using unbiased data driven decisions, we ensure your investment journey is successful so you can focus on what matters most to you.";

  return (
    <div className="relative">
      <section
        ref={heroRef}
        className="sticky top-[30%] flex h-screen items-center justify-center "
      >
        <div
          ref={heroRef}
          className="sticky flex flex-col items-center  h-screen "
        >
          <h1 ref={textRef} className="lg:text-5xl font-[500] w-10/12 lg:w-8/12 text-2xl text-center">
        {splitText(text)}
      </h1>

      {/* will use this component after the responsiveness and correction of the animation */}
          {/* <TextReveal
            text={
              "Traditional wealth management is broken & you need a better way to manage your money. Using unbiased data driven decisions, we ensure your investment journey is successful so you can focus on what matters most to you."
            }
          /> */}
          <br />
          <br />
          <ProfileCard />
        </div>
      </section>

      <section className="relative z-10 h-screen">
        <div
          className=" w-full flex items-center justify-center bg-white rounded-t-[50%] lg:mt-20"
          style={{
            zIndex: 10,
            boxShadow: "0 -100px 100px -100px gold",
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
          }}
        >
          <div className="flex flex-col w-full ">
            <h2 className="text-primary text-4xl md:text-6xl lg:text-7xl font-semibold flex flex-col items-center justify-center h-screen">
              <p className="py-2">How iProp91 does</p>
              <p className="py-2">things differently</p>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
