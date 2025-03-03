"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import axios from "axios";

export default function ScrollAnimatedText() {
  const containerRef = useRef(null);
  const [textData, setTextData] = useState([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 10,
    restDelta: 0.001,
  });

  const splitText = (text) => {
    return text.split(" ");
  };

  const AnimatedWord = ({ word, index, totalWords }) => {
    const start = index / totalWords;
    const end = (index + 1) / totalWords;

    const opacity = useTransform(
      smoothProgress,
      [start, (start + end) / 2, end],
      [0.2, 1, 1]
    );

    const y = useTransform(smoothProgress, [start, end], [10, 0]);

    return (
      <motion.span className="inline-block mr-2" style={{ opacity, y }}>
        {word}
      </motion.span>
    );
  };
  useEffect(() => {
    const fecthData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/heroText/fetchAllHeroTexts`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setTextData(response.data);
        console.log("hero text: ", response.data);
        
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };
    fecthData()
  }, []);

  const headingText =
    "Curated real estate management solutions for the ones who have arrived";
  const subheadingText =
    "Real estate transactions as well as management is complicated, biased, and lacks transparency. With constant regulatory changes and cumbersome one-sided documentation, you need a refined way to manage your most valued asset. Using curated tools and unbiased data-driven analysis, we endeavor to ensure your real estate transactions yield desired results and your ownership experience is hassle-free.";

  const headingWords = splitText(headingText);
  const subheadingWords = splitText(subheadingText);
  const totalWords = headingWords.length + subheadingWords.length * 1.3;

  return (
    <div
      className="relative min-h-screen bg-black px-3 py-10"
      ref={containerRef}
    >
      <section className="flex min-h-[110vh] lg:pb-28 items-center justify-center">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="lg:text-6xl font-semibold w-full lg:w-8/12 text-4xl text-white">
            {headingWords.map((word, index) => (
              <AnimatedWord
                key={index}
                word={word}
                index={index}
                totalWords={totalWords}
              />
            ))}
          </h1>

          <p className="lg:text-5xl  w-full lg:w-8/12 text-2xl text-white">
            {subheadingWords.map((word, index) => (
              <AnimatedWord
                key={index + headingWords.length}
                word={word}
                index={index + headingWords.length}
                totalWords={totalWords}
              />
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
