import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Move registration outside component to avoid re-registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GsapTextColorChange() {
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  const splitText = (text) => {
    return text.split(" ").map((word, index) => (
      <span key={index} className="inline-block opacity-20">
        {word}&nbsp;
      </span>
    ));
  };

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === "undefined") return;

    const animateText = (ref) => {
      if (!ref.current) return;
      
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

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      animateText(headingRef);
      animateText(subheadingRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  const headingText = "Curated real estate management solutions for the ones who have arrived";
  const subheadingText =
    "Real estate transactions as well as management is complicated, biased, and lacks transparency. With constant regulatory changes and cumbersome one-sided documentation, you need a refined way to manage your most valued asset. Using curated tools and unbiased data-driven analysis, we endeavor to ensure your real estate transactions yield desired results and your ownership experience is hassle-free.";

  return (
    <div className="relative min-h-screen bg-black px-3">
      <section className="flex min-h-[110vh] lg:pb-28 items-center justify-center">
        <div className="flex flex-col gap-8 items-center h-s">
          <h1
            ref={headingRef}
            className="lg:text-6xl font-[500] w-12/12 lg:w-8/12 text-4xl text-white"
          >
            {splitText(headingText)}
          </h1>

          <p
            ref={subheadingRef}
            className="lg:text-5xl font-[300] w-12/12 lg:w-8/12 text-2xl text-white"
          >
            {splitText(subheadingText)}
          </p>
        </div>
      </section>
    </div>
  );
}