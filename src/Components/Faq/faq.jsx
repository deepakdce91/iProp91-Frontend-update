import { ArrowLeftIcon } from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import DOMPurify from "dompurify";
import parse from 'html-react-parser';
import Breadcrumb from "../Landing/Breadcrumb";
 
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);
  const [activeBlog, setActiveBlog] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

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

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "FAQs" },
  ];

  // Format content with proper styling for links, tables, and other HTML elements
  const formatContent = (content) => {
    if (!content) return "";
    
    const prefix = "Frequently Asked Questions (FAQs) – Property Tax – Gurgaon";
    const cleanContent = content.startsWith(prefix)
      ? content.slice(prefix.length).trim()
      : content.trim();
    
    // Check if content contains HTML
    const isHTML = /<[^>]+>/.test(cleanContent);
    let sanitizedContent;

    if (isHTML) {
      // If it's already HTML, just sanitize it
      sanitizedContent = DOMPurify.sanitize(cleanContent);
    } else {
      // If it's plain text, replace links and then sanitize
      sanitizedContent = cleanContent.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>'
      );
      sanitizedContent = DOMPurify.sanitize(sanitizedContent);
    }

    // Add styles to existing links if any
    sanitizedContent = sanitizedContent.replace(
      /<a /g,
      '<a class="text-blue-500 underline" target="_blank" rel="noopener noreferrer" '
    );

    // Enhance tables with styling if present
    sanitizedContent = sanitizedContent.replace(
      /<table/g,
      '<table class="min-w-full border-collapse border border-gray-300 my-4"'
    );
    
    sanitizedContent = sanitizedContent.replace(
      /<tr/g,
      '<tr class="border-b border-gray-300"'
    );
    
    sanitizedContent = sanitizedContent.replace(
      /<th/g,
      '<th class="border border-gray-300 bg-gray-100 p-2 text-left font-medium"'
    );
    
    sanitizedContent = sanitizedContent.replace(
      /<td/g,
      '<td class="border border-gray-300 p-2"'
    );

    // Add styling for bullet points and ordered lists
    sanitizedContent = sanitizedContent.replace(
      /<ul/g,
      '<ul class="list-disc pl-5 space-y-2 my-4"'
    );
    
    sanitizedContent = sanitizedContent.replace(
      /<ol/g,
      '<ol class="list-decimal pl-5 space-y-2 my-4"'
    );
    
    sanitizedContent = sanitizedContent.replace(
      /<li/g,
      '<li class="ml-2"'
    );

    return sanitizedContent;
  };

  // Options for html-react-parser to handle links, images, etc.
  const parserOptions = {
    replace: (domNode) => {
      if (domNode.name === 'a' && domNode.attribs) {
        // Make sure links open in new tab and have styling
        return (
          <a 
            href={domNode.attribs.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline"
          >
            {domNode.children && domNode.children[0] && domNode.children[0].data}
          </a>
        );
      }
    }
  };

  return (
    <div className="flex relative text-black py-28 px-3 md:px-8 bg-white min-h-screen lg:px-32 pt-5 md:pt-10">
      <Breadcrumb items={breadcrumbItems} className={"flex items-center space-x-2 text-black text-sm lg:text-base absolute top-28 lg:left-32 mt-2 left-[5%]"} />
      <div className="flex flex-col md:flex-row justify-center h-full lg:items-start mt-32">
        <div className="md:w-1/3 flex flex-col gap-3">
          <h1 className="text-6xl tracking-wide font-bold">FAQ</h1>
          <p className="text-lg">
            Can&apos;t find the answer you&apos;re looking for? Ask your
            question and get an answer within 24 hours
          </p>
        </div>
        <div className="md:w-2/3 md:pl-8 md:mt-0">
          {data &&
            data.map((faqData, index) => (
              <div
                key={index}
                className={`my-4 transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "border-[1px] border-black/20 bg-gray-200 max-h-[300px] overflow-y-scroll"
                    : "border-[1px] border-black/30"
                } p-4 hover:scale-105 transition-all`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="md:text-lg text-base font-medium">
                    {faqData.title}
                  </h3>
                  <div className="text-xl">
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? "mt-4" : "max-h-0"
                  }`}
                >
                  <hr className="border-t-[2px] border-black mb-4" />
                  <div className="mt-7">
                    {parse(formatContent(faqData.content), parserOptions)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}