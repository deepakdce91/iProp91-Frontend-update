import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import '../../css/styles.css';

// Import required modules
import { Autoplay, Pagination } from 'swiper/modules';

const SaleCard = () => {
    return (
        <div className="relative max-w-sm mx-auto bg-beige rounded-xl overflow-hidden border-2  shadow-lg">
            <div className=" flex justify-center items-center">
                <img
                    src="images/2.jpg" // Replace with your image URL
                    alt="E-commerce sales"
                    className="w-full object-cover"
                />
            </div>
            <button className="absolute bottom-4 right-4 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none">
                <span>
                    <img
                        decoding="async"
                        src="https://framerusercontent.com/images/CEcnOZ0GAMxkderVtnnXkheUQ.svg"
                        alt="Arrow Icon"
                        className="w-6 h-6"
                    />
                </span>
            </button>
        </div>
    );
};

export default function Test() {
  return (
    <>
      <div className="mt-24 w-4/5 mx-auto">
        <div className="my-10">
          <h1 className="text-3xl lg:text-6xl font-semibold text-primary text-center">Expert Views</h1>
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
          breakpoints={{
            // Define responsive breakpoints
            640: {
              slidesPerView: 1, // For small screens
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2, // For medium screens
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3, // For large screens
              spaceBetween: 30,
            },
          }}
        >
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
          <SwiperSlide><SaleCard /></SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
