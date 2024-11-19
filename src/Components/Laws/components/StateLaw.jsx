import React, { useState } from 'react';
import { ArrowLeft, Book, Gavel, Scale, FileText } from 'lucide-react';
import { FiMinus, FiPlus } from 'react-icons/fi';

// Mock data (replace with actual API data when available)
const mockData = [
  { id: 1, title: 'Delhi', icon: "/images/delhi.png", content: 'Content for Criminal Law...' },
  { id: 2, title: 'Haryana', icon: "/images/har.png", content: 'Content for Civil Law...' },
  { id: 3, title: 'Bihar', icon:  "/images/delhi.png", content: 'Content for Family Law...' },
  { id: 4, title: 'Uttrakhand', icon: "/images/uk.png", content: 'Content for Corporate Law...' },
];
const demodata = [
  {
    question: "Do you work with a small business?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?"
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Not only do we offer the expected maintenance and security but we also offer design and marketing support. Our goal is to become an extension of your in-house marketing team and we will tailor a team and offering that empowers your internal team. You can read more about MLab here."
  },
  {
    question: "How long does the project take on average?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?"
  },
  {
    question: "Is there a possibility of offline meetings?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?"
  },
  {
    question: "Is there a possibility of offline meetings?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, reiciendis consequuntur maiores quod sequi sint quo fugit nemo tempore sunt? Labore consequatur illo voluptates voluptatibus voluptatum eligendi dolorum omnis blanditiis odio, doloremque reiciendis dolor harum porro sit, magnam deleniti mollitia exercitationem soluta fugiat excepturi minus quo asperiores! Quasi, sequi voluptatibus?"
  },
];

const StateLaw = ({ onBack ,data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const [selectedLaw, setSelectedLaw] = useState([0]);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelectLaw = (law) => {
    setSelectedLaw(law);
  };

  return (
    <div className="flex flex-col w-full px-2 md:px-10 mt-28 lg:px-24 min-h-screen ">
      <button 
        className=" mb-4 flex items-center text-white  transition-colors"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <div className="flex md:gap-5 gap-4 lg:overflow-x-auto bg-white/20 text-white overflow-x-scroll shadow-lg rounded-2xl py-3 md:px-10 px-3  ">
        {mockData.map((law) => (
          <button
            key={law.id}
            className={`flex flex-col min-w-[70px] items-center focus:outline-none ${
              selectedLaw?.id === law.id ? 'scale-110' : ''
            }`}
            onClick={() => handleSelectLaw(law)}
          >
            <div className={`p-4 rounded-full flex items-center justify-center  ${
              selectedLaw?.id === law.id ? 'bg-white border-[3px] border-black' : 'bg-gray-200 border-[2px] border-black'
            }`}>
              <img src={law.icon} alt='img' className='w-8 h-8' />
            </div>
            <span className="text-xs text-center">{law.title}</span>
          </button>
        ))}
      </div>

      {selectedLaw ? (
        <div className="mt-2 animate-fade-in px-5 md:px-10 py-3  rounded-2xl ">
          <div className="">
  { demodata.map((faqData, index) => {
    return (
      <div
        key={index}
        className={`mb-4 transition-all duration-300 ease-in-out  ${
          openIndex === index ? ' bg-gray-200 text-black' : 'border-[1px] bg-white/20 text-white border-black'
        } p-4 rounded-3xl hover:scale-105 transition-all`}
      >
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleFAQ(index)}
        >
          <h3 className="text-lg font-medium">{faqData.question}</h3>
          <div className="text-xl ">
            {openIndex === index ? <FiMinus /> : <FiPlus />}
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openIndex === index ? 'max-h-screen mt-4' : 'max-h-0'
          }`}
        >
          <hr className="border-t-[2px] border-black mb-4" />
          <p className='mt-7'>{faqData.answer}</p>
        </div>
      </div>
    );
  })}
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