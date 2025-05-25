import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationArrow, FaUser } from "react-icons/fa";
import axios from "axios";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom marker icon for property with price
const createCustomIcon = (price) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-content">₹${price}</div>`,
    iconSize: [50, 30],
  });
};

// Custom user location icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div class="user-location-pulse-container">
        <div class="user-location-outer-circle"></div>
        <div class="user-location-middle-circle"></div>
        <div class="user-location-inner-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Helper function to get cities from multiple coordinates within bounds
const getCitiesInBounds = async (bounds) => {
  const cities = new Set();
  const promises = [];
  
  // Sample multiple points within the bounds to get different cities
  const samplePoints = [
    // Center
    [(bounds.ne[0] + bounds.sw[0]) / 2, (bounds.ne[1] + bounds.sw[1]) / 2],
    // Northeast
    [bounds.ne[0], bounds.ne[1]],
    // Southwest  
    [bounds.sw[0], bounds.sw[1]],
    // Northwest
    [bounds.ne[0], bounds.sw[1]],
    // Southeast
    [bounds.sw[0], bounds.ne[1]],
    // Quarter points for better coverage
    [bounds.ne[0] * 0.75 + bounds.sw[0] * 0.25, bounds.ne[1] * 0.75 + bounds.sw[1] * 0.25],
    [bounds.ne[0] * 0.25 + bounds.sw[0] * 0.75, bounds.ne[1] * 0.25 + bounds.sw[1] * 0.75],
  ];

  // Create promises for each sample point
  samplePoints.forEach(([lat, lng]) => {
    const promise = fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`
    )
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (data && data.address) {
          const city = 
            data.address.city || 
            data.address.town || 
            data.address.village || 
            data.address.county || 
            data.address.state_district;
          
          if (city && city !== "Unknown") {
            cities.add(city);
          }
        }
      })
      .catch(error => {
        console.warn("Failed to fetch city for coordinates:", [lat, lng], error);
      });
    
    promises.push(promise);
  });

  // Wait for all requests to complete (with timeout)
  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.warn("Some city requests failed:", error);
  }

  return Array.from(cities);
};

// Component to display current map bounds information
const MapBoundsDisplay = ({ filters, visibleCities }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!filters?.bounds) return null;

  const { bounds, city, viewport } = filters;

  return (
    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm py-2 px-3 rounded-lg shadow-md z-[1000] text-xs max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">Current Map Area</h4>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-500 hover:text-gray-700 ml-2"
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>
      
      {isVisible && (
        <div className="flex flex-col gap-1">
          {city && (
            <div className="border-b pb-1 mb-1">
              <span className="font-medium">Primary City:</span> {city}
            </div>
          )}
          
          {visibleCities && visibleCities.length > 0 && (
            <div className="border-b pb-1 mb-1">
              <span className="font-medium">All Cities ({visibleCities.length}):</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {visibleCities.map((cityName, index) => {
  // Remove 'tehsil' (and common misspellings) from city name
  const cleanedCity = cityName.replace(/teh?s?i?l/gi, '').replace(/\s+/g, ' ').trim();
  return (
    <span 
      key={index} 
      className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs"
    >
      {cleanedCity}
    </span>
  );
})}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-600 mt-1">
            🔄 Updates automatically when map moves
          </div>
        </div>
      )}
    </div>
  );
};

// Optional Mouse Tracker Component (can be enabled/disabled)
const MouseTracker = ({ setFilters, enabled = false }) => {
  const [mouseCoords, setMouseCoords] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const fetchTimeoutRef = useRef(null);
  const lastFetchCoordsRef = useRef(null);

  const map = useMapEvents({
    mousemove: enabled ? (e) => {
      const { lat, lng } = e.latlng;
      setMouseCoords([lat, lng]);

      // Clear existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Debounce the city fetching - only fetch after mouse stops for 500ms
      fetchTimeoutRef.current = setTimeout(() => {
        fetchCityForCoordinates(lat, lng);
      }, 500);
    } : () => {}
  });

  const fetchCityForCoordinates = async (lat, lng) => {
    if (!enabled) return;
    
    // Skip if coordinates haven't changed much (within ~100m)
    if (lastFetchCoordsRef.current) {
      const [lastLat, lastLng] = lastFetchCoordsRef.current;
      const distance = Math.sqrt(
        Math.pow((lat - lastLat) * 111000, 2) + 
        Math.pow((lng - lastLng) * 111000 * Math.cos(lat * Math.PI / 180), 2)
      );
      
      if (distance < 100) {
        return; // Skip if moved less than 100 meters
      }
    }

    try {
      setIsLoadingCity(true);
      console.log("🌍 Fetching city for mouse coordinates:", [lat, lng]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch location data: ${response.status}`);
      }

      const data = await response.json();
      console.log("📍 Mouse location data received:", data);

      // Extract city information from the response
      const city = 
        data.address?.city || 
        data.address?.town || 
        data.address?.village || 
        data.address?.county || 
        data.address?.state_district ||
        "Unknown";

      console.log("🏙️ City detected from mouse position:", city);
      
      // Only update if city has changed
      if (city !== currentCity && city !== "Unknown") {
        setCurrentCity(city);
        
        // Note: Mouse tracker no longer updates filters automatically
        // The map bounds tracker handles the main filtering
        console.log("🗺️ Mouse detected city (info only):", city);
      }

      lastFetchCoordsRef.current = [lat, lng];
    } catch (error) {
      console.error("❌ Error fetching city from mouse coordinates:", error);
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Mouse coordinates display */}
      {mouseCoords && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-lg shadow-md z-[1000] text-xs">
          <div className="flex flex-col gap-1">
            <div className="font-medium text-center">Mouse Position</div>
            <div>
              <span className="font-medium">Lat:</span> {mouseCoords[0].toFixed(6)}
            </div>
            <div>
              <span className="font-medium">Lng:</span> {mouseCoords[1].toFixed(6)}
            </div>
            {currentCity && (
              <div className="border-t pt-1 mt-1">
                <span className="font-medium">City:</span> {currentCity}
              </div>
            )}
          </div>
          {isLoadingCity && (
            <div className="flex items-center gap-1 mt-1 pt-1 border-t">
              <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
              <span className="text-xs">Loading city...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Component to handle map events with debounce and enhanced logging
const MapEvents = ({ onBoundsChange }) => {
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const map = useMapEvents({
    movestart: () => {
      console.log("🗺️ Map movement started");
      setIsLoading(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    moveend: () => {
      console.log("🗺️ Map movement ended");

      // Clear any existing timeout to reset the timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout that will trigger after 1 second
      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        const mapBounds = {
          ne: [bounds._northEast.lat, bounds._northEast.lng],
          sw: [bounds._southWest.lat, bounds._southWest.lng],
        };

        // Enhanced logging for debugging
        console.log("📍 Map bounds updated:", {
          northEast: {
            lat: bounds._northEast.lat,
            lng: bounds._northEast.lng,
          },
          southWest: {
            lat: bounds._southWest.lat,
            lng: bounds._southWest.lng,
          },
        });

        console.log("🔍 Filter coordinates being sent:", mapBounds);

        // Get current map center and zoom for additional context
        const center = map.getCenter();
        const zoom = map.getZoom();
        console.log("📌 Map center:", { lat: center.lat, lng: center.lng });
        console.log("🔍 Map zoom level:", zoom);

        // Calculate the area being viewed
        const latDiff = bounds._northEast.lat - bounds._southWest.lat;
        const lngDiff = bounds._northEast.lng - bounds._southWest.lng;
        console.log("📐 Map view area:", {
          latitudeSpan: latDiff.toFixed(6),
          longitudeSpan: lngDiff.toFixed(6),
          approximateKmSpan: {
            lat: (latDiff * 111).toFixed(2) + " km", // rough conversion
            lng:
              (lngDiff * 111 * Math.cos((center.lat * Math.PI) / 180)).toFixed(
                2
              ) + " km",
          },
        });

        // Call the onBoundsChange function with the updated bounds
        onBoundsChange(mapBounds);
        setIsLoading(false);

        console.log("✅ Map bounds filter update completed");
      }, 1000);
    },
    zoomend: () => {
      const zoom = map.getZoom();
      console.log("🔍 Map zoom changed to:", zoom);
    },
  });

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow-md z-[1000] flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      )}
    </>
  );
};

