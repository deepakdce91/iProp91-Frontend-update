import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "./style.css"; // Import your CSS file for styles

function toTitleCase(str) {
  return str
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join words with space
}

const RewardCard = ({ name, amount, status, icon, commonImageUrl }) => {
  // Use a random image for each card to ensure variety
  const imageUrl = "/images/rewards-image.jpg";

  // Normalize the name for comparison
  const normalized = (str) => str.trim().toLowerCase();
  const bonusNames = [
    "buy property through us test",
    "sell property through us",
    "rent property through us",
  ];
  const showBonus = bonusNames.some(
    (target) => normalized(name) === normalized(target)
  );

  return (
    <>
      <div className="inline-block lg:w-[400px]">
        <div
          className="bg-white 
          reward-card rounded-xl shadow-lg 
          transition-all duration-300 hover:scale-105 
          max-w-xs overflow-hidden flex
          flex-col mx-3 max-sm:mx-0 no-selection-effect h-[400px]"
        >
          {/* Image section with curved top corners */}
          <div className="w-full bg-gradient-to-r from-blue-800 to-blue-600 rounded-t-xl flex items-center justify-center h-[250px] relative overflow-hidden">
            <img
              src={imageUrl}
              alt="Reward"
              className="w-full h-full object-cover rounded-t-xl hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300"></div>
            {showBonus && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                Get 25% bonus
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="p-6 flex-1 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-wrap text-[#0a0f19] reward-card-title">
                  {toTitleCase(name)}
                </h3>
                <span className="text-orange-500 font-semibold mt-4 text-xl">
                  Get {amount} Coins
                </span>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Modified rewards container with horizontal scrolling and navigation arrows
const RewardsContainer = ({ cardsData }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Sample data array - updated with name and amount
  const rewardsData = cardsData
    ? cardsData
    : [
        {
          id: 1,
          name: "Sign Up on our website",
          amount: 5000,
        },
        {
          id: 2,
          name: "Complete your profile",
          amount: 2000,
        },
        {
          id: 3,
          name: "Make first purchase",
          amount: 10000,
        },
        {
          id: 4,
          name: "Refer a friend",
          amount: 7500,
        },
        {
          id: 5,
          name: "Complete verification",
          amount: 5000,
        },
        {
          id: 6,
          name: "Submit feedback",
          amount: 3000,
        },
        {
          id: 7,
          name: "Complete survey",
          amount: 4000,
        },
      ];

  // Function to handle scrolling
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Show left arrow if we've scrolled to the right
      setShowLeftArrow(scrollLeft > 0);

      // Show right arrow if there's more content to scroll to
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  // Check on window resize
  useEffect(() => {
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative w-full px-14 reward-cards ">
      {/* Left navigation arrow - positioned outside the container */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 scroll-left-arrow top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white"
          aria-label="Scroll left"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div className="width-full ">
        <div
          ref={scrollContainerRef}
          className=" overflow-x-auto whitespace-nowrap scrollbar-hide  scroll-smooth space-x-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {rewardsData.map((reward) => (
            <RewardCard
              key={reward.id}
              name={reward.name}
              amount={reward.amount}
              status={reward.status}
              icon={reward.icon}
            />
          ))}
        </div>
      </div>

      {/* Right navigation arrow - positioned outside the container */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 scroll-right-arrow top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white"
          aria-label="Scroll right"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const WeDoMore = () => {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rewards/fetchAdditionRewards`
      )
      .then((response) => {
        if (response) {
          setCardsData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <section className="py-20 px-2 relative overflow-hidden max-sm:p-0 bg-black/90 border-y-[1px] border-y-white/30">
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex flex-col items-center px-10 max-sm:px-2 max-sm:py-20 lg:px-32 pb-20">
        <div className="flex flex-col gap-5 text-white w-full md:w-full mb-6 lg:mb-8">
          <p className="lg:text-6xl md:text-4xl text-3xl font-semibold">
            do more with <br /> your real estate assets
          </p>
          <p className="text-lg md:text-2xl text-gray-500">
            Join exclusive club of verified owners of your project, manage all
            your real estate documents well, earn reward points, get access to
            expert views & other owner reviews, understand your documents, stay
            compliant and a lot more
          </p>
        </div>

        {cardsData.length > 0 ? (
          <RewardsContainer cardsData={cardsData} />
        ) : (
          <RewardsContainer />
        )}

        <div className="absolute -z-10 md:z-10 md:block -right-14 -bottom-20">
          <img src="/images/domore.png" className="w-full h-[300px]" alt="ss" />
        </div>
      </div>
    </section>
  );
};

export default WeDoMore;
