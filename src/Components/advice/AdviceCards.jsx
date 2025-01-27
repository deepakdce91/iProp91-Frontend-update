"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

const carouselData = [
  {
    id: 1,
    title: "EXECUTION",
    heading: "We have found luxury properties for our clients",
    features: [
      "Review of documents to be executed with the developer/seller",
      "Power of attorney",
      "On-ground assistance in relation to the registration process",
      "Guidance on foreign exchange and tax-related compliance",
      "Documentation support for purchase, sale, or lease of property",
    ],
  },
  {
    id: 2,
    title: "Management",
    heading: "We Connect To The World NRI",
    features: [
      "Free access to iProp91 Safe to manage all the documents in relation to your property",
      "Access to iProp91 Owners' Club, a confidential platform of verified owners of the same real estate project with common interests to help enhance the overall experience of the occupants of such project",
      "Assistance in the sale or lease of the property",
      "Documentation support",
      "Tenant identification, KYC, and management of leased property",
      "Periodic updates of the project status",
    ],
  },
  {
    id: 3,
    title: "DRAFT AGREEMENTS",
    heading: "Global Real Estate Solutions",
    features: [
      "Access to best property options from the best developers",
      "Market analysis and reports",
      "Access to genuine reviews and ratings",
      "Regular status updates",
    ],
  },
];

const draftAgreements = Array(8).fill({
  title: "DRAFT AGREEMENTS",
  subtitle: "iProp 91- Residential lease agreement",
});

export default function AdviceCards() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAgreements, setShowAgreements] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
      setTimeout(() => setIsAnimating(false), 500); // Match animation duration
    }
  };

  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length
    );
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50 || info.offset.y < -50) {
      nextSlide();
    } else if (info.offset.x > 50 || info.offset.y > 50) {
      prevSlide();
    }
  };
  const handleCardClick = (offset, slideIndex) => {
    if (offset !== 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(slideIndex);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white p-2 md:p-8 overflow-hidden">
      <div className="mx-auto min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!showAgreements ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row items-center lg:gap-8 justify-center"
            >
              {/* Text content */}
              <div className="w-full lg:w-1/3 lg:ml-14 space-y-6  lg:mt-0">
                <p className="lg:text-7xl text-5xl text-primary font-bold text-start">
                  Advice
                </p>
                <div className="space-y-1  ">
                  <p className="lg:text-2xl max-w-2xl lg:w-full text-start text-xl text-black font-semibold">
                    Understand the law, legal positions and the key terms of
                    your documents. Happy ownership!
                  </p>
                  <ul className="md:text-lg space-y-2 text-gray-700 md:px-2">
                    <li className="flex items-center">
                      <span>Foundational principles and regulations</span>
                    </li>
                    <li className="flex items-center ">
                      <span>Relevant laws for your situation</span>
                    </li>
                    <li className="flex items-center ">
                      <span>Your rights and responsibilities</span>
                    </li>
                    <li className="flex items-center ">
                      <span>Compliance for smooth ownership</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Carousel */}
              <div className="w-full lg:w-2/3 relative">
                <div className="hidden md:flex flex-col items-center justify-center h-[90vh] lg:h-[100vh] ">
                  {[-1, 0, 1].map((offset) => {
                    const slideIndex =
                      (currentIndex + offset + carouselData.length) %
                      carouselData.length;
                    const item = carouselData[slideIndex];
                    return (
                      <motion.div
                        key={item.id}
                        className={`absolute w-full max-w-2xl h-80 py-4 backdrop-blur-lg border border-gray-800 rounded-lg p-6 ${
                          offset === 0 ? "z-30 " : "z-20 "
                        } overflow-hidden`}
                        initial={{
                          scale: offset === 0 ? 0.9 : 0.7,
                          y: `${offset * 60}%`,
                          opacity: offset === 0 ? 0.9 : 0.5,
                        }}
                        animate={{
                          scale: offset === 0 ? 1 : 0.8,
                          y: `${offset * 50}%`,
                          opacity: offset === 0 ? 1 : 0.6,
                        }}
                        whileHover={{ scale: offset === 0 ? 1.05 : 0.85 }}
                        transition={{ duration: 0.3 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleCardClick(offset, slideIndex)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/2.jpg')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <h3 className="text-3xl font-bold mb-4 text-white overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.title}
                        </h3>
                        <ul className="space-y-3">
                          {item.features.map((feature, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <span className="text-base text-gray-300">•</span>
                              <span
                                className={
                                  feature[1]
                                    ? "text-sm text-gray-300 overflow-hidden text-ellipsis "
                                    : "text-base text-gray-300 overflow-hidden text-ellipsis"
                                }
                              >
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Horizontal Carousel for smaller screens */}
                <div className="md:hidden relative flex justify-center items-center h-[80vh] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselData[currentIndex].id}
                      className="w-[90%] h-[500px] bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg p-6 flex flex-col"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/2.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Header section with fixed height */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white truncate">
                          {carouselData[currentIndex].title}
                        </h3>
                      </div>

                      {/* Content section with scrollable area if needed */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <ul className="space-y-3">
                          {carouselData[currentIndex].features.map(
                            (feature, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <span className="text-base text-gray-300 shrink-0">
                                  •
                                </span>
                                <span className="text-sm md:text-base text-gray-300 break-words">
                                  {feature}
                                </span>
                              </motion.li>
                            )
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {carouselData.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentIndex === idx
                            ? "bg-black w-4"
                            : "bg-black hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <button
                onClick={() => setShowAgreements(false)}
                className="absolute right-0 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-4xl font-bold mb-8 text-center">
                Download Draft Agreements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {draftAgreements.map((agreement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: idx * 0.1 },
                    }}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/20 transition-colors group"
                  >
                    <h3 className="text-sm font-semibold mb-2">
                      {agreement.title}
                    </h3>
                    <p className="text-xs text-white mb-4">
                      {agreement.subtitle}
                    </p>
                    <button className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
