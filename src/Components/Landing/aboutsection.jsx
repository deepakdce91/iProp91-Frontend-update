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
        { 
          opacity: 0.2, 
          y: 10 
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            end: "bottom 50%",
            scrub: 1,
            onEnter: () => ScrollTrigger.refresh(),
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
    <div className="relative min-h-screen bg-black px-3 ">
      <section
        className="  flex  min-h-[110vh] lg:pb-28  items-center justify-center"
      >
        <div className="flex flex-col gap-8 items-center h-s">
          {/* Heading */}
          <h1
            ref={headingRef}
            className="lg:text-6xl font-[500] w-12/12 lg:w-8/12 text-4xl  text-white"
          >
            {splitText(headingText)}
          </h1>

          {/* Subheading */}
          <p
            ref={subheadingRef}
            className="lg:text-5xl font-[300] w-12/12 lg:w-8/12 text-2xl  text-white "
          >
            {splitText(subheadingText)}
          </p>
        </div>
      </section>
    </div>
  );
}
