import { ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import DOMPurify from "dompurify";
import axios from "axios";
import Breadcrumb from "../../Landing/Breadcrumb";

const CentralLaw = ({  }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [lawData, setLawData] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchCentralLaws = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchAllActiveCentralLaws`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        setLawData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };
    fetchCentralLaws()
  }, [])
  

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

  const formatContent = (content) => {
    // Check if content contains HTML
    const isHTML = /<[^>]+>/.test(content);
    let sanitizedContent;

    if (isHTML) {
      // If it's already HTML, just sanitize it
      sanitizedContent = DOMPurify.sanitize(content);
    } else {
      // If it's plain text, replace links and then sanitize
      sanitizedContent = content.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>'
      );
      sanitizedContent = DOMPurify.sanitize(sanitizedContent);
    }

    // Add styles to existing links if any
    sanitizedContent = sanitizedContent.replace(
      /<a /g,
      '<a class="text-blue-500 underline" '
    );

    return sanitizedContent;
  };

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Laws", link: "/laws" },
    { label: "Central Laws",  }
  ];

  return (
    <div className="flex flex-col  w-full  px-6 lg:px-32 min-h-[100vh] text-black relative gap-5 bg-white py-28 md:py-32">
      <Breadcrumb items={breadcrumbItems} className={"flex z-50 items-center space-x-2 text-black text-sm lg:text-base "} />
      
      <div className="w-full">
        {lawData.map((item, index) => {
          const { text, href } = parseContent(item.content); // Parse content
          const formattedContent = formatContent(item.content); // Format content

          // Check if title and content are the same
          const isSameAsTitle = item.title === text;

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out w-full ${
                openIndex === index ? "bg-white/80 text-black border-[1px] border-black" : "border-[1px] border-black"
              } p-4 rounded-3xl hover:scale-105 transition-all hover:shadow-xl `}
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
                      className="text-blue-500 underline"
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
                  <p
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                    className="text-black"
                  ></p>
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
