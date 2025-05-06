import React, { useEffect, useState } from "react";
import { ArrowLeft, Book, Gavel, Scale, FileText, Map } from "lucide-react";
import { FiMinus, FiPlus, FiDownload, FiFile } from "react-icons/fi";
import axios from "axios";
import DOMPurify from "dompurify";
import parse from 'html-react-parser';
import Breadcrumb from "../../Landing/Breadcrumb";

// Complete list of Indian states and union territories with abbreviations
const allIndianStates = [
  { id: 1, title: "Andhra Pradesh", code: "AP" },
  { id: 2, title: "Arunachal Pradesh", code: "AR" },
  { id: 3, title: "Assam", code: "AS" },
  { id: 4, title: "Bihar", code: "BR" },
  { id: 5, title: "Chhattisgarh", code: "CG" },
  { id: 6, title: "Goa", code: "GA" },
  { id: 7, title: "Gujarat", code: "GJ" },
  { id: 8, title: "Haryana", code: "HR" },
  { id: 9, title: "Himachal Pradesh", code: "HP" },
  { id: 10, title: "Jharkhand", code: "JH" },
  { id: 11, title: "Karnataka", code: "KA" },
  { id: 12, title: "Kerala", code: "KL" },
  { id: 13, title: "Madhya Pradesh", code: "MP" },
  { id: 14, title: "Maharashtra", code: "MH" },
  { id: 15, title: "Manipur", code: "MN" },
  { id: 16, title: "Meghalaya", code: "ML" },
  { id: 17, title: "Mizoram", code: "MZ" },
  { id: 18, title: "Nagaland", code: "NL" },
  { id: 19, title: "Odisha", code: "OD" },
  { id: 20, title: "Punjab", code: "PB" },
  { id: 21, title: "Rajasthan", code: "RJ" },
  { id: 22, title: "Sikkim", code: "SK" },
  { id: 23, title: "Tamil Nadu", code: "TN" },
  { id: 24, title: "Telangana", code: "TG" },
  { id: 25, title: "Tripura", code: "TR" },
  { id: 26, title: "Uttar Pradesh", code: "UP" },
  { id: 27, title: "Uttarakhand", code: "UK" },
  { id: 28, title: "West Bengal", code: "WB" },

  // Union Territories
  { id: 29, title: "Delhi", code: "DL" },
  { id: 30, title: "Andaman and Nicobar", code: "AN" },
  { id: 31, title: "Chandigarh", code: "CH" },
  { id: 32, title: "Dadra and Nagar Haveli and Daman and Diu", code: "DD" },
  { id: 33, title: "Jammu and Kashmir", code: "JK" },
  { id: 34, title: "Ladakh", code: "LA" },
  { id: 35, title: "Lakshadweep", code: "LD" },
  { id: 36, title: "Puducherry", code: "PY" }
];

