import React from "react";
import Card from "./card";

const ServicesListing = () => {
  const listingPoints = [
    {
      heading: "Verified Listings",
      content: ` One of the most significant advantages of iProp91 is its strict policy of allowing only verified
 property owners to post listings. This verification process ensures that all listings are
 legitimate, reducing the risk of fraud and misrepresentation and significantly increasing the
 closing rate for transactions. Buyers and tenants can browse properties with peace of mind,
 knowing that they are dealing with genuine owners`,
      image: "/public/listing/verified-listing.png",
    },
    {
      heading: "Higher Weightage for Verified Title Documents",
      content: ` iProp91 places a premium on transparency by giving higher weightage to listings that come
 with verified title documents. This feature not only boosts the credibility of the listings but
 also helps buyers make informed decisions reducing the possibilities of fake listings.
 Properties with verified titles are more likely to have clear ownership, reducing potential legal
 complications and resulting in faster closure of transactions`,
      image: "/public/listing/height-weightage.png",
    },
    {
      heading: "Concierge Services",
      content: ` The concierge services offered by iProp91 add an extra layer of support for both buyers and
 sellers. From managing property viewings to handling communication with the prospective
 buyers/tenants, assisting with paperwork, the concierge team ensures a seamless experience
 throughout the transaction process. This personalized service is particularly beneficial for
 investors handling multiple properties`,
      image: "/public/listing/concierge-services.png",
    },
    {
      heading: "Enhanced User Experience",
      content: ` With a focus on verified listings and concierge support, iProp91 provides an enhanced user
 experience. The platform is designed to be user-friendly, making it easy for property owners
 to list their properties and for buyers/tenants to navigate through available listings. This
 streamlined process encourages more engagement and satisfaction among users.`,
      image: "/public/listing/enhance-user-experience.png",
    },
    {
      heading: "Building Trust in the Market",
      content: ` By prioritizing verification and transparency, iProp91 is actively working to build trust in the
 real estate market. This commitment to authenticity not only attracts serious buyers but also
 encourages responsible selling practices among property owners. As a result, iProp91 is
 fostering a community where trust is paramount.`,
      image: "/public/listing/trust.png",
    },
  ];

  return (
    <>
      <div className="w-full max-md:pr-[11rem] max-sm: md:w-[70%] pt-0 pb-0 px-4 md:pl-20 md:pr-40 box-border bg-white">
        <section>
          <div className="text-center mt-4 md:mt-8">
            <h1 className="font-bold text-2xl md:text-4xl">iProp91 Listing</h1>
            <p className="mt-4 text-base md:text-lg">
              In the ever-evolving real estate market, the need for trust and
              transparency has never been more critical. iProp91 stands out as a
              unique platform that exclusively allows verified property owners
              to post listings, ensuring that every transaction is backed by
              authenticity. This advantage and distinctive features of iProp91,
              particularly its verification process and concierge services,
              collectively enhance the user experience and foster confidence
              among buyers and sellers
            </p>
          </div>

          <ul className="mt-6 md:mt-8">
            {listingPoints.map((items, index) => (
              <Card
                key={index}
                heading={items.heading}
                content={items.content}
                index={index}
                image={items.image}
              />
            ))}
          </ul>
          <div className="mt-8 md:mt-15">
            <img src="/public/listing/one.png" alt="image" className="w-full" />
          </div>
        </section>
        <section>
          <h1 className="font-bold text-2xl md:text-3xl mt-6 md:mt-8 mb-4 md:mb-8 capitalize">
            conclusion
          </h1>
          <p className="text-base md:text-lg">
            iProp91 is redefining the real estate listing experience by
            emphasizing verification, transparency, and personalized service.
            With its commitment to allowing only verified property owners to
            post listings and providing concierge support, iProp91 not only
            enhances the buying and selling process but also builds a
            trustworthy marketplace. As the platform continues to grow, it
            promises to be a leader in fostering a secure and efficient real
            estate environment.
          </p>
        </section>
      </div>
    </>
  );
};

export default ServicesListing;
