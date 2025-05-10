import { ArrowLeftIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiDownload, FiFile } from "react-icons/fi";
import DOMPurify from "dompurify";
import axios from "axios";
import parse from 'html-react-parser';
import Breadcrumb from "../../Landing/Breadcrumb";

const CentralLaw = ({}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [lawData, setLawData] = useState([]);

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
  
  // Function to handle file download
  const handleDownload = async (myUrl) => {
    const fileUrl = myUrl; // Replace with your file link
    const response = await fetch(fileUrl);
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const blob = await response.blob(); // Get the file as a Blob
    const url = window.URL.createObjectURL(blob); // Create a Blob URL
  
    const link = document.createElement('a'); // Create a link element
    link.href = url;
    
    // Use the filename from user input or default to 'filename.pdf' if empty
    link.setAttribute('download', "document"); 
  
    // Append to the body and trigger the download
    document.body.appendChild(link);
    link.click();
  
    // Clean up and remove the link
    link.parentNode.removeChild(link);
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

    return sanitizedContent;
  };

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Laws", link: "/laws" },
    { label: "Central Laws" }
  ];

  // Function to determine file type and return appropriate icon
  const getFileIcon = (fileName) => {
    if (!fileName) return <FiFile />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return <FiFile className="text-red-500" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FiFile className="text-blue-500" />;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <FiFile className="text-green-500" />;
    } else {
      return <FiFile />;
    }
  };

  // Extract filename from URL if needed
  const getFilenameFromUrl = (url) => {
    if (!url) return "";
    return url.split('/').pop();
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
    <div className="flex flex-col w-full px-6 lg:px-32 min-h-[100vh] text-black relative gap-5 bg-white py-28 md:py-32">
      <Breadcrumb items={breadcrumbItems} className={"flex z-50 items-center space-x-2 text-black text-sm lg:text-base"} />
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
                openIndex === index ? "bg-gray-200 text-black border-[1px] border-black/30" : "border-[1px] border-black/30 bg-white"
              } p-4 hover:shadow-xl hover:scale-105 transition-all`}
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
                  {/* Use html-react-parser instead of dangerouslySetInnerHTML */}
                  <div className="text-black">
                    {parse(formattedContent, parserOptions)}
                  </div>
                  
                  {/* Resource Files Section */}
                  {item.file && (item.file.name || item.file.url) && (
                    <div className="mt-4">
                      <h4 className="font-medium text-black mb-2">Resource Files:</h4>
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                        <span className="text-lg">{getFileIcon(item.file.name)}</span>
                        <a 
                          href={item.file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 text-blue-600 hover:underline font-medium"
                        >
                          {item.file.name || getFilenameFromUrl(item.file.url)}
                        </a>
                        <button 
                          onClick={() => handleDownload(item.file.url)}
                          className="p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                          title="Download file"
                        >
                          <FiDownload />
                        </button>
                      </div>
                    </div>
                  )}
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