import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, {  useEffect, useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
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

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [data, setData] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in local storage.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; // Assuming userId is stored within the token

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/faqs/fetchAllFAQs?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
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
    <div  className="flex flex-col gap-10 md:flex-row items-start py-28 px-6 lg:px-32 mt-5 md:mt-10 h-screen    ">
      <div className="md:w-1/3 flex flex-col gap-3">
        <h1  className="text-6xl tracking-wide font-bold ">
          FAQ
        </h1>
        <p  className="text-lg">
          Can&apos;t find the answer you&apos;re looking for? Ask your question and get an answer within 24 hours
        </p>
      </div>
      <div className="md:w-2/3 md:pl-8  md:mt-0">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`mb-4 transition-all duration-300 ease-in-out ${
              openIndex === index ? 'bg-gold' : 'border-[1px] border-gold'
            } p-4 rounded-3xl hover:scale-105 transition-all`}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-medium">{faq.question}</h3>
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
              <p className='mt-7'>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
