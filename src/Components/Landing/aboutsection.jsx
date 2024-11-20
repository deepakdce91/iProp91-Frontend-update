import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GsapTextColorChange() {
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  // Custom splitText function that splits text by words
  const splitText = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="inline-block opacity-20">
        {word}&nbsp;
      </span> // Add space after each word
    ));
  };

  useEffect(() => {
    const animateText = (ref) => {
      const words = ref.current.children;

      gsap.fromTo(
        words,
        { opacity: 0.2, y: 10 }, // Start with low opacity and slight offset
        {
          opacity: 1, // Fade to full opacity
          y: 0, // Slide up to the original position
          stagger: 0.1, // Stagger each word's animation
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%", // Start animation when it enters the viewport
            end: "bottom 60%", // End when it leaves the viewport
            scrub: true, // Smooth scrolling animation
          },
        }
      );
    };

    // Animate heading and subheading
    animateText(headingRef);
    animateText(subheadingRef);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const headingText = "Curated real estate management solutions for the ones who have arrived";
  const subheadingText =
    "Real estate transactions as well as management is complicated, biased, and lacks transparency. With constant regulatory changes and cumbersome one-sided documentation, you need a refined way to manage your most valued asset. Using curated tools and unbiased data-driven analysis, we endeavor to ensure your real estate transactions yield desired results and your ownership experience is hassle-free.";

  return (
    <div className="relative min-h-screen bg-black">
      <section
        className="  flex h-[110vh] lg:pb-20 items-center justify-center"
      >
        <div className="flex flex-col gap-8 items-center h-s">
          {/* Heading */}
          <h1
            ref={headingRef}
            className="lg:text-6xl font-[500] w-12/12 lg:w-8/12 text-2xl  text-white"
          >
            {splitText(headingText)}
          </h1>

          {/* Subheading */}
          <p
            ref={subheadingRef}
            className="lg:text-5xl font-[300] w-12/12 lg:w-8/12 text-xl  text-white "
          >
            {splitText(subheadingText)}
          </p>
        </div>
      </section>
    </div>
  );
}
