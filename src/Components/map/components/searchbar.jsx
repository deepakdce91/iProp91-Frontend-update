import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Sliders } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function SearchBar({ search, onFilterChange, onOpenFilters }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Memoize searchParams to prevent unnecessary re-renders
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // State for location selection
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is active
  const [stateSearchQuery, setStateSearchQuery] = useState(""); // Add state for search input
  const [citySearchQuery, setCitySearchQuery] = useState(""); // Add state for city search input

  // State for filters
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(
    searchParams.get("propertyTypes")
      ? searchParams.get("propertyTypes").split(",")
      : []
  );
  const [selectedBhk, setSelectedBhk] = useState(
    searchParams.get("bhk") ? searchParams.get("bhk").split(",") : []
  );
  const [minBudget, setMinBudget] = useState(
    searchParams.get("minBudget") || ""
  );
  const [maxBudget, setMaxBudget] = useState(
    searchParams.get("maxBudget") || ""
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get("amenities")
      ? searchParams.get("amenities").split(",")
      : []
  );
  const [selectedFurnishing, setSelectedFurnishing] = useState(
    searchParams.get("furnishing") || ""
  );
  const [selectedAge, setSelectedAge] = useState(searchParams.get("age") || "");
  const [selectedFloor, setSelectedFloor] = useState(
    searchParams.get("floor") || ""
  );

  // Dropdown states for filters - this is unused, we're using activeDropdown instead
  // const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] = useState(false);

  // Helper function to sort array by name - memoized to prevent dependency issues
  const sortArrayByName = useCallback((array) => {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Function to fetch all states from API - using useCallback to avoid recreation on each render
  const fetchAllStates = useCallback(async () => {
    try {
      console.log("Fetching states from API...");
      const response = await axios.get(
        "https://api.countrystatecity.in/v1/countries/IN/states",
        {
          headers: {
            "X-CSCAPI-KEY":
              "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
          },
          timeout: 8000, // 8 second timeout
        }
      );

      if (response.data && response.data.length > 0) {
        console.log(
          "States fetched successfully from API:",
          response.data.length,
          "states"
        );
        setStates(sortArrayByName(response.data));
      } else {
        console.error("API returned no states");
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states from API:", error);
      setStates([]);
    }
  }, [sortArrayByName]);

  // Effect to fetch states when component mounts
  useEffect(() => {
    fetchAllStates();
  }, [fetchAllStates]);

  // Function to fetch cities by state code - memoized to prevent dependency issues
  const fetchCitiesByState = useCallback(
    async (currentStateCode) => {
      try {
        console.log(`Fetching cities for state code: ${currentStateCode}...`);
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${currentStateCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY":
                "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
            },
            timeout: 8000, // 8 second timeout
          }
        );

        if (response.data && response.data.length > 0) {
          console.log(
            `Cities for ${currentStateCode} fetched successfully:`,
            response.data.length,
            "cities"
          );
          setCities(sortArrayByName(response.data));
        } else {
          console.log(`No cities found for ${currentStateCode}`);
          setCities([]);
        }
      } catch (error) {
        console.error(`Error fetching cities for ${currentStateCode}:`, error);
        setCities([]);
      }
    },
    [sortArrayByName]
  );

  // We'll fetch states when the dropdown is opened instead of on component mount

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      // Only reset city when state changes and it's not from URL params
      if (!searchParams.has("city")) {
        setSelectedCity("");
      }

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
  }, [selectedState, states, searchParams, fetchCitiesByState]);

  // Function to handle dropdown toggle
  const toggleDropdown = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Update all dropdown click handlers to use toggleDropdown
  const handleStateClick = () => {
    if (activeDropdown !== "state" && states.length === 0) {
      fetchAllStates();
    }
    toggleDropdown("state");
  };

  const handleCityClick = () => {
    if (selectedState) {
      toggleDropdown("city");
    }
  };

  const handlePropertyTypeClick = () => {
    toggleDropdown("propertyType");
  };

  const handleBhkClick = () => {
    toggleDropdown("bhk");
  };

  const handleBudgetClick = () => {
    toggleDropdown("budget");
  };

  const handleAmenitiesClick = () => {
    toggleDropdown("amenities");
  };

  const handleMoreFiltersClick = () => {
    // Instead of toggling dropdown, open the full filters panel
    if (onOpenFilters) {
      onOpenFilters();
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state.name);
    setActiveDropdown(null);
    // City dropdown will be populated by the useEffect that watches selectedState
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    setActiveDropdown(null);
    applyFilters(selectedState, city.name);
  };

  // Property type handlers
  const handlePropertyTypeToggle = (type) => {
    let updatedTypes;
    if (selectedPropertyTypes.includes(type)) {
      updatedTypes = selectedPropertyTypes.filter((t) => t !== type);
    } else {
      updatedTypes = [...selectedPropertyTypes, type];
    }
    setSelectedPropertyTypes(updatedTypes);
    applyFilters(
      selectedState,
      selectedCity,
      updatedTypes,
      selectedBhk,
      minBudget,
      maxBudget
    );
  };

  // BHK handlers
  const handleBhkToggle = (bhk) => {
    let updatedBhk;
    if (selectedBhk.includes(bhk)) {
      updatedBhk = selectedBhk.filter((b) => b !== bhk);
    } else {
      updatedBhk = [...selectedBhk, bhk];
    }
    setSelectedBhk(updatedBhk);
    applyFilters(
      selectedState,
      selectedCity,
      selectedPropertyTypes,
      updatedBhk,
      minBudget,
      maxBudget
    );
  };

  // Budget handlers
  const handleBudgetChange = (type, value) => {
    if (type === "min") {
      setMinBudget(value);
      applyFilters(
        selectedState,
        selectedCity,
        selectedPropertyTypes,
        selectedBhk,
        value,
        maxBudget
      );
    } else {
      setMaxBudget(value);
      applyFilters(
        selectedState,
        selectedCity,
        selectedPropertyTypes,
        selectedBhk,
        minBudget,
        value
      );
    }
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    let updatedAmenities;
    if (selectedAmenities.includes(amenity)) {
      updatedAmenities = selectedAmenities.filter((a) => a !== amenity);
    } else {
      updatedAmenities = [...selectedAmenities, amenity];
    }
    setSelectedAmenities(updatedAmenities);
    applyFilters(
      selectedState,
      selectedCity,
      selectedPropertyTypes,
      selectedBhk,
      minBudget,
      maxBudget,
      updatedAmenities,
      selectedFurnishing,
      selectedAge,
      selectedFloor
    );
  };

  // Handle furnishing selection
  const handleFurnishingChange = (furnishing) => {
    setSelectedFurnishing(furnishing);
    applyFilters(
      selectedState,
      selectedCity,
      selectedPropertyTypes,
      selectedBhk,
      minBudget,
      maxBudget,
      selectedAmenities,
      furnishing,
      selectedAge,
      selectedFloor
    );
  };

  // Handle property age selection
  const handleAgeChange = (age) => {
    setSelectedAge(age);
    applyFilters(
      selectedState,
      selectedCity,
      selectedPropertyTypes,
      selectedBhk,
      minBudget,
      maxBudget,
      selectedAmenities,
      selectedFurnishing,
      age,
      selectedFloor
    );
  };

  // Handle floor selection
  const handleFloorChange = (floor) => {
    setSelectedFloor(floor);
    applyFilters(
      selectedState,
      selectedCity,
      selectedPropertyTypes,
      selectedBhk,
      minBudget,
      maxBudget,
      selectedAmenities,
      selectedFurnishing,
      selectedAge,
      floor
    );
  };

  // Apply all filters - memoized to prevent infinite loops in useEffect
  const applyFilters = useCallback(
    (
      state,
      city,
      propertyTypes = selectedPropertyTypes,
      bhk = selectedBhk,
      min = minBudget,
      max = maxBudget,
      amenities = selectedAmenities,
      furnishing = selectedFurnishing,
      age = selectedAge,
      floor = selectedFloor
    ) => {
      const filters = {
        state: state,
        city: city,
        propertyType: Array.isArray(propertyTypes)
          ? propertyTypes.map((type) => ({ id: type, label: type }))
          : [],
        bedrooms: Array.isArray(bhk)
          ? bhk.map((b) => ({ id: b, label: b }))
          : [],
        budget: { min: min || 0, max: max || 100000000 },
        amenities: Array.isArray(amenities) ? amenities : [],
        furnishing: furnishing,
        age: age,
        floor: floor,
      };

      // Call the search function with state and city
      if (search) {
        search(state, city);
      }

      // Call the onFilterChange function with all filters
      if (onFilterChange) {
        onFilterChange(filters);
      }
    },
    [
      search,
      onFilterChange,
      selectedPropertyTypes,
      selectedBhk,
      minBudget,
      maxBudget,
      selectedAmenities,
      selectedFurnishing,
      selectedAge,
      selectedFloor,
    ]
  );

  // Navigate to filters page
  const goToFiltersPage = () => {
    const params = new URLSearchParams();
    if (selectedState) params.set("state", selectedState);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedPropertyTypes.length)
      params.set("propertyTypes", selectedPropertyTypes.join(","));
    if (selectedBhk.length) params.set("bhk", selectedBhk.join(","));
    if (minBudget) params.set("minBudget", minBudget);
    if (maxBudget) params.set("maxBudget", maxBudget);
    if (selectedAmenities.length)
      params.set("amenities", selectedAmenities.join(","));
    if (selectedFurnishing) params.set("furnishing", selectedFurnishing);
    if (selectedAge) params.set("age", selectedAge);
    if (selectedFloor) params.set("floor", selectedFloor);

    navigate(`/filters?${params.toString()}`);
  };

  // Load filters from URL params when component mounts
  useEffect(() => {
    // If there are filter params in the URL, apply them
    if (
      searchParams.has("state") ||
      searchParams.has("city") ||
      searchParams.has("propertyTypes") ||
      searchParams.has("bhk") ||
      searchParams.has("minBudget") ||
      searchParams.has("maxBudget") ||
      searchParams.has("amenities") ||
      searchParams.has("furnishing") ||
      searchParams.has("age") ||
      searchParams.has("floor")
    ) {
      const state = searchParams.get("state") || "";
      const city = searchParams.get("city") || "";
      const propertyTypes = searchParams.get("propertyTypes")
        ? searchParams.get("propertyTypes").split(",")
        : [];
      const bhk = searchParams.get("bhk")
        ? searchParams.get("bhk").split(",")
        : [];
      const min = searchParams.get("minBudget") || "";
      const max = searchParams.get("maxBudget") || "";
      const amenities = searchParams.get("amenities")
        ? searchParams.get("amenities").split(",")
        : [];
      const furnishing = searchParams.get("furnishing") || "";
      const age = searchParams.get("age") || "";
      const floor = searchParams.get("floor") || "";

      setSelectedState(state);
      setSelectedCity(city);
      setSelectedPropertyTypes(propertyTypes);
      setSelectedBhk(bhk);
      setMinBudget(min);
      setMaxBudget(max);
      setSelectedAmenities(amenities);
      setSelectedFurnishing(furnishing);
      setSelectedAge(age);
      setSelectedFloor(floor);

      // Apply the filters
      applyFilters(
        state,
        city,
        propertyTypes,
        bhk,
        min,
        max,
        amenities,
        furnishing,
        age,
        floor
      );
    }
  }, [location.search, applyFilters, searchParams]);

  // Filter states based on search query
  const filteredStates = useMemo(() => {
    if (!stateSearchQuery) return states;
    return states.filter((state) =>
      state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );
  }, [states, stateSearchQuery]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery) return cities;
    return cities.filter((city) =>
      city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [cities, citySearchQuery]);

  return (
    <div
      className="w-full mx-auto p-2 sm:p-3 lg:p-4"
      style={{ position: "relative", zIndex: 9999 }}
    >
      {/* All Filters in a Single Line */}
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6 dropdown-container">
        {/* State Dropdown */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handleStateClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {selectedState || "State"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform  ${
                activeDropdown === "state" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "state" && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto w-48">
              <div className="p-2 border-b">
                <h3 className="font-medium text-sm text-gold-500">
                  Select State
                </h3>
                {/* Add search input for states */}
                <input
                  type="text"
                  placeholder="Search states..."
                  className="w-full mt-2 px-2 py-1 border-2 border-black rounded text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  value={stateSearchQuery}
                  onChange={(e) => setStateSearchQuery(e.target.value)}
                />
              </div>
              {filteredStates.length > 0 ? (
                filteredStates.map((state) => (
                  <div
                    key={state.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-xs text-black"
                    onClick={() => handleStateSelect(state)}
                  >
                    {state.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-xs text-gray-500">No states found</div>
              )}
            </div>
          )}
        </div>

        {/* City Dropdown */}
        <div className="relative">
          <div
            className={`flex items-center justify-between gap-2 px-3 py-2 border rounded-lg transition-all ${
              selectedState
                ? "hover:bg-gray-50 cursor-pointer"
                : "bg-gray-50 cursor-not-allowed"
            }`}
            onClick={handleCityClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {selectedCity || "City"}
            </span>
            <ChevronDown
              size={16}
              className={` text-gold-500 transition-transform ${
                activeDropdown === "city" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "city" && selectedState && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto w-48">
              <div className="p-2 border-b">
                <h3 className="font-medium text-sm text-gold-500">
                  Select City
                </h3>
                {/* Add search input for cities */}
                <input
                  type="text"
                  placeholder="Search cities..."
                  className="w-full mt-2 px-2 py-1 border-2 border-black rounded text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  value={citySearchQuery}
                  onChange={(e) => setCitySearchQuery(e.target.value)}
                />
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-xs text-black"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-xs text-gray-500">No cities found</div>
              )}
            </div>
          )}
        </div>
        {/* Property Type Filter */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handlePropertyTypeClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {selectedPropertyTypes.length > 0
                ? `${selectedPropertyTypes.length} Property Types`
                : "Property Type"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                activeDropdown === "propertyType" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "propertyType" && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto w-64">
              <div className="p-2 border-b">
                <h3 className="font-medium text-sm text-gold-500">
                  Property Type
                </h3>
              </div>
              {[
                { id: "flat", name: "Flat" },
                { id: "housevilla", name: "House/Villa" },
                { id: "plot", name: "Plot/Land" },
                { id: "office", name: "Office Space" },
              ].map((type) => (
                <div
                  key={type.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center text-black`}
                  onClick={() => handlePropertyTypeToggle(type.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedPropertyTypes.includes(type.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BHK Filter */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handleBhkClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {selectedBhk.length > 0 ? `${selectedBhk.length} BHK` : "BHK"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform text-gold-500 ${
                activeDropdown === "bhk" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "bhk" && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto w-48">
              <div className="p-2 border-b">
                <h3 className="font-medium text-sm text-gold-500">Bedrooms</h3>
              </div>
              {[
                { id: "1bhk", name: "1 BHK" },
                { id: "2bhk", name: "2 BHK" },
                { id: "3bhk", name: "3 BHK" },
                { id: "4bhk", name: "4 BHK" },
                { id: "5bhk", name: "5 BHK" },
                { id: "5plusbhk", name: "5+ BHK" },
              ].map((bhk) => (
                <div
                  key={bhk.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center text-black`}
                  onClick={() => handleBhkToggle(bhk.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedBhk.includes(bhk.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-sm">{bhk.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Filter */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handleBudgetClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {minBudget || maxBudget
                ? `₹${
                    minBudget
                      ? (parseInt(minBudget) / 100000).toFixed(1) + "L"
                      : "0"
                  } - ₹${
                    maxBudget
                      ? (parseInt(maxBudget) / 100000).toFixed(1) + "L"
                      : "∞"
                  }`
                : "Budget"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform text-gold-500 ${
                activeDropdown === "budget" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "budget" && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 w-64">
              <div className="mb-3 border-b pb-2">
                <h3 className="font-medium text-sm text-gold-500">Budget</h3>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Budget
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    value={minBudget}
                    onChange={(e) => handleBudgetChange("min", e.target.value)}
                  >
                    <option value="">No Min</option>
                    <option value="500000" className="text-black">
                      ₹ 5 Lac
                    </option>
                    <option value="1000000" className="text-black">
                      ₹ 10 Lac
                    </option>
                    <option value="2000000" className="text-black">
                      ₹ 20 Lac
                    </option>
                    <option value="3000000" className="text-black">
                      ₹ 30 Lac
                    </option>
                    <option value="4000000" className="text-black">
                      ₹ 40 Lac
                    </option>
                    <option value="5000000" className="text-black">
                      ₹ 50 Lac
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    value={maxBudget}
                    onChange={(e) => handleBudgetChange("max", e.target.value)}
                  >
                    <option value="">No Max</option>
                    <option value="5000000" className="text-black">
                      ₹ 50 Lac
                    </option>
                    <option value="7500000" className="text-black">
                      ₹ 75 Lac
                    </option>
                    <option value="10000000" className="text-black">
                      ₹ 1 Cr
                    </option>
                    <option value="15000000" className="text-black">
                      ₹ 1.5 Cr
                    </option>
                    <option value="20000000" className="text-black">
                      ₹ 2 Cr
                    </option>
                    <option value="50000000" className="text-black">
                      ₹ 5 Cr
                    </option>
                    <option value="100000000" className="text-black">
                      ₹ 10 Cr+
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Amenities Filter */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handleAmenitiesClick}
          >
            <span className="text-sm font-medium text-gold-500">
              {selectedAmenities.length > 0
                ? `${selectedAmenities.length} Amenities`
                : "Amenities"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform text-gold-500 ${
                activeDropdown === "amenities" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "amenities" && (
            <div className="absolute z-50 top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 w-64">
              <div className="mb-3 border-b pb-2">
                <h3 className="font-medium text-sm">Amenities</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "parking", name: "Parking" },
                  { id: "gym", name: "Gym" },
                  { id: "swimming_pool", name: "Swimming Pool" },
                  { id: "lift", name: "Lift" },
                  { id: "security", name: "Security" },
                  { id: "power_backup", name: "Power Backup" },
                  { id: "garden", name: "Garden" },
                  { id: "clubhouse", name: "Clubhouse" },
                ].map((amenity) => (
                  <div
                    key={amenity.id}
                    className={`p-2 hover:bg-gray-100 text-black cursor-pointer flex items-center`}
                    onClick={() => handleAmenityToggle(amenity.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More Filters Button */}
        <div className="relative">
          <div
            className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
            onClick={handleMoreFiltersClick}
          >
            <span className="text-sm font-medium">
              {selectedFurnishing || selectedAge || selectedFloor
                ? "Filters Applied"
                : "More Filters"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                activeDropdown === "moreFilters" ? "rotate-180" : ""
              }`}
            />
          </div>

          {activeDropdown === "moreFilters" && (
            <div className="absolute z-50 top-full right-0 mt-1 bg-white border rounded-lg shadow-lg p-4 w-72">
              <div className="mb-3 border-b pb-2">
                <h3 className="font-medium text-sm">Additional Filters</h3>
              </div>

              {/* Furnishing Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnishing Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "unfurnished", name: "Unfurnished" },
                    { id: "semifurnished", name: "Semi-Furnished" },
                    { id: "fullyfurnished", name: "Fully Furnished" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      onClick={() =>
                        handleFurnishingChange(
                          option.id === selectedFurnishing ? "" : option.id
                        )
                      }
                      className={`cursor-pointer py-1 px-3 rounded-full text-xs border ${
                        selectedFurnishing === option.id
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {option.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Age */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Age
                </label>
                <select
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={selectedAge}
                  onChange={(e) => handleAgeChange(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor
                </label>
                <select
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={selectedFloor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="ground">Ground Floor</option>
                  <option value="1-5">1-5 Floor</option>
                  <option value="5-10">5-10 Floor</option>
                  <option value="10+">10+ Floor</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
