import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gold py-4 w-full">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">
          0{index + 1} &nbsp; &nbsp; &nbsp;{question}
        </h3>
        <span className="text-4xl border-b-[4px] shadow-sm shadow-gold border-b-gold rounded-full   flex justify-center items-center px-3">
          {isOpen ? " - " : " + "}
        </span>
      </div>
      <div
        className={`overflow-hidden  transition-all duration-800 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <p className="mt-4 text-gray-600" dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(answer)
              }} />
      </div>
    </div>
  );
};

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/faqs/fetchAllActiveNriFAQs`);
        setFaqData(response.data);
        console.log(response.data)
      } catch (error) {
        if (error.response) {
          console.error("Error fetching FAQs:", error.response.data);
        } else {
          console.error("Error fetching FAQs:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
        {/* <div className="h-[200vh] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/images/image.jpg')"}}></div> */}
      <div className="min-h-screen bg-white border-y-[1px] border-y-white/20 text-black p-8 flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-6xl text-center mb-8">
          You Might Have Questions!
        </h2>
        <p className="text-center mb-12 text-gray-500 max-w-4xl mx-auto">
          We take great pride in ensuring the satisfaction of our customers,
          which is why we guarantee that the products we sell will bring
          happiness to each and every customer. Our genuine care for customer
          satisfaction is what sets us apart.
        </p>
        <div className="w-[80%] md:w-[50%] mx-auto">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.title}
              answer={faq.content}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
