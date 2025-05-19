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
  onSearch,
}) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [searchParams, setSearchParams] = useState({
    state: "",
    stateCode: "",
    city: "",
    propertyType: [],
    bhk: [],
    minBudget: "",
    maxBudget: "",
    amenities: [],
    furnishing: "",
    age: "",
    floor: "",
    facing: "",
    possession: "",
    constructionStatus: "",
    localities: [],
  });

  // Function to handle the complete flow
  const handleLocationBasedSearch = async () => {
    try {
      setIsLocating(true);

      // 1. Fetch user location
      const getUserLocation = async () => {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported");
        }
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        return position.coords;
      };

      // 2. Get city directly from geolocation
      const getCityFromCoords = async (coords) => {
        const locationResponse = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
        );
        const { city } = locationResponse.data;
        if (!city) {
          throw new Error("City not found from location");
        }
        return city;
      };

      // Execute the flow
      const coords = await getUserLocation();
      const cityName = await getCityFromCoords(coords);
      setSelectedCity(cityName);

      // Update search parameters
      setSearchParams((prev) => ({
        ...prev,
        city: cityName,
        state: '',
        stateCode: '',
      }));

      // Trigger search with only city
      if (onSearch) {
        onSearch({
          city: cityName,
          ...searchParams,
          state: '',
          stateCode: '',
        });
      }

      // No need to return properties as in the old flow
    } catch (error) {
      console.error("Error in location-based search:", error);
      throw error;
    } finally {
      setIsLocating(false);
    }
  };


  // Add a button to trigger location-based search
  const handleLocationClick = () => {
    handleLocationBasedSearch().catch((error) => {
      console.error("Failed to perform location-based search:", error);
    });
  };

  // Effect to trigger location-based search on component mount
  useEffect(() => {
    handleLocationBasedSearch().catch((error) => {
      console.error("Failed to perform location-based search:", error);
    });
  }, []);

  // Update searchParams when state or city changes
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      stateCode: selectedState?.iso2 || "",
      city: selectedCity?.name || "",
    }));
  }, [selectedState, selectedCity]);

  // ... rest of the existing code ...

  return (
    <div className="w-full mx-auto p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-gray-900 to-black">
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
        {/* Location Button */}
        <button
          onClick={handleLocationClick}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gold-400 rounded-lg text-gold-400 hover:bg-gold-400/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaLocationArrow className={`${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Locating..." : "Use My Location"}</span>
        </button>

        {/* State Dropdown */}
        <div className="relative flex-1 min-w-[200px]">
          <button
            onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-100 hover:border-gold-400 transition-all"
          >
            <span className="truncate">
              {selectedState ? selectedState.name : "Select State"}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform text-gold-400 ${
                stateDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {stateDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search states..."
                className="w-full px-4 py-2 bg-gray-900/50 border-b-2 border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gold-400"
              />
              <div className="py-1">
                {states
                  .filter((state) =>
                    state.name.toLowerCase().includes(stateSearch.toLowerCase())
                  )
                  .map((state) => (
                    <button
                      key={state.iso2}
                      onClick={() => {
                        setSelectedState(state);
                        setStateDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700/50 focus:bg-gray-700/50 focus:outline-none"
                    >
                      {state.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* City Dropdown */}
        <div className="relative flex-1 min-w-[200px]">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            disabled={!selectedState}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-gray-100 hover:border-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {selectedCity ? selectedCity.name : "Select City"}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform text-gold-400 ${
                cityDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {cityDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search cities..."
                className="w-full px-4 py-2 bg-gray-900/50 border-b-2 border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gold-400"
              />
              <div className="py-1">
                {cities
                  .filter((city) =>
                    city.name.toLowerCase().includes(citySearch.toLowerCase())
                  )
                  .map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-100 hover:bg-gray-700/50 focus:bg-gray-700/50 focus:outline-none"
                    >
                      {city.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => onSearch && onSearch(searchParams)}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gold-400 to-gold-500 text-gray-900 rounded-lg hover:from-gold-500 hover:to-gold-600 transition-all font-medium shadow-lg shadow-gold-500/20"
        >
          <FaSearch />
          <span>Search</span>
        </button>

        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gold-400 text-gold-400 rounded-lg hover:bg-gold-400/10 transition-all"
        >
          <FaMapMarkerAlt />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
