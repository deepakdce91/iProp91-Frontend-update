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
  setProperties,
  initialFilters = {},
  transactionType = "buy",
}) {
  const [cities, setCities] = useState([]);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  // const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // Refs for dropdowns
  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  // Helper function to sort array by name



  // Function to fetch cities by state code
  const fetchCitiesByState = useCallback(
    async (currentStateCode) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/cities/unique`,
        );

        console.log(response.data);
        console.log(response.data.data)

       if(response.data.status === "success"){
        setCities(response.data.data);
       }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    },
    []
  );

  // Fetch cities when state changes
  useEffect(() => {
   
    fetchCitiesByState();
  }, []);

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



  const handleCitySelect = (city) => {
    setSelectedCity(city); // store the whole city object
    setCityDropdownOpen(false);

    // Apply filters immediately when city is selected
    // Merge with existing filters from URL/initialFilters
    const locationFilters = {
      ...initialFilters,
      city: city,
    };
    console.log("Applying city filters with existing filters:", locationFilters);
    onFilterChange(locationFilters);
  };

  // // Filter states based on search
  // const filteredStates = states.filter((state) =>
  //   state.name.toLowerCase().includes(stateSearch.toLowerCase())
  // );

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Function to fetch location from coordinates
  const fetchLocationFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );

      if (response.data) {
        // Extract city name from API response (prefer city, then locality, then principalSubdivision)
        let cityName = response.data.city || response.data.locality || response.data.principalSubdivision;
        console.log("Location data:", response.data);
        console.log("Detected city:", cityName);

        if (cityName) {
          // Map common alternate names for better matching
          const alternateNames = {
            'gurugram': 'gurgaon',
            'gurgaon': 'gurugram',
            'bengaluru': 'bangalore',
            'bangalore': 'bengaluru',
            'mumbai': 'bombay',
            'bombay': 'mumbai',
            'chennai': 'madras',
            'madras': 'chennai',
            'kolkata': 'calcutta',
            'calcutta': 'kolkata',
          };
          
          // Check if we need to use an alternate name
          const lowerCityName = cityName.toLowerCase();
          if (alternateNames[lowerCityName]) {
            console.log(`Using alternate name: ${alternateNames[lowerCityName]} for ${cityName}`);
            cityName = alternateNames[lowerCityName];
          }

          // Set the selected city directly
          setSelectedCity(cityName);
          
          // Apply filters with just the city
          const locationFilters = {
            city: cityName,
            propertyType: [],
            bhk: [],
            minBudget: "",
            maxBudget: "",
            amenities: [],
          };
          console.log("Applying city-only filters:", locationFilters);
          onFilterChange(locationFilters);

          // Fetch properties for the city
          try {
            const propsResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster`,
              {
                params: { city: cityName }
              }
            );
            
            if (propsResponse.data && propsResponse.data.data && propsResponse.data.data.projects) {
              if (typeof setProperties === 'function') {
                setProperties(propsResponse.data.data.projects);
              }
              console.log("Fetched properties for city:", cityName, propsResponse.data.data.projects);
            }
          } catch (fetchErr) {
            console.error("Error fetching properties for city:", cityName, fetchErr);
          }
        } else {
          console.log("No city found in location data");
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
    <div className="shadow-lg " style={{ background: '#0a0f19' }}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Location Search with State and City */}
          <div className="flex-1 w-full flex gap-4">
            {/* Current Location Button */}
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="px-4 py-3 rounded-xl border-2 border-gold-400 text-white font-medium flex items-center justify-center gap-2 hover:bg-[#23283a]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaLocationArrow
                className={`text-lg text-white ${
                  isLocating ? "animate-spin" : ""
                }`}
              />
              <span>{isLocating ? "Locating..." : "Use My Location"}</span>
            </button>
            

            {/* City Selection */}
            <div className="relative flex-1" ref={cityDropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-white text-lg" />
              </div>
              <button
                type="button"
                onClick={() =>
                   setCityDropdownOpen(!cityDropdownOpen)
                }
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                  selectedCity
                    ? "border-gold-400 bg-[#23283a] text-white"
                    : "border-gold-400 text-white hover:bg-[#23283a]/80 bg-[#0a0f19]"
                }`}
              >
                {selectedCity ? (typeof selectedCity === 'string' ? selectedCity : selectedCity.name || 'Selected City') : "Select City"}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              </button>
              {cityDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-[#181c27] text-white rounded-xl shadow-xl border-2 border-gold-400 max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-[#181c27] text-white p-2 border-b-2 border-gold-400">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="w-full p-2 bg-[#23283a] border-2 border-gold-400 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-3 text-left hover:bg-[#23283a]/80 transition-colors text-white"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Button */}
          <button
            type="button"
            className="w-full md:w-auto px-8 py-3 border-2 border-gold-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#23283a]/80 transition-colors"
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
