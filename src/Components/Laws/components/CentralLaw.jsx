import { ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";

const CentralLaw = ({ onBack, data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to parse HTML content and extract the link and text
  const parseContent = (htmlContent) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const link = div.querySelector("a");
    return {
      text: link ? link.textContent : "",
      href: link ? link.href : "#",
    };
  };

  return (
    <div className="flex flex-col relative gap-10 md:flex-row items-start py-28 px-6 lg:px-32 mt-5 md:mt-10">
      <div className="flex absolute md:top-10 top-16 md:left-24  left-8 gap-1 cursor-pointer group" onClick={onBack}>
        <ArrowLeftIcon className="w-4 group-hover:-translate-x-1 transition-all" />
        <p className="text-sm">Back</p>
      </div>
      <div className="w-full  ">
        {data.map((item, index) => {
          const { text, href } = parseContent(item.content); // Parse content

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out ${
                openIndex === index ? "bg-gold" : "border-[1px] border-gold"
              } p-4 rounded-3xl hover:scale-105 transition-all hover:shadow-xl md:max-w-screen-lg max-w-xs lg:min-w-[800px]`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="md:text-lg font-medium">{item.title}</h3>
                <div className="text-xl">
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-screen mt-4" : "max-h-0"
                }`}
              >
                <hr className="border-t-[2px] border-black mb-4" />
                {/* Display parsed link and text */}
                <p>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {text}
                  </a>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CentralLaw;
