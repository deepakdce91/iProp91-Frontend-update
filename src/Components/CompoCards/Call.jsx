import React, { useState, useEffect, useRef } from "react";
import GoldButton from "./GoldButton/Goldbutton";
import BookingAppointment from "../forms/BookingAppointment";
import ContactUsForm from "../forms/ContactUs";
import { Calendar, Phone } from "lucide-react";
import { motion } from "framer-motion";
 


const ExpertContact = () => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isContactModalOpen || isBookingModalOpen) {
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
  }, [isContactModalOpen || isBookingModalOpen]);

  const handleContactModalClose = () => {
    setContactModalOpen(false);
  };

  const handleBookingModalClose = () => {
    setBookingModalOpen(false);
  };
  const buttonStyle =
    "flex items-center relative w-full  justify-between    font-semibold   transition-transform transform hover:scale-105  ";
  const iconWrapperStyle =
    "flex items-center  justify-center  rounded-full bg-white   p-3 absolute";
  const pstyle =
    "w-full flex bg-white py-5 rounded-full items-center justify-center text-black ";

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-col items-center justify-center  bg-transparent text-white   m-auto py-20"
      >
        <div className="flex flex-row items-center justify-center w-full px-10 mt-10">
          
          <div className="flex flex-col items-center justify-center w-full md:w-2/3  gap-2">
            <p className="text-xl md:text-3xl text-white transition-colors duration-500">
              Talk With an
            </p>
            <p
              className={`text-6xl font-bold transition-colors duration-500 text-gold `}
            >
               Expert
            </p>
            <div className="flex my-4 gap-8 w-full flex-col lg:flex-row min-w-64">
              <motion.button
              onClick={() => setContactModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={buttonStyle}
              >
                <div  className={iconWrapperStyle}>
                  <span className="bg-black p-3 rounded-full ">
                    <Phone className="w-8 h-8 text-white" />
                  </span>
                </div>
                <p className={pstyle}>Drop Your Number</p>
              </motion.button>

              <motion.button
              onClick={() => setBookingModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={buttonStyle}
              >
                <div  className={iconWrapperStyle}>
                  <span className="bg-black p-3 rounded-full ">
                    <Calendar className="w-8 h-8 text-white" />
                  </span>
                </div>
                <p className={pstyle}>Call with an expert</p>
              </motion.button>
            </div>
          </div>
        </div>
        {/* <p className="mt-10 md:text-xl font-400 text-center text-sm transition-colors duration-500">
          Just book a boom short demo we will contact you supasoon!
        </p> */}
      </div>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleContactModalClose}
          />
          <div className="relative bg-black rounded-lg shadow-xl  mx-4">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleContactModalClose}
            >
              {/* Close Button SVG */}
            </button>
            <ContactUsForm onClose={handleContactModalClose} />
          </div>
        </div>
      )}

      {/* Booking Appointment Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBookingModalClose}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleBookingModalClose}
            >
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
