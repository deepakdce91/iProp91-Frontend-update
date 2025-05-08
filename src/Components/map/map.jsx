import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Home,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SearchBar from "./components/searchbar";
import PropertyCardComponent from "./components/PropertyCard";
import FiltersPanel from "./pages/FiltersPage";
import ErrorBoundary from "./components/ErrorBoundary";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import axios from "axios";
import { toast } from "react-hot-toast";

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

// Create custom house icon
const houseIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Create custom user location icon
const userLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Image Carousel Component
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // for smooth scrolling
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`Property image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      />

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white"
        onClick={handlePrev}
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>

      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full hover:bg-white"
        onClick={handleNext}
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Main app component
export default function App() {
  return (
    <div className="pt-[14vh] bg-black">
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<AirbnbMapClone />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

function AirbnbMapClone() {
  const location = useLocation();
  const [mapInstance, setMapInstance] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isFetchingLimited, setIsFetchingLimited] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [currentStateCity, setCurrentStateCity] = useState({
    state: "",
    city: "",
  });
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [panelState, setPanelState] = useState("half");
  const panelRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // State data from API
  const [statesData, setStatesData] = useState([]);

  // Function to fetch properties with filters - matching listing.jsx logic
  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();

      // Add all filter parameters if they exist
      if (filters.state) queryParams.append("state", filters.state);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.propertyType?.length)
        queryParams.append("propertyType", filters.propertyType.join(","));
      if (filters.bhk?.length) queryParams.append("bhk", filters.bhk.join(","));
      if (filters.minBudget) queryParams.append("minBudget", filters.minBudget);
      if (filters.maxBudget) queryParams.append("maxBudget", filters.maxBudget);
      if (filters.amenities?.length)
        queryParams.append("amenities", filters.amenities.join(","));

      // Always add these parameters
      if (activeCategory && activeCategory !== "all") {
        queryParams.append("category", activeCategory);
      }

      // Add sort parameter
      if (sortBy) {
        queryParams.append("sort", sortBy);
      }

      // Add pagination parameters
      queryParams.append("page", "1");
      queryParams.append("limit", "100"); // Increased limit for map view

      const apiUrl = `https://iprop91new.onrender.com/api/projectsDataMaster?${queryParams.toString()}`;
      console.log("Fetching properties with URL:", apiUrl);

      const response = await axios.get(apiUrl);

      if (response.data.status === "success" && response.data.data?.projects) {
        const processedProperties = response.data.data.projects.map(
          (property) => ({
            id: property._id,
            title: `${property.bhk || ""} ${property.type || "Property"} in ${
              property.project || ""
            }`,
            price: property.minimumPrice
              ? `₹${property.minimumPrice}`
              : "Price on Request",
            location: `${property.city}, ${property.state}`,
            coordinates: {
              lat: property.latitude || 0,
              lng: property.longitude || 0,
            },
            images: property.images || [],
            description: property.overview || "",
            amenities: property.amenities || [],
            features: property.features || [],
            bhk: property.bhk,
            type: property.type,
            area: property.size,
            status: property.status,
          })
        );

        setProperties(processedProperties);
      } else {
        console.error("Invalid API response format:", response.data);
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, activeCategory]);

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

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy, activeCategory, fetchProperties]);

  // Handle filter changes - matching listing.jsx logic
  const handleFilterChange = useCallback(
    (newFilters) => {
      console.log("Before filter change:", filters);
      console.log("New filters being applied:", newFilters);

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          ...newFilters,
        };

        console.log("Updated filters:", updatedFilters);
        return updatedFilters;
      });
    },
    [filters]
  );

  // Handle search - matching listing.jsx logic
  const handlePropertiesSearch = useCallback(
    async (state, city, propertyType, bedrooms, minBudget, maxBudget) => {
      const now = Date.now();
      if (isFetchingLimited && now - lastFetchTime < 2000) {
        console.log("Throttling search requests");
        return;
      }

      try {
        setIsLoading(true);
        setLastFetchTime(Date.now());

        setCurrentStateCity({
          state: state || "",
          city: city || "",
        });

        const newFilters = {
          ...filters,
          state: state || "",
          city: city || "",
          propertyType: propertyType || [],
          bhk: bedrooms || [],
          minBudget: minBudget || 0,
          maxBudget: maxBudget || 10000000,
        };

        setFilters(newFilters);
      } catch (error) {
        console.error("Error in search:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, isFetchingLimited, lastFetchTime]
  );

  // Handle sort changes
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle category changes
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Function to fetch states data from API
  const fetchStatesData = async () => {
    console.log("🔄 Starting to fetch states data...");
    try {
      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSCAPI-KEY": process.env.REACT_APP_CSC_API,
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      setStatesData(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      console.log(
        "✅ States data fetched successfully:",
        response.data.length,
        "states"
      );
    } catch (error) {
      console.error("❌ Error fetching states data:", error);
      toast.error("Failed to fetch states data");
    }
  };

  // Fetch states data on component mount
  // We're using useRef to ensure it only runs once on mount, avoiding the dependency issue completely
  const statesDataFetchedRef = useRef(false);
  useEffect(() => {
    if (!statesDataFetchedRef.current) {
      statesDataFetchedRef.current = true;
      fetchStatesData();
    }
  }, []);

  // Utility function to process property data - memoized with useCallback
  const processProperties = useCallback(
    (propertiesArray, latitude, longitude) => {
      // Add distance and coordinates for each property
      const propertiesWithCoordinates = propertiesArray.map((property) => {
        // Check if coordinates array is empty or undefined
        let propertyCoordinates;

        if (property.coordinates) {
          propertyCoordinates = {
            latitude: parseFloat(property.coordinates.latitude),
            longitude: parseFloat(property.coordinates.longitude),
          };
        } else {
          // If no valid coordinates, add random coordinates near the center
          propertyCoordinates = {
            latitude: latitude + (Math.random() - 0.5) * 0.05,
            longitude: longitude + (Math.random() - 0.5) * 0.05,
          };
        }

        // Calculate distance from center (simplified)
        const distance =
          Math.sqrt(
            Math.pow(propertyCoordinates.latitude - latitude, 2) +
              Math.pow(propertyCoordinates.longitude - longitude, 2)
          ) * 111; // Rough conversion to kilometers

        // Create a complete property object with all fields from the API response
        return {
          ...property,
          coordinates: propertyCoordinates,
          title:
            property.title || property.project || `Property ${property._id}`,
          price:
            property.price ||
            (property.minimumPrice
              ? property.maximumPrice
                ? `${property.minimumPrice} - ${property.maximumPrice}`
                : property.minimumPrice
              : "Price on request"),
          location: [
            property.address,
            property.sector,
            property.city,
            property.state,
            property.pincode,
          ]
            .filter(Boolean)
            .join(", "),
          images:
            Array.isArray(property.images) && property.images.length > 0
              ? property.images
              : ["/dummy-image.png"], // Using image from public folder
          propertyType: property.type || "Residential",
          bedrooms: property.bhk || property.numberOfBedrooms || "",
          bathrooms: property.numberOfBathrooms || "",
          washrooms: property.numberOfWashrooms || "",
          floors: property.numberOfFloors || "",
          parkings: property.numberOfParkings || "",
          area: property.size ? `${property.size} sq.ft` : "",
          description: property.overview || "",
          distance: `${Math.round(distance)} kilometres away`,
        };
      });

      // Sort by distance
      propertiesWithCoordinates.sort((a, b) => {
        const distA = parseInt(a.distance);
        const distB = parseInt(b.distance);
        return distA - distB;
      });

      setProperties(propertiesWithCoordinates);

      // Automatically select the first property
      if (propertiesWithCoordinates.length > 0) {
        setSelectedProperty(propertiesWithCoordinates[0]);
      }
    },
    [setProperties, setSelectedProperty]
  );

  // Function to get user location
  const getUserLocation = () => {
    console.log("🔄 Getting user location...");
    if (!navigator.geolocation) {
      console.log("❌ Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("✅ User location obtained successfully");
        const { latitude, longitude } = position.coords;
        // Ensure coordinates are valid numbers
        if (
          typeof latitude === "number" &&
          typeof longitude === "number" &&
          !isNaN(latitude) &&
          !isNaN(longitude)
        ) {
          setUserLocation({ lat: latitude, lng: longitude });
          setCurrentLocation({ lat: latitude, lng: longitude });
        } else {
          console.error("❌ Invalid coordinates received:", {
            latitude,
            longitude,
          });
          toast.error("Invalid location coordinates received");
        }
      },
      (error) => {
        console.error("❌ Error getting user location:", error);
        toast.error("Failed to get your location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Get user's geolocation and fetch nearby properties on component mount
  useEffect(() => {
    getUserLocation();
  }, [mapInstance]); // Removed fetchPropertiesNearLocation from dependencies

  // Use the ref instead of the function directly to avoid dependency cycles
  useEffect(() => {}, [currentLocation, properties.length]);

  // Track screen size for responsive UI adjustments
  const isSmallScreen = viewportWidth < 768;

  // State for controlling FiltersPanel visibility
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Handler for opening filters panel
  const handleOpenFilters = useCallback(() => {
    setFiltersVisible(true);
  }, []);

  // Handler for closing filters panel
  const handleCloseFilters = useCallback(() => {
    setFiltersVisible(false);
  }, []);

  const panelAnimations = {
    full: { height: "85vh" },
    half: { height: "50vh" },
    minimized: { height: "4rem" },
  };

  // Handle touch start event for panel dragging
  const handleTouchStart = (e) => {
    console.log("🔄 Touch start detected");
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
  };

  // Handle touch move event for panel dragging
  const handleTouchMove = (e) => {
    console.log("🔄 Touch move detected");
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (deltaY > 50) {
      console.log("✅ Panel state changed to: full");
      setPanelState("full");
    } else if (deltaY < -50) {
      console.log("✅ Panel state changed to: half");
      setPanelState("half");
    }
  };

  // Function to fetch properties within map bounds
  const fetchPropertiesInBounds = useCallback(
    async (latitude, longitude, bounds) => {
      const now = Date.now();
      // Increase the cooldown time to 3 seconds and check isLoading state
      if (isLoading || now - lastFetchTime < 3000) {
        console.log("⏳ Throttling map bounds fetch requests");
        return;
      }

      try {
        setIsLoading(true);
        setLastFetchTime(Date.now());

        // Get the northeast and southwest corners of the bounds
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        // Calculate radius based on the bounds (approximate)
        const latDiff = Math.abs(ne.lat - sw.lat);
        const lngDiff = Math.abs(ne.lng - sw.lng);
        const radius = (Math.max(latDiff, lngDiff) * 111) / 2; // Convert to km

        let url = "https://iprop91new.onrender.com/api/projectsDataMaster";
        console.log("🌐 Initial API URL:", url);

        try {
          // First, try a minimal request without coordinates to check if the server is responding
          console.log("🔍 Checking server availability...");
          await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 10000,
          });
          console.log("✅ Server is responding");

          // If we got here, the server is up. Now build our query with filters
          const params = new URLSearchParams();

          // *** IMPORTANT: We're using city/state search instead of lat/lng since that works ***
          // Only add lat/lng as fallback
          try {
            // Use OpenStreetMap's Nominatim service for reverse geocoding
            const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
            console.log("🗺️ Geocoding URL:", geocodeUrl);

            const geocodeResponse = await axios.get(geocodeUrl, {
              headers: {
                Accept: "application/json",
                "User-Agent": "iProp Web Application",
              },
            });

            const result = geocodeResponse.data;
            console.log("📍 Geocoding result:", result);

            // Extract city and state from geocoding result
            let city = null;
            let state = null;

            if (result && result.address) {
              // Extract city and state from Nominatim response
              city =
                result.address.city ||
                result.address.town ||
                result.address.village;
              state = result.address.state || result.address.county;
              console.log("🏙️ Extracted location:", { city, state });
            }

            // Add city and state if found
            if (city) params.append("city", city);
            if (state) params.append("state", state);

            // If geocoding failed or no city/state found, fall back to coordinates
            if (!city && !state) {
              console.log(
                "⚠️ No city/state found, falling back to coordinates"
              );
              params.append("lat", latitude);
              params.append("lng", longitude);
              params.append("radius", Math.ceil(radius));
            }
          } catch (geocodeError) {
            console.error("❌ Geocoding error:", geocodeError);
            // Fall back to coordinates
            params.append("lat", latitude);
            params.append("lng", longitude);
            params.append("radius", Math.ceil(radius));
          }

          // Add filter parameters
          if (filters?.propertyType?.length > 0) {
            params.append("propertyType", filters.propertyType.join(","));
          }

          if (filters?.bhk?.length > 0) {
            params.append("bhk", filters.bhk.join(","));
          }

          if (filters?.minBudget && filters.minBudget > 0) {
            params.append("minBudget", filters.minBudget);
          }

          if (filters?.maxBudget && filters.maxBudget < 10000000) {
            params.append("maxBudget", filters.maxBudget);
          }

          if (selectedAmenities.length > 0) {
            params.append("amenities", selectedAmenities.join(","));
          }

          const finalUrl = `${url}?${params.toString()}`;
          console.log("🔗 Final API URL with parameters:", finalUrl);

          const response = await axios.get(finalUrl, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 10000,
          });

          const propertiesData = response.data;
          console.log("📦 API Response:", {
            totalProperties: propertiesData.data?.projects?.length || 0,
            firstProperty: propertiesData.data?.projects?.[0],
            responseStatus: response.status,
            responseHeaders: response.headers,
          });

          const propertiesArray = propertiesData.data?.projects || [];

          if (propertiesArray.length > 0) {
            console.log("✅ Processing", propertiesArray.length, "properties");
            processProperties(propertiesArray, latitude, longitude);
          } else {
            console.log("ℹ️ No properties found in the response");
            setProperties([]);
          }
        } catch (apiError) {
          console.error("❌ API error when fetching properties:", {
            error: apiError,
            message: apiError.message,
            response: apiError.response?.data,
          });

          // Use hardcoded sample data as fallback when server fails
          try {
            console.log("🔄 Using fallback sample property data");
            const sampleProperty = {
              _id: "IPMP0005",
              thumbnail: null,
              propertyId: "IPP00120",
              listingId: "IPL00045",
              state: "Haryana",
              city: "Sonipat",
              coordinates: [latitude, longitude],
              builder: "Sample Builder",
              project: "Sample Project",
              tower: "Tower A",
              unit: "3333",
              size: "2223",
              status: "under-construction",
              type: "residential",
            };

            processProperties([sampleProperty], latitude, longitude);
          } catch (fallbackError) {
            console.error("❌ Error using fallback data:", fallbackError);
            setProperties([]);
          }
        }
      } catch (error) {
        console.error("❌ Error in fetchPropertiesInBounds:", error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    },
    [lastFetchTime, filters, selectedAmenities, processProperties, isLoading]
  );

  // Create a debounced version of fetchPropertiesInBounds
  const debouncedFetch = useCallback(() => {
    // Using an inline function rather than passing debounce directly
    const debouncedFn = debounce((lat, lng, bounds) => {
      if (!isLoading) {
        fetchPropertiesInBounds(lat, lng, bounds);
      }
    }, 1000);
    return debouncedFn;
  }, [fetchPropertiesInBounds, isLoading])();

  // Re-initialize the debounced function when its dependencies change
  useEffect(() => {
    // This ensures the debounced function is properly updated
    window.debouncedMapFetch = debouncedFetch;
  }, [debouncedFetch]);

  // Store fetch function in window object for the MapController to access
  useEffect(() => {
    if (fetchPropertiesInBounds && typeof window !== "undefined") {
      // Store reference to fetchPropertiesInBounds in window object
      window.mapFetchPropertiesInBounds = fetchPropertiesInBounds;
    }

    return () => {
      if (typeof window !== "undefined") {
        window.mapFetchPropertiesInBounds = null;
      }
    };
  }, [fetchPropertiesInBounds]);

  // Cleanup for debouncedFetch reference
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.debouncedMapFetch = null;
      }
    };
  }, []);

  // Update viewport width when window resizes
  useEffect(() => {
    const handleResize = () => {
      console.log("🔄 Handling window resize");
      setViewportWidth(window.innerWidth);
      console.log("✅ Viewport width updated:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function MapController() {
    const map = useMap();
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);

    useEffect(() => {
      setMapInstance(map);
      window.mapInstance = map;

      // Add keyboard event listeners for Control key
      const handleKeyDown = (e) => {
        if (e.key === "Control") {
          setIsCtrlPressed(true);
        }
      };

      const handleKeyUp = (e) => {
        if (e.key === "Control") {
          setIsCtrlPressed(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.mapInstance = null;
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [map]);

    // Add event listener for zoom end events to fetch properties in the visible area
    useEffect(() => {
      // Function to fetch properties in the current map bounds
      const handleMapZoomEnd = () => {
        console.log("🔄 Map zoom ended");
        const currentZoom = map.getZoom();
        console.log("✅ Current zoom level:", currentZoom);
        const bounds = map.getBounds();
        const center = bounds.getCenter();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        console.log("Map zoomed or panned. New bounds:", {
          center: [center.lat, center.lng],
          ne: [northEast.lat, northEast.lng],
          sw: [southWest.lat, southWest.lng],
          zoom: map.getZoom(),
        });

        // Use the debounced fetch function from window instead
        if (window.debouncedMapFetch) {
          window.debouncedMapFetch(center.lat, center.lng, bounds);
        }
      };

      // Only add event listener for zoom end events, not for position changes
      map.on("zoomend", handleMapZoomEnd);

      // Add wheel event listener to check for Control key
      const handleWheel = (e) => {
        if (!isCtrlPressed) {
          e.preventDefault();
          return;
        }
      };

      map
        .getContainer()
        .addEventListener("wheel", handleWheel, { passive: false });

      // Clean up event listeners when component unmounts
      return () => {
        map.off("zoomend", handleMapZoomEnd);
        map.getContainer().removeEventListener("wheel", handleWheel);
      };
    }, [map, isCtrlPressed]);

    useEffect(() => {
      if (selectedProperty && selectedProperty.coordinates) {
        const timer = setTimeout(() => {
          map.setView(
            [
              selectedProperty.coordinates.latitude,
              selectedProperty.coordinates.longitude,
            ],
            13
          );
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [map, selectedProperty]);

    return null;
  }

  const CustomMarker = memo(({ property, onSelect }) => {
    if (
      !property.coordinates ||
      !property.coordinates.latitude ||
      !property.coordinates.longitude ||
      isNaN(property.coordinates.latitude) ||
      isNaN(property.coordinates.longitude)
    ) {
      console.warn(
        `Property ${property._id || "unknown"} has invalid coordinates:`,
        property.coordinates
      );
      return null;
    }

    return (
      <Marker
        position={[
          property.coordinates.latitude,
          property.coordinates.longitude,
        ]}
        id={`marker-${property._id}`}
        icon={houseIcon}
        eventHandlers={{
          click: () => {
            onSelect(property);
          },
        }}
      >
        <Popup>
          <div className="p-2 text-center">
            <h3 className="font-semibold">{property.title || "Property"}</h3>
            <p className="text-sm">{property.price || "Price not available"}</p>
          </div>
        </Popup>
      </Marker>
    );
  });

  const getPanelClasses = (state) => {
    const baseClasses = "bg-white rounded-t-xl shadow-2xl overflow-hidden";

    switch (state) {
      case "full":
        return `${baseClasses} h-5/6`;
      case "half":
        return `${baseClasses} h-1/2`;
      case "minimized":
        return `${baseClasses} h-16`;
      default:
        return `${baseClasses} h-1/2`;
    }
  };

  const navigate = useNavigate();

  const handlePropertyClick = (property) => {
    console.log("🔄 Handling property click for:", property.title);
    if (!property || !property.coordinates) {
      console.error("Invalid property or missing coordinates");
      return;
    }

    const { latitude, longitude } = property.coordinates;

    // Validate coordinates
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      console.error("Invalid coordinates:", { latitude, longitude });
      return;
    }

    setSelectedProperty(property);

    // Center map on the property location
    if (mapInstance) {
      mapInstance.setView([latitude, longitude], 15);
      console.log("✅ Map view updated to property location");
    }

    // Navigate to the property detail page with the property data
    navigate(`/property/${property._id}`, { state: { property } });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Filters Panel with states data from API */}
      <FiltersPanel
        isVisible={filtersVisible}
        onClose={handleCloseFilters}
        onApplyFilters={handleFilterChange}
        initialFilters={{
          tab: "buy",
          propertyTypes: filters.propertyType,
          bhk: filters.bhk,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
          state: currentStateCity.state,
          city: currentStateCity.city,
          amenities: filters.amenities || [],
        }}
        statesData={statesData}
      />

      {/* Header with search bar - black background with gold accents */}
      <div className="bg-black text-white shadow-md z-10 sticky top-0 border-b border-gold-500">
        <div className="max-w-7xl mx-auto">
          <SearchBar
            search={handlePropertiesSearch}
            onFilterChange={handleFilterChange}
            onOpenFilters={handleOpenFilters}
            currentStateCity={currentStateCity}
          />
        </div>
      </div>

      {/* Main content area - white background */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
        {/* Property listings panel for desktop (lg and above) */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 h-full overflow-y-auto p-4 flex-col bg-white lg:border-r">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-black">
              <span className="text-gold-600">{properties.length}</span>{" "}
              Properties{" "}
              {currentStateCity.city && `in ${currentStateCity.city}`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCardComponent
                    key={property._id}
                    property={property}
                    isSelected={
                      selectedProperty && selectedProperty._id === property._id
                    }
                    onClick={() => handlePropertyClick(property)}
                  />
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 mx-auto bg-gold-100 rounded-full flex items-center justify-center mb-4">
                    <Home className="w-8 h-8 text-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    No properties found
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Try adjusting your filters or search for a different
                    location
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map area */}
        <div className="flex-1 relative">
          {/* Slidable panel for mobile (max-md) */}
          <motion.div
            ref={panelRef}
            className={`absolute bottom-0 left-0 right-0 z-10 ${
              isSmallScreen ? "" : "lg:hidden"
            } ${getPanelClasses(panelState)}`}
            initial="half"
            animate={panelState}
            variants={panelAnimations}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onDragEnd={(e, info) => {
              if (info.offset.y < -50) {
                setPanelState(panelState === "half" ? "full" : "half");
              } else if (info.offset.y > 50) {
                setPanelState(panelState === "full" ? "half" : "minimized");
              }
            }}
          >
            {/* Handle for dragging */}
            <div className="w-full flex justify-center p-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Panel header */}
            <div className="px-4 py-2 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {properties.length} Properties{" "}
                {currentStateCity.city && `in ${currentStateCity.city}`}
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => setPanelState("half")}>
                  {panelState === "minimized" ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Panel content */}
            {panelState !== "minimized" && (
              <div className="overflow-y-auto h-full p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading properties...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.length > 0 ? (
                      properties.map((property) => (
                        <PropertyCardComponent
                          key={property._id}
                          property={property}
                          isSelected={
                            selectedProperty &&
                            selectedProperty._id === property._id
                          }
                          onClick={() => handlePropertyClick(property)}
                        />
                      ))
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-700 mb-2">
                          No properties found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Try adjusting your filters or search for a different
                          location.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors">
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            whenCreated={(map) => {
              setMapInstance(map);
              window.mapInstance = map;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Add user location marker */}
            {userLocation && userLocation.lat && userLocation.lng && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userLocationIcon}
              >
                <Popup>You are here</Popup>
              </Marker>
            )}
            {Array.isArray(properties) &&
              properties.map((property) => (
                <CustomMarker
                  key={property._id || Math.random().toString(36).substr(2, 9)}
                  property={property}
                  onSelect={setSelectedProperty}
                />
              ))}
            <MapController />
          </MapContainer>

          {/* Map overlay controls with enhanced styling */}
          <div className="absolute top-4 right-4 z-[1000]">
            <div className="bg-black border border-gold-500 rounded-full shadow-lg p-2 flex flex-col space-y-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-900 text-gold-500 transition-colors"
                title="Zoom In (Hold Control)"
                onClick={() => {
                  if (window.mapInstance) {
                    window.mapInstance.zoomIn();
                  }
                }}
              >
                <svg
                  className="w-5 h-5 text-gold-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </button>
              <div className="h-px bg-gray-200 w-full"></div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-900 text-gold-500 transition-colors"
                title="Zoom Out (Hold Control)"
                onClick={() => {
                  if (window.mapInstance) {
                    window.mapInstance.zoomOut();
                  }
                }}
              >
                <svg
                  className="w-5 h-5 text-gold-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 12H6"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="mt-2 bg-black border border-gold-500 rounded-full shadow-lg p-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-900 text-gold-500 transition-colors"
                title="My Location"
                onClick={() => {
                  if (navigator.geolocation && window.mapInstance) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        window.mapInstance.setView([latitude, longitude], 13);
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                        alert(
                          "Could not get your location. Please check your browser permissions."
                        );
                      }
                    );
                  } else {
                    alert("Geolocation is not supported by your browser.");
                  }
                }}
              >
                <svg
                  className="w-5 h-5 text-gold-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
