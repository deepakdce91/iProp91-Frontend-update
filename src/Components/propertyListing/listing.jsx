import { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.jsx";
import FiltersPanel from "./components/FiltersPage.jsx";
import PropertyCard from "./components/PropertyCard.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCards from "./components/propertyCards.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";

function PropertyListing() {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [properties, setProperties] = useState([]);
  
  // Initialize URL parameters
  const searchParams = new URLSearchParams(location.search);
  
  // Get transaction type from URL (rent/buy)
  const initialTransactionType = searchParams.get("transactionType") || "buy";
  const [transactionType, setTransactionType] = useState(initialTransactionType);
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState(() => {
    const urlFilters = {};

    // Get category from URL
    const category = searchParams.get("category");
    if (category) {
      urlFilters.category = category;
    }

    // Get property type from URL
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      urlFilters.propertyType = propertyType.split(",");
    }

    // Get BHK from URL
    const bhk = searchParams.get("bhk");
    if (bhk) {
      urlFilters.bhk = bhk.split(",");
    }

    // Get budget range from URL
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    if (minBudget) urlFilters.minBudget = minBudget;
    if (maxBudget) urlFilters.maxBudget = maxBudget;

    // Get location from URL
    const city = searchParams.get("city");
    if (city) urlFilters.city = city;
    
    // Get amenities from URL
    const amenities = searchParams.get("amenities");
    if (amenities) {
      urlFilters.amenities = amenities.split(",");
    }

    console.log("URL Filters:", urlFilters);
    
    // If URL has filters, use them
    if (Object.keys(urlFilters).length > 0) {
      return urlFilters;
    }

    // Otherwise, check localStorage
    const savedFilters = localStorage.getItem("propertyFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Set the active category from URL if present
  const urlCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(() => {
    // Map URL category to local category ID
    const categoryMapping = {
      verified_owner: "verified",
      new_project: "new",
      pre_launch: "prelaunch",
      new_sale: "sale",
      upcoming_project: "upcoming",
    };
    return urlCategory ? (categoryMapping[urlCategory] || "all") : "all";
  });
  
  const [propertyCategories] = useState([
    { id: "all", label: "All Properties", count: 0 },
    { id: "new", label: "New Projects", count: 0 },
    { id: "prelaunch", label: "Pre Launch Homes", count: 0 },
    { id: "verified", label: "Verified Owner Properties", count: 0 },
    { id: "sale", label: "New Sale Properties", count: 0 },
    { id: "upcoming", label: "Upcoming Projects", count: 0 },
  ]);

  // Get city from URL for selectedCity
  const urlCity = searchParams.get("city");
  const [selectedCity, setSelectedCity] = useState(() => {
    if (urlCity) {
      return urlCity; // Use city directly from URL
    }
    const savedCity = localStorage.getItem("selectedCity");
    return savedCity ? JSON.parse(savedCity) : null;
  });
  
  // Get state from URL for selectedState (if needed)
  const [selectedState, setSelectedState] = useState(() => {
    const savedState = localStorage.getItem("selectedState");
    return savedState ? JSON.parse(savedState) : null;
  });

  console.log("Filters:", filters);
  console.log("Selected City:", selectedCity);
  console.log("Transaction Type:", transactionType);

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 text-gray-600 hover:text-white hover:bg-[#031273] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#031273]/50 -ml-2 sm:ml-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 text-gray-600 hover:text-white hover:bg-[#031273] transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#031273]/50 -mr-2 sm:mr-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const handleFetchAllProperties = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster`
      )
      .then((res) => {
        setProperties(res.data.data.projects);
        console.log(res.data.data.projects);
      })
      .catch((err) => console.log(err));
    
  }

  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: false,
    speed: 600,
    slidesToShow: 8,
    slidesToScroll: 2,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    swipeToSlide: true,
    touchThreshold: 8,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  // Load filters from localStorage on initial render
  useEffect(() => {
    const savedFilters = localStorage.getItem("propertyFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("propertyFilters", JSON.stringify(filters));
  }, [filters]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("propertyFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("propertyFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save selectedState to localStorage
  useEffect(() => {
    if (selectedState) {
      localStorage.setItem("selectedState", JSON.stringify(selectedState));
    } else {
      localStorage.removeItem("selectedState");
    }
  }, [selectedState]);

  // Save selectedCity to localStorage
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("selectedCity", JSON.stringify(selectedCity));
    } else {
      localStorage.removeItem("selectedCity");
    }
  }, [selectedCity]);

  // Update state when URL parameters change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Update category
    const category = searchParams.get("category");
    if (category) {
      const categoryMapping = {
        verified_owner: "verified",
        new_project: "new",
        pre_launch: "prelaunch",
        new_sale: "sale",
        upcoming_project: "upcoming",
      };
      setActiveCategory(categoryMapping[category] || "all");
    }
    
    // Update city
    const city = searchParams.get("city");
    if (city && city !== selectedCity) {
      setSelectedCity(city);
    }
    
    // Update filters if parameters exist
    const newFilters = {};
    let hasNewFilters = false;
    
    // Property type
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      newFilters.propertyType = propertyType.split(",");
      hasNewFilters = true;
    }
    
    // BHK
    const bhk = searchParams.get("bhk");
    if (bhk) {
      newFilters.bhk = bhk.split(",");
      hasNewFilters = true;
    }
    
    // Budget
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    if (minBudget) {
      newFilters.minBudget = minBudget;
      hasNewFilters = true;
    }
    if (maxBudget) {
      newFilters.maxBudget = maxBudget;
      hasNewFilters = true;
    }
    
    // Transaction type
    const transType = searchParams.get("transactionType");
    if (transType) {
      setTransactionType(transType);
    }
    
    // Apply new filters if any were found
    if (hasNewFilters) {
      // Keep existing filters that aren't being updated
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
    
    // Update sort parameter
    const sort = searchParams.get("sort");
    if (sort) {
      setSortBy(sort);
    }
  }, [location.search, selectedCity]);

  const handleFilterChange = (newFilters) => {
    console.log("Before filter change:", filters); // Debug log
    console.log("New filters being applied:", newFilters); // Debug log

    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        ...newFilters,
      };

      // For debugging
      console.log("Updated filters:", updatedFilters);

      return updatedFilters;
    });
  };

  // Debug effect to log when filters change
  useEffect(() => {
    console.log("Filters updated in App state:", filters);
  }, [filters]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  if (selectedProperty) {
    return (
      <div>
        <div className="fixed inset-0 bg-[#0a0f19] bg-opacity-50 z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0a0f19] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-white hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProperty.image}
                    alt={selectedProperty.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-gray-600 mt-2">
                      {selectedProperty.description}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="bg-[#0a0f19] p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Property Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium">{selectedProperty.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">BHK</p>
                        <p className="font-medium">{selectedProperty.bhk}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Area</p>
                        <p className="font-medium">
                          {selectedProperty.area} sq.ft
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-medium">{selectedProperty.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-medium">
                          {selectedProperty.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">{selectedProperty.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black pt-[10vh]">
      <div className="min-h-screen bg-gray-50 ">
        {showSearchBar && (
          <SearchBar
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onFilterChange={handleFilterChange}
            onOpenFilters={() => setShowFilters(true)}
            setProperties={setProperties}
            initialFilters={filters}
            transactionType={transactionType}
          />
        )}
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
          <div className="relative mb-6 sm:mb-8 pb-6">
            <style jsx>{`
              .custom-dots {
                bottom: -20px;
                display: flex !important;
                justify-content: center;
                gap: 4px;
                margin-top: 8px;
              }
              .custom-dots li {
                margin: 0;
              }
              .custom-dots li button {
                padding: 0;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                background: #e2e8f0;
                transition: all 0.3s ease;
              }
              .custom-dots li.slick-active button {
                width: 20px;
                background: #031273;
              }
              .slick-slide {
                transition: transform 0.3s ease;
              }
            `}</style>
            <Slider {...sliderSettings} className="px-2 sm:px-8 category-slider">
              {propertyCategories.map((category) => (
                <div key={category.id} className="px-1.5 sm:px-2.5 py-2">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex justify-between items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 transform ${
                      activeCategory === category.id
                        ? "bg-[#031273] text-nowrap text-white scale-105 shadow-md ring-2 ring-[#031273]/20"
                        : "text-gray-700 text-nowrap bg-white hover:bg-gray-50 hover:shadow hover:scale-105"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] inline-flex justify-center ${
                        activeCategory === category.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                </div>
              ))}
            </Slider>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-to-high">Price - Low to High</option>
                <option value="price-high-to-low">Price - High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div>
              <button
                className="px-4 py-2 text-white bg-[#031273] hover:bg-[#031273]/90 rounded-lg"
                onClick={() => handleFetchAllProperties()} 
              >
                Fetch All Properties
              </button>
            </div>
          </div>

          <PropertyCards
            propertyCategories={propertyCategories}
            selectedCity={selectedCity}
            properties={properties}
            setProperties={setProperties}
            filters={filters}
            sortBy={sortBy}
            activeCategory={activeCategory}
            favorites={favorites}
            onPropertyClick={handlePropertyClick}
            transactionType={transactionType}
          />
        </div>

        <FiltersPanel
          isVisible={showFilters}
          onClose={() => setShowFilters(false)}
          onApplyFilters={handleFilterChange}
          onVisibilityChange={(isVisible) => {
            setShowFilters(isVisible);
            setShowSearchBar(!isVisible);
          }}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </div>
    </div>
  );
}

export default PropertyListing;
