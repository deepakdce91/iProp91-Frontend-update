import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "../../css/styles.css";

// Import required modules
import { Autoplay, Pagination } from "swiper/modules";
import TestimonialForm from "./TestomonialForm";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/testimonials/fetchAllActiveTestimonials`
      );
      setTestimonials(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
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
      className="
        w-full
        max-w-[100vw]
        sm:max-w-[95vw]
        md:max-w-[90vw]
        lg:max-w-[85vw]
        h-[450px]
        sm:h-[500px]
        md:h-[550px]
        lg:h-[600px]"
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial._id}>
          <div
            className="flex flex-col md:flex-row 
            w-[95%] 
            sm:w-[85%] 
            md:w-4/5 
            lg:w-3/5 
            mx-auto 
            px-4 
            sm:px-6 
            md:px-10 
            lg:px-14 
            py-6
            sm:py-8
            md:py-12
            lg:py-16 
            h-[400px]
            sm:h-[450px]
            md:h-[500px]
            lg:h-[550px]
            bg-white 
            rounded-lg
            sm:rounded-xl
            md:rounded-2xl
            lg:rounded-[40px] 
            border border-gray-200 
            hover:bg-white/90 
            transition-all
            duration-300
            mb-[10vh]"
          >
            <div
              className="
              w-24 
              sm:w-32 
              md:w-36 
              lg:w-40 
              h-24 
              sm:h-32 
              md:h-36 
              lg:h-40 
              md:flex-shrink-0 
              md:mt-14 
              overflow-hidden 
              mx-auto 
              md:mx-0"
            >
              <img
                src={testimonial.userInfo.profilePicture.url}
                alt={testimonial.userInfo.name}
                className="
                  w-16
                  sm:w-18
                  md:w-20
                  lg:w-24
                  h-16
                  sm:h-18
                  md:h-20
                  lg:h-24
                  rounded-full 
                  object-cover 
                  bg-gray-50"
              />
            </div>
            <div
              className="
              mt-4 
              md:mt-0 
              md:ml-6 
              lg:ml-8 
              text-center 
              md:text-left
              px-4
              sm:px-6
              md:px-8
              lg:px-10"
            >
              <blockquote className="text-gray-600 text-sm sm:text-base md:text-lg">
                <div className="flex flex-col items-center md:items-start">
                  <div className="mt-2 sm:mt-3 md:mt-4">
                    <p
                      className="
                      text-base
                      sm:text-lg
                      md:text-xl
                      lg:text-2xl
                      font-semibold 
                      text-gray-800"
                    >
                      {testimonial.userInfo.name}
                    </p>
                  </div>
                  <p
                    className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    text-gray-600 
                    mt-2
                    sm:mt-3
                    md:mt-4
                    max-h-[200px]
                    sm:max-h-[250px]
                    md:max-h-[300px]
                    lg:max-h-[350px]
                    overflow-y-auto"
                  >
                    {testimonial.testimonial}
                  </p>
                </div>
              </blockquote>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      // Disable scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
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
      <div className="py-8 relative min-h-screen border-y-[1px] border-y-white/40 bg-black flex flex-col justify-center items-center">
        <div className="mb-6 -mt-20">
          <h1 className="text-3xl lg:text-6xl font-semibold text-white text-center">
            Testimonials
          </h1>
        </div>
        <Testimonials />
        <div className="flex justify-center mt-6">
          <button
            onClick={openModal}
            className="px-6 py-3 bg-white text-black hover:text-white hover:bg-black hover:border hover:border-white border-black border font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            Share Your Reviews
          </button>
        </div>

        {isModalOpen && (
          <div className=" z-50 flex items-center justify-center ">
            <TestimonialForm close={closeModal} />
          </div>
        )}
      </div>
    </>
  );
}
