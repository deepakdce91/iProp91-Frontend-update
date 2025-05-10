import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "../../css/styles.css";
import { Autoplay, Pagination } from "swiper/modules";

const SaleCard = ({ blog, onClick }) => {
  return (
    <div
      className="relative max-w-md h-96 mx-auto bg-beige rounded-xl overflow-hidden border-2 shadow-lg"
      onClick={onClick}
    >
      <div className="flex justify-center items-center">
        <img
          src={blog.thumbnail || "images/logo1.png"} // Use blog thumbnail or a default image
          alt={blog.title}
          className="w-full object-cover"
        />
      </div>
      <button className="absolute bottom-4 right-4 bg-white text-black rounded-full p-2 shadow-md hover:bg-gray-200 focus:outline-none">
        <span>
          <img
            decoding="async"
            src="https://framerusercontent.com/images/CEcnOZ0GAMxkderVtnnXkheUQ.svg"
            alt="Arrow Icon"
            className="w-6 h-full"
          />
        </span>
      </button>
    </div>
  );
};

export default function Test() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/library/fetchAllActiveBlogs`
        );
        setBlogs(response.data);
        console.log("expert views data", response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Sort blogs by priority and index
  const sortedBlogs = blogs.sort((a, b) => {
    if (a.priority === b.priority) {
      return blogs.indexOf(a) - blogs.indexOf(b); // Sort by index if priority is the same
    }
    return a.priority - b.priority; // Sort by priority
  });

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <section className="bg-black py-24">
      <div className="w-4/5 mx-auto">
        <div className="my-10">
          <h1 className="text-3xl lg:text-6xl font-semibold text-white text-center">
            Expert Views
          </h1>
        </div>

        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {sortedBlogs.map((blog) => (
              <SwiperSlide key={blog._id}>
                <SaleCard
                  blog={blog}
                  onClick={() =>
                    navigate(
                      `/library/${blog.title.replace(/\s+/g, "-").toLowerCase()}`,
                      { state: { blog } }
                    )
                  } // Navigate to blog post
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="w-full flex justify-end items-end mt-5 ">
          <Link
            className="text-white  text-sm lg:text-lg border-b-[1px] border-b-white"
            to={"/library"}
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}