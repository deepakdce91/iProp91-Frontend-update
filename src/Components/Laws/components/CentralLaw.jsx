import { ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
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
    <div className="flex flex-col text-white relative gap-10 md:flex-row items-start py-28 px-6 lg:px-32 mt-5 md:mt-10">
      
      <div className="w-full">
        {data.map((item, index) => {
          const { text, href } = parseContent(item.content); // Parse content

          // Check if title and content are the same
          const isSameAsTitle = item.title === text;

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out ${
                openIndex === index ? "bg-white text-black border-[1px] border-white" : "border-[1px] border-white"
              } p-4 rounded-3xl hover:scale-105 transition-all hover:shadow-xl md:max-w-screen-lg max-w-xs lg:min-w-[800px]`}
            >
              <div
                className={`flex justify-between items-center ${
                  isSameAsTitle ? "" : "cursor-pointer"
                }`}
                onClick={() => !isSameAsTitle && toggleFAQ(index)}
              >
                <h3 className="md:text-lg font-medium">
                  {isSameAsTitle ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                {!isSameAsTitle && (
                  <div className="text-xl text-black">
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                )}
              </div>
              {!isSameAsTitle && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "max-h-screen mt-4" : "max-h-0"
                  }`}
                >
                  <hr className="border-t-[2px] border-black mb-4" />
                  {/* Display parsed link and text */}
                  <p>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline"
                    >
                      {text}
                    </a>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CentralLaw;
