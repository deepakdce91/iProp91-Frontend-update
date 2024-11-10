import React from "react";
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Comparison.css';

const CompComponent = () => {
  return (
    <div className="rounded-3xl border-2 border-gold max-w-3xl mx-auto overflow-hidden relative m-4">
      <div className="flex flex-col bg-gray-100 text-black">
        <div className="flex-1 flex flex-col justify-center p-4">
          <h2 className="text-2xl font-semibold">We track the market&apos;s impact on your portfolio daily</h2>
        </div>
        <div className="flex-1 mt-6 md:mt-0 p-3">
          <div className="bg-white p-4 shadow-md flex flex-row gap-4">
            <div className="flex w-[30%] flex-col items-center space-x-2 space-y-2 mb-4">
              <img
                src="images/1.png"
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
              <span className="text-xs font-medium">Driven by extreme bullishness</span>
            </div>
            <div className="relative w-[70%]">
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <polyline points="0,60 50,50 100,70 150,45 200,40" fill="none" stroke="#ccc" strokeWidth="2" />
                <circle cx="50" cy="50" r="5" fill="#ff6768" />
                <text x="40" y="70" fontSize="10" fill="#888">US Banking Crisis</text>
                <circle cx="100" cy="70" r="5" fill="#ff6768" />
                <text x="90" y="90" fontSize="10" fill="#888">Israel conflict</text>
                <circle cx="200" cy="40" r="5" fill="#3AC977" />
                <text x="180" y="60" fontSize="10" fill="#888">India State elections</text>
              </svg>
              <div className="flex justify-between text-gray-500 text-xs mt-1">
                <span>Mar 2023</span>
                <span>Apr 2023</span>
                <span>Dec 2023</span>
              </div>
              <p className="text-gray-400 text-xs mt-2 text-center">For illustrative purposes only.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-12 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-semibold rounded-full p-2">
        VS
      </div>
      <div className="bg-gray-200 border-t-[2px] border-t-gold text-black p-4">
        <h3 className="font-semibold">Traditional wealth firms</h3>
        <p className="text-black text-sm mt-2">
          Your RM is busy searching for new clients & rarely tracks your portfolio
        </p>
      </div>
    </div>
  );
};

export default function Comparison() {
  return (
    <div className="slider-container relative my-28">
    <Swiper
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      slidesPerView={3}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 300,
        modifier: 2.5,
        slideShadows: false,
      }}
      modules={[EffectCoverflow]}
      className="relative"
    >
      {[...Array(7).keys()].map((i) => (
        <SwiperSlide key={i}>
          <div className="swiper-slide-wrapper">
            <CompComponent />
          </div>
        </SwiperSlide>
      ))}

      {/* Custom Navigation Buttons */}
      {/* <div className="swiper-button-prev custom-button">
        <ArrowLeft size={24} />
      </div>
      <div className="swiper-button-next custom-button">
        <ArrowRight size={24} />
      </div> */}
    </Swiper>
  </div>
  );
}
