import { ArrowLeftIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiMinus, FiFileText, FiDownload } from 'react-icons/fi';
import Breadcrumb from '../Landing/Breadcrumb';
import DOMPurify from "dompurify";
import parse from 'html-react-parser';

export default function CaseLaws() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);

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
    const linkMatch = content?.match(/<a href="(.*?)">(.*?)<\/a>/);
    if (linkMatch) {
      return { url: linkMatch[1], text: linkMatch[2] };
    }
    return null;
  };

  // Function to format content with proper styling for links, tables, and other HTML elements
  const formatContent = (content) => {
    if (!content) return "";
    
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

  // Get filename from URL
  const getFilenameFromUrl = (url) => {
    if (!url) return "Document";
    return url.split('/').pop();
  };

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Case Laws" }
  ];

  return (
    <div className={`flex flex-col gap-10 px-6 lg:px-32 bg-white min-h-[150vh] md:min-h-[100vh] text-black`}>
      <div className="w-full h-full flex flex-col pt-28">
        <Breadcrumb items={breadcrumbItems} className={"flex items-center space-x-2 my-3 text-black text-sm lg:text-base"} />
        {data && data.map((caseLaw, index) => {
          const pdfLink = extractPdfLink(caseLaw?.content);

          return (
            <div
              key={index}
              className={`mb-4 transition-all duration-300 ease-in-out ${
                openIndex === index ? 'border-[1px] border-black/20 bg-gray-200' : 'border-[1px] border-black/20'
              } p-4 hover:scale-105 transition-all hover:shadow-xl`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-medium">{caseLaw.title}</h3>
                <div className="text-xl">
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[500px] mt-4 overflow-y-auto' : 'max-h-0'
                }`}
              >
                <hr className="border-t-[2px] border-black/40 mb-4" />
                
                {/* Content Section */}
                {!pdfLink && (
                  <div className="mt-7">
                    {parse(formatContent(caseLaw.content), parserOptions)}
                  </div>
                )}
                
                {/* PDF Link Button */}
                {pdfLink && (
                  <div className="mt-4 flex gap-2">
                    <a
                      href={pdfLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md transition-colors hover:bg-gray-800"
                    >
                      <FiFileText className="text-xl" />
                      <p>View {pdfLink.text || "File"}</p>
                    </a>
                    <a
                      href={pdfLink.url}
                      download={getFilenameFromUrl(pdfLink.url)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md transition-colors hover:bg-gray-600"
                    >
                      <FiDownload className="text-xl" />
                      <p>Download</p>
                    </a>
                  </div>
                )}
                
                {/* File Attachment */}
                {caseLaw.file && (
                  <div className="mt-4 flex gap-2">
                    <a
                      href={caseLaw.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md transition-colors hover:bg-gray-800"
                    >
                      <FiFileText className="text-xl" />
                      <p>View {caseLaw.file.name || "File"}</p>
                    </a>
                    <a
                      href={caseLaw.file.url}
                      download={caseLaw.file.name || getFilenameFromUrl(caseLaw.file.url)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md transition-colors hover:bg-gray-600"
                    >
                      <FiDownload className="text-xl" />
                      <p>Download</p>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Loading or Empty State */}
        {!data && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        
        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FiFileText size={48} className="mb-4" />
            <p className="text-lg">No case laws available</p>
          </div>
        )}
      </div>
    </div>
  );
}
