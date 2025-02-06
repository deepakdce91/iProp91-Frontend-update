import React, { useEffect, useState } from "react";
import { ArrowLeft, Book, Gavel, Scale, FileText } from "lucide-react";
import { FiMinus, FiPlus } from "react-icons/fi";
import axios from "axios";
import DOMPurify from "dompurify";
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

  const breadcrumbItems = [
    { label: "Knowledge Center", link: "/" },
    { label: "Laws", link: "/laws" },
    { label: "State Laws",  }
  ];

  return (
    <div className="flex flex-col w-full px-5 md:px-20 pt-28  min-h-screen bg-white ">
      <Breadcrumb items={breadcrumbItems}  className={"flex z-50 items-center space-x-2 text-black text-sm lg:text-base  my-3"} />
      <div className="flex md:gap-5 gap-4 lg:overflow-x-auto bg-white/20 text-white overflow-x-scroll shadow-lg  py-3 md:px-10 px-3  ">
        {mockData.map((law) => (
          <button
            key={law.id}
            className={`flex flex-col min-w-[70px] items-center focus:outline-none ${
              selectedLaw?.id === law.id ? "scale-110" : ""
            }`}
            onClick={() => handleSelectLaw(law)}
          >
            <div
              className={`p-4 rounded-full flex items-center justify-center  ${
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
        <div className="mt-2 animate-fade-in px-5 md:px-10 py-3 ">
          <div className="">
            {stateLaws.map((law, index) => (
              <div
                key={index}
                className={`mb-4 transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "bg-gray-200 text-black border-[1px] border-black/30 "
                    : "border-[1px] bg-white text-black border-black/30"
                } p-4  hover:scale-105 transition-all`}
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
                  <p dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(law.content),
                  }} className="mt-7"/>
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
