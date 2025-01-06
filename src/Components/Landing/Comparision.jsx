import React, { useEffect, useState, useRef } from "react";
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import axios from "axios";
import DOMPurify from 'dompurify';

const CompComponent = ({ item }) => {
  return (
    <div className="rounded-3xl w-[600px] h-[450px] border-2 border-gold overflow-hidden relative flex flex-col hover:scale-105 duration-500">
      <div className="h-[80px] bg-gray-100 text-black px-4 py-2 flex flex-col items-center justify-center">
        <p className="text-lg text-start font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.topText) }}></p>
      </div>
      <div className="h-[250px] bg-gray-100 text-black px-6 py-2">
        <div className="bg-white h-full p-4 shadow-md flex flex-row gap-7">
          <div className="flex w-[30%] flex-col items-center justify-center">
            <img
              src={item.centerImage1?.url}
              alt={item.centerImage1?.name}
              className="w-16 h-16 object-contain"
            />
            <span className="text-sm font-medium mt-2 text-center">{item.centerImage1Text}</span>
          </div>
          <div className="w-[70%] flex flex-col items-center justify-center">
            <img
              src={item.centerImage2?.url}
              alt={item.centerImage2?.name}
              className="w-16 h-16 object-contain"
            />
            <span className="text-sm font-medium mt-2 text-center">{item.centerImage2Text}</span>
          </div>
        </div>
      </div>
      <div className="absolute left-6 top-[330px] transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-semibold rounded-full p-2 z-10">
        VS
      </div>
      <div className="flex-1 bg-gray-200 border-t-[2px] border-t-gold text-black px-4 flex flex-col items-center justify-center">
        <p className="text-black text-sm mt-2 text-start" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.bottomText) }}></p>
      </div>
    </div>
  );
};

export default function Comparison() {
  const [data, setData] = useState([]);
  const swiperRef = useRef(null);

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
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  const handleSlideClick = (index) => {
    if (swiperRef.current) {
      // Calculate the actual slide index considering the loop
      const swiper = swiperRef.current;
      const realIndex = swiper.params.loop 
        ? index + swiper.loopedSlides 
        : index;
      
      // Use slideTo with immediate transition
      swiper.slideTo(realIndex, 300);
    }
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
        `}
      </style>
      <div className="slider-container relative pb-24 bg-black pt-28 flex flex-col items-center border-y-[1px] border-y-white/40">
        <p className="text-center text-3xl lg:text-6xl lg:max-w-5xl font-semibold text-white mb-10">
          The minimum you deserve and we're coming up with more
        </p>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={data.length > 3}
          slidesPerView={3}
          spaceBetween={30}
          slidesPerGroup={1}
          navigation={{
            enabled: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 300,
            modifier: 2.5,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="relative"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {data.map((item, index) => (
            <SwiperSlide 
              key={index} 
              onClick={() => handleSlideClick(index)}
            >
              <div className="swiper-slide-wrapper py-10">
                <CompComponent item={item} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}