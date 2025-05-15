import React, { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.jsx";
import FiltersPanel from "./components/FiltersPage.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCards from "./components/propertyCards.jsx";
import { useLocation } from "react-router-dom";
import MapComponent from "./components/MapComponent.jsx";
import Navbar from "../Landing/Navbar.jsx";

// Add this style fix function to ensure property cards are visible
const ensurePropertiesVisible = () => {
  // Create a style tag
  const style = document.createElement('style');
  style.setAttribute('id', 'properties-visibility-fix');
  style.textContent = `
    .property-cards-container {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
      z-index: 10 !important;
    }
    
    .property-card {
      visibility: visible !important;
      opacity: 1 !important;
      display: block !important;
    }
    
    /* Fix any potential z-index issues */
    .map-container {
      z-index: 5;
    }
  `;
  
  // Remove any existing fix
  const existingStyle = document.getElementById('properties-visibility-fix');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add the style to the head
  document.head.appendChild(style);
};

function App() {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(() => {
    // First check URL parameters
    const searchParams = new URLSearchParams(location.search);
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
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    if (state) urlFilters.state = state;
    if (city) urlFilters.city = city;

    // If URL has filters, use them
    if (Object.keys(urlFilters).length > 0) {
      return urlFilters;
    }

    // Otherwise, check localStorage
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
  const [selectedMapProperty, setSelectedMapProperty] = useState(null);
  const [mapProperties, setMapProperties] = useState([]);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [showNearby, setShowNearby] = useState(false);

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
    slidesToShow: 3,
    slidesToScroll: 2,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
  
  // Add CSS for responsive layout
  useEffect(() => {
    const styleId = 'map-layout-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        html, body, #root {
          height: 100%;
        }
        
        .map-container {
          position: sticky !important;
          height: 100% !important;
          width: 100% !important;
          z-index: 5;
        }
        
        @media (max-width: 639px) {
          .search-container {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            z-index: 20;
          }
          
          .property-list {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
            height: 60vh;
            overflow-y: auto;
            transition: transform 0.3s ease-out;
            z-index: 30;
            transform: translateY(0);
            padding-bottom: 50px;
          }
          
          .property-list.collapsed {
            transform: translateY(calc(100% - 80px));
          }
          
          .drag-handle {
            width: 40px;
            height: 5px;
            border-radius: 3px;
            background: #e0e0e0;
            margin: 10px auto;
            cursor: grab;
          }
          
          .map-container {
            height: calc(100vh - 76px) !important;
            position: fixed !important;
            left: 0;
            right: 0;
            z-index: 10;
            transition: height 0.3s ease-out;
          }
          
          .property-list.collapsed ~ .map-container {
            height: calc(100vh - 156px) !important;
          }
        }
        
        @media (min-width: 640px) and (max-width: 768px) {
          .search-container {
            position: sticky;
            top: 76px;
            left: 0;
            right: 0;
            z-index: 20;
          }
          
          .property-list {
            overflow-y: auto;
            max-height: calc(100vh - 230px);
          }
          
          .map-container {
            height: 40vh !important;
            position: sticky !important;
            top: 0;
          }
        }
        
        @media (min-width: 769px) {
          .property-list {
            overflow-y: auto;
            height: calc(100vh - 230px);
          }
          
          .map-container {
            height: calc(100vh - 156px) !important;
            position: sticky !important;
            top: 76px;
          }
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, []);

  // Update useEffect to handle URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("category");

    if (category) {
      // Map URL category to activeCategory
      const categoryMapping = {
        verified_owner: "verified",
        new_project: "new",
        ready_to_move: "ready",
        budget_homes: "budget",
        pre_launch: "prelaunch",
        new_sale: "sale",
        upcoming_project: "upcoming",
      };

      setActiveCategory(categoryMapping[category] || "all");
    }
  }, [location.search]);

  // Add useEffect to fetch properties
  useEffect(() => {
    // This is a placeholder. Replace with your actual API call
    const fetchProperties = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/projectDataMaster`);
        console.log("response in app.jsx" + response);
        const data = await response.json();
        
        // Add latitude and longitude if they don't exist
        const propertiesWithCoords = data.projects.map(property => ({
          ...property,
          latitude: property.coordinates[0] || 20.5937 + (Math.random() - 0.5) * 10,
          longitude: property.coordinates[1] || 78.9629 + (Math.random() - 0.5) * 10
        }));
        
        setProperties(propertiesWithCoords);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [filters, activeCategory, sortBy]);

  // Update useEffect to set mapProperties in window object with array coordinates
  useEffect(() => {
    // Add properties to window object so map component can access them
    window.mapProperties = properties.map(property => ({
      id: property.id,
      title: property.title || 'Property',
      price: property.price || 'Contact for price',
      location: property.location || 'Unknown location',
      // Format coordinates as [lat, lng] array for Leaflet
      coordinates: [
        property.latitude,
        property.longitude
      ]
    }));
  }, [properties]);

  // Add drag functionality for mobile view
  useEffect(() => {
    const handleDrag = () => {
      const propertyList = document.getElementById('mobile-property-list');
      const dragHandle = document.getElementById('drag-handle');
      
      if (!propertyList || !dragHandle) return;
      
      // Initialize in semi-collapsed state
      setTimeout(() => {
        propertyList.classList.add('collapsed');
      }, 500);
      
      let startY = 0;
      let currentY = 0;
      let initialHeight = 0;
      let isDragging = false;
      
      // Toggle collapsed state when clicking the handle
      dragHandle.addEventListener('click', (e) => {
        if (!isDragging) {
          propertyList.classList.toggle('collapsed');
        }
      });
      
      // Handle touch start
      dragHandle.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        initialHeight = propertyList.offsetHeight;
        propertyList.style.transition = 'none';
      });
      
      // Handle touch move
      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touchY = e.touches[0].clientY;
        currentY = touchY - startY;
        
        // Calculate the new transform value
        const translateY = Math.max(0, Math.min(currentY, window.innerHeight - 80));
        propertyList.style.transform = `translateY(${translateY}px)`;
      });
      
      // Handle touch end
      document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        propertyList.style.transition = 'transform 0.3s ease-out';
        
        // If dragged more than 30% down, collapse the panel
        if (currentY > window.innerHeight * 0.3) {
          propertyList.classList.add('collapsed');
        } else {
          propertyList.classList.remove('collapsed');
        }
        
        // Reset currentY
        currentY = 0;
      });
    };
    
    // Only initialize drag on mobile devices
    if (window.innerWidth < 640) {
      handleDrag();
    }
    
    return () => {
      // Cleanup event listeners if needed
      const dragHandle = document.getElementById('drag-handle');
      if (dragHandle) {
        dragHandle.removeEventListener('touchstart', () => {});
        document.removeEventListener('touchmove', () => {});
        document.removeEventListener('touchend', () => {});
      }
    };
  }, []);

  // Check for nearby properties from the map component
  useEffect(() => {
    const checkForNearbyProperties = () => {
      if (window.nearbyProperties && window.nearbyProperties.length > 0) {
        setNearbyProperties(window.nearbyProperties);
        // If we find nearby properties for the first time, show them
        if (window.nearbyProperties.length > 0 && !showNearby) {
          setShowNearby(true);
        }
      }
    };
    
    // Check for nearby properties every second
    const intervalId = setInterval(checkForNearbyProperties, 1000);
    
    return () => clearInterval(intervalId);
  }, [showNearby]);

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

  // Call the function to ensure properties are visible
  useEffect(() => {
    ensurePropertiesVisible();
    
    // Set a timeout to apply it again after a short delay
    // This handles cases where other scripts might be changing visibility
    const timer = setTimeout(() => {
      ensurePropertiesVisible();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

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
    <>
      {/* Navbar */}
      <Navbar />
      
      <div className="bg-black pt-[13vh]">
      <div className="min-h-screen bg-white">
        {/* Search Bar */}
        <div className="search-container z-20">
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
        </div>

        {/* Main content - Side by side layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Property listings */}
          <div className="w-full md:w-1/2 md:border-r border-gray-200">
            <div className="p-4 sm:block hidden">
              {/* Property Categories */}
              <div className="mb-4 bg-white rounded-xl shadow-sm p-1">
                <Slider {...sliderSettings} className="px-2 py-1">
                  {propertyCategories.map((category) => (
                    <div key={category.id} className="px-1">
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full min-w-max whitespace-nowrap flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                          activeCategory === category.id
                            ? "bg-[#031273] text-white shadow-sm"
                            : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <span className="whitespace-nowrap text-center">{category.label}</span>
                        <span
                          className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] ${
                            activeCategory === category.id
                              ? "bg-white/20"
                              : "bg-gray-200"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Sort and Filter Controls */}
              <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm">
                <div className="flex-1">
                  <select
                    className="w-full md:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="price-low-to-high">Sort: Price Low to High</option>
                    <option value="price-high-to-low">Sort: Price High to Low</option>
                    <option value="newest">Sort: Newest First</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1.5 ml-2 bg-[#031273] text-white rounded-lg px-3 py-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>

              {/* Nearby Properties Section */}
              {showNearby && nearbyProperties.length > 0 && (
                <div className="mb-4 bg-gradient-to-r from-teal-50 to-blue-50 p-3 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-semibold text-teal-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Nearby Properties
                    </h2>
                    <div className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">
                      {nearbyProperties.length} found
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nearbyProperties.slice(0, 2).map((property) => (
                      <div 
                        key={property.id || property.title} 
                        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handlePropertyClick(property)}
                      >
                        <div className="p-2">
                          <h3 className="font-semibold text-sm truncate">{property.title}</h3>
                          <p className="text-xs text-gray-600">{property.price}</p>
                          <p className="text-xs text-teal-600 mt-1">
                            {property.distance} km away
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {nearbyProperties.length > 2 && (
                    <button 
                      className="w-full mt-2 py-1.5 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
                      onClick={() => setActiveCategory('nearby')}
                    >
                      View all {nearbyProperties.length} nearby properties
                    </button>
                  )}
                </div>
              )}

              {/* Property Listings (non-mobile) */}
              <div className="property-list pb-8 sm:block hidden">
                <PropertyCards
                  filters={filters}
                  sortBy={sortBy}
                  activeCategory={activeCategory}
                  favorites={favorites}
                  onPropertyClick={handlePropertyClick}
                  onPropertySelect={setSelectedMapProperty}
                  nearbyProperties={nearbyProperties}
                  showNearby={showNearby && activeCategory === 'nearby'}
                />
              </div>
            </div>
          </div>

          {/* Right side - Map */}
          <div className="w-full md:w-1/2">
            <div className="map-container sticky top-0 md:top-20 h-[calc(100vh-156px)]">
              <MapComponent />
            </div>
          </div>
        </div>

        {/* Mobile draggable property list */}
        <div className="property-list max-sm:block hidden" id="mobile-property-list">
          <div className="drag-handle" id="drag-handle"></div>
          <div className="flex justify-between items-center px-4 py-1">
            <h2 className="text-sm font-medium text-gray-700">Available Properties</h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              {properties.length} properties
            </span>
          </div>
          <div className="p-4">
            {/* Mobile Property Categories */}
            <div className="mb-4 bg-white rounded-xl shadow-sm p-1">
              <Slider {...sliderSettings} className="px-2 py-1">
                {propertyCategories.map((category) => (
                  <div key={category.id} className="px-1">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full min-w-max whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                        activeCategory === category.id
                          ? "bg-[#031273] text-white shadow-sm"
                          : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <span className="whitespace-nowrap text-center">{category.label}</span>
                      <span
                        className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] ${
                          activeCategory === category.id
                            ? "bg-white/20"
                            : "bg-gray-200"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Mobile Sort and Filter Controls */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm">
              <div className="flex-1">
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="price-low-to-high">Sort: Price Low to High</option>
                  <option value="price-high-to-low">Sort: Price High to Low</option>
                  <option value="newest">Sort: Newest First</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-1.5 ml-2 bg-[#031273] text-white rounded-lg px-3 py-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>

            {/* Property Listings (mobile) */}
            <PropertyCards
              filters={filters}
              sortBy={sortBy}
              activeCategory={activeCategory}
              favorites={favorites}
              onPropertyClick={handlePropertyClick}
              onPropertySelect={setSelectedMapProperty}
              nearbyProperties={nearbyProperties}
              showNearby={showNearby && activeCategory === 'nearby'}
            />
          </div>
        </div>

        {/* Filters Panel */}
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
    </>
  );
}

export default App;
