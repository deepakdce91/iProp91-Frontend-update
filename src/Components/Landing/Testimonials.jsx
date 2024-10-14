import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const testimonials = [
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        image: 'images/image.jpg',
        name: 'Law',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
]


export default () => {
    return (
        <div className=" bg-black min-h-screen w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
                Our Testimonials
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
               
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center">
                            <div className="bg-white text-black p-8 rounded-lg flex flex-col md:flex-row items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full object-cover mr-8" />
                                <div className="mt-4 md:mt-0">
                                    <p className="text-xl font-bold">{testimonial.name}</p>
                                    <p className="mt-2 text-gray-600">{testimonial.text}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
                </div>
        </div>
    );
  };
