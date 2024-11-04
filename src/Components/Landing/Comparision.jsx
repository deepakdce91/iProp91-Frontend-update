import React from "react";
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../css/styles.css';

const CompComponent = () => {
  return (
    <div className="rounded-3xl border-2 border-gold max-w-3xl mx-auto overflow-hidden relative m-4">
      <div className="flex flex-col md:flex-row bg-gray-100 text-black">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center p-4">
          <h2 className="text-2xl font-semibold">We track the market&apos;s impact on your portfolio daily</h2>
        </div>

        {/* Right Side */}
        <div className="flex-1 mt-6 md:mt-0 md:ml-4">
          <div className="bg-white p-4 shadow-md">
            <div className="flex md:flex-row flex-col items-center space-x-2 space-y-2 mb-4">
              <img
                src="images/1.png" // Placeholder image for the profile picture
                alt="profile"
                className="lg:w-8 lg:h-8 w-1 rounded-full"
              />
              <span className="text-sm font-medium">Driven by extreme bullishness</span>
            </div>
            <div className="relative">
              {/* Line chart illustration */}
              <svg viewBox="0 0 200 100" className="w-full h-24">
                <polyline
                  points="0,60 50,50 100,70 150,45 200,40"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="2"
                />
                {/* Circles and labels */}
                <circle cx="50" cy="50" r="5" fill="#ff6768" />
                <text x="40" y="70" fontSize="10" fill="#888">
                  US Banking Crisis
                </text>
                <circle cx="100" cy="70" r="5" fill="#ff6768" />
                <text x="90" y="90" fontSize="10" fill="#888">
                  Israel conflict
                </text>
                <circle cx="200" cy="40" r="5" fill="#3AC977" />
                <text x="180" y="60" fontSize="10" fill="#888">
                  India State elections
                </text>
              </svg>
              {/* Date labels */}
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

      {/* VS Label */}
      <div className="absolute left-12 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-semibold rounded-full p-2">
        VS
      </div>

      <div className="bg-gold text-white p-4">
        <h3 className="font-semibold">Traditional wealth firms</h3>
        <p className="text-gray-400 text-sm mt-2">
          Your RM is busy searching for new clients & rarely tracks your portfolio
        </p>
      </div>
    </div>
  );
};

export default function Comparision() {
  return (
    <section className="py-12">
      <div className="w-11/12 flex items-center justify-center lg:w-full mx-auto">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false, // Allow autoplay to continue after interaction
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {[...Array(7)].map((_, index) => (
            <SwiperSlide key={index} className="swiper-slide-custom">
              <CompComponent />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
