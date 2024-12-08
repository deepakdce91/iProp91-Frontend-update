import React, { useEffect, useState } from "react";
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import axios from "axios";
import parse from 'html-react-parser';

const CompComponent = ({compData}) => {


  return (
        
    <div className="rounded-3xl border-2 border-gold max-w-3xl mx-auto overflow-hidden relative ">
      <div className="flex flex-col bg-gray-100 text-black">
        <div className="flex-1 flex flex-col justify-center p-4">
          <h2 className="text-2xl font-semibold">{parse(compData.topText)}</h2>
        </div>
        <div>
        {compData.centerImage1 && <img
                src={compData.centerImage1.url}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />}
              {compData.centerImage2 && <img
                src={compData.centerImage2.url}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />}
        </div>
        <div className="flex-1 flex flex-col justify-center p-4">
          <h2 className="text-2xl font-semibold">{parse(compData.bottomText)}</h2>
        </div>
      </div>
      
    </div>
  );
};

export default function Comparison() {

  const [data, setData] = useState();

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
          loop={true}
          slidesPerView={3}
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
        >
          {data?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-slide-wrapper bg-black">
                <CompComponent compData={item}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
