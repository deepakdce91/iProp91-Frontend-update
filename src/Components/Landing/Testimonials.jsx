import React, { useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../../css/styles.css';

// Import required modules
import { Autoplay, Pagination } from 'swiper/modules';
import TestimonialForm from './TestomonialForm';

function Testimonials() {
  return (
    <div className="flex flex-col md:flex-row w-11/12 md:w-4/5 lg:w-3/5 mx-auto px-6 md:px-10 lg:px-14 py-10 md:py-14 lg:py-16 bg-white rounded-2xl md:rounded-[40px] border border-gray-200 hover:bg-white/90">
      <div className=" w-40 h-40  md:flex-shrink-0 md:mt-16 overflow-hidden mx-auto md:mx-0">
        <img 
          src="images/2.jpg" // Replace with the actual image URL
          alt="Kabir Mehra" 
          className="w-20 h-20 rounded-full object-cover bg-gray-50"
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // Disable scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="py-16 relative min-h-screen border-y-[1px] border-y-white/40 bg-black flex flex-col justify-center items-center">
        <div className="my-10">
        <h1 className="text-3xl lg:text-6xl font-semibold text-white text-center">Testimonials</h1>
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
          className=""
        >
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
          <SwiperSlide><Testimonials /></SwiperSlide>
        </Swiper>
        <div className="flex justify-center mt-10">
          <button
            onClick={openModal}
            className="px-6 py-3 bg-white text-black hover:text-white hover:bg-black hover:border hover:border-white border-black border font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            Share Your Reviews
          </button>
        </div>

        {isModalOpen && (
           <div className=" z-50 flex items-center justify-center ">
          <TestimonialForm close={closeModal}/>
          </div>
          )}
      </div>
    </>
  );
}
