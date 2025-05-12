import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import "./style.css"; // Import your CSS file for styles

function toTitleCase(str) {
  return str
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join words with space
}

const RewardCard = ({ name, amount, status, icon }) => {
  return (
    <div className="inline-block h-full w-[160px] sm:w-[200px] md:w-[250px] lg:w-[280px]">
      <div className="bg-white rounded-xl shadow-md transition-all duration-300 hover:scale-105 overflow-hidden flex flex-col h-full mx-2 no-selection-effect">
        {/* Image section with proper aspect ratio */}
        <div className="w-full max-sm:h-[75%] bg-gray-100 relative pt-[75%] overflow-hidden">
          {" "}
          {/* 4:3 aspect ratio */}
          <img
            src="/images/rewards-image.jpg"
            alt="Reward"
            className="absolute top-0 left-0 w-full h-full object-cover  "
          />
          {/* Badge for special offers like in the design */}
          {status === "offer" && (
            <div className="absolute bottom-2 right-2 bg-yellow-500 text-xs font-bold text-black px-2 py-1 rounded">
              Offer
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-3 flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {toTitleCase(name)}
          </h3>
          <div className="mt-2 text-sm text-gray-600">
            <span className="text-orange-500 font-semibold text-base">
              Get {amount} Coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modified rewards container with horizontal scrolling and navigation arrows
const RewardsContainer = ({ cardsData }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Sample data array with status field added for "offer" badges
  const rewardsData = cardsData
    ? cardsData
    : [
        {
          id: 1,
          name: "Sign Up on our website",
          amount: 5000,
          status: "offer",
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
          status: "offer",
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
      // Calculate scroll amount based on card width to ensure smooth scrolling to next card
      const cardWidth = 180; // Approximate width of a card including margin
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
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
      setShowLeftArrow(scrollLeft > 10);

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
    <div className="w-full">
      {/* Section Heading similar to MagicBricks design */}
      <div className="px-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Property Services</h2>
        <div className="w-10 h-1 bg-red-500 mt-1"></div>
      </div>

      {/* Cards Container with Navigation */}
      <div className="relative w-full px-4 sm:px-6 h-[18rem] sm:h-[20rem]">
        {/* Left navigation arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5"
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
        <div className="w-full h-full overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto h-full whitespace-nowrap scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Add left padding to first card for better spacing */}
            <div className="inline-block w-2"></div>

            {rewardsData.map((reward) => (
              <RewardCard
                key={reward.id}
                name={reward.name}
                amount={reward.amount}
                status={reward.status}
                icon={reward.icon}
              />
            ))}

            {/* Add right padding to last card for better spacing */}
            <div className="inline-block w-2"></div>
          </div>
        </div>

        {/* Right navigation arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-lg text-gray-800 hover:bg-white"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5"
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
