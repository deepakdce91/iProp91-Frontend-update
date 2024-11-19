import { ArrowLeftIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import DOMPurify from "dompurify";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);
  const [activeBlog, setActiveBlog] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/faqs/fetchAllActiveKnowledgeCenterFAQs`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="flex relative flex-col gap-10 md:flex-row items-start py-28 px-4 md:px-6   lg:px-32 mt-5 md:mt-10">
      <a
        href={"/"}
        className="absolute flex gap-1 justify-center items-center group top-20 left-[5%] lg:left-[8%] text-gold hover:underline"
      >
        <ArrowLeftIcon className="text-gold w-4 group-hover:-translate-x-1 transition-all" />
        <p>Back</p>
      </a>
      <div className="md:w-1/3 flex flex-col gap-3">
        <h1 className="text-6xl tracking-wide font-bold ">FAQ</h1>
        <p className="text-lg">
          Can&apos;t find the answer you&apos;re looking for? Ask your question
          and get an answer within 24 hours
        </p>
      </div>
      <div className="md:w-2/3 md:pl-8 md:mt-0">
        {data &&
          data.map((faqData, index) => {
            const prefix = "Frequently Asked Questions (FAQs) – Property Tax – Gurgaon";
            const cleanContent = faqData.content.startsWith(prefix)
              ? faqData.content.slice(prefix.length).trim()
              : faqData.content.trim();

            return (
              <div
                key={index}
                className={`mb-4 transition-all duration-300 ease-in-out max-w-[280px] md:max-w-full ${
                  openIndex === index ? 'border-[1px] border-gold bg-gray-200' : 'border-[1px] border-gold'
                } p-4 rounded-3xl hover:scale-105 transition-all`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="md:text-lg text-base font-medium">{faqData.title}</h3>
                  <div className="text-xl ">
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-screen mt-4' : 'max-h-0'
                  }`}
                >
                  <hr className="border-t-[2px] border-gold mb-4" />
                  <p
                    className="mt-7"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(cleanContent),
                    }}
                  ></p>
                </div>
              </div>
            );
          })}
      </div>
      
    </div>
  );
}
