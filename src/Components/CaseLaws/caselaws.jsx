import { ArrowLeftIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { FiFileText } from 'react-icons/fi';
import Breadcrumb from '../Landing/Breadcrumb';
import DOMPurify from "dompurify";

export default function CaseLaws() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);

  const toggleFAQ = (index) => {

    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Case Laws" }
  ];

  return (
    <div className={`flex flex-col gap-10   px-6 lg:px-32 bg-white min-h-[150vh] md:min-h-[100vh] text-black `}>
      
      <div className="w-full h-full  flex flex-col  pt-28 " >
      <Breadcrumb items={breadcrumbItems} className={"flex  items-center space-x-2 my-3 text-black text-sm lg:text-base  "}  />
        {data && data.map((faq, index) => {
          const pdfLink = extractPdfLink(faq.content);

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out ${
                openIndex === index ? 'border-[1px] border-black/20 bg-gray-200' : 'border-[1px] border-black/20'
              } p-4  hover:scale-105 transition-all hover:shadow-xl`}
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
                  openIndex === index ? 'max-h-[500px] mt-4' : 'max-h-0'
                }`}
              >
                <hr className="border-t-[2px] border-black/40 mb-4" />
                {pdfLink ? (
                  <a
                    href={pdfLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md  transition-colors"
                  >
                    <FiFileText className="text-xl" />
                    <p>Read File</p>
                  </a>
                ) : (
                  <p dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(faq.content),
                  }} className="mt-7"/>
                )}
                {faq.file && (
                  <a
                    href={faq.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md transition-colors"
                  >
                    <FiFileText className="text-xl" />
                    <p>Read File</p>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
