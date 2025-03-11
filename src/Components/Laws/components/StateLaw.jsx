import React, { useEffect, useState } from "react";
import { ArrowLeft, Book, Gavel, Scale, FileText } from "lucide-react";
import { FiMinus, FiPlus, FiDownload, FiFile } from "react-icons/fi";
import axios from "axios";
import DOMPurify from "dompurify";
import parse from 'html-react-parser';
import Breadcrumb from "../../Landing/Breadcrumb";

// Mock data (replace with actual API data when available)
const mockData = [
  {
    id: 1,
    title: "Delhi",
    icon: "/images/delhi.png",
    content: "Content for Criminal Law...",
  },
  {
    id: 2,
    title: "Haryana",
    icon: "/images/har.png",
    content: "Content for Civil Law...",
  },
];

const StateLaw = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [states, setStates] = useState([]); // for active states
  const [stateLaws, setStateLaws] = useState([]); // for state-specific laws
  const [selectedLaw, setSelectedLaw] = useState(mockData[0]); // Default to first state

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelectLaw = async (law) => {
    setSelectedLaw(law);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveLawsByState`,
        {
          params: { state: law.title }
        }
      );
      setStateLaws(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching state laws:", error);
    }
  };

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveStates`
        );
        setStates(response.data);
        // Fetch laws for default selected state
        handleSelectLaw(mockData[0]);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchLaws();
  }, []);

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

  // Function to format content with proper styling for tables and links
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

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Laws", link: "/laws" },
    { label: "State Laws" }
  ];

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
    <div className="flex flex-col w-full px-5 md:px-20 pt-28 min-h-screen bg-white">
      <Breadcrumb items={breadcrumbItems} className={"flex z-50 items-center space-x-2 text-black text-sm lg:text-base my-3"} />
      <div className="flex md:gap-5 gap-4 lg:overflow-x-auto bg-white/20 text-white overflow-x-scroll shadow-lg py-3 md:px-10 px-3">
        {mockData.map((law) => (
          <button
            key={law.id}
            className={`flex flex-col min-w-[70px] items-center focus:outline-none ${
              selectedLaw?.id === law.id ? "scale-110" : ""
            }`}
            onClick={() => handleSelectLaw(law)}
          >
            <div
              className={`p-4 rounded-full flex items-center justify-center ${
                selectedLaw?.id === law.id
                  ? "bg-white border-[3px] border-black"
                  : "bg-gray-200 border-[2px] border-black"
              }`}
            >
              <img src={law.icon} alt="img" className="w-8 h-8" />
            </div>
            <span className="text-xs text-center text-black">{law.title}</span>
          </button>
        ))}
      </div>

      {selectedLaw ? (
        <div className="mt-2 animate-fade-in px-5 md:px-10 py-3">
          <div className="">
            {stateLaws.map((law, index) => (
              <div
                key={index}
                className={`mb-4 transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "bg-gray-200 text-black border-[1px] border-black/30"
                    : "border-[1px] bg-white text-black border-black/30"
                } p-4 hover:scale-105 transition-all`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-medium">{law.title}</h3>
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
                  {/* Use html-react-parser instead of dangerouslySetInnerHTML */}
                  <div className="mt-7">
                    {parse(formatContent(law.content), parserOptions)}
                  </div>
                  
                  {/* Resource Files Section */}
                  {law.file && (law.file.name || law.file.url) && (
                    <div className="mt-4">
                      <h4 className="font-medium text-black mb-2">Resource Files:</h4>
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                        <span className="text-lg">{getFileIcon(law.file.name)}</span>
                        <a 
                          href={law.file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 text-blue-600 hover:underline font-medium"
                        >
                          {law.file.name || getFilenameFromUrl(law.file.url)}
                        </a>
                        <button 
                          onClick={() => handleDownload(law.file.url)}
                          className="p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                          title="Download file"
                        >
                          <FiDownload />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
          Select a state to view details
        </div>
      )}
    </div>
  );
};

export default StateLaw;