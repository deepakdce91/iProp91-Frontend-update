import React from "react";
import Card from "./card";

const FeaturesSafe = () => {
  const advanatges = [
    {
      heading: "Enhanced Security",
      content: `iProp91 Safe offers a robust encryption mechanism that ensures
                all sensitive documents are stored securely. This feature is
                crucial in the real estate sector, where the risk of document
                theft or unauthorized access can lead to significant financial
                and legal repercussions`,
      image: "/public/safe/enhance-security.png",
    },
    {
      heading: "Secure Storage",
      content: `iProp91 Safe provides a secure storage solution that ensures
                the confidentiality and integrity of your documents. The
                encrypted documents are stored in a secure environment, ensuring
                that they cannot be accessed by unauthorized individuals`,
      image: "/public/safe/secure-storage.png",
    },
    {
      heading: "User-Friendly Interface",
      content: `iProp91 Safe offers a user-friendly interface that makes it easy
                for users to upload and manage their documents. The interface is
                designed to be intuitive and easy to navigate, ensuring that
                users can access their documents quickly and efficiently`,
      image: "/public/safe/user-friendly.png",
    },
    {
      heading: "Access Control",
      content: `iProp91 Safe provides a secure storage solution that ensures
                the confidentiality and integrity of your documents. The
                encrypted documents are stored in a secure environment, ensuring
                that they cannot be accessed by unauthorized individuals`,
      image: "/public/safe/ease-of-access.png",
    },
    {
      heading: "Document Tracking",
      content: `iProp91 Safe provides a secure storage solution that ensures
                the confidentiality and integrity of your documents. The
                encrypted documents are stored in a secure environment, ensuring
                that they cannot be accessed by unauthorized individuals`,
      image: "/public/safe/tracking.png",
    },
    {
      heading: "Security Updates",
      content: `iProp91 Safe provides a secure storage solution that ensures
                the confidentiality and integrity of your documents. The
                encrypted documents are stored in a secure environment, ensuring
                that they cannot be accessed by unauthorized individuals`,
      image: "/public/safe/security-updates.png",
    },
  ];

  const Necessity = [
    {
      heading: " Growing Real Estate Sector",
      content: ` India's real estate market is rapidly expanding, with increasing investments and transactions.
 As the volume of real estate dealings rises, the need for a secure and organized way to
 manage documents across multiple properties becomes essential. iProp91 Safe addresses
 this necessity effectively.`,
      image: "/public/safe/property-improve.png",
    },
    {
      heading: "Legal Compliance",
      content: ` Real estate transactions are subject to various legal requirements. iProp91 Safe ensures that
 users are aware of and can easily access the necessary documentation, helping them stay
 compliant with local laws and regulations.`,
      image: "/public/safe/Legal-Compliance.png",
    },
    {
      heading: "Protection Against Fraud",
      content: `The real estate sector is often targeted by fraudsters. By securely storing documents in
 iProp91 Safe, users can protect themselves against identity theft and fraudulent activities,
 safeguarding their investments and personal information.`,
      image: "/public/safe/fraud-protection.png",
    },
    {
      heading: "Ease of Access",
      content: `In a fast-paced market, having quick access to important documents is crucial. The iProp91
 Safe allows users to retrieve their documents anytime, anywhere, facilitating smoother
 transactions and timely decision-making.`,
      image: "/public/safe/ease-of-access.png",
    },
    {
      heading: "Peace of Mind",
      content: ` Knowing that all important documents are securely stored and easily accessible provides
 peace of mind to property owners and investors. iProp91 Safe alleviates the stress associated
 with managing real estate documentation, allowing users to focus on their investments.`,
      image: "/public/safe/peace-of-mind.png",
    },
  ];

  return (
    <>
      <div className="w-full max-md:pr-[11rem] max-sm: md:w-[70%] pt-0 pb-0 px-4 md:pl-20 md:pr-40 box-border bg-white">
        <div className="text-start mt-4 md:mt-8">
          <h1 className="font-bold text-2xl md:text-4xl capitalize">
            iProp91 Safe
          </h1>
          <p className="mt-4 md:mt-7 text-base md:text-lg">
            iProp91 Safe is a revolutionary secured document safe tailored
            specifically for the real estate market in India
          </p>
        </div>
        <section>
          <h1 className="font-bold text-start capitalize text-2xl md:text-3xl mt-6 md:mt-[10vh] mb-6 md:mb-15">
            Advantages of iProp91 Safe
          </h1>
          <ul>
            {advanatges.map((items, index) => (
              <Card
                key={index}
                heading={items.heading}
                content={items.content}
                image={items.image}
                index={index}
              />
            ))}
          </ul>
          <div className="mt-6 md:mt-8">
            <img src="/public/safe/three.png" alt="image" className="w-full" />
          </div>
        </section>
        <section>
          <div className="text-start mt-8 md:mt-[20vh] mb-6 md:mb-10">
            <h1 className="font-bold text-2xl md:text-4xl">
              Necessity of iProp91 Safe
            </h1>
          </div>
          <div>
            <ul>
              {Necessity.map((items, index) => (
                <Card
                  key={index}
                  heading={items.heading}
                  content={items.content}
                  image={items.image}
                  index={index}
                />
              ))}
            </ul>
          </div>
          <div>
            <img src="/public/safe/one.png" alt="" className="w-full" />
          </div>
        </section>
      </div>
    </>
  );
};

export default FeaturesSafe;
