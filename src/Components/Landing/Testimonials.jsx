import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../../css/styles.css';

// Import required modules
import { Autoplay, Pagination } from 'swiper/modules';

function Testimonials() {
  return (
    <div className="flex flex-col md:flex-row w-11/12 md:w-4/5 lg:w-3/5 mx-auto px-6 md:px-10 lg:px-14 py-10 md:py-14 lg:py-16 bg-white rounded-2xl md:rounded-[40px] border border-gray-200">
      <div className=" w-full md:flex-shrink-0 md:w-32 lg:w-40 mx-auto md:mx-0">
        <img 
          src="images/2.jpg" // Replace with the actual image URL
          alt="Kabir Mehra" 
          className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-[20px]  md:rounded-full object-cover bg-gray-50"
        />
      </div>
      <div className="mt-4 md:mt-0 md:ml-6 lg:ml-8 text-center md:text-left">
        <blockquote className="text-gray-600 text-base md:text-lg">
          <div className="hidden md:flex  justify-center md:justify-end mb-2">
            <svg width="60" height="45" viewBox="0 0 88 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.8159 64.2171H3.18388L12.9759 36.2811H0.879883V0.569092H41.1999V36.2811L28.8159 64.2171ZM74.8959 64.2171H49.2639L59.0559 36.2811H46.9599V0.569092H87.2799V36.2811L74.8959 64.2171Z" fill="#A7A6A4" />
            </svg>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-800">Kabir Mehra</p>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 mt-2">
              As a property manager, I've tried various tools to streamline my operations, but Property Manager Pro has truly exceeded my expectations. This comprehensive property management software offers an array of features that cater to both small landlords and large property management companies.
            </p>
          </div>
        </blockquote>
      </div>
    </div>
  );
}


export default function Test() {
  return (
    <>
      <div className="mt-24">
        <div className="my-10">
        <h1 className="text-3xl lg:text-6xl font-semibold text-primary text-center">Testimonials</h1>
        </div>
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
        >
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
