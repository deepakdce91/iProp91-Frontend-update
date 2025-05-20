import React, { useEffect } from "react";

const ServicesConcierge = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

  return (
    <div className="w-full px-6 sm:px-16 md:px-20 lg:px-32 xl:px-40 2xl:px-64 py-6 md:py-12 pt-28 md:pt-28">
      {/* Hero Section */}
      <div className="text-left mb-8 md:mb-12">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
          iProp91 Concierge
        </h1>
        <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
          In the fast-paced and often complex landscape of the Indian real estate sector, 
          our tailored concierge services have emerged as a game-changer, offering unparalleled 
          convenience and effectiveness. Our concierge service is specifically designed to meet 
          the intricate requirements of property owners, buyers, and renters in India.
        </p>
      </div>

      {/* Services List */}
      <ul className="space-y-8 md:space-y-10">
        {/* Service 1 */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Comprehensive Management of Property Documents and Records
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              One of the most daunting tasks in real estate is managing a plethora of property 
              documents and records. iProp91 services streamline this process by ensuring that 
              all necessary documentation across stages of ownership or tenancy is organized, 
              up-to-date, and easily accessible.
            </p>
          </div>
          <div className="flex justify-center bg-gray-50">
            <img
              src="/Concierge/conci1.jpg"
              alt="Property document management"
              className="rounded-lg   sm:h-[50dvh]  w-[60dvw] "
            />
          </div>
        </li>

        {/* Service 2 */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Dedicated Listing Page for Verified Owners/Properties
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              We provide India's first and only dedicated listing page for verified owners 
              (and not just verified properties), enhancing authenticity, transparency and 
              credibility in the market. This feature ensures that potential buyers and renters 
              have access to accurate and trustworthy information directly from the owners.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/two.png"
              alt="Verified owners listing"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>

        {/* Service 3 */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Personalized Support with Dedicated Relationship Managers
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              Having a dedicated Relationship Manager (RM) can significantly enhance the real 
              estate experience. iProp91 assigns RMs to clients, offering personalized support 
              and guidance throughout the buying, selling, or renting process.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci3.png"
              alt="Relationship manager support"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>

        {/* Service 4 */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Real Estate Wealth Management Services
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              iProp91 services extend beyond traditional real estate transactions by offering 
              comprehensive wealth management services. Whether clients are looking to buy, sell, 
              or rent properties, these services provide strategic advice and insights to maximize 
              their real estate investments.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci4.png"
              alt="Wealth management services"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>

        {/* Service 5 */}
        <li className="flex flex-col gap-6 md:gap-8">
        <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Efficient Rental Management Services
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              For property owners, managing rentals can be time-consuming. iProp91 simplifies 
              this process by handling everything from tenant screening, KYC to rent collection 
              and document management. This allows property owners to enjoy passive income 
              without the stress of day-to-day management.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci5.png"
              alt="Strategic wealth management"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-2xl"
            />
          </div>
        </li>

        {/* Service 6 */}
        <li className="flex flex-col gap-6 md:gap-8">
        <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
              Spam Protection and Privacy Assurance
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
              In an age where data privacy is paramount, iProp91 prioritizes the protection of 
              clients' personally identifiable information. By implementing robust spam protection 
              measures and ensuring non-disclosure of sensitive information, these services provide 
              peace of mind to clients.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci6.png"
              alt="Rental management services"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>

        {/* Service 7 */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
            Loan Assistance
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
            Navigating the complexities of real estate financing can be overwhelming. Trusted partners of iProp91 offer loan assistance, guiding clients through the process of securing financing for their property purchases. This support includes helping clients understand their options, comparing loan products, and facilitating communication with lenders.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci77.png"
              alt="Privacy protection"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>

        {/* conclusion  */}
        <li className="flex flex-col gap-6 md:gap-8">
          <div>
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6">
            Conclusion
            </h2>
            <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
            The integration of iProp91 concierge services into the Indian real estate sector represents a significant advancement in how property transactions are conducted. By offering a comprehensive suite of services tailored to the unique needs of clients, our services provide unparalleled convenience and effectiveness. From document management to personalized support and privacy assurance, they are redefining the real estate experience in India, making it more accessible and efficient for everyone involved.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/Concierge/conci8.png"
              alt="Privacy protection"
              className="rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ServicesConcierge;