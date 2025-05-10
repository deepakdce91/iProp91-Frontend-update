import React, { useEffect } from "react";
import Card from "./card";

const ServicesSafe = () => {
  const advanatges = [
    {
      heading: "Enhanced Security",
      content: `iProp91 Safe offers a robust encryption mechanism that ensures all sensitive documents are stored securely. This feature is crucial in the real estate sector, where the risk of document theft or unauthorized access can lead to significant financial and legal repercussions`,
      image: "/safe/enhance-security.png",
    },
    {
      heading: "Secure Storage",
      content: `iProp91 Safe provides a secure storage solution that ensures the confidentiality and integrity of your documents. The encrypted documents are stored in a secure environment, preventing unauthorized access.`,
      image: "/safe/secure-storage.png",
    },
    {
      heading: "User-Friendly Interface",
      content: `iProp91 Safe offers an intuitive interface that makes document upload and management easy. Designed for quick navigation, users can access their documents efficiently.`,
      image: "/safe/user-friendly.png",
    },
    {
      heading: "Access Control",
      content: `iProp91 Safe ensures document confidentiality through secure storage with strict access controls, preventing unauthorized individuals from viewing your documents.`,
      image: "/safe/ease-of-access.png",
    },
    {
      heading: "Document Tracking",
      content: `Track and manage all your documents in one secure location with iProp91 Safe's comprehensive document tracking features.`,
      image: "/safe/tracking.png",
    },
    {
      heading: "Security Updates",
      content: `iProp91 Safe maintains document integrity through regular security updates and encrypted storage in a protected environment.`,
      image: "/safe/security-updates.png",
    },
  ];

  const Necessity = [
    {
      heading: "Growing Real Estate Sector",
      content: `India's expanding real estate market demands secure document management across multiple properties. iProp91 Safe effectively addresses this need.`,
      image: "/safe/property-improve.png",
    },
    {
      heading: "Legal Compliance",
      content: `Stay compliant with real estate regulations through iProp91 Safe's organized documentation system that keeps required paperwork accessible.`,
      image: "/safe/Legal-Compliance.png",
    },
    {
      heading: "Protection Against Fraud",
      content: `Secure document storage in iProp91 Safe protects against identity theft and fraud, safeguarding your investments and personal information.`,
      image: "/safe/fraud-protection.png",
    },
    {
      heading: "Ease of Access",
      content: `Quickly retrieve important documents anytime, anywhere with iProp91 Safe, enabling smoother transactions and timely decisions.`,
      image: "/safe/ease-of-access.png",
    },
    {
      heading: "Peace of Mind",
      content: `iProp91 Safe eliminates stress by securely storing and organizing your real estate documents, letting you focus on investments.`,
      image: "/safe/peace-of-mind.png",
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

  return (
    <div className="w-full px-6 sm:px-16 md:px-20 lg:px-32 xl:px-40 2xl:px-64 py-6 md:py-12 pt-28 md:pt-28">
      <div className="text-left max-w-4xl mx-auto">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4 md:mb-6">
          {`iProp91 Safe`}
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
          iProp91 Safe is a revolutionary secured document safe tailored specifically for the real estate market in India
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <section className="mt-8 md:mt-16">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl capitalize mb-6 md:mb-10">
            Advantages of iProp91 Safe
          </h1>
          <ul className="space-y-8 md:space-y-10">
            {advanatges.map((items, index) => (
              <Card
                key={index}
                heading={items.heading}
                content={items.content}
                image={items.image}
                index={index}
                isMobile={window.innerWidth < 768}
              />
            ))}
          </ul>
          <div className="mt-8 md:mt-12 flex justify-center">
            <img
              src="/safe/serv1.png"
              alt="Security features"
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto"
            />
          </div>
        </section>

        <section className="mt-12 md:mt-24">
          <div className="text-left mb-8 md:mb-12">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">
              Necessity of iProp91 Safe
            </h1>
          </div>
          <ul className="space-y-8 md:space-y-10">
            {Necessity.map((items, index) => (
              <Card
                key={index}
                heading={items.heading}
                content={items.content}
                image={items.image}
                index={index}
                isMobile={window.innerWidth < 768}
              />
            ))}
          </ul>
          <div className="mt-8 md:mt-12 flex justify-center">
            <img
              src="/safe/serv2.png"
              alt="Document security"
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto"
            />
          </div>
        </section>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-base my-8 sm:text-lg md:text-lg text-gray-700 leading-relaxed">
            {`In conclusion, iProp91 Safe is not just a document storage solution; it is a comprehensive tool designed to meet the unique needs of the real estate market in India. With its focus on security, guidance, and management, iProp91 Safe is an indispensable asset for anyone involved in real estate transactions.`}
          </p>
        </div>

        <div className="mt-8 md:mt-12 flex justify-center">
          <img
            src="/safe/serv3.png"
            alt="Security features"
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSafe;