import { ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";

const CentralLaw = ({ onBack, data }) => {
  const [openIndex, setOpenIndex] = useState(null);
  // const [data, setData] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Do you work with a small business?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?",
    },
    {
      question: "Do you offer ongoing support?",
      answer:
        "Not only do we offer the expected maintenance and security but we also offer design and marketing support. Our goal is to become an extension of your in-house marketing team and we will tailor a team and offering that empowers your internal team. You can read more about MLab here.",
    },
    {
      question: "How long does the project take on average?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?",
    },
    {
      question: "Is there a possibility of offline meetings?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?",
    },
    {
      question: "Is there a possibility of offline meetings?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?",
    },
  ];

  return (
    <div className="flex flex-col relative gap-10 md:flex-row items-start py-28 px-6 lg:px-32 mt-5 md:mt-10     ">
      {/* <p>Case-Laws</p> */}
      <div className="flex absolute top-10 left-24 gap-1 cursor-pointer group" onClick={onBack}>
        <ArrowLeftIcon className="w-4 group-hover:-translate-x-1 transition-all"/>
        <p className="text-sm ">Back</p>
      </div>
      <div className="w-full md:pl-8  md:mt-0">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`mb-4 transition-all duration-300 ease-in-out ${
              openIndex === index ? "bg-gold" : "border-[1px] border-gold"
            } p-4 rounded-3xl hover:scale-105 transition-all hover:shadow-xl min-w-[300px] lg:min-w-[800px]`}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="md:text-lg font-medium">{faq.question}</h3>
              <div className="text-xl ">
                {openIndex === index ? <FiMinus /> : <FiPlus />}
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-screen mt-4" : "max-h-0"
              }`}
            >
              <hr className="border-t-[2px] border-black mb-4" />
              <div className="flex gap-4 text-xs md:text-base">
                <button
                  
                  className="px-1  py-1 md:px-5 md:py-2 border-[1px] border-black/50 bg-white/50 rounded-xl "
                >
                  <span className="relative z-10 capitalize ">Read full article</span>
                </button>

                <button
                  
                  className="px-5 py-2 border-[1px] border-black/50 bg-white/50 rounded-xl"
                >
                  <span className="relative z-10 capitalize flex justify-center items-center gap-2">
                    <FaFilePdf/>
                    download pdf</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CentralLaw;
