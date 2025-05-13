"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ScrollAnimatedText() {
  const containerRef = useRef(null);
  const [textData, setTextData] = useState({
    title: "",
    text: "",
  });
  const [loading, setLoading] = useState(true);

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
    return text ? text.split(" ") : [];
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/heroText/fetchAllHeroTexts`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        if (response.data && response.data.length > 0) {
          console.log("hero text data: ", response.data);
          setTextData({
            title: response.data[0].title || "",
            text: response.data[0].text || "",
          });
          console.log("hero text: ", response.data[0]);
        } else {
          console.warn("No hero text data found in the response");
          setTextData({
            title:
              "Curated real estate management solutions for the ones who have arrived",
            text: "Real estate transactions as well as management is complicated, biased, and lacks transparency. With constant regulatory changes and cumbersome one-sided documentation, you need a refined way to manage your most valued asset. Using curated tools and unbiased data-driven analysis, we endeavor to ensure your real estate transactions yield desired results and your ownership experience is hassle-free.",
          });
        }
      } catch (error) {
        console.error("Error fetching hero text:", error);
        toast.error("Failed to fetch hero text");
        setTextData({
          title:
            "Curated real estate management solutions for the ones who have arrived",
          text: "Real estate transactions as well as management is complicated, biased, and lacks transparency. With constant regulatory changes and cumbersome one-sided documentation, you need a refined way to manage your most valued asset. Using curated tools and unbiased data-driven analysis, we endeavor to ensure your real estate transactions yield desired results and your ownership experience is hassle-free.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split the title and text into words
  const headingWords = splitText(textData.title);
  const subheadingWords = splitText(textData.text);

  // Calculate total words for animation timing
  const totalWords = headingWords.length + subheadingWords.length * 1.3;

  // Show loading state or render content
  return (
    <div
      className="relative h-screen lg:h-fit bg-transparent px-3 
            lg:py-10 
            between-md-lg:py-0 
            max-sm:py-0 
            md:pb-0 
            md:py-0 
            flex justify-start "
      ref={containerRef}
    >
      {loading ? (
        <div className="flex h-[110vh] items-center justify-center ">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : (
        <section className="flex lg:h-fit md:justify-start md:h-[70vh] lg:pb-28 items-center justify-center">
          <div className="flex flex-col gap-8 items-center">
            <h1 className="lg:text-6xl font-semibold w-full lg:w-8/12 text-4xl text-white">
              {headingWords.map((word, index) => (
                <AnimatedWord
                  key={`heading-${index}`}
                  word={word}
                  index={index}
                  totalWords={totalWords}
                />
              ))}
            </h1>

            <p className="lg:text-5xl w-full lg:w-8/12 text-2xl text-white">
              {subheadingWords.map((word, index) => (
                <AnimatedWord
                  key={`subheading-${index}`}
                  word={word}
                  index={index + headingWords.length}
                  totalWords={totalWords}
                />
              ))}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