// Component to update map center when prop changes
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    console.log("🎯 Map view changing to:", center);
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

// Map Controls
const MapControls = ({ userLocation, centerOnUserLocation }) => {
  const map = useMap();
  const [locationClicked, setLocationClicked] = useState(false);

  const handleZoomIn = () => {
    console.log("➕ Zooming in");
    map.zoomIn();
  };

  const handleZoomOut = () => {
    console.log("➖ Zooming out");
    map.zoomOut();
  };

  const handleCenterOnUserLocation = () => {
    console.log("📍 Centering on user location");
    centerOnUserLocation();

    // Visual feedback when clicked
    setLocationClicked(true);
    setTimeout(() => {
      setLocationClicked(false);
    }, 1000);
  };

  return (
    <div className="absolute right-2.5 top-2.5 z-[1000] flex flex-col gap-2.5">
      <button
        className={`w-12 h-12 flex items-center justify-center ${
          locationClicked ? "bg-blue-500 text-white" : "bg-white"
        } border ${
          userLocation ? "border-blue-500" : "border-gray-300"
        } rounded-lg shadow-md text-lg cursor-pointer hover:bg-blue-50 transition-all ${
          locationClicked ? "animate-pulse" : ""
        }`}
        onClick={handleCenterOnUserLocation}
        title="Go to your location"
      >
        <FaLocationArrow
          className={
            userLocation
              ? locationClicked
                ? "text-white"
                : "text-blue-500"
              : ""
          }
          size={20}
        />
      </button>
      <button
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md text-lg cursor-pointer hover:scale-105 transition-transform"
        onClick={handleZoomIn}
        title="Zoom in"
      >
        +
      </button>
      <button
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md text-lg cursor-pointer hover:scale-105 transition-transform"
        onClick={handleZoomOut}
        title="Zoom out"
      >
        -
      </button>
    </div>
  );
};

