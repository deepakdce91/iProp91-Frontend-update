import React, { useEffect } from "react";
import Card from "./card";

const ServicesListing = () => {
  const listingPoints = [
    {
      heading: "Verified Listings",
      content: `iProp91 allows only verified property owners to post listings, ensuring legitimacy and reducing fraud risk. This verification significantly increases transaction closing rates as buyers can trust they're dealing with genuine owners.`,
      image: "/listing/verified-listing.png",
    },
    {
      heading: "Higher Weightage for Verified Title Documents",
      content: `iProp91 boosts credibility by prioritizing listings with verified title documents. This transparency helps buyers make informed decisions and reduces legal complications, leading to faster transaction closures.`,
      image: "/listing/height-weightage.png",
    },
    {
      heading: "Concierge Services",
      content: `iProp91's concierge services support both buyers and sellers through property viewings, communication management, and paperwork assistance. This personalized service is especially valuable for investors managing multiple properties.`,
      image: "/listing/concierge-services.png",
    },
    {
      heading: "Enhanced User Experience",
      content: `With verified listings and concierge support, iProp91 offers a user-friendly platform that simplifies property listing for owners and property discovery for buyers/tenants, encouraging greater engagement.`,
      image: "/listing/enhance-user-experience.png",
    },
    {
      heading: "Building Trust in the Market",
      content: `iProp91's focus on verification and transparency builds market trust, attracting serious buyers and encouraging responsible selling practices among property owners, fostering a community where trust is paramount.`,
      image: "/listing/trust.png",
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
      <section>
        <div className="text-left">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
            iProp91 Verified Listings
          </h1>
          <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed mb-6">
            In the ever-evolving real estate market, the need for trust and transparency has never been more critical. iProp91 stands out by exclusively allowing verified property owners to post listings, ensuring every transaction is backed by authenticity.
          </p>
        </div>

        <ul className="space-y-8 md:space-y-10">
          {listingPoints.map((items, index) => (
            <Card
              key={index}
              heading={items.heading}
              content={items.content}
              index={index}
              image={items.image}
              isMobile={window.innerWidth < 768}
            />
          ))}
        </ul>

        <div className="mt-8 md:mt-12 flex justify-center">
          <img
            src="/listing/listing1.png"
            alt="Verified listings illustration"
            className="w-full max-w-xs sm:max-w-lg md:max-w-xl mx-auto"
          />
        </div>
      </section>

      <section className="mt-8 md:mt-12">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6 text-left capitalize">
          Conclusion
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
          iProp91 redefines real estate listings by emphasizing verification, transparency, and personalized service. With verified owners and concierge support, iProp91 enhances the buying/selling process while building a trustworthy marketplace, positioning itself as a leader in secure real estate transactions.
        </p>
      </section>
    </div>
  );
};

export default ServicesListing;