import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Plus, Check, ArrowLeft, X } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/goldTheme.css";
import { FaTimes, FaCheck } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

// The FiltersPanel component has been converted from a route to a component
// with improved animations using Framer Motion
export default function FiltersPanel({
  isVisible,
  onClose,
  onApplyFilters,
  initialFilters = {},
  onVisibilityChange,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) {
  // Reference to the filters panel for detecting outside clicks
  const filtersPageRef = useRef(null);

  // Initialize filter states with provided values or defaults
  const [activeTab, setActiveTab] = useState(initialFilters.tab || "buy");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(
    (
      initialFilters.propertyType ||
      initialFilters.propertyTypes || ["flat", "house/villa"]
    ).map((t) => t.toLowerCase())
  );
  const [selectedBhk, setSelectedBhk] = useState(
    initialFilters.bhk ? initialFilters.bhk.map((b) => b.toLowerCase()) : []
  );
  const [minBudget, setMinBudget] = useState(initialFilters.minBudget || "");
  const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget || "");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState(
    initialFilters.localities ? initialFilters.localities.split(",") : []
  );

  // Additional filter states
  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    if (!initialFilters.amenities) {
      return [];
    }
    if (Array.isArray(initialFilters.amenities)) {
      return initialFilters.amenities;
    }
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

  // Refs for dropdown click outside detection
  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const handlePropertyTypeToggle = (type, event) => {
    if (event) event.stopPropagation();
    const normalizedType = type.toLowerCase();
    setSelectedPropertyTypes((prev) => {
      if (prev.includes(normalizedType)) {
        return prev.filter((t) => t !== normalizedType);
      }
      return [...prev, normalizedType];
    });
  };

  const handleBhkToggle = (bhk, event) => {
    if (event) event.stopPropagation();
    const normalizedBhk = bhk.toLowerCase();
    setSelectedBhk((prev) => {
      if (prev.includes(normalizedBhk)) {
        return prev.filter((b) => b !== normalizedBhk);
      }
      return [...prev, normalizedBhk];
    });
  };

  // Helper function to sort array by name - using useCallback to memoize the function
  const sortArrayByName = useCallback((array) => {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // API key for the location API
  const API_KEY = "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==";

  // Standardize BHK format
  const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"];
  const PROPERTY_TYPE_OPTIONS = [
    "Flat",
    "House/Villa",
    "Plot/Land",
    "Office Space",
  ];

  // Function to fetch all states from API
  const fetchAllStates = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.countrystatecity.in/v1/countries/IN/states",
        {
          headers: {
            "X-CSCAPI-KEY": API_KEY,
          },
          timeout: 8000,
        }
      );

      if (response.data && response.data.length > 0) {
        const sortedStates = sortArrayByName(response.data);
        setStates(sortedStates);

        // If a state was provided in initialFilters, select it
        if (initialFilters.state && !selectedState) {
          const matchedState = sortedStates.find(
            (state) =>
              state.name.toLowerCase() === initialFilters.state.toLowerCase()
          );
          if (matchedState) {
            setSelectedState(matchedState);
          }
        }
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  }, [sortArrayByName, initialFilters.state, selectedState, setSelectedState]);

  // Function to fetch cities by state code
  const fetchCitiesByState = useCallback(
    async (currentStateCode) => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${currentStateCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY": API_KEY,
            },
            timeout: 8000,
          }
        );

        if (response.data && response.data.length > 0) {
          const sortedCities = sortArrayByName(response.data);
          setCities(sortedCities);

          // If a city was provided in initialFilters, select it
          if (initialFilters.city && !selectedCity) {
            const matchedCity = sortedCities.find(
              (city) =>
                city.name.toLowerCase() === initialFilters.city.toLowerCase()
            );
            if (matchedCity) {
              setSelectedCity(matchedCity);
            }
          }
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    },
    [sortArrayByName, initialFilters.city, selectedCity, setSelectedCity]
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
      const selectedStateObj = states.find(
        (state) => state.name === selectedState.name
      );
      if (selectedStateObj) {
        fetchCitiesByState(selectedStateObj.iso2);
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
    }
  }, [selectedState, states, fetchCitiesByState]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  // Log initial filters for debugging
  useEffect(() => {
    console.log("Initial filters:", initialFilters);
    if (
      initialFilters.propertyType ||
      initialFilters.state ||
      initialFilters.city
    ) {
      console.log("Filters present in initialization");
    }
  }, [initialFilters]);

  // Handler for closing the filters panel
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Main click outside handler
  const handleMainClickOutside = useCallback(
    (event) => {
      if (
        filtersPageRef.current &&
        !filtersPageRef.current.contains(event.target)
      ) {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleMainClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleMainClickOutside);
    };
  }, [handleMainClickOutside]);

  const handleStateSelect = (state) => {
    setSelectedState(state); // store the whole state object
    setStateDropdownOpen(false);
    setSelectedCity(null); // Reset city when state changes
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city); // store the whole city object
    setCityDropdownOpen(false);
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity, event) => {
    if (event) event.stopPropagation();
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      }
      return [...prev, amenity];
    });
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

  // Handle apply button click - collect filter values and pass to parent
  const handleApplyFilters = () => {
    // Collect all filter values, preserving types and formats expected by the API
    const filterValues = {
      tab: activeTab,
      propertyType: selectedPropertyTypes, // Array of property types
      bhk: selectedBhk, // Array of BHK options
      minBudget: minBudget, // String value
      maxBudget: maxBudget, // String value
      city: selectedCity ? selectedCity.name : "",
      state: selectedState ? selectedState.name : "", // Use state name for API
      stateCode: selectedState ? selectedState.iso2 : "", // Include state code if needed
      localities:
        selectedLocalities.length > 0 ? selectedLocalities.join(",") : "",
      amenities: selectedAmenities, // Array of amenities
      furnishing: selectedFurnishing,
      age: selectedAge,
      floor: selectedFloor,
      facing: selectedFacing,
      possession: selectedPossession,
      constructionStatus: selectedConstructionStatus,
    };

    console.log("FiltersPage applying filters:", filterValues); // For debugging

    // Pass filters to parent component
    if (onApplyFilters) {
      onApplyFilters(filterValues);
    }

    // Close the filter panel
    handleClose();
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    setActiveTab("buy");
    setSelectedPropertyTypes(["flat", "house/villa"]);
    setSelectedBhk([]);
    setMinBudget("");
    setMaxBudget("");
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedLocalities([]);
    setSelectedAmenities([]);
    setSelectedFurnishing("");
    setSelectedAge("");
    setSelectedFloor("");
    setSelectedFacing("");
    setSelectedPossession("");
    setSelectedConstructionStatus("");

    // Apply cleared filters immediately if callback exists
    if (onApplyFilters) {
      onApplyFilters({
        tab: "buy",
        propertyType: ["flat", "house/villa"],
        bhk: [],
        minBudget: "",
        maxBudget: "",
        city: "",
        state: "",
        stateCode: "",
        localities: "",
        amenities: [],
        furnishing: "",
        age: "",
        floor: "",
        facing: "",
        possession: "",
        constructionStatus: "",
      });
    }
  };

  // Add effect to notify parent about visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  // Filter states based on search
  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={filtersPageRef}
          className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 overflow-y-auto"
          initial={{ x: "100%" }} // Start from the right
          animate={{ x: 0 }}
          exit={{ x: "100%" }} // Exit to the right
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#031273]">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            {/* Property Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Property Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PROPERTY_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={(e) => handlePropertyTypeToggle(type, e)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedPropertyTypes.includes(type.toLowerCase())
                        ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                        : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* BHK Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                BHK Type
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {BHK_OPTIONS.map((bhk) => (
                  <button
                    key={bhk}
                    onClick={(e) => handleBhkToggle(bhk, e)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedBhk.includes(bhk.toLowerCase())
                        ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                        : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                    }`}
                  >
                    {bhk}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Budget
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Min Budget
                  </label>
                  <input
                    type="text"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="₹"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#031273] focus:ring-2 focus:ring-[#031273]/20 outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Max Budget
                  </label>
                  <input
                    type="text"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="₹"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#031273] focus:ring-2 focus:ring-[#031273]/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Location
              </h3>
              <div className="space-y-4">
                {/* State */}
                <div className="relative" ref={stateDropdownRef}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-[#031273] text-lg" />
                  </div>
                  <button
                    onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                      selectedState
                        ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                        : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                    }`}
                  >
                    {selectedState ? selectedState.name : "Select State"}
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </button>
                  {stateDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                      <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search states..."
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#031273]/20"
                        />
                      </div>
                      {filteredStates.map((state) => (
                        <button
                          key={state.iso2}
                          onClick={() => handleStateSelect(state)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          {state.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="relative" ref={cityDropdownRef}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-[#031273] text-lg" />
                  </div>
                  <button
                    onClick={() =>
                      selectedState && setCityDropdownOpen(!cityDropdownOpen)
                    }
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                      selectedCity
                        ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                        : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                    } ${!selectedState ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!selectedState}
                  >
                    {selectedCity ? selectedCity.name : "Select City"}
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </button>
                  {cityDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                      <div className="sticky top-0 bg-white p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search cities..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#031273]/20"
                        />
                      </div>
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Gym",
                  "Swimming Pool",
                  "Garden",
                  "Power Backup",
                  "Lift",
                  "Security",
                  "Club House",
                  "Children's Play Area",
                ].map((amenity) => (
                  <button
                    key={amenity}
                    onClick={(e) => handleAmenityToggle(amenity, e)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedAmenities.includes(amenity)
                        ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                        : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Additional Filters
              </h3>

              {/* Furnishing Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Furnishing Status
                </label>
                <div className="flex gap-3">
                  {["Unfurnished", "Semi-Furnished", "Fully Furnished"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleFurnishingChange(status)}
                        className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          selectedFurnishing === status
                            ? "border-[#031273] bg-[#031273]/5 text-[#031273]"
                            : "border-gray-200 text-gray-600 hover:border-[#031273]/50"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Property Age */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Property Age
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#031273] focus:ring-2 focus:ring-[#031273]/20 outline-none transition-all"
                >
                  <option value="">Any</option>
                  <option value="0-1">Under Construction</option>
                  <option value="1-5">1-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>

              {/* Floor */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Floor
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#031273] focus:ring-2 focus:ring-[#031273]/20 outline-none transition-all"
                >
                  <option value="">Any</option>
                  <option value="ground">Ground Floor</option>
                  <option value="1-5">1-5 Floor</option>
                  <option value="5-10">5-10 Floor</option>
                  <option value="10+">10+ Floor</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
              <div className="flex gap-4">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 p-4 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 p-4 rounded-xl bg-[#031273] text-white font-medium hover:bg-[#031273]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheck className="text-lg" />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
