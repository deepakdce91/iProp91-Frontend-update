import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Plus, Check, ArrowLeft, Search, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/goldTheme.css";

// The FiltersPanel component has been converted from a route to a component
// with improved animations using Framer Motion
export default function FiltersPanel({
  isVisible,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) {
  // Reference to the filters panel for detecting outside clicks
  const filtersPageRef = useRef(null);

  // Initialize filter states with provided values or defaults
  const [activeTab, setActiveTab] = useState(initialFilters.tab || "buy");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(
    initialFilters.propertyTypes || ["flat", "housevilla"]
  );
  const [selectedBhk, setSelectedBhk] = useState(
    initialFilters.bhk || ["2bhk", "3bhk"]
  );
  const [minBudget, setMinBudget] = useState(initialFilters.minBudget || "");
  const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget || "");
  // State for city selection
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(
    initialFilters.state || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    initialFilters.city || ""
  );
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState(
    initialFilters.localities
      ? initialFilters.localities.split(",")
      : []
  );

  // Additional filter states
  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    // Handle both string and array inputs for amenities
    if (!initialFilters.amenities) {
      return [];
    }
    // If it's already an array, use it directly
    if (Array.isArray(initialFilters.amenities)) {
      return initialFilters.amenities;
    }
    // If it's a string, split it
    return initialFilters.amenities.split(",");
  });
  const [selectedFurnishing, setSelectedFurnishing] = useState(
    initialFilters.furnishing || ""
  );
  const [selectedAge, setSelectedAge] = useState(initialFilters.age || "");
  const [selectedFloor, setSelectedFloor] = useState(
    initialFilters.floor || ""
  );
  const [selectedFacing, setSelectedFacing] = useState(
    initialFilters.facing || ""
  );
  const [selectedPossession, setSelectedPossession] = useState(
    initialFilters.possession || ""
  );
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState(
    initialFilters.constructionStatus || ""
  );

  // We'll use the main filtersPageRef for click outside detection

  // Refs for dropdown click outside detection
  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const handlePropertyTypeToggle = (type) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  const handleBhkToggle = (bhk) => {
    if (selectedBhk.includes(bhk)) {
      setSelectedBhk(selectedBhk.filter((b) => b !== bhk));
    } else {
      setSelectedBhk([...selectedBhk, bhk]);
    }
  };

  // Helper function to sort array by name - using useCallback to memoize the function
  const sortArrayByName = useCallback((array) => {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Function to fetch all states from API - using useCallback to memoize the function
  const fetchAllStates = useCallback(() => {
    axios
      .get("https://api.countrystatecity.in/v1/countries/IN/states", {
        headers: {
          "X-CSCAPI-KEY":
            "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
        },
      })
      .then((response) => {
        setStates(sortArrayByName(response.data));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [sortArrayByName]);

  // Function to fetch cities by state code - using useCallback to memoize the function
  const fetchCitiesByState = useCallback(
    (currentStateCode) => {
      axios
        .get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${currentStateCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY":
                "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
            },
          }
        )
        .then((response) => {
          setCities(sortArrayByName(response.data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    [sortArrayByName]
  );

  // Fetch states when dropdown is opened
  useEffect(() => {
    if (stateDropdownOpen && states.length === 0) {
      fetchAllStates();
    }
  }, [stateDropdownOpen, states.length, fetchAllStates]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      // Find the state code for the selected state
      const selectedStateObj = states.find(
        (state) => state.name === selectedState
      );

      if (selectedStateObj) {
        // Fetch cities for the selected state using its ISO code
        fetchCitiesByState(selectedStateObj.iso2);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [selectedState, states, fetchCitiesByState]);

  // Click outside handler for dropdowns and main component
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown clicks
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target)
      ) {
        setStateDropdownOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for closing the filters panel
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Main component click outside handler
  const handleMainClickOutside = useCallback((event) => {
    // Check if click is outside the main component
    if (
      filtersPageRef.current &&
      !filtersPageRef.current.contains(event.target)
    ) {
      // Close the filter panel
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener("mousedown", handleMainClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleMainClickOutside);
    };
  }, [handleMainClickOutside]);

  const handleStateSelect = (state) => {
    setSelectedState(state.name);
    setStateDropdownOpen(false);
    setSelectedCity(""); // Reset city when state changes
    setSelectedLocalities([]); // Reset localities when state changes
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    setCityDropdownOpen(false);
  };

  const handleLocalityToggle = (locality) => {
    if (selectedLocalities.includes(locality)) {
      setSelectedLocalities(selectedLocalities.filter((l) => l !== locality));
    } else {
      setSelectedLocalities([...selectedLocalities, locality]);
    }
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Handle furnishing selection
  const handleFurnishingChange = (furnishing) => {
    setSelectedFurnishing(furnishing);
  };

  // Handle property age selection
  const handleAgeChange = (age) => {
    setSelectedAge(age);
  };

  // Handle floor selection
  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
  };

  // Handle facing selection
  const handleFacingChange = (facing) => {
    setSelectedFacing(facing);
  };

  // Handle possession selection
  const handlePossessionChange = (possession) => {
    setSelectedPossession(possession);
  };

  // Construction status is not currently implemented in the UI
  // But we keep the handler for future use
  const handleConstructionStatusChange = (status) => {
    setSelectedConstructionStatus(status);
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    setSelectedPropertyTypes([]);
    setSelectedBhk([]);
    setMinBudget("");
    setMaxBudget("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedLocalities([]);
    setSelectedAmenities([]);
    setSelectedFurnishing("");
    setSelectedAge("");
    setSelectedFloor("");
    setSelectedFacing("");
    setSelectedPossession("");
    setSelectedConstructionStatus("");
  };

  // Handle apply button click - collect filter values and pass to parent
  const handleApplyFilters = () => {
    // Collect all filter values
    const filterValues = {
      tab: activeTab,
      propertyTypes: selectedPropertyTypes,
      bhk: selectedBhk,
      minBudget,
      maxBudget,
      city: selectedCity,
      state: selectedState,
      localities: selectedLocalities,
      amenities: selectedAmenities,
      furnishing: selectedFurnishing,
      age: selectedAge,
      floor: selectedFloor,
      facing: selectedFacing,
      possession: selectedPossession,
      constructionStatus: selectedConstructionStatus
    };

    // Pass filters to parent component
    if (onApplyFilters) {
      onApplyFilters(filterValues);
    }

    // Close the filter panel
    handleClose();
  };

  // handleClose is now defined above

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Blurred background overlay with gold tint */}
          <motion.div
            className="fixed inset-0 bg-transparent backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleClose} // Close when clicking outside
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 to-black/10"></div>
          </motion.div>

          {/* Filters panel */}
          <motion.div
            ref={filtersPageRef}
            className="bg-gradient-to-br from-gray-900 to-black min-h-screen max-h-screen font-sans w-4/5 md:w-2/3 lg:w-1/2 max-w-lg shadow-xl absolute left-0 top-0 z-50 text-white overflow-y-auto overflow-x-auto"
            initial={{ x: "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 1
            }}
          >
            {/* Header with back button */}
            <div className="border-b border-gold-500/30 sticky top-0 bg-black z-10">
              <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
                <motion.button
                  onClick={handleClose}
                  className="mr-4 p-1 rounded-full hover:bg-gray-800 text-gold-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={24} />
                </motion.button>
                <motion.h1
                  className="text-xl font-semibold text-gold-500"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Filters
                </motion.h1>

                <div className="ml-auto flex items-center gap-2">
                  <motion.button
                    onClick={clearAllFilters}
                    className="text-gray-400 bg-gray-800 hover:text-gold-500 px-3 py-2 rounded-lg font-medium text-sm border border-transparent hover:border-gold-500/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </motion.button>
                  <motion.button
                    onClick={handleApplyFilters}
                    className="bg-gold-600 hover:bg-gold-500 text-black px-4 py-2 rounded-lg font-medium shadow-lg shadow-gold-900/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="border-b border-gray-800">
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center overflow-x-auto">
                  <motion.div
                    className={`px-4 py-4 font-medium cursor-pointer whitespace-nowrap ${
                      activeTab === "buy"
                        ? "text-gold-500 border-b-2 border-gold-500"
                        : "text-gray-400 hover:text-gold-300"
                    }`}
                    onClick={() => setActiveTab("buy")}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    Buy
                  </motion.div>
                  <motion.div
                    className={`px-4 py-4 font-medium cursor-pointer whitespace-nowrap ${
                      activeTab === "rent"
                        ? "text-gold-500 border-b-2 border-gold-500"
                        : "text-gray-400 hover:text-gold-300"
                    }`}
                    onClick={() => setActiveTab("rent")}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    Rent
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <motion.div
              className="max-w-6xl mx-auto px-4 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* City/Localities Selection */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Select State/City
                </motion.div>

                {/* State Dropdown */}
                <div className="mb-4 relative" ref={stateDropdownRef}>
                  <motion.div
                    className="border border-gray-700 bg-gray-900 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-gold-500 transition-colors"
                    onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-gray-200">
                      {selectedState || "Select State"}
                    </div>
                    <motion.div
                      animate={{ rotate: stateDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-gold-500" />
                    </motion.div>
                  </motion.div>

                  {stateDropdownOpen && (
                    <motion.div
                      className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2 sticky top-0 bg-gray-900 border-b border-gray-700">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search states..."
                            className="w-full p-2 border border-gray-700 bg-gray-800 rounded-md pl-8 text-gray-200 placeholder-gray-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Search
                            size={16}
                            className="absolute left-2 top-3 text-gold-500"
                          />
                          {searchQuery && (
                            <X
                              size={16}
                              className="absolute right-2 top-3 text-gold-500 cursor-pointer hover:text-gold-400"
                              onClick={() => setSearchQuery("")}
                            />
                          )}
                        </div>
                      </div>
                      {states
                        .filter((state) =>
                          state.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((state) => (
                          <div
                            key={state.id}
                            className="p-3 hover:bg-gray-800 cursor-pointer flex items-center text-gray-200"
                            onClick={() => handleStateSelect(state)}
                          >
                            <span>{state.name}</span>
                            {selectedState === state.name && (
                              <Check
                                size={16}
                                className="ml-auto text-gold-500"
                              />
                            )}
                          </div>
                        ))}
                    </motion.div>
                  )}
                </div>

                {/* City Dropdown */}
                <div className="mb-4 relative" ref={cityDropdownRef}>
                  <motion.div
                    className={`border border-gray-700 bg-gray-900 rounded-lg p-3 flex justify-between items-center ${
                      selectedState
                        ? "cursor-pointer hover:border-gold-500 transition-colors"
                        : "opacity-60"
                    }`}
                    onClick={() =>
                      selectedState && setCityDropdownOpen(!cityDropdownOpen)
                    }
                    whileHover={selectedState ? { scale: 1.02 } : {}}
                    whileTap={selectedState ? { scale: 0.98 } : {}}
                  >
                    <div className="text-gray-200">
                      {selectedCity || "Select City"}
                    </div>
                    {selectedState && (
                      <motion.div
                        animate={{ rotate: cityDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} className="text-gold-500" />
                      </motion.div>
                    )}
                  </motion.div>

                  {cityDropdownOpen && (
                    <motion.div
                      className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2 sticky top-0 bg-gray-900 border-b border-gray-700">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search cities..."
                            className="w-full p-2 border border-gray-700 bg-gray-800 rounded-md pl-8 text-gray-200 placeholder-gray-400 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Search
                            size={16}
                            className="absolute left-2 top-3 text-gold-500"
                          />
                          {searchQuery && (
                            <X
                              size={16}
                              className="absolute right-2 top-3 text-gold-500 cursor-pointer hover:text-gold-400"
                              onClick={() => setSearchQuery("")}
                            />
                          )}
                        </div>
                      </div>
                      {cities
                        .filter((city) =>
                          city.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                        .map((city) => (
                          <div
                            key={city.id}
                            className="p-3 hover:bg-gray-800 cursor-pointer flex items-center text-gray-200"
                            onClick={() => handleCitySelect(city)}
                          >
                            <span>{city.name}</span>
                            {selectedCity === city.name && (
                              <Check
                                size={16}
                                className="ml-auto text-gold-500"
                              />
                            )}
                          </div>
                        ))}
                    </motion.div>
                  )}
                </div>

                {/* Selected Localities */}
                {selectedCity && (
                  <div className="mb-4">
                    <div className="text-gray-800 font-medium mb-2">
                      Localities
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* This is a simplified version. In a real app, you would fetch localities from an API */}
                      {[
                        "Central",
                        "North",
                        "South",
                        "East",
                        "West",
                        "Old Town",
                        "New Area",
                        "Downtown",
                      ].map((locality) => (
                        <div
                          key={locality}
                          onClick={() => handleLocalityToggle(locality)}
                          className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center
                      ${
                        selectedLocalities.includes(locality)
                          ? "bg-green-100 text-green-800"
                          : "border border-gray-300 text-gray-600"
                      }`}
                        >
                          {selectedLocalities.includes(locality) ? (
                            <Check size={14} className="mr-1" />
                          ) : (
                            <Plus size={14} className="mr-1" />
                          )}
                          {locality}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Filters Display */}
                {(selectedState ||
                  selectedCity ||
                  selectedLocalities.length > 0) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">
                      Selected Location Filters:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedState && (
                        <div className="bg-blue-50 text-blue-800 py-1 px-3 rounded-full text-xs flex items-center">
                          State: {selectedState}
                          <X
                            size={14}
                            className="ml-1 cursor-pointer"
                            onClick={() => {
                              setSelectedState("");
                              setSelectedCity("");
                              setSelectedLocalities([]);
                            }}
                          />
                        </div>
                      )}
                      {selectedCity && (
                        <div className="bg-blue-50 text-blue-800 py-1 px-3 rounded-full text-xs flex items-center">
                          City: {selectedCity}
                          <X
                            size={14}
                            className="ml-1 cursor-pointer"
                            onClick={() => {
                              setSelectedCity("");
                              setSelectedLocalities([]);
                            }}
                          />
                        </div>
                      )}
                      {selectedLocalities.map((locality) => (
                        <div
                          key={locality}
                          className="bg-gray-800 text-gold-400 py-1 px-3 rounded-full text-xs flex items-center border border-gold-500"
                        >
                          {locality}
                          <X
                            size={14}
                            className="ml-1 cursor-pointer text-gold-300 hover:text-gold-100"
                            onClick={() => handleLocalityToggle(locality)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Top Localities */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Top Localities
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Greenfield Colony
                  </div>
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Sector 88
                  </div>
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Sector 85
                  </div>
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Sector 89
                  </div>
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Sector 86
                  </div>
                  <div className="border border-gray-700 text-gray-300 py-2 px-4 rounded-full text-sm flex items-center hover:border-gold-500 hover:text-gold-300 transition-all duration-200">
                    <Plus size={14} className="mr-1" /> Sector 84
                  </div>
                </div>
              </div>

              {/* Budget Slider */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Budget
                </motion.div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className="relative w-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <select
                      className="appearance-none w-full border border-gray-700 bg-gray-900 rounded py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                    >
                      <option value="">Min</option>
                      <option value="500000">₹ 5 Lac</option>
                      <option value="1000000">₹ 10 Lac</option>
                      <option value="2000000">₹ 20 Lac</option>
                      <option value="3000000">₹ 30 Lac</option>
                      <option value="4000000">₹ 40 Lac</option>
                      <option value="5000000">₹ 50 Lac</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-3 text-gold-500"
                      size={16}
                    />
                  </motion.div>
                  <span className="text-gray-600">to</span>
                  <motion.div
                    className="relative w-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <select
                      className="appearance-none w-full border border-gray-700 bg-gray-900 rounded py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                    >
                      <option value="">Max</option>
                      <option value="5000000">₹ 50 Lac</option>
                      <option value="7500000">₹ 75 Lac</option>
                      <option value="10000000">₹ 1 Cr</option>
                      <option value="15000000">₹ 1.5 Cr</option>
                      <option value="20000000">₹ 2 Cr</option>
                      <option value="50000000">₹ 5 Cr</option>
                      <option value="100000000">₹ 10 Cr+</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-3 text-gold-500"
                      size={16}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg hover:text-gold-600 transition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Property Type
                </motion.div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  <div
                    className={`cursor-pointer rounded border transition-all duration-200 ${
                      selectedPropertyTypes.includes("flat")
                        ? "bg-gold-900/30 border-gold-500 shadow-md shadow-gold-900/20"
                        : "border-gray-700 hover:border-gold-600"
                    } 
              p-3 flex flex-col items-center justify-center text-center relative`}
                    onClick={() => handlePropertyTypeToggle("flat")}
                  >
                    {selectedPropertyTypes.includes("flat") && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-gold-500" />
                      </div>
                    )}
                    <div className="w-10 h-10 mb-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <line x1="2" y1="8" x2="22" y2="8" />
                        <line x1="12" y1="8" x2="12" y2="20" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm">Flat</div>
                  </div>

                  <div
                    className={`cursor-pointer rounded border transition-all duration-200 ${
                      selectedPropertyTypes.includes("housevilla")
                        ? "bg-gold-900/30 border-gold-500 shadow-md shadow-gold-900/20"
                        : "border-gray-700 hover:border-gold-600"
                    } 
              p-3 flex flex-col items-center justify-center text-center relative`}
                    onClick={() => handlePropertyTypeToggle("housevilla")}
                  >
                    {selectedPropertyTypes.includes("housevilla") && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-gold-500" />
                      </div>
                    )}
                    <div className="w-10 h-10 mb-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm">House/Villa</div>
                  </div>

                  <div
                    className={`cursor-pointer rounded border transition-all duration-200 ${
                      selectedPropertyTypes.includes("plot")
                        ? "bg-gold-900/30 border-gold-500 shadow-md shadow-gold-900/20"
                        : "border-gray-700 hover:border-gold-600"
                    } 
              p-3 flex flex-col items-center justify-center text-center relative`}
                    onClick={() => handlePropertyTypeToggle("plot")}
                  >
                    {selectedPropertyTypes.includes("plot") && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-gold-500" />
                      </div>
                    )}
                    <div className="w-10 h-10 mb-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M4 12h16" />
                        <path d="M12 4v16" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm">Plot/Land</div>
                  </div>

                  <div
                    className={`cursor-pointer rounded border transition-all duration-200 ${
                      selectedPropertyTypes.includes("office")
                        ? "bg-gold-900/30 border-gold-500 shadow-md shadow-gold-900/20"
                        : "border-gray-700 hover:border-gold-600"
                    } 
              p-3 flex flex-col items-center justify-center text-center relative`}
                    onClick={() => handlePropertyTypeToggle("office")}
                  >
                    {selectedPropertyTypes.includes("office") && (
                      <div className="absolute top-2 right-2">
                        <Check size={16} className="text-gold-500" />
                      </div>
                    )}
                    <div className="w-10 h-10 mb-2 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      >
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="16" y2="10" />
                        <line x1="8" y1="14" x2="16" y2="14" />
                        <line x1="8" y1="18" x2="16" y2="18" />
                      </svg>
                    </div>
                    <div className="text-xs sm:text-sm">Office Space</div>
                  </div>
                </div>
              </div>

              {/* BHK Selection */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  BHK
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("1bhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("1bhk")}
                  >
                    {selectedBhk.includes("1bhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    1 BHK
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("2bhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("2bhk")}
                  >
                    {selectedBhk.includes("2bhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    2 BHK
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("3bhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("3bhk")}
                  >
                    {selectedBhk.includes("3bhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    3 BHK
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("4bhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("4bhk")}
                  >
                    {selectedBhk.includes("4bhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    4 BHK
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("5bhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("5bhk")}
                  >
                    {selectedBhk.includes("5bhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    5 BHK
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedBhk.includes("5plusbhk")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleBhkToggle("5plusbhk")}
                  >
                    {selectedBhk.includes("5plusbhk") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    5+ BHK
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Amenities
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedAmenities.includes("parking")
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleAmenityToggle("parking")}
                  >
                    {selectedAmenities.includes("parking") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Parking
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("lift")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("lift")}
                  >
                    {selectedAmenities.includes("lift") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Lift
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("power_backup")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("power_backup")}
                  >
                    {selectedAmenities.includes("power_backup") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Power Backup
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("security")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("security")}
                  >
                    {selectedAmenities.includes("security") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Security
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("swimming_pool")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("swimming_pool")}
                  >
                    {selectedAmenities.includes("swimming_pool") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Swimming Pool
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("gym")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("gym")}
                  >
                    {selectedAmenities.includes("gym") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Gym
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("garden")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("garden")}
                  >
                    {selectedAmenities.includes("garden") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Garden
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("clubhouse")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("clubhouse")}
                  >
                    {selectedAmenities.includes("clubhouse") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Clubhouse
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("kids_play_area")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("kids_play_area")}
                  >
                    {selectedAmenities.includes("kids_play_area") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Kids Play Area
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAmenities.includes("rainwater_harvesting")
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAmenityToggle("rainwater_harvesting")}
                  >
                    {selectedAmenities.includes("rainwater_harvesting") ? (
                      <Check size={14} className="mr-1" />
                    ) : (
                      <Plus size={14} className="mr-1" />
                    )}{" "}
                    Rainwater Harvesting
                  </div>
                </div>
              </div>

              {/* Furnishing Status */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Furnishing Status
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedFurnishing === "unfurnished"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleFurnishingChange("unfurnished")}
                  >
                    {selectedFurnishing === "unfurnished" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Unfurnished
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFurnishing === "semi_furnished"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFurnishingChange("semi_furnished")}
                  >
                    {selectedFurnishing === "semi_furnished" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Semi-Furnished
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFurnishing === "fully_furnished"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFurnishingChange("fully_furnished")}
                  >
                    {selectedFurnishing === "fully_furnished" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Fully Furnished
                  </div>
                </div>
              </div>

              {/* Property Age */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Property Age
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedAge === "under_construction"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleAgeChange("under_construction")}
                  >
                    {selectedAge === "under_construction" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Under Construction
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAge === "new"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAgeChange("new")}
                  >
                    {selectedAge === "new" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Newly Built
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAge === "less_than_5"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAgeChange("less_than_5")}
                  >
                    {selectedAge === "less_than_5" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Less than 5 years
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAge === "5_to_10"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAgeChange("5_to_10")}
                  >
                    {selectedAge === "5_to_10" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    5-10 years
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedAge === "above_10"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleAgeChange("above_10")}
                  >
                    {selectedAge === "above_10" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Above 10 years
                  </div>
                </div>
              </div>

              {/* Floor Preference */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Floor Preference
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedFloor === "ground"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleFloorChange("ground")}
                  >
                    {selectedFloor === "ground" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Ground Floor
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFloor === "1_to_3"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFloorChange("1_to_3")}
                  >
                    {selectedFloor === "1_to_3" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    1-3 Floor
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFloor === "4_to_8"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFloorChange("4_to_8")}
                  >
                    {selectedFloor === "4_to_8" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    4-8 Floor
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFloor === "above_8"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFloorChange("above_8")}
                  >
                    {selectedFloor === "above_8" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Above 8 Floor
                  </div>
                </div>
              </div>

              {/* Facing Direction */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Facing Direction
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedFacing === "north"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleFacingChange("north")}
                  >
                    {selectedFacing === "north" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    North
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFacing === "south"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFacingChange("south")}
                  >
                    {selectedFacing === "south" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    South
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFacing === "east"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFacingChange("east")}
                  >
                    {selectedFacing === "east" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    East
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFacing === "west"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFacingChange("west")}
                  >
                    {selectedFacing === "west" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    West
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFacing === "north_east"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFacingChange("north_east")}
                  >
                    {selectedFacing === "north_east" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    North-East
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedFacing === "south_east"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handleFacingChange("south_east")}
                  >
                    {selectedFacing === "south_east" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    South-East
                  </div>
                </div>
              </div>

              {/* Possession Status */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Possession Status
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedPossession === "ready_to_move"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handlePossessionChange("ready_to_move")}
                  >
                    {selectedPossession === "ready_to_move" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Ready to Move
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedPossession === "within_3_months"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handlePossessionChange("within_3_months")}
                  >
                    {selectedPossession === "within_3_months" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Within 3 Months
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedPossession === "3_to_6_months"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handlePossessionChange("3_to_6_months")}
                  >
                    {selectedPossession === "3_to_6_months" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    3-6 Months
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedPossession === "after_6_months"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() => handlePossessionChange("after_6_months")}
                  >
                    {selectedPossession === "after_6_months" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    After 6 Months
                  </div>
                </div>
              </div>

              {/* Construction Status */}
              <div className="mb-8">
                <motion.div
                  className="text-gold-500 font-medium mb-3 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Construction Status
                </motion.div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center transition-all duration-200 
                ${
                  selectedConstructionStatus === "new_launch"
                    ? "bg-gold-500 text-black font-medium shadow-md shadow-gold-900/20"
                    : "border border-gray-700 text-gray-300 hover:border-gold-500 hover:text-gold-300"
                }`}
                    onClick={() => handleConstructionStatusChange("new_launch")}
                  >
                    {selectedConstructionStatus === "new_launch" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    New Launch
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedConstructionStatus === "under_construction"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() =>
                      handleConstructionStatusChange("under_construction")
                    }
                  >
                    {selectedConstructionStatus === "under_construction" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Under Construction
                  </div>
                  <div
                    className={`cursor-pointer py-2 px-4 rounded-full text-sm flex items-center 
                ${
                  selectedConstructionStatus === "ready_to_move"
                    ? "bg-green-100 text-green-800"
                    : "border border-gray-300 text-gray-600"
                }`}
                    onClick={() =>
                      handleConstructionStatusChange("ready_to_move")
                    }
                  >
                    {selectedConstructionStatus === "ready_to_move" ? (
                      <Check size={14} className="mr-1" />
                    ) : null}{" "}
                    Ready to Move
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
