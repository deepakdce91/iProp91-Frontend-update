import React, { useState } from "react";

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gold py-4">
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
        className={`overflow-hidden transition-all duration-800 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <p className="mt-4 text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "Who is NRI?",
      answer:
        "Non-Resident Indian (NRI) refers to a person who is a citizen of India but resides outside India.",
    },
    {
      question:
        "Are there any restrictions on the type of properties NRIs or PIOs can invest in?",
      answer:
        "NRIs and PIOs can invest in residential and commercial properties in India, except agricultural land, plantation property, and farmhouse.",
    },
    {
      question: "Are NRI available for loan?",
      answer:
        "Yes, NRIs can avail of loans in India for purchasing property, subject to certain conditions.",
    },
    {
      question: "How to pay the quote?",
      answer:
        "Payments can be made through regular banking channels, using funds remitted to India through normal banking channels or funds held in NRE/FCNR (B)/NRO account.",
    },
  ];

  return (
    <>
        {/* <div className="h-[200vh] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/images/image.jpg')"}}></div> */}
      <div className="min-h-screen bg-black border-y-[1px] border-y-white/20 text-white p-8 flex flex-col items-center justify-center">
        <h2 className="text-4xl md:text-6xl text-center mb-8">
          You Might Have Questions!
        </h2>
        <p className="text-center mb-12 text-gray-500 max-w-4xl mx-auto">
          We take great pride in ensuring the satisfaction of our customers,
          which is why we guarantee that the products we sell will bring
          happiness to each and every customer. Our genuine care for customer
          satisfaction is what sets us apart.
        </p>
        <div className="max-w-4xl mx-auto">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
