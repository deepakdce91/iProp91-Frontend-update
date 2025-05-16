"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Call from "../CompoCards/Call";
import AdviceCards from "./AdviceCards";
import DraftAgreementsList from "./ShowDrafts";
import Profile from "../User/Profile/profile";

export default function Advice() {
  const [scrollY, setScrollY] = useState(0);
  const [hasToken, setHasToken] = useState(false);
  const containerRef = useRef(null);
  const adviceCardsRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 8]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };

    checkToken();

    // Scroll to AdviceCards section
    if (adviceCardsRef.current) {
      adviceCardsRef.current.scrollIntoView({ behavior: "smooth" });
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="bg-white md:rounded-t-xl md:overflow-hidden mt-24 lg:mt-0">
      {/* Profile Header */}
      
      {/* Commented-out Background Section */}
      {/* <motion.div
        className={`fixed  inset-0 ${
          hasToken ? "lg:ml-[175px]" : ""
        } h-[100vh] z-0`}
        style={{ opacity }}
      >
        <motion.img
          src="/images/advicebg.png"
          alt="Background"
          className="z-0 w-full h-[100vh] object-cover"
          style={{ scale, filter: `blur(${blur}px)` }}
        />
        <motion.img src="/images/advicebg2.png"  className={`absolute  ${
          hasToken ? "h-[400px] bottom-6 left-[25.9%] w-[590px]" : "lg:w-[585px] lg:h-[370px] lg:bottom-3 lg:left-[25.9%] bottom-[9%] h-[360px] w-full md:w-[80%] md:left-0 md:bottom-[9%] md:h-[370px] "
        }`} />
      </motion.div> */}

      {/* Commented-out Content Section */}
      {/* <div className="relative z-10">
        <div className="h-screen flex justify-center ">
          <p className="text-4xl md:text-6xl font-semibold text-white mt-52  lg:mr-28 lg:max-w-xl text-center" >
            Get advice from our trusted brands
          </p>
        </div>
      </div> */}
        <div className={``}>
          <div ref={adviceCardsRef}>
            <AdviceCards />
          </div>
          <DraftAgreementsList/>
          {/* <Que /> */}
          <Call />
          {/* <ContactUs /> */}
        </div>
    </section>
  );
}