import React, { useState, useEffect, useRef } from 'react';
import GoldButton from './GoldButton/Goldbutton';
import BookingAppointment from '../forms/BookingAppointment';
import ContactUsForm from '../forms/ContactUs';

// Function to toggle body scroll
const toggleBodyScroll = (isOpen) => {
  if (isOpen) {
    document.body.classList.add('overflow-hidden'); // Disable scrolling
  } else {
    document.body.classList.remove('overflow-hidden'); // Enable scrolling
  }
};

const ExpertContact = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (visible && window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.9 } // Adjust this threshold as needed
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleContactModalClose = () => {
    setContactModalOpen(false);
    toggleBodyScroll(false); // Enable scrolling when modal closes
  };

  const handleBookingModalClose = () => {
    setBookingModalOpen(false);
    toggleBodyScroll(false); // Enable scrolling when modal closes
  };

  useEffect(() => {
    // Disable scrolling when either modal is open
    toggleBodyScroll(isContactModalOpen || isBookingModalOpen);
  }, [isContactModalOpen, isBookingModalOpen]);

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center  bg-black text-white  min-h-screen m-auto py-20"
      >
        {/* <div className="hidden md:!flex md:!flex-row justify-between w-full md:px-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden mr-16`}
          />
        </div> */}
        <div className="flex flex-row items-center justify-center w-full px-10 mt-10">
          {/* <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-32 h-32' : 'w-24 h-24'} rounded-full md:!block hidden`}
          /> */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            <p className="text-xl md:text-3xl text-white transition-colors duration-500">
              {scrolled ? 'Talk With an' : 'Talk With an'}
            </p>
            <p
              className={`text-6xl font-bold transition-colors duration-500 ${
                scrolled ? 'text-white' : 'text-white'
              }`}
            >
              {scrolled ? 'Expert' : 'Expert'}
            </p>
            <div className="flex my-4 gap-4 w-full flex-col lg:flex-row min-w-64">
              <GoldButton btnname={"Drop Your Number"} properties={"bg-black rounded-full  hover:shadow-gold"} onclick={() => setContactModalOpen(true)} />
              <GoldButton btnname={"Call with an expert"} properties={"bg-black rounded-full  hover:shadow-gold"}  onclick={() => setBookingModalOpen(true)} />
            </div>
          </div>
          {/* <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden`}
          /> */}
        </div>
        {/* <div className="hidden md:!flex md:!flex-row justify-between w-full px-10 mt-10">
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden ml-16`}
          />
          <img
            src="./images/1.png"
            alt="Expert"
            className={`transition-all duration-500 ${scrolled ? 'w-24 h-24' : 'w-24 h-24'} rounded-full md:!block hidden mr-16`}
          />
        </div> */}
        <p className="mt-10 md:text-xl font-400 text-center text-sm transition-colors duration-500">
          {scrolled ? 'Just book a boom short demo we will contact you supasoon!' : 'Just book a boom short demo we will contact you supasoon!'}
        </p>
      </div>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleContactModalClose} />
          <div className="relative bg-black rounded-lg shadow-xl  mx-4">
            <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={handleContactModalClose}>
              {/* Close Button SVG */}
            </button>
            <ContactUsForm onClose={handleContactModalClose} />
          </div>
        </div>
      )}

      {/* Booking Appointment Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBookingModalClose} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors" onClick={handleBookingModalClose}>
              {/* Close Button SVG */}
            </button>
            <BookingAppointment onClose={handleBookingModalClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertContact;
