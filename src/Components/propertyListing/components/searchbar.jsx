import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

export default function SearchBar({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  onFilterChange,
  onOpenFilters,
}) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Refs for dropdowns
  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  // Helper function to sort array by name
  const sortArrayByName = useCallback((array) => {
    return array.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Function to fetch all states from API
  const fetchAllStates = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://api.countrystatecity.in/v1/countries/IN/states",
        {
          headers: {
            "X-CSCAPI-KEY":
              "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
          },
          timeout: 8000,
        }
      );

      if (response.data && response.data.length > 0) {
        setStates(sortArrayByName(response.data));
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  }, [sortArrayByName]);

  // Function to fetch cities by state code
  const fetchCitiesByState = useCallback(
    async (currentStateCode) => {
      try {
        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${currentStateCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY":
                "WVQzaUdWbEFnQVNQcnppdjRoUDdNZVo2eXR2QWRpbUR2ZnZmUGUwUw==",
            },
            timeout: 8000,
          }
        );

        if (response.data && response.data.length > 0) {
          setCities(sortArrayByName(response.data));
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
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

  const handleStateSelect = (state) => {
    setSelectedState(state); // store the whole state object
    setStateDropdownOpen(false);
    setSelectedCity(null); // Reset city when state changes

    // Apply filters immediately when state is selected, only including state
    const locationFilters = {
      state: state.name,
      stateCode: state.iso2,
      city: "",
      propertyType: [], // Reset property type
      bhk: [], // Reset BHK
      minBudget: "", // Reset budget
      maxBudget: "", // Reset budget
      amenities: [], // Reset amenities
    };
    console.log("Applying state filters:", locationFilters);
    onFilterChange(locationFilters);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city); // store the whole city object
    setCityDropdownOpen(false);

    // Apply filters immediately when city is selected, only including state and city
    const locationFilters = {
      state: selectedState.name,
      stateCode: selectedState.iso2,
      city: city.name,
      propertyType: [], // Reset property type
      bhk: [], // Reset BHK
      minBudget: "", // Reset budget
      maxBudget: "", // Reset budget
      amenities: [], // Reset amenities
    };
    console.log("Applying city filters:", locationFilters);
    onFilterChange(locationFilters);
  };

  // Filter states based on search
  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Function to fetch location from coordinates
  const fetchLocationFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (response.data) {
        const { city, principalSubdivision } = response.data;
        console.log("Location data:", response.data);

        // First fetch all states if not already loaded
        if (states.length === 0) {
          await fetchAllStates();
        }

        // Find matching state in our states list
        const matchedState = states.find(
          (state) =>
            state.name.toLowerCase() === principalSubdivision.toLowerCase()
        );

        if (matchedState) {
          console.log("Matched state:", matchedState);
          setSelectedState(matchedState);

          // Fetch cities for this state
          await fetchCitiesByState(matchedState.iso2);

          // Wait for cities to be loaded
          setTimeout(async () => {
            // Find matching city in our cities list
            const matchedCity = cities.find(
              (cityObj) => cityObj.name.toLowerCase() === city.toLowerCase()
            );

            console.log("Matched city:", matchedCity);

            if (matchedCity) {
              setSelectedCity(matchedCity);
              // Apply filters
              const locationFilters = {
                state: matchedState.name,
                stateCode: matchedState.iso2,
                city: matchedCity.name,
                propertyType: [],
                bhk: [],
                minBudget: "",
                maxBudget: "",
                amenities: [],
              };
              console.log("Applying location filters:", locationFilters);
              onFilterChange(locationFilters);
            } else {
              // If city not found, still apply state filter
              const locationFilters = {
                state: matchedState.name,
                stateCode: matchedState.iso2,
                city: "",
                propertyType: [],
                bhk: [],
                minBudget: "",
                maxBudget: "",
                amenities: [],
              };
              console.log("Applying state-only filters:", locationFilters);
              onFilterChange(locationFilters);
            }
          }, 1000); // Give time for cities to load
        } else {
          console.log("No matching state found for:", principalSubdivision);
        }
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLocating(false);
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got coordinates:", { latitude, longitude });
        fetchLocationFromCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Location Search with State and City */}
          <div className="flex-1 w-full flex gap-4">
            {/* Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="px-4 py-3 rounded-xl border-2 border-gold-400 text-white font-medium flex items-center justify-center gap-2 hover:bg-gold-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaLocationArrow
                className={`text-lg text-white ${
                  isLocating ? "animate-spin" : ""
                }`}
              />
              <span>{isLocating ? "Locating..." : "Use My Location"}</span>
            </button>

            {/* State Selection */}
            <div className="relative flex-1" ref={stateDropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <button
                type="button"
                onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                  selectedState
                    ? "border-gold-400 bg-gold-400/5 text-white"
                    : "border-gold-400 text-white hover:bg-gold-400/10 bg-gray-800/50"
                }`}
              >
                {selectedState ? selectedState.name : "Select State"}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              </button>
              {stateDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-gold-400 max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white p-2 border-b-2 border-gold-400">
                    <input
                      type="text"
                      placeholder="Search states..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="w-full p-2 bg-gray-50 border-2 border-gold-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  {filteredStates.map((state) => (
                    <button
                      key={state.iso2}
                      type="button"
                      onClick={() => handleStateSelect(state)}
                      className="w-full px-4 py-3 text-left hover:bg-gold-400/10 transition-colors text-gray-900"
                    >
                      {state.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Selection */}
            <div className="relative flex-1" ref={cityDropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <button
                type="button"
                onClick={() =>
                  selectedState && setCityDropdownOpen(!cityDropdownOpen)
                }
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                  selectedCity
                    ? "border-gold-400 bg-gold-400/5 text-white"
                    : "border-gold-400 text-white hover:bg-gold-400/10 bg-gray-800/50"
                } ${!selectedState ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!selectedState}
              >
                {selectedCity ? selectedCity.name : "Select City"}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              </button>
              {cityDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-gold-400 max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white p-2 border-b-2 border-gold-400">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full p-2 bg-gray-50 border-2 border-gold-400 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-3 text-left hover:bg-gold-400/10 transition-colors text-gray-900"
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className="w-full md:w-auto px-8 py-3 border-2 border-gold-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gold-400/10 transition-colors"
            onClick={onOpenFilters}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