// Property popup component updated for new property structure
const PropertyPopup = ({ property }) => {
  // Get a placeholder image if no images available
  const propertyImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "/api/placeholder/400/300";

  // Format price display
  const formatPrice = (price) => {
    if (!price) return "Price not available";

    // Convert to number if it's a string
    const numPrice = typeof price === "string" ? parseInt(price, 10) : price;

    // Format with Indian numbering system (if it's a valid number)
    if (isNaN(numPrice)) return price;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <img
        src={propertyImage}
        alt={property.project || "Property"}
        className="w-full h-[150px] object-cover"
      />
      <div className="p-3">
        <h3 className="text-base font-medium mb-2">
          {property.project || "Property"}{" "}
          {property.builder ? `by ${property.builder}` : ""}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-sm">
            {property.bhk} BHK {property.type} in {property.city}
          </p>
          <p className="text-sm">{property.address}</p>
          <div className="flex justify-between mt-1">
            <p className="text-sm font-medium">{property.availableFor}</p>
            <p className="text-sm font-semibold">
              {formatPrice(property.minimumPrice)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Map = ({
  properties = [],
  setProperties,
  selectedProperty,
  setSelectedProperty,
  mapCenter = [28.6139, 77.2090], // Default to Delhi
  setMapCenter,
  setMapBounds,
  filters,
  setFilters,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [useUserLocationOnLoad, setUseUserLocationOnLoad] = useState(true);
  const [locationError, setLocationError] = useState(null);
  
  // NEW STATE: Track all cities visible in current map bounds
  const [visibleCities, setVisibleCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  const mapRef = useRef(null);

  // Enhanced logging for props and state changes
  useEffect(() => {
    console.log("🏠 Properties received:", {
      count: Array.isArray(properties) ? properties.length : 0,
      properties: properties,
    });
  }, [properties]);

  useEffect(() => {
    console.log("🎯 Map center changed to:", mapCenter);
  }, [mapCenter]);

  // Log current filters when they change
  useEffect(() => {
    if (filters) {
      console.log("🔍 Current filters:", {
        coordinates: filters.coordinates,
        priceRange: filters.priceRange,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        propertyType: filters.propertyType,
        city: filters.city,
        categoryFilter: filters.categoryFilter,
        visibleCities: filters.visibleCities,
      });
    }
  }, [filters]);

  
useEffect(() => {
  if (visibleCities && visibleCities.length > 0) {
    // Remove 'tehsil' and common misspellings from each city name
    const cleanedCities = visibleCities.map(cityName => cityName.replace(/teh?s?i?l/gi, '').replace(/\s+/g, ' ').trim());
    const params = {
      city: cleanedCities.join(",")
    };
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/advancedSearch`, { params })
      .then(response => {
        // Handle response here if needed
        console.log("Advanced search response:", response.data);
      })
      .catch(error => {
        console.error("Advanced search error:", error);
      });
  }
}, [visibleCities]);


  // NEW: Effect to update properties when visible cities change
  useEffect(() => {
    if (visibleCities.length > 0 && typeof setProperties === 'function') {
      console.log("🏙️ Visible cities changed, updating properties:", visibleCities);
      
      // Call setProperties with the visible cities array as parameter
      // This allows the parent component to filter/fetch properties based on cities
      setProperties(prevProperties => {
        console.log("🔄 Properties update triggered by cities:", {
          previousCount: Array.isArray(prevProperties) ? prevProperties.length : 0,
          visibleCities: visibleCities,
        });
        
        // If setProperties is expected to handle the cities parameter differently,
        // you might need to modify this based on your parent component's implementation
        return prevProperties;
      });
    }
  }, [visibleCities, setProperties]);

  // Enhanced function to update filters with visible map area bounds
  const enhancedSetMapBounds = async (bounds) => {
    console.log("🔄 setMapBounds called with visible area bounds:", bounds);
    setIsLoadingCities(true);

    try {
      // Get all cities within the current bounds
      console.log("🌍 Fetching all cities within bounds...");
      const cities = await getCitiesInBounds(bounds);
      console.log("🏙️ Cities found in current view:", cities);
      
      // Update visible cities state
      setVisibleCities(cities);

      // Update the legacy setMapBounds if provided (for backward compatibility)
      if (typeof setMapBounds === "function") {
        setMapBounds(bounds);
        console.log("✅ setMapBounds function executed");
      }

      // Update filters with the entire visible map area bounds
      if (typeof setFilters === "function") {
        // Get center coordinates from bounds for reverse geocoding
        const centerLat = (bounds.ne[0] + bounds.sw[0]) / 2;
        const centerLng = (bounds.ne[1] + bounds.sw[1]) / 2;
        
        console.log("🌍 Fetching primary location data for map center:", [centerLat, centerLng]);
        
        // Fetch location information using reverse geocoding for the center
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${centerLat}&lon=${centerLng}`
        );
        
        let primaryCity = "Any";
        if (response.ok) {
          const data = await response.json();
          console.log("📍 Primary location data received:", data);
          
          // Extract city information from the response
          primaryCity = 
            data.address?.city || 
            data.address?.town || 
            data.address?.village || 
            data.address?.county || 
            "Any";
        }
        
        console.log("📍 Primary location fetched:", primaryCity);

        // Create comprehensive bounds filter with all corner coordinates
        const mapAreaFilter = {
          // Bounding box coordinates (standard format)
          boundingBox: {
            northEast: { lat: bounds.ne[0], lng: bounds.ne[1] },
            southWest: { lat: bounds.sw[0], lng: bounds.sw[1] },
            northWest: { lat: bounds.ne[0], lng: bounds.sw[1] },
            southEast: { lat: bounds.sw[0], lng: bounds.ne[1] }
          },
          // Center coordinates
          center: { lat: centerLat, lng: centerLng },
          // Array format for API compatibility
          coordinates: bounds,
          // Legacy format
          ne: bounds.ne,
          sw: bounds.sw
        };

        console.log("🗺️ Map area filter created:", mapAreaFilter);

        // Update filters with comprehensive map area data
        setFilters((prevFilters) => {
          const newFilters = {
            ...prevFilters,
            // Main map area filter
            mapArea: mapAreaFilter,
            // Center coordinates (for backward compatibility)
            coordinates: [centerLat, centerLng],
            // Bounding box (common API format)
            bounds: bounds,
            // Primary city from center point
            city: primaryCity,
            // NEW: All visible cities in the current map bounds
            visibleCities: cities,
            // Viewport info for debugging
            viewport: {
              area: {
                latSpan: (bounds.ne[0] - bounds.sw[0]).toFixed(6),
                lngSpan: (bounds.ne[1] - bounds.sw[1]).toFixed(6),
                approximateKmArea: {
                  lat: ((bounds.ne[0] - bounds.sw[0]) * 111).toFixed(2) + " km",
                  lng: ((bounds.ne[1] - bounds.sw[1]) * 111 * Math.cos(centerLat * Math.PI / 180)).toFixed(2) + " km"
                }
              }
            }
          };

          console.log("🗺️ Updated filters with complete map area and cities:", {
            previousBounds: prevFilters.bounds,
            newBounds: bounds,
            previousCity: prevFilters.city,
            newCity: primaryCity,
            previousVisibleCities: prevFilters.visibleCities,
            newVisibleCities: cities,
            mapAreaFilter: mapAreaFilter,
            fullFilters: newFilters,
          });

          return newFilters;
        });

        console.log("✅ Filters updated with complete visible map area and all cities");
      } else {
        console.error("❌ setFilters is not a function:", typeof setFilters);
      }
    } catch (error) {
      console.error("❌ Error in enhancedSetMapBounds:", error);
      
      // If anything fails, still update with basic bounds data
      const centerLat = (bounds.ne[0] + bounds.sw[0]) / 2;
      const centerLng = (bounds.ne[1] + bounds.sw[1]) / 2;
      
      const mapAreaFilter = {
        boundingBox: {
          northEast: { lat: bounds.ne[0], lng: bounds.ne[1] },
          southWest: { lat: bounds.sw[0], lng: bounds.sw[1] },
          northWest: { lat: bounds.ne[0], lng: bounds.sw[1] },
          southEast: { lat: bounds.sw[0], lng: bounds.ne[1] }
        },
        center: { lat: centerLat, lng: centerLng },
        coordinates: bounds,
        ne: bounds.ne,
        sw: bounds.sw
      };

      if (typeof setFilters === "function") {
        setFilters((prevFilters) => ({
          ...prevFilters,
          mapArea: mapAreaFilter,
          coordinates: [centerLat, centerLng],
          bounds: bounds,
          visibleCities: visibleCities, // Use whatever cities were found before error
        }));
      }
      
      console.log("✅ Filters updated with bounds (partial data due to error)");
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Get user's location on component mount
  useEffect(() => {
    console.log("🌍 Initializing geolocation...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          console.log("📍 User location obtained:", userCoords);
          console.log(
            "🎯 Location accuracy:",
            position.coords.accuracy,
            "meters"
          );
          setUserLocation(userCoords);

          // Center on user's location when component first loads if the preference is enabled
          if (useUserLocationOnLoad) {
            console.log(
              "🎯 Centering on user location on initial load:",
              userCoords
            );
            setMapCenter(userCoords);
          }

          setShowUserLocation(true);
        },
        (error) => {
          console.error("❌ Error getting user location:", error);
          setLocationError(error.message);

          // Show more specific error messages based on error code
          let errorMsg = "Unable to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg +=
                " Please enable location services in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg +=
                " Location information is unavailable. Try again later.";
              break;
            case error.TIMEOUT:
              errorMsg += " The request to get your location timed out.";
              break;
            default:
              errorMsg += " Please enable location services and try again.";
          }
          console.error("🚨 Location error details:", errorMsg);
          setLocationError(errorMsg);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 10000, // Wait for 10 seconds max
          maximumAge: 0, // Don't use cached position
        }
      );
    } else {
      console.error("❌ Geolocation is not supported by this browser.");
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, [useUserLocationOnLoad, setMapCenter]);

  // Function to center the map on user's location (must be defined before JSX usage)
  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userCoords);
          setShowUserLocation(true);
          setMapCenter(userCoords);
          setLocationError(null);
          console.log("📍 User location fetched by button:", userCoords);
        },
        (error) => {
          let errorMsg = "Unable to get your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += " Please enable location services in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += " Location information is unavailable. Try again later.";
              break;
            case error.TIMEOUT:
              errorMsg += " The request to get your location timed out.";
              break;
            default:
              errorMsg += " Please enable location services and try again.";
          }
          setLocationError(errorMsg);
          setShowUserLocation(false);
          console.error("🚨 Location error details (button):", errorMsg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      const errorMsg = "Geolocation is not supported by this browser.";
      setLocationError(errorMsg);
      setShowUserLocation(false);
      console.error("❌ ", errorMsg);
    }
  };

  // Filter properties that have valid coordinates
  const validProperties = Array.isArray(properties) 
    ? properties.filter(property => 
        property.latitude && 
        property.longitude && 
        !isNaN(parseFloat(property.latitude)) && 
        !isNaN(parseFloat(property.longitude))
      )
    : [];

  console.log("🏠 Valid properties for map display:", {
    total: properties.length,
    valid: validProperties.length,
    invalid: properties.length - validProperties.length
  });

  return (
    <div className="relative w-full h-full">
      {/* Add custom CSS for markers */}
      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .marker-content {
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .marker-content:hover {
          background: #1d4ed8;
          transform: scale(1.05);
        }

        .user-location-marker {
          background: transparent !important;
          border: none !important;
        }

        .user-location-pulse-container {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .user-location-outer-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .user-location-middle-circle {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 20px;
          height: 20px;
          background: rgba(59, 130, 246, 0.4);
          border-radius: 50%;
          animation: pulse 2s infinite 0.5s;
        }

        .user-location-inner-dot {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 10px;
          height: 10px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
        }

        .leaflet-popup-content {
          margin: 0;
          min-width: 250px;
        }
      `}</style>

      {/* Map Bounds Display */}
      <MapBoundsDisplay filters={filters} visibleCities={visibleCities} />

      {/* Loading Cities Indicator */}
      {isLoadingCities && (
        <div className="absolute top-16 left-2 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-lg shadow-md z-[1000] text-xs flex items-center gap-2">
          <div className="animate-spin h-3 w-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
          <span>Loading cities...</span>
        </div>
      )}

      {/* Location Error Display */}
      {locationError && (
        <div className="absolute bottom-2 left-2 bg-red-100 border border-red-300 text-red-700 py-2 px-3 rounded-lg shadow-md z-[1000] text-xs max-w-xs">
          <div className="flex items-center justify-between">
            <span>{locationError}</span>
            <button
              onClick={() => setLocationError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false} // Disable default zoom controls since we have custom ones
      >
        {/* Map Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Map Events Handler */}
        <MapEvents onBoundsChange={enhancedSetMapBounds} />

        {/* Change Map View Component */}
        <ChangeMapView center={mapCenter} />

        {/* Mouse Tracker (disabled by default, can be enabled for debugging) */}
        <MouseTracker setFilters={setFilters} enabled={false} />

        {/* User Location Marker */}
        {showUserLocation && userLocation && (
          <Marker
            position={userLocation}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaUser className="text-blue-500" />
                  <span className="font-medium">Your Location</span>
                </div>
                <p className="text-xs text-gray-600">
                  Lat: {userLocation[0].toFixed(6)}<br/>
                  Lng: {userLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Property Markers */}
        {validProperties.map((property, index) => {
          const lat = parseFloat(property.latitude);
          const lng = parseFloat(property.longitude);
          
          // Create custom marker with price
          const customIcon = createCustomIcon(
            property.minimumPrice 
              ? (typeof property.minimumPrice === 'string' 
                  ? property.minimumPrice 
                  : property.minimumPrice.toLocaleString('en-IN'))
              : 'N/A'
          );

          return (
            <Marker
              key={property.id || index}
              position={[lat, lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  console.log("🏠 Property marker clicked:", property);
                  if (setSelectedProperty) {
                    setSelectedProperty(property);
                  }
                },
              }}
            >
              <Popup maxWidth={300} minWidth={250}>
                <PropertyPopup property={property} />
              </Popup>
            </Marker>
          );
        })}

        {/* Map Controls */}
        <MapControls 
          userLocation={userLocation} 
          centerOnUserLocation={centerOnUserLocation} 
        />
      </MapContainer>

      {/* Properties Count Display */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-lg shadow-md z-[1000] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium">Properties:</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {validProperties.length}
          </span>
          {properties.length !== validProperties.length && (
            <span className="text-gray-500">
              ({properties.length - validProperties.length} hidden)
            </span>
          )}
        </div>
        {visibleCities.length > 0 && (
          <div className="mt-1 pt-1 border-t">
            <span className="text-gray-600">
              Cities: {visibleCities.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;