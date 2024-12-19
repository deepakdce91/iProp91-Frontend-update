import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const carouselData = [
  {
    id: 1,
    title: "Identification",
    heading: "We have found luxury properties for our clients",
    features: [
      "Access to best property options from the best developers",
      "Market analysis and reports",
      "Access to genuine reviews and ratings from verified owners of the same project",
      "Periodic update of the project status",
    ],
  },
  {
    id: 2,
    title: "Management",
    heading: "We Connect To The World NRI",
    features: [
      "Free access to iProp91 Safe to manage all the documents in relation to your property",
      "Access to iProp91 Owners' Club, a confidential platform of verified owners of same real estate project with common interests to help enhance the overall experience of the occupants of such project",
      "Assistance in sale or lease of the property",
      "Documentation support",
      "Tenant identification, KYC and management of leased property",
      "Periodic updates of the project status",
    ],
  },
  {
    id: 3,
    title: "Execution",
    heading: "Global Real Estate Solutions",
    features: [
      "Review of documents to be executed with the developer/seller",
      "Power of attorney",
      "On ground assistance in relation to registration process",
      "Guidance on foreign exchange and tax related compliance",
      "Free access to iProp91 Handbook – summary of key terms of the documents executed with the developer, bank/NBFC and/or the tenant in simple English",
      "Assistance in procurement of loan / financing for the project",
    ],
  },
];

export default function Cards() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  };

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

  return (
    <div className="w-full min-h-screen bg-transparent backdrop-blur-md text-black">
      <div className="p-4 md:p-8 flex flex-col md:flex-row items-center justify-center">
        <div className="flex flex-col md:flex-row items-center md:gap-8 justify-center">
          {/* Text content */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0  space-y-2 md:space-y-4 mt-28 text-center md:text-start md:mt-0">
            <p className="text-4xl md:text-6xl text-black font-semibold">
              NRI
            </p>
            <p className="text-2xl md:text-3xl text-black font-semibold">
              We connect to the world NRI
            </p>
            <p className="md:text-2xl text-black overflow-hidden text-ellipsis whitespace-nowrap">
              iProp91 endeavors to provide customized services to NRIs in the
              following categories, to ensure hassle-free ownership
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full md:w-2/3 relative">
            {/* Vertical Carousel for larger screens */}
            <div className="hidden md:flex flex-col items-center justify-center h-[100vh] ">
              {[-1, 0, 1].map((offset) => {
                const slideIndex =
                  (currentIndex + offset + carouselData.length) %
                  carouselData.length;
                const item = carouselData[slideIndex];
                return (
                  <motion.div
                    key={item.id}
                    className={`absolute w-full hover:scale-110 max-w-2xl h-80 py-4 backdrop-blur-lg border border-gray-800 rounded-lg p-6 ${
                      offset === 0 ? "z-20" : "z-10"
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
                    whileHover={{ scale: 1.001 }}
                    transition={{ duration: 0.5 }}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={handleDragEnd}
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
                          <span className="text-base text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
              {/* Navigation buttons */}
              {/* ... existing button code ... */}
            </div>

            {/* Horizontal Carousel for smaller screens */}
            <div className="md:hidden flex justify-center items-center h-[500px] overflow-hidden ">
              {[-1, 0, 1].map((offset) => {
                const slideIndex =
                  (currentIndex + offset + carouselData.length) %
                  carouselData.length;
                const item = carouselData[slideIndex];
                return (
                  <motion.div
                    key={item.id}
                    className={`absolute w-[80%] py-10 bg-black/40 backdrop-blur-lg border border-gray-800 rounded-lg p-6 ${
                      offset === 0 ? "z-20" : "z-10"
                    }`}
                    initial={{
                      scale: offset === 0 ? 0.9 : 0.7,
                      x: `${offset * 60}%`,
                      opacity: offset === 0 ? 0.9 : 0.5,
                    }}
                    animate={{
                      scale: offset === 0 ? 1 : 0.8,
                      x: `${offset * 50}%`,
                      opacity: offset === 0 ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.5 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/2.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <h3 className="text-3xl  font-bold mb-4 text-white">
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
                          <span className="text-base text-gray-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
              {/* <button
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
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
