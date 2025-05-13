import React, { useEffect, useState, useRef } from "react";
import {
  EffectCoverflow,
  Navigation,
  Autoplay,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import axios from "axios";
import DOMPurify from "dompurify";

const CompComponent = ({ item }) => {
  if (!item) {
    return null;
  }

  // Determine if we have one or two images
  const hasImage1 = Boolean(item.centerImage1);
  const hasImage2 = Boolean(item.centerImage2);
  const imagesToShow = hasImage1 && hasImage2 ? 2 : hasImage1 ? 1 : 0;

  return (
    <div className="rounded-2xl max-w-[90vw] md:w-[600px] md:h-[450px] h-[350px] border-2 border-gold overflow-hidden relative flex flex-col hover:scale-105 duration-500">
      <div className="h-[80px] bg-gray-100 text-black px-4 py-2 flex flex-col items-center justify-center">
        <p
          className="md:text-lg text-sm text-start font-semibold"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.topText || ""),
          }}
        ></p>
      </div>
      <div className="md:h-[250px] h-[200px] bg-gray-100 text-black px-2 py-1">
        <div className="bg-white h-full shadow-md flex flex-row">
          {imagesToShow === 1 && (
            <div className="flex w-full flex-col items-center justify-center">
              <div className="flex items-center justify-center h-[180px]">
                <img
                  src={hasImage1 ? item.centerImage1.url : item.centerImage2.url}
                  alt={hasImage1 ? item.centerImage1.name : item.centerImage2.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className="text-sm font-medium text-center">
                {hasImage1 ? item.centerImage1Text : item.centerImage2Text}
              </span>
            </div>
          )}
          
          {imagesToShow === 2 && (
            <>
              <div className="flex w-1/2 flex-col items-center justify-center">
                <div className="flex items-center justify-center h-[140px]">
                  <img
                    src={item.centerImage1.url}
                    alt={item.centerImage1.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center px-1">
                  {item.centerImage1Text}
                </span>
              </div>
              <div className="w-1/2 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-[140px]">
                  <img
                    src={item.centerImage2.url}
                    alt={item.centerImage2.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center px-1">
                  {item.centerImage2Text}
                </span>
              </div>
            </>
          )}
          
          {imagesToShow === 0 && (
            <div className="w-full flex items-center justify-center">
              <span className="text-sm text-gray-500">No images available</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 py-4 bg-gray-200 border-t-[2px] border-t-gold text-black px-4 flex flex-col items-center justify-center relative">
        <div className="absolute left-6 md:top-0 top-[1%] transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-semibold rounded-full p-2 z-10">
          VS
        </div>
        <p
          className="text-black text-xs md:text-sm md:mt-2 text-start"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.bottomText || ""),
          }}
        ></p>
      </div>
    </div>
  );
};

export default function Comparison() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/comparisons/fetchAllEnabledComparisons`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  // Ensure we have enough slides for looping based on slidesPerView
  const processedSlides = (() => {
    if (data.length === 0) return [];
    
    const minSlidesForLoop = 6;
    
    if (data.length >= minSlidesForLoop) return data;

    const duplicatesNeeded = minSlidesForLoop - data.length;
    const duplicatedSlides = [];

    for (let i = 0; i < duplicatesNeeded; i++) {
      duplicatedSlides.push({...data[i % data.length], id: `dup-${i}`});
    }

    return [...data, ...duplicatedSlides];
  })();

  const enableLoop = processedSlides.length >= 6;

  const handleSlideClick = (clickedIndex) => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      swiper.slideToLoop(clickedIndex, 300);
      setActiveIndex(clickedIndex);
    }
  };

  // Function to pause autoplay
  const pauseAutoplay = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
      setIsPaused(true);
    }
  };

  // Function to resume autoplay
  const resumeAutoplay = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
      setIsPaused(false);
    }
  };

  // Custom hover handlers for slides
  const handleSlideHover = (index) => {
    // Only pause when hovering the active/center slide
    if (index === activeIndex) {
      pauseAutoplay();
    }
  };

  const handleSlideHoverExit = () => {
    resumeAutoplay();
  };

  return (
    <>
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: white !important;
          }
          
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 24px !important;
          }
          
          .swiper-pagination-bullet {
            background: white !important;
          }
          
          .swiper-slide-active {
            z-index: 10;
          }
          
          /* Remove any background color/images from swiper slides */
          .swiper-slide {
            background-color: transparent !important;
            background-image: none !important;
          }
          
          /* Fix for coverflow effect shadows */
          .swiper-slide-shadow-left,
          .swiper-slide-shadow-right {
            display: none !important;
          }
          
          /* Style for wrapper div */
          .swiper-slide-wrapper {
            background-color: transparent !important;
          }
        `}
      </style>
      <div className="slider-container relative pb-24 bg-[radial-gradient(circle_at_center,#2d445e_0%,#111c2c_50%,#0b0d1e_100%)] pt-28 flex flex-col items-center border-y-[1px] border-y-white/40">
        <p className="text-center text-3xl lg:text-6xl lg:max-w-5xl font-semibold text-white mb-10">
          The minimum you deserve and we're coming up with more
        </p>
        {/* For larger screens */}
        <div className="hidden md:block w-full">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={enableLoop}
            slidesPerView={3}
            spaceBetween={30}
            slidesPerGroup={1}
            navigation={{
              enabled: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false, // We'll handle this manually
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 300,
              modifier: 2.5,
              slideShadows: false, // Turn off slide shadows
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiper"
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.realIndex);
              autoplayRef.current = swiper.autoplay;
            }}
          >
            {processedSlides.length > 0 &&
              processedSlides.map((item, index) => (
                <SwiperSlide 
                  key={index} 
                  onClick={() => handleSlideClick(index)}
                  onMouseEnter={() => handleSlideHover(index)}
                  onMouseLeave={handleSlideHoverExit}
                  className="bg-transparent"
                >
                  <div className="swiper-slide-wrapper py-10 bg-transparent">
                    <CompComponent item={item} />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* For smaller screens */}
        <div className="block md:hidden w-full">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
            onSwiper={(swiper) => {
              // Store reference for mobile swiper too
              if (!swiperRef.current) {
                swiperRef.current = swiper;
                autoplayRef.current = swiper.autoplay;
              }
            }}
          >
            {processedSlides.map((item, index) => (
              <SwiperSlide 
                key={index} 
                onClick={() => handleSlideClick(index)}
                onMouseEnter={() => handleSlideHover(index)}
                onMouseLeave={handleSlideHoverExit}
                className="bg-transparent"
              >
                <div className="py-10 px-3 z-50 bg-transparent">
                  <CompComponent item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}