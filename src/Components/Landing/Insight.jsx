import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Insight  = [
    {
        image: 'images/image.jpg',
        title: 'Law',
    },
    
    {
        image: 'images/image.jpg',
        title: 'Law',
    },
    {
        image: 'images/image.jpg',
        title: 'Law',
    },
    {
        image: 'images/image.jpg',
        title: 'Law',
    },

]

export default () => {
  return (
      <div className=" bg-black min-h-screen w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
              Insights for our clients
          </h1>
          <div className="w-2/3 m-auto">

          <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log('slide change')}
              >
              {Insight.map((insight) => (
                  <SwiperSlide key={insight.title}>
                      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                          <img
                              src={insight.image}
                              alt="Library"
                              className="object-cover w-full h-96 opacity-70"
                          />
                          <div className="z-50 flex items-center text-center justify-center">
                              <p className="text-white text-xl  font-semibold">{insight.title}</p>
                          </div>
                      </div>
                  </SwiperSlide>
              ))}

          </Swiper>
              </div>
      </div>
  );
};