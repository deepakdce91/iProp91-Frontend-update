import React, { useState } from "react";
import Que from "../NRI/questoin/question";
import Call from "../NRI/corousal/corsoual";
import Footer from "../Landing/Footer";
import DisclaimerModal from "./DisclaimerModal.jsx";

const Lend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="md:pt-20 pt-32 flex w-full min-h-screen gap-10 flex-col justify-center items-center bg-black text-white">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="text-center flex flex-col gap-7 md:w-[60%] lg:px-32">
            <p className="capitalize text-2xl md:text-5xl text-white font-semibold">
              Lend money from our partners
            </p>
            <button onClick={handleOpenModal} className="w-full md:w-[30%] text-center py-3 text-black hover:text-white bg-white hover:bg-black transition-all border-[1px] border-white/20 rounded-full">
              Get Started
            </button>
          </div>
          <div className="md:w-[40%]">
            <img src="/images/lendbg.png" alt="ayush" />
          </div>
        </div>
        {/* <div className="h-screen w-full px-10">
          <div
            className="h-full w-full bg-gray-300 rounded-2xl flex justify-center items-center cursor-pointer"
            onClick={handleOpenModal}
          >
            advertisement
          </div>
        </div> */}
      </div>

      {/* Modal Component */}
      {isModalOpen && <DisclaimerModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Lend;
