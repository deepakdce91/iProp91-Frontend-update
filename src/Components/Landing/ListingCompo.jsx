import { useEffect, useState, useRef } from "react";
import {
  Search,
  MapPin,
  Mic,
  TrendingUp,
  Calculator,
  LineChart,
  FileText,
  ListCheck,
  Map,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { Carousel } from "../listingpage/components/carousel";
import { PropertyCard } from "../listingpage/components/property-card";
import EnhancedMapComponent from "../MapComponent/EnhancedMapComponent";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Enhanced dummy data

const categories = [
  {
    title: "New Projects",
    description: "New Projects, ready to buy/rent.",
    image: "/images/propcat.jpg",
    link: "/property-listing",
    count: "15,800+ Properties",
    filters: {
      category: "new_projects",
    },
  },
  {
    title: "Property Resale",
    description: "Upcoming and ongoing projects",
    image: "/images/propcat.jpg",
    link: "/property-listing",
    count: "1,200+ Properties",
    filters: {
      category: "property_resale",
    },
  },

  {
    title: "Pre Launch Projects",
    description: "Upcoming pre-launch properties",
    image: "/images/propcat.jpg",
    link: "/property-listing",
    count: "1,500+ Properties",
    filters: {
      category: "pre_launch",
    },
  },
  {
    title: "Verified Owner Properties",
    description: "Direct from property owners",
    image: "/images/propcat.jpg",
    link: "/property-listing",
    count: "10,000+ Properties",
    filters: {
      category: "verified_owner",
    },
  },

  {
    title: "Upcoming Projects",
    description: "Soon to be launched properties",
    image: "/images/propcat.jpg",
    link: "/property-listing",
    count: "2,000+ Properties",
    filters: {
      category: "upcoming_projects",
    },
  },
];

const CategoryCarousel = ({ categories }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Create an array with duplicated cards for infinite effect
  const infiniteCategories = [...categories, ...categories, ...categories];

  // Calculate how many items to show and slide step
  const itemsToShow = isMobile ? 2 : categories.length;
  const slideStep = isMobile ? 2 : 1;

  const handleCategoryClick = (category) => {
    const searchParams = new URLSearchParams();

    // Add category filter
    if (category.filters.category) {
      searchParams.append("category", category.filters.category);
    }

    // Navigate to property-listing with filters
    navigate(`/property-listing?${searchParams.toString()}`);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(nextSlide, 3000);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + slideStep;
      if (newIndex >= categories.length) {
        // Reset to the beginning
        setTimeout(() => {
          setCurrentIndex(0);
          setIsTransitioning(false);
        }, 50);
        return 0;
      }
      setIsTransitioning(false);
      return newIndex;
    });
    resetTimer();
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - slideStep;
      if (newIndex < 0) {
        // Go to the last valid position
        const lastIndex =
          Math.floor((categories.length - 1) / slideStep) * slideStep;
        setTimeout(() => {
          setCurrentIndex(lastIndex);
          setIsTransitioning(false);
        }, 50);
        return lastIndex;
      }
      setIsTransitioning(false);
      return newIndex;
    });
    resetTimer();
  };

  useEffect(() => {
    if (!isPaused) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, isMobile]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out gap-4"
        style={{
          transform: isMobile
            ? `translateX(-${currentIndex * 50}%)`
            : `translateX(-${currentIndex * (100 / categories.length)}%)`,
          width: isMobile
            ? "100%"
            : `${infiniteCategories.length * (100 / categories.length)}%`,
        }}
      >
        {(isMobile ? categories : infiniteCategories).map((category, index) => (
          <motion.div
            key={`${category.title}-${index}`}
            className={
              isMobile
                ? "w-[60%] flex-shrink-0"
                : "w-[12%] md:w-[12%] lg:w-[10%] flex-shrink-0"
            }
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              onClick={() => handleCategoryClick(category)}
              className="block cursor-pointer"
            >
              <motion.div
                className="relative h-[35vh] rounded-xl overflow-hidden shadow-lg group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h3
                    className="text-white text-xl font-bold mb-1 group-hover:text-white/90"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.title}
                  </motion.h3>
                  <motion.p
                    className="text-white/80 text-sm mb-2 group-hover:text-white/70"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {(isMobile
          ? Array.from({ length: Math.ceil(categories.length / 2) })
          : categories
        ).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const newIndex = isMobile ? index * 2 : index;
              setCurrentIndex(newIndex);
              resetTimer();
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              (
                isMobile
                  ? Math.floor(currentIndex / 2) === index
                  : currentIndex % categories.length === index
              )
                ? "bg-white w-4"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ListingCompo = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [allFetchedProjects, setAllFetchedProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categorizedProjects, setCategorizedProjects] = useState({});
  const [location, setLocation] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  // const [citySuggestions, setCitySuggestions] = useState([]);
  // const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedBhkTypes, setSelectedBhkTypes] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMinPrice, setShowMinPrice] = useState(false);
  const [showMaxPrice, setShowMaxPrice] = useState(false);

  const [citySuggestions, setCitySuggestions] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Property type options - only residential now
  const propertyTypes = ["Flat", "House/Villa", "Plot"];

  // BHK options (will show after residential property selection)
  const bhkOptions = ["1 Bhk", "2 Bhk", "3 Bhk", "4 Bhk", "5 Bhk", "5+ Bhk"];

  // Budget options
  const minPriceOptions = [
    "₹5 Lac",
    "₹10 Lac",
    "₹20 Lac",
    "₹30 Lac",
    "₹40 Lac",
    "₹50 Lac",
    "₹60 Lac",
  ];
  const maxPriceOptions = [
    "₹10 Lac",
    "₹20 Lac",
    "₹30 Lac",
    "₹40 Lac",
    "₹50 Lac",
    "₹75 Lac",
    "₹1 Cr",
  ];

  // Handle property type selection
  const togglePropertyType = (type) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(
        selectedPropertyTypes.filter((item) => item !== type)
      );

      // If we unselect Flat or House/Villa and no other residential properties are selected,
      // hide BHK options and clear selections
      if (
        (type === "Flat" || type === "House/Villa") &&
        !selectedPropertyTypes.some(
          (item) => (item === "Flat" || item === "House/Villa") && item !== type
        )
      ) {
        setSelectedBhkTypes([]);
      }
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  // Handle BHK selection
  const toggleBhkType = (bhk) => {
    if (selectedBhkTypes.includes(bhk)) {
      setSelectedBhkTypes(selectedBhkTypes.filter((item) => item !== bhk));
    } else {
      setSelectedBhkTypes([...selectedBhkTypes, bhk]);
    }
  };

  // Handle price selection
  const selectMinPrice = (price) => {
    setMinPrice(price);
    setShowMinPrice(false);
  };

  const selectMaxPrice = (price) => {
    setMaxPrice(price);
    setShowMaxPrice(false);
  };

  // Check if BHK options should be displayed
  const shouldShowBhkOptions = selectedPropertyTypes.some(
    (type) => type === "Flat" || type === "House/Villa"
  );

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setShowPropertyDropdown(false);
    setShowBudgetDropdown(false);
    setShowMinPrice(false);
    setShowMaxPrice(false);
  };

  // Function to filter projects based on search criteria
  const filterProjects = () => {
    if (!allFetchedProjects) return;

    let filtered = [...allFetchedProjects];

    // Filter by active tab (availableFor)
    if (activeTab) {
      filtered = filtered.filter(
        (project) =>
          project.availableFor?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by city/location
    if (location) {
      filtered = filtered.filter((project) =>
        project.address?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by property type and subtype
    if (selectedPropertyTypes.length > 0) {
      filtered = filtered.filter((project) => {
        const matchesType = project.appartmentType?.some((type) =>
          selectedPropertyTypes.includes(type)
        );
        const matchesSubType = project.appartmentSubType?.some((subType) =>
          selectedPropertyTypes.includes(subType)
        );
        return matchesType || matchesSubType;
      });
    }

    // Filter by BHK
    if (selectedBhkTypes.length > 0) {
      filtered = filtered.filter((project) =>
        selectedBhkTypes.includes(project.bhk)
      );
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filtered = filtered.filter((project) => {
        const projectPrice = parseFloat(project.minimumPrice);
        const minPriceValue = minPrice
          ? parseFloat(minPrice.replace(/[₹,]/g, ""))
          : 0;
        const maxPriceValue = maxPrice
          ? parseFloat(maxPrice.replace(/[₹,]/g, ""))
          : Infinity;

        return projectPrice >= minPriceValue && projectPrice <= maxPriceValue;
      });
    }

    setFilteredProjects(filtered);

    // Update categorized projects
    if (filtered.length > 0) {
      const categorized = {
        pre_launch: filtered.filter(
          (project) => project.category === "pre_launch"
        ),
        verified_owner: filtered.filter(
          (project) => project.category === "verified_owner"
        ),
        property_resale: filtered.filter(
          (project) => project.category === "property_resale"
        ),
        upcoming_project: filtered.filter(
          (project) => project.category === "upcoming_project"
        ),
        new_sale: filtered.filter((project) => project.category === "new_sale"),
      };
      setCategorizedProjects(categorized);
    }
  };

  // Call filterProjects whenever search parameters change
  useEffect(() => {
    filterProjects();
  }, [
    location,
    selectedPropertyTypes,
    selectedBhkTypes,
    minPrice,
    maxPrice,
    activeTab,
    allFetchedProjects,
  ]);

  // Update the search button click handler
  const navigate = useNavigate();
  const handleSearch = () => {
    // Create search parameters object
    const searchParams = new URLSearchParams();

    // Add location if provided
    if (location) {
      searchParams.append("city", location);
    }

    // Add property types if selected
    if (selectedPropertyTypes.length > 0) {
      searchParams.append("types", selectedPropertyTypes.join(","));
    }

    // Add BHK types if selected
    if (selectedBhkTypes.length > 0) {
      searchParams.append("bhk", selectedBhkTypes.join(","));
    }

    // Add min price if selected
    if (minPrice) {
      searchParams.append("minPrice", minPrice.replace(/[₹,]/g, ""));
    }

    // Add max price if selected
    if (maxPrice) {
      searchParams.append("maxPrice", maxPrice.replace(/[₹,]/g, ""));
    }

    // Add active tab
    // searchParams.append("availableFor", activeTab);

    // Navigate to search-properties with the parameters
    navigate(`/property-listing?${searchParams.toString()}`);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchAllProjects`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const allProjects = await response.data;
        setAllFetchedProjects(allProjects);
        // toast.success("projects fetched successfully")
        console.log(allProjects);

        if (allProjects) {
          const categorized = {
            pre_launch: allProjects.filter(
              (project) => project.category === "pre_launch"
            ),
            verified_owner: allProjects.filter(
              (project) => project.category === "verified_owner"
            ),
            property_resale: allProjects.filter(
              (project) => project.category === "property_resale"
            ),
            upcoming_project: allProjects.filter(
              (project) => project.category === "upcoming_project"
            ),
            new_sale: allProjects.filter(
              (project) => project.category === "new_sale"
            ),
          };
          setCategorizedProjects(categorized);
        }
        return;
      }
      toast.error("Error fetching projects");
    };
    fetchProjects();
  }, []);

  const [showMap, setShowMap] = useState(false);

  const toggleMap = () => {
    // Navigate to search-properties without any filters
    navigate("/search-properties");
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/cities/unique`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data) {
          const cities = response.data.data;
          setAllCities(cities); // Store all cities
          setFilteredCities(cities); // Initialize filtered cities
          setCitySuggestions(cities); // Keep this for backward compatibility
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Replace the filterCities function with this:
  const filterCities = (input) => {
    if (!input || input.trim() === "") {
      // If input is empty, show all cities
      setFilteredCities(allCities);
      setShowCitySuggestions(true);
      return;
    }

    // Filter from allCities, not from the current filtered list
    const filtered = allCities.filter((city) =>
      city.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowCitySuggestions(true);
  };

  // Update the handleCitySelect function:
  const handleCitySelect = (selectedCity) => {
    setLocation(selectedCity);
    setShowCitySuggestions(false);
    // Reset filtered cities to all cities for next time
    setFilteredCities(allCities);
  };

  // Update the handleInputBlur function:
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for click on suggestion
    setTimeout(() => {
      setShowCitySuggestions(false);
    }, 200);
  };

  return (
    <main className="min-h-screen  relative bg-white py-10">
      {/* Hero Section with Enhanced Search */}
      <div className="relative ">
        {/* <img
        src="/images/lishero.jpg"
        alt="Property Hero"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      /> */}
        <div className=" flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl text-black font-bold mb-8 text-center">
            Find a home you'll love
          </h1>
          {!showMap && (
            <div className="w-full max-w-5xl mx-auto space-y-4 ">
              <div className="w-full   max-w-7xl mx-auto">
                <div className="flex  items-center max-md:pr-0 rounded-full border bg-white shadow-sm pr-3">
                  {/* Location Input */}
                  <div className="flex items-center px-4 max-sm:px-0 py-2 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Enter City"
                      className="w-full p-2 outline-none max-sm:p-0 max-sm:placeholder:text-sm"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        filterCities(e.target.value);
                      }}
                      onFocus={() => {
                        // When focusing, show suggestions based on current input
                        filterCities(location);
                        setShowCitySuggestions(true);
                      }}
                      onBlur={handleInputBlur}
                    />
                    {/* City Suggestions Dropdown */}
                    {showCitySuggestions && filteredCities.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
                        {filteredCities.map((city, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="max-md:hidden  relative w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300">
                    <div
                      className="flex items-center justify-between max-sm:px-0 px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setShowPropertyDropdown(!showPropertyDropdown);
                        setShowBudgetDropdown(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-black"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="text-gray-700">
                          {selectedPropertyTypes.length > 0
                            ? selectedPropertyTypes.join(", ")
                            : "Property Type"}
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          showPropertyDropdown ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Property Type Dropdown Content */}
                    {showPropertyDropdown && (
                      <div className="absolute max-sm:hidden top-full left-0 z-10 bg-white w-full lg:w-[150%] shadow-lg rounded-lg border border-gray-200 mt-1 py-2">
                        <div className="px-3 py-2">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Residential
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {propertyTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => togglePropertyType(type)}
                                className={`px-4 py-1 rounded-full text-sm ${
                                  selectedPropertyTypes.includes(type)
                                    ? "bg-gray-100 text-black border border-black"
                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* BHK Options (only show if Flat or House/Villa is selected) */}
                        {shouldShowBhkOptions && (
                          <div className="px-3 py-2 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              {bhkOptions.map((bhk) => (
                                <button
                                  key={bhk}
                                  onClick={() => toggleBhkType(bhk)}
                                  className={`px-4 py-1 rounded-full text-sm ${
                                    selectedBhkTypes.includes(bhk)
                                      ? "bg-gray-100 text-black border border-black"
                                      : "bg-gray-100 text-gray-800 border border-gray-300"
                                  }`}
                                >
                                  {bhk}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Budget Dropdown */}
                  <div className=" max-sm:hidden relative w-full md:w-1/3">
                    <div
                      className="flex items-center justify-between px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setShowBudgetDropdown(!showBudgetDropdown);
                        setShowPropertyDropdown(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-black"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092c-.647.19-1.23.51-1.633.919a.75.75 0 101.06 1.061c.213-.215.587-.38.933-.449v2.5a1.502 1.502 0 01-.21-.016 1.318 1.318 0 01-.67-.295.75.75 0 00-1.05 1.072c.37.369.988.65 1.72.765V11h.5v.9c.722.12 1.352.422 1.744.8a.75.75 0 101.102-1.016c-.309-.3-.764-.538-1.346-.653v-2.5a2.59 2.59 0 01.62.12c.304.108.548.274.719.445a.75.75 0 001.06-1.06c-.47-.47-1.156-.793-1.9-.945V5a1 1 0 10-2 0v.09z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {minPrice && maxPrice
                            ? `${minPrice} - ${maxPrice}`
                            : minPrice
                            ? `Min: ${minPrice}`
                            : maxPrice
                            ? `Max: ${maxPrice}`
                            : "Budget"}
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          showBudgetDropdown ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Budget Dropdown Content */}
                    {showBudgetDropdown && (
                      <div className="absolute top-full left-0 z-10 bg-white w-full lg:w-[110%] shadow-lg rounded-lg border border-gray-200 mt-1 py-2 px-3">
                        <div className="flex space-x-2 mb-4">
                          {/* Min Price Button */}
                          <div className="relative w-1/2">
                            <button
                              onClick={() => {
                                setShowMinPrice(!showMinPrice);
                                setShowMaxPrice(false);
                              }}
                              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:border-gray-400 focus:outline-none"
                            >
                              {minPrice || "Min Price"}
                            </button>

                            {/* Min Price Dropdown */}
                            {showMinPrice && (
                              <div className=" top-full left-0 z-20 w-full mt-1   max-h-48 overflow-y-auto">
                                {minPriceOptions.map((price) => (
                                  <div
                                    key={price}
                                    onClick={() => selectMinPrice(price)}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    {price}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Max Price Button */}
                          <div className="relative w-1/2">
                            <button
                              onClick={() => {
                                setShowMaxPrice(!showMaxPrice);
                                setShowMinPrice(false);
                              }}
                              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:border-gray-400 focus:outline-none"
                            >
                              {maxPrice || "Max Price"}
                            </button>

                            {/* Max Price Dropdown */}
                            {showMaxPrice && (
                              <div className=" top-full left-0 z-20 w-full mt-1  max-h-48 overflow-y-auto">
                                {maxPriceOptions.map((price) => (
                                  <div
                                    key={price}
                                    onClick={() => selectMaxPrice(price)}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    {price}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-black w-[6rem] max-sm:w-[30vw] hover:bg-black/80 text-white font-medium px-6 py-3 max-sm:px-0 max-sm:text-sm md:w-auto transition-colors rounded-full"
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="max-sm:hidden">Search</span>
                    </div>
                  </button>
                </div>

                {/* Overlay to close dropdowns when clicking outside */}
                {(showPropertyDropdown ||
                  showBudgetDropdown ||
                  showMinPrice ||
                  showMaxPrice) && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={handleClickOutside}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Categories */}
      {!showMap && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              We've got properties for everyone
            </h2>
            <Link
              href="/all-categories"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <CategoryCarousel categories={categories} />
        </section>
      )}

      <div className="mt-5">{showMap && <EnhancedMapComponent />}</div>
      <button
        onClick={toggleMap}
        className="px-4 py-3 sticky bottom-10 left-[45%] bg-black hover:bg-black/80 text-white rounded-xl"
      >
        {showMap ? (
          <p className="flex gap-2">
            Show List <ListCheck />
          </p>
        ) : (
          <p className="flex gap-2">
            Show Map <Map />
          </p>
        )}
      </button>
    </main>
  );
};

export default ListingCompo;
