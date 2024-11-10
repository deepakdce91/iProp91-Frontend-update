import { ArrowLeftIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { FiFileText } from 'react-icons/fi';

export default function CaseLaws() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);

  const toggleFAQ = (index) => {

    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

       

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/caseLaws/fetchAllActiveCaseLaws`,
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

  // Function to extract PDF link and description
  const extractPdfLink = (content) => {
    const linkMatch = content.match(/<a href="(.*?)">(.*?)<\/a>/);
    if (linkMatch) {
      return { url: linkMatch[1], text: linkMatch[2] };
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-10 md:flex-row items-start py-28 px-6 lg:px-32 mt-5 md:mt-10">
      <a
         href={"/"}
        className="absolute flex gap-2 justify-center items-center group top-24 lg:left-40 left-[5%] text-gold hover:underline"
      >
        <ArrowLeftIcon className="text-gold w-4 group-hover:-translate-x-1 transition-all" />
        <p>Back</p>
      </a>

      <div className="w-full md:pl-8 md:mt-0">
        {data && data.map((faq, index) => {
          const pdfLink = extractPdfLink(faq.content);

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out ${
                openIndex === index ? 'border-[1px] border-gold bg-gray-200' : 'border-[1px] border-gold'
              } p-4 rounded-3xl hover:scale-105 transition-all hover:shadow-xl`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium">{faq.title}</h3>
                <div className="text-xl">
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-screen mt-4' : 'max-h-0'
                }`}
              >
                <hr className="border-t-[2px] border-gold mb-4" />
                {pdfLink ? (
                  <a
                    href={pdfLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-md  transition-colors"
                  >
                    <FiFileText className="text-xl" />
                    <p>Download PDF to read</p>
                  </a>
                ) : (
                  <p className="mt-7">{faq.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
