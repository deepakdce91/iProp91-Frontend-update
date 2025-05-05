import { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.jsx";
import FiltersPanel from "./components/FiltersPage.jsx";
import PropertyCard from "./components/PropertyCard.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCards from "./components/propertyCards.jsx";

function PropertyListing() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("propertyFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [propertyCategories] = useState([
    { id: "all", label: "All Properties", count: 0 },
    { id: "owner", label: "Owner's Property", count: 0 },
    { id: "new", label: "New Projects", count: 0 },
    { id: "ready", label: "Ready to Move", count: 0 },
    { id: "budget", label: "Budget Homes", count: 0 },
    { id: "prelaunch", label: "Pre Launch Homes", count: 0 },
    { id: "verified", label: "Verified Owner Properties", count: 0 },
    { id: "sale", label: "New Sale Properties", count: 0 },
    { id: "upcoming", label: "Upcoming Projects", count: 0 },
  ]);
  const [selectedState, setSelectedState] = useState(() => {
    const savedState = localStorage.getItem("selectedState");
    return savedState ? JSON.parse(savedState) : null;
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    const savedCity = localStorage.getItem("selectedCity");
    return savedCity ? JSON.parse(savedCity) : null;
  });

  console.log("filters in app.jsx" + filters);

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-[#031273] transition-colors"
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
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-[#031273] transition-colors"
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

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
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
                  <div className="bg-gray-50 p-4 rounded-lg">
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
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onFilterChange={handleFilterChange}
            onOpenFilters={() => setShowFilters(true)}
          />
        )}
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
          <div className="relative mb-4 sm:mb-6 pb-2">
            <Slider {...sliderSettings} className="px-2 sm:px-8">
              {propertyCategories.map((category) => (
                <div key={category.id} className="px-1 sm:px-2">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? "bg-[#031273] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {category.label}
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                        activeCategory === category.id
                          ? "bg-white/20"
                          : "bg-gray-100"
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
          </div>

          <PropertyCards
            filters={filters}
            sortBy={sortBy}
            activeCategory={activeCategory}
            favorites={favorites}
            onPropertyClick={handlePropertyClick}
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
