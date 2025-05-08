import { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.jsx";
import FiltersPanel from "./components/FiltersPage.jsx";
import PropertyCard from "./components/PropertyCard.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCards from "./components/propertyCards.jsx";
import axios from "axios";

function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Load initial properties when component mounts
  useEffect(() => {
    const loadInitialProperties = async () => {
      try {
        // First check if we have stored properties
        const storedProperties = localStorage.getItem("initialProperties");
        const userCity = localStorage.getItem("userCity");
        const userState = localStorage.getItem("userState");

        if (storedProperties) {
          // If we have stored properties, use them
          setProperties(JSON.parse(storedProperties));
          setIsLoading(false);
        } else if (userCity && userState) {
          // If we have location but no properties, fetch them
          const response = await axios.get(
            `https://iprop91new.onrender.com/api/projectsDataMaster?city=${encodeURIComponent(
              userCity
            )}&state=${encodeURIComponent(userState)}`
          );

          if (response.data?.data?.projects) {
            setProperties(response.data.data.projects);
            localStorage.setItem(
              "initialProperties",
              JSON.stringify(response.data.data.projects)
            );
          }
        } else {
          // If no location data, fetch properties for default location (e.g., Delhi)
          const response = await axios.get(
            "https://iprop91new.onrender.com/api/projectsDataMaster?city=Delhi&state=Delhi"
          );

          if (response.data?.data?.projects) {
            setProperties(response.data.data.projects);
          }
        }
      } catch (error) {
        console.error("Error loading initial properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProperties();
  }, []);

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

  const handleSearch = async (searchParams) => {
    try {
      setIsLoading(true);
      console.log("Search params:", searchParams);

      // Destructure all filter parameters
      const {
        state,
        stateCode,
        city,
        propertyType,
        bhk,
        minBudget,
        maxBudget,
        amenities,
        furnishing,
        age,
        floor,
        facing,
        possession,
        constructionStatus,
        localities,
      } = searchParams;

      // Create query parameters object
      const queryParams = {
        state: state || "",
        stateCode: stateCode || "",
        city: city || "",
        propertyType: propertyType?.join(",") || "",
        bhk: bhk?.join(",") || "",
        minBudget: minBudget || "",
        maxBudget: maxBudget || "",
        amenities: amenities?.join(",") || "",
        furnishing: furnishing || "",
        age: age || "",
        floor: floor || "",
        facing: facing || "",
        possession: possession || "",
        constructionStatus: constructionStatus || "",
        localities: localities || "",
      };

      // Remove empty parameters
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      console.log("Query parameters:", queryParams);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster`,
        {
          params: queryParams,
        }
      );

      console.log("Search response:", response.data);
      if (response.data?.data?.projects) {
        setProperties(response.data.data.projects);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error searching properties:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedProperty) {
    return (
      <div className="bg-black pt-[10vh]">
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
    <div className="min-h-screen bg-gray-50">
      {showSearchBar && (
        <div className="sticky top-0 z-50 bg-white shadow-md">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onOpenFilters={() => setShowFilters(true)}
            selectedState={selectedState}
            selectedCity={selectedCity}
            setSelectedState={setSelectedState}
            setSelectedCity={setSelectedCity}
          />
        </div>
      )}

      <FiltersPanel
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleFilterChange}
        initialFilters={filters}
      />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Slider {...sliderSettings}>
                {propertyCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`px-4 py-2 cursor-pointer ${
                      activeCategory === category.id
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.label}
                  </div>
                ))}
              </Slider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={favorites.includes(property._id)}
                  onFavoriteToggle={() => {
                    setFavorites((prev) =>
                      prev.includes(property._id)
                        ? prev.filter((id) => id !== property._id)
                        : [...prev, property._id]
                    );
                  }}
                  onClick={() => handlePropertyClick(property)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
