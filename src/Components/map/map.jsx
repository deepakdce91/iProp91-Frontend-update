import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import "./style.css";
import Header from "./components/Header";
import PropertyNav from "./components/PropertyNav";
import PropertyList from "./components/PropertyList";
import PropertyDetails from "./components/PropertyDetails";
import Map from "./components/Map";
import FiltersModal from "./components/FiltersModal";
import { fetchDataWithParams } from "./data/mockProperties";

// Main Home component with property listings and map
function Home() {
  // Initialize properties as an empty array to prevent the "properties.map is not a function" error
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.4595, 77.0266]); // Default to Gurgaon coordinates
  const [mapBounds, setMapBounds] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [userLocation, setUserLocation] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [filters, setFilters] = useState({
    priceRange: [1000, 20000],
    bedrooms: 0,
    bathrooms: 0,
    propertyType: "Any",
    selectedAmenities: [],
    city: "Any",
    amenities: [],
    categoryFilter: "all",
    coordinates: [],
  });
  const fetchingRef = useRef(false); // Ref to track ongoing fetch operations
  const retryCountRef = useRef(0); // Ref to track retry count
  const locationRequestedRef = useRef(false); // Track if we've requested location

  const url = `${
    process.env.REACT_APP_BACKEND_URL || "https://iprop91new.onrender.com"
  }/api/projectsDataMaster`;
  const MAX_RETRIES = 3;

  // Get user's location on component mount
  useEffect(() => {
    if (!locationRequestedRef.current) {
      locationRequestedRef.current = true;
      console.log("Initial location request...");
      getUserLocation();
    }
  }, []);

  // When location is denied or granted, fetch properties
  useEffect(() => {
    if (locationDenied || userLocation) {
      console.log("Location status resolved, fetching properties...");
      fetchProperties();
    }
  }, [locationDenied, userLocation]);

  // Function to get user's location
  const getUserLocation = () => {
    console.log("Attempting to get user location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          console.log("User location retrieved:", userCoords);
          setUserLocation(userCoords);
          setMapCenter(userCoords);
          // Location granted, will trigger fetchProperties via useEffect
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationDenied(true);
          // Location denied, will trigger fetchProperties via useEffect
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation not supported by this browser");
      setLocationDenied(true);
      // Location not supported, will trigger fetchProperties via useEffect
    }
  };

  // Handle property category selection
  const handleCategoryChange = (categoryId) => {
    console.log("Category changed to:", categoryId);
    // Update filter state with the new category
    setFilters((prevFilters) => ({
      ...prevFilters,
      categoryFilter: categoryId,
    }));
    // Fetch will be triggered by the filter change useEffect
    setIsLoading(true);
  };

  // Main fetch properties function that decides whether to use location or fetch random
  const fetchProperties = async () => {
    if (userLocation) {
      // If we have user location, update filters with it and fetch based on location
      await updateFiltersWithLocation(userLocation);
      // fetchPropertiesInBounds will be triggered by useEffect when filters change
    } else {
      // If location was denied or not available, fetch random properties
      fetchRandomProperties();
    }
  };

  // Function to update filters with user location
  const updateFiltersWithLocation = async (coords) => {
    try {
      // Attempt to reverse geocode coordinates to get city name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
      );
      const data = await response.json();

      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        "Any";

      // Update filters with new location information
      setFilters((prevFilters) => ({
        ...prevFilters,
        city: city,
      }));

      console.log("Updated filters with location:", city);
      // After updating filters, will trigger mapBounds useEffect
      if (!mapBounds) {
        // If mapBounds haven't been set by the Map component yet,
        // create artificial bounds around user location
        setMapBounds({
          _northEast: { lat: coords[0] + 0.05, lng: coords[1] + 0.05 },
          _southWest: { lat: coords[0] - 0.05, lng: coords[1] - 0.05 },
        });
      }
    } catch (error) {
      console.error("Error updating filters with location:", error);
      // If geocoding fails, fetch random properties as fallback
      fetchRandomProperties();
    }
  };

  // When map bounds change, immediately fetch properties
  const handleMapBoundsChange = (bounds) => {
    console.log("📊 Map bounds changed in parent component:", bounds);
    setMapBounds(bounds);

    // If we have valid bounds and either user location or location was denied,
    // we can proceed with fetching properties
    if (bounds && (userLocation || locationDenied)) {
      console.log("🔍 Triggering immediate property fetch due to map bounds change");
      
      // Use a small delay to ensure state updates have propagated
      setTimeout(() => {
        fetchPropertiesInBounds();
      }, 100);
    }
  };

  // When map bounds change or filters change, fetch properties for that area
  useEffect(() => {
    console.log("🔄 Filter or mapBounds changed - current filters:", filters);
    console.log("🗺️ Current mapBounds:", mapBounds);
    
    if (mapBounds && (userLocation || locationDenied)) {
      console.log("🔍 Triggering fetchPropertiesInBounds due to filter/bounds change");
      fetchPropertiesInBounds();
    }
  }, [filters, mapBounds, userLocation, locationDenied]);

  // Function to fetch random properties without any filter
  const fetchRandomProperties = async () => {
    if (fetchingRef.current) {
      console.log("Fetch already in progress, skipping random fetch");
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    console.log("Fetching random properties with no filters");

    try {
      // Reset filters to default values
      const defaultFilters = {
        priceRange: [1000, 100000], // Wide price range
        bedrooms: 0,
        bathrooms: 0,
        propertyType: "Any",
        selectedAmenities: [],
        city: "Any",
        amenities: [],
        categoryFilter: "all", // Default to 'all'
        limit: 20, // Request specifically 20 properties
      };

      // Use default filters for random properties
      const fetchedProperties = await fetchDataWithParams(url, defaultFilters);

      processApiResponse(fetchedProperties);
    } catch (error) {
      console.error("Error fetching random properties:", error);
      loadFallbackData();
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  const fetchPropertiesInBounds = async (retryCount = 0) => {
    // If already fetching, don't start another fetch
    if (fetchingRef.current) {
      console.log("Fetch already in progress, skipping this request");
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    console.log(
      `Starting fetch attempt ${retryCount + 1} with filters`,
      filters
    );

    try {
      // Try to fetch real data with current filters including categoryFilter
      const params = { ...filters };
      if (locationDenied) {
        // If location was denied, ensure we get at least 20 random properties
        params.limit = 20;
      }

      const fetchedProperties = await fetchDataWithParams(url, params);
      processApiResponse(fetchedProperties, retryCount);
    } catch (error) {
      handleFetchError(error, retryCount);
    }
  };

  // Helper function to process API response
  const processApiResponse = (fetchedProperties, retryCount = 0) => {
    console.log("Fetch response:", fetchedProperties);

    if (
      fetchedProperties &&
      fetchedProperties.data &&
      (fetchedProperties.data.projects || fetchedProperties.data.properties)
    ) {
      // Handle both API response formats
      const projectsArray =
        fetchedProperties.data.projects ||
        fetchedProperties.data.properties ||
        [];

      console.log("Fetch successful, data is array:", projectsArray.length);

      if (Array.isArray(projectsArray)) {
        // Add coordinates to properties without them
        const processedProperties = projectsArray.map((prop) => {
          // If property doesn't have coordinates, add mock ones based on user location or default
          let coords = prop.coordinates;
          if (!coords || !Array.isArray(coords) || coords.length !== 2) {
            // Generate random coordinates within 5km of current map center
            const randomOffset = () => (Math.random() - 0.5) * 0.05; // ~5km
            coords = [
              mapCenter[0] + randomOffset(),
              mapCenter[1] + randomOffset(),
            ];
          }

          return {
            ...prop,
            coordinates: coords,
          };
        });

        setProperties(processedProperties);

        // Calculate and update category counts
        updateCategoryCounts(processedProperties);

        // Save processed properties to localStorage for persistence
        localStorage.setItem(
          "cachedProperties",
          JSON.stringify(processedProperties)
        );

        retryCountRef.current = 0;
        setIsLoading(false);
        fetchingRef.current = false;
      } else {
        throw new Error("Projects/properties is not an array");
      }
    } else {
      console.error(
        "API response is not in expected format:",
        fetchedProperties
      );

      if (retryCount < MAX_RETRIES) {
        retryFetch(retryCount);
      } else {
        console.warn("Max retries reached, using fallback data");
        loadFallbackData();
        setIsLoading(false);
        fetchingRef.current = false;
      }
    }
  };

  // Function to calculate category counts from properties
  const updateCategoryCounts = (properties) => {
    // Initialize counts object with all categories set to 0
    const counts = {
      all: properties.length,
      owner: 0,
      new: 0,
      ready: 0,
      budget: 0,
      prelaunch: 0,
      verified: 0,
      sale: 0,
      upcoming: 0,
    };

    // Count properties by category
    properties.forEach((property) => {
      // Count properties in each category based on property attributes
      // This is example logic - update according to your actual property data structure
      if (property.isOwner) counts.owner++;
      if (property.isNewProject) counts.new++;
      if (property.isReadyToMove) counts.ready++;
      if (property.price < 20000) counts.budget++; // Example price threshold for budget homes
      if (property.isPreLaunch) counts.prelaunch++;
      if (property.isVerifiedOwner) counts.verified++;
      if (property.isNewSale) counts.sale++;
      if (property.isUpcoming) counts.upcoming++;
    });

    setCategoryCounts(counts);
  };

  // Helper function to handle fetch errors
  const handleFetchError = (error, retryCount) => {
    console.error("Error fetching properties:", error);

    // If retry count hasn't reached max, retry with exponential backoff
    if (retryCount < MAX_RETRIES) {
      retryFetch(retryCount);
    } else {
      // Max retries reached, use dummy data instead
      console.warn("Max retries reached after errors, using fallback data");
      loadFallbackData();
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  // Helper function to retry fetch with exponential backoff
  const retryFetch = (retryCount) => {
    const nextRetryDelay = Math.pow(2, retryCount) * 1000;
    console.log(
      `Fetch failed. Retrying in ${nextRetryDelay}ms (attempt ${
        retryCount + 1
      }/${MAX_RETRIES})`
    );

    setTimeout(() => {
      fetchingRef.current = false; // Reset fetching flag before retry
      fetchPropertiesInBounds(retryCount + 1);
    }, nextRetryDelay);
  };

  // Check for cached properties on initial load
  useEffect(() => {
    const cachedProps = localStorage.getItem("cachedProperties");
    if (cachedProps) {
      try {
        const parsedProps = JSON.parse(cachedProps);
        if (Array.isArray(parsedProps) && parsedProps.length > 0) {
          console.log("Loading properties from cache:", parsedProps.length);
          setProperties(parsedProps);
          // Update category counts for the cached properties
          updateCategoryCounts(parsedProps);
          // If there are cached properties, use the coordinates of the first one to set map center
          if (parsedProps[0]?.coords) {
            setMapCenter(parsedProps[0].coords);
          }
        }
      } catch (e) {
        console.error("Error parsing cached properties:", e);
      }
    }
    // Don't load fallback data immediately - let the location request flow determine what to do
  }, []);

  // Helper function to use fallback data
  const loadFallbackData = () => {
    const fallbackProperties = [
      {
        id: 1,
        title: "Modern apartment with great view",
        type: "Apartment",
        location: "Gurgaon",
        price: 25000,
        pricePerNight: "₹25,000/month",
        coords: [28.4595, 77.0266],
        coordinates: [28.4595, 77.0266],
        rating: 4.9,
        reviews: 128,
        isNewProject: true,
        isVerifiedOwner: true,
        freeCancel: true,
        dates: "Available now",
        images: [
          "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
        ],
      },
      {
        id: 2,
        title: "Cozy studio in downtown",
        type: "Studio",
        location: "Delhi",
        price: 18000,
        pricePerNight: "₹18,000/month",
        coords: [28.6139, 77.209],
        coordinates: [28.6139, 77.209],
        rating: 4.7,
        reviews: 86,
        isNewProject: false,
        isReadyToMove: true,
        freeCancel: true,
        dates: "Available from June 1",
        images: [
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        ],
      },
      {
        id: 3,
        title: "Luxury 3BHK with balcony",
        type: "Apartment",
        location: "Noida",
        price: 35000,
        pricePerNight: "₹35,000/month",
        coords: [28.5355, 77.391],
        coordinates: [28.5355, 77.391],
        rating: 4.8,
        reviews: 152,
        isOwner: true,
        isUpcoming: false,
        freeCancel: true,
        dates: "Available now",
        images: [
          "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        ],
      },
      {
        id: 4,
        title: "Affordable 1BHK near metro",
        type: "Apartment",
        location: "Gurgaon",
        price: 15000,
        pricePerNight: "₹15,000/month",
        coords: [28.4601, 77.0193],
        coordinates: [28.4601, 77.0193],
        rating: 4.5,
        reviews: 74,
        isBudget: true,
        isPreLaunch: true,
        freeCancel: false,
        dates: "Available from June 15",
        images: [
          "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
        ],
      },
    ];

    setProperties(fallbackProperties);
    updateCategoryCounts(fallbackProperties);
    localStorage.setItem(
      "cachedProperties",
      JSON.stringify(fallbackProperties)
    );
  };

  console.log("properties", properties);
  console.log("current category filter", filters.categoryFilter);

  return (
    <>
      <Header setShowFilters={setShowFilters} />
      <PropertyNav
        onCategoryChange={handleCategoryChange}
        counts={categoryCounts}
      />

      <main className="flex flex-grow relative mt-2.5">
        <section className="w-3/5 max-w-[850px] p-5 overflow-y-auto h-[calc(100vh-60px-77px)]">
          <div className="flex justify-between items-center mb-5 flex-wrap">
            <h2 className="text-[22px] font-semibold">
              {isLoading
                ? "Finding properties..."
                : `Over ${properties.length} places within `}
              {userLocation
                ? "your area"
                : locationDenied
                ? "available properties"
                : "selected area"}
              {filters.categoryFilter !== "all"
                ? ` - ${filters.categoryFilter} category`
                : ""}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                Prices include all fees
              </div>
              <button
                className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-full text-sm font-medium shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                onClick={() => setShowFilters(true)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>
          <PropertyList
            properties={properties}
            setSelectedProperty={setSelectedProperty}
            isLoading={isLoading}
          />
        </section>

        <section className="w-2/5 sticky top-[60px] right-0 h-[calc(100vh-60px-77px)]">
          <Map
            setProperties={setProperties}
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            setMapBounds={handleMapBoundsChange}
            userLocation={userLocation}
            setFilters={setFilters}
            filters={filters}
          />
        </section>
      </main>

      {showFilters && (
        <FiltersModal
          allFilters={filters}
          setFilters={setFilters}
          closeModal={() => setShowFilters(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen pt-[14vh]">
      <Routes>
        <Route path="/search-properties/*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/property-details/:id" element={<PropertyDetails />} />
      </Routes>
    </div>
  );
}

export default App;