const StateLaw = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [states, setStates] = useState([]); // for active states from API
  const [stateLaws, setStateLaws] = useState([]); // for state-specific laws
  const [selectedLaw, setSelectedLaw] = useState(null); // Will be set after fetching available states
  const [isLoading, setIsLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]); // States that have laws

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelectLaw = async (law) => {
    setSelectedLaw(law);
    setIsLoading(true);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveLawsByState`,
        {
          params: { state: law.title }
        }
      );
      setStateLaws(response.data);
      console.log(`Fetched laws for ${law.title}:`, response.data);
      
    } catch (error) {
      console.error(`Error fetching laws for ${law.title}:`, error);
      setStateLaws([]); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchLaws = async () => {
      setIsLoading(true);
      try {
        // Fetch list of active states from backend
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/laws/fetchActiveStates`
        );
        
        // Filter all states to only include those returned by the API
        const activeStateNames = response.data;
        const activeStates = allIndianStates.filter(state => 
          activeStateNames.includes(state.title)
        );
        
        setAvailableStates(activeStates);
        
        // Set the first available state as selected, or Delhi if it's available
        const defaultState = activeStates.find(s => s.title === "Delhi") || activeStates[0];
        if (defaultState) {
          setSelectedLaw(defaultState);
          // Fetch laws for the default state
          handleSelectLaw(defaultState);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        // If API fails, don't show any states
        setAvailableStates([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLaws();
  }, []);

  // Function to handle file download
  const handleDownload = async (myUrl) => {
    if (!myUrl) {
      console.error("No URL provided for download");
      return;
    }
    
    try {
      const fileUrl = myUrl;
      const response = await fetch(fileUrl);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    
      const blob = await response.blob(); // Get the file as a Blob
      const url = window.URL.createObjectURL(blob); // Create a Blob URL
    
      const link = document.createElement('a'); // Create a link element
      link.href = url;
      
      // Use the filename from URL or default to 'document'
      const filename = myUrl.split('/').pop() || "document";
      link.setAttribute('download', filename); 
    
      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();
    
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again later.");
    }
  };

// Function to format content with proper styling for tables, links, and bullet points
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
}

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

  // Function to render state icon/abbreviation with black styling
  const renderStateIcon = (state) => {
    // If there's an actual image path available
    if (state.icon) {
      return <img src={state.icon} alt={state.title} className="w-8 h-8" />;
    }
    
    // Otherwise use the state abbreviation with black background
    return (
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-black"
      >
        {state.code}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full px-5 md:px-20 pt-28 min-h-screen bg-white">
      <Breadcrumb items={breadcrumbItems} className={"flex z-50 items-center space-x-2 text-black text-sm lg:text-base my-3"} />
      
      {/* State Selection Horizontal Scrollable Area - Only show available states */}
      {availableStates.length > 0 && (
        <div className="flex md:gap-5 gap-4 lg:overflow-x-auto bg-white/20 text-white overflow-x-scroll shadow-lg py-3 md:px-10 px-3">
          {availableStates.map((state) => (
            <button
              key={state.id}
              className={`flex flex-col min-w-[70px] items-center focus:outline-none ${
                selectedLaw?.id === state.id ? "scale-110" : ""
              }`}
              onClick={() => handleSelectLaw(state)}
            >
              <div
                className={`p-4 rounded-full flex items-center justify-center ${
                  selectedLaw?.id === state.id
                    ? "bg-white border-[3px] border-black"
                    : "bg-gray-200 border-[2px] border-black"
                }`}
              >
                {renderStateIcon(state)}
              </div>
              <span className="text-xs text-center text-black mt-1">{state.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Display a loader while initially loading states */}
      {isLoading && availableStates.length === 0 && (
        <div className="flex justify-center items-center h-40 mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No states available message */}
      {!isLoading && availableStates.length === 0 && (
        <div className="text-center py-10 mt-8">
          <Map className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500">No states with laws available</p>
          <p className="text-sm text-gray-400 mt-2">Please check back later</p>
        </div>
      )}

      {/* Laws Display Section */}
      {selectedLaw ? (
        <div className="mt-2 animate-fade-in px-5 md:px-10 py-3">
          <h2 className="text-2xl font-bold text-center mb-4">Laws of {selectedLaw.title}</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : stateLaws.length > 0 ? (
            <div className="">
              {stateLaws.map((law, index) => (
                <div
                  key={index}
                  className={`mb-4 transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? "bg-gray-200 text-black border-[1px] border-black/30"
                      : "border-[1px] bg-white text-black border-black/30"
                  } p-4 hover:scale-105 transition-all shadow-sm rounded-md`}
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
                          <span className="text-lg">{getFileIcon(law.file.name || law.file.url)}</span>
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
          ) : (
            <div className="text-center py-10">
              <Map className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">No laws found for {selectedLaw.title}</p>
              <p className="text-sm text-gray-400 mt-2">Please check back later or select another state</p>
            </div>
          )}
        </div>
      ) : (
        !isLoading && availableStates.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Select a state to view details
          </div>
        )
      )}
    </div>
  );
};

export default StateLaw;