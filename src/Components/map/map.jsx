import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapPin,
  Building,
  Bed,
  Bath,
  Square,
  Tag,
  Search,
  Navigation,
  Home,
  Star,
  Calendar,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "/home-icon.png",
  iconRetinaUrl: "/home-icon.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "custom-house-icon",
});

// Map controller component to handle center changes
function MapController({ center, zoom, selectedProperty }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  // Handle popup opening when selectedProperty changes
  useEffect(() => {
    if (selectedProperty && selectedProperty.coordinates) {
      const [lat, lng] =
        selectedProperty.displayCoordinates || selectedProperty.coordinates;

      // Find the marker and open its popup
      map.eachLayer((layer) => {
        if (
          layer.options &&
          layer.options.propertyId === selectedProperty._id
        ) {
          // Center the map on the marker
          map.setView([lat, lng], 15);
          // Open the popup after a short delay to ensure map is centered
          setTimeout(() => {
            layer.openPopup();
          }, 100);
        }
      });
    }
  }, [map, selectedProperty]);

  return null;
}

// Map event handler component
function MapEvents({ onBoundsChange }) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      onBoundsChange({
        neLat: bounds.getNorthEast().lat,
        neLng: bounds.getNorthEast().lng,
        swLat: bounds.getSouthWest().lat,
        swLng: bounds.getSouthWest().lng,
      });
    };

    map.on("moveend", handleMoveEnd);

    // Trigger initial bounds fetch
    handleMoveEnd();

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, onBoundsChange]);

  return null;
}

// Enhanced Popup Component
// Enhanced Popup Component - Updated Version
const PropertyPopup = ({ property }) => {
  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("ready")) return "bg-green-100 text-green-700";
    if (statusLower.includes("construction"))
      return "bg-orange-100 text-orange-700";
    if (statusLower.includes("launched")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  // Get full address
  const getFullAddress = () => {
    const addressParts = [
      property.sector,
      property.locality,
      property.city,
      property.state,
      property.pincode,
    ].filter(Boolean);

    return addressParts.length > 0
      ? addressParts.join(", ")
      : "Address not available";
  };

  return (
    <div className="min-w-[260px] max-w-[280px] z-[9999] p-0 m-0 relative">
      {/* Close Button */}
      {/* <button 
        className="absolute -top-2 -right-2 z-20 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow p-1.5 border border-gray-200"
        onClick={(e) => {
          e.stopPropagation();
          // Close popup functionality can be added here if needed
        }}
      >
        <svg className="w-5 h-5 text-gray-600 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> */}

      {/* Header Section - No Image */}
      <div className="relative  border rounded-xl border-1 border-gray-300 rounded-t-lg p-4">
        {/* Status Badge */}
        {property.status && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                property.status
              )}`}
            >
              {property.status}
            </span>
          </div>
        )}

        {/* Multiple Properties Indicator */}
        {property.isOffset && (
          <div className="absolute top-2 left-2">
            <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 text-xs font-medium rounded-full flex items-center">
              <Building className="h-3 w-3 mr-1" />
              Multiple
            </span>
          </div>
        )}

        {/* Project Name */}
        <h3 className="font-bold text-lg text-black mb-2 leading-tight mt-4">
          {property.project}
        </h3>

        {/* Price - Prominent in header */}
        <div className="flex items-center text-white">
          {/* <IndianRupee className="h-5 w-5 mr-1 text-green-400" /> */}
          <span className="font-bold text-xl text-green-400">
            {formatPrice(property.minimumPrice)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 bg-white">
        {/* Full Address */}
        <div className="flex items-start text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm font-medium leading-relaxed">
            {getFullAddress()}
          </span>
        </div>

        {/* Key Information Grid - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* BHK Configuration */}
          {property.bhk && (
            <div className="flex items-center">
              <div className="bg-blue-50 p-1.5 rounded mr-2">
                <Bed className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                {/* <p className="text-xs text-gray-500">Config</p> */}
                <p className="font-semibold text-blue-600 text-sm">
                  {property.bhk} BHK
                </p>
              </div>
            </div>
          )}

          {/* Area (if available) */}
          {property.area && (
            <div className="flex items-center">
              <div className="bg-purple-50 p-1.5 rounded mr-2">
                <Square className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Area</p>
                <p className="font-semibold text-purple-600 text-sm">
                  {property.area}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Developer (if available) */}
        {property.developer && (
          <div className="flex items-center mb-3">
            <div className="bg-orange-50 p-1.5 rounded mr-2">
              <Building className="h-3 w-3 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Developer</p>
              <p className="font-semibold text-orange-600 text-sm truncate">
                {property.developer}
              </p>
            </div>
          </div>
        )}

        {/* Top Amenities - Compact */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <Star className="h-3 w-3 mr-1" />
              Amenities
            </p>
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-1">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Possession Date (if available) */}
        {property.possessionDate && (
          <div className="flex items-center mb-3 text-sm text-gray-600">
            <Calendar className="h-3 w-3 mr-2 text-gray-500" />
            <span className="text-xs">
              Possession: {property.possessionDate}
            </span>
          </div>
        )}

        {/* View Property Button - Compact */}
        <a
          href={`/property-details/${property._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-[#0E1524] to-[#1a2332] !text-white no-underline visited:!text-white hover:!text-white active:!text-white py-2.5 px-3 rounded-lg hover:from-[#1a2332] hover:to-[#2a3442] transition-all duration-200 text-xs font-semibold text-center shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          View Details
        </a>
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      await onSearch(searchQuery);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 bg-white">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          placeholder="Search properties"
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#0E1524] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, isSelected, scrollToSection }) => {
  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div
      onClick={() => {
        scrollToSection();
      }}
      className={`bg-white rounded-lg shadow-md p-3 mb-3 hover:shadow-lg transition-shadow ${
        isSelected ? "ring-2 ring-[#0E1524]" : ""
      }`}
    >
      <div className="relative h-32 overflow-hidden bg-gray-200 rounded-lg mb-2">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].path}
            alt={property.project}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img
              src={"/iPropLogo.6ed8e014.svg"}
              alt={property.project}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {property.status && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                property.status.toLowerCase().includes("ready")
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {property.status}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {property.project}
      </h3>

      <div className="flex items-center text-gray-600 text-xs mb-1">
        <MapPin className="h-3 w-3 mr-1" />
        <span className="line-clamp-1">
          {[property.sector, property.city].filter(Boolean).join(", ")}
        </span>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="text-[#0E1524] font-semibold text-sm">
          {formatPrice(property.minimumPrice)}
        </div>
        {property.bhk && (
          <div className="text-gray-600 text-xs">{property.bhk} BHK</div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {property.amenities?.slice(0, 3).map((amenity, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function MapComponent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.209]); // Delhi coordinates
  const [zoom, setZoom] = useState(10);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const lastBoundsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const mapRef = useRef(null); // Add this ref for map instance

  const navigate = useNavigate();
  const location = useLocation();


  // mobile scroll setup
  const sectionRef = useRef(null);

  const clearQueryParams = () => {
    navigate(location.pathname, { replace: true });
  };

  const scrollToSection = () => {
    if (window.innerWidth <= 768) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper function to validate coordinates
  const isValidCoordinates = (coordinates) => {
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return false;
    }
    const [lat, lng] = coordinates; // Backend sends [lat, lng]
    const isValid =
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      lat !== 0 &&
      lng !== 0;
    return isValid;
  };

  // Function to calculate offset positions for overlapping markers
  const calculateMarkerPositions = (properties) => {
    const positionMap = new Map();
    const offsetProperties = [];

    properties.forEach((property) => {
      if (!isValidCoordinates(property.coordinates)) return;

      const [lat, lng] = property.coordinates;
      const key = `${lat.toFixed(6)}_${lng.toFixed(6)}`; // Create a key for exact location matching

      if (!positionMap.has(key)) {
        positionMap.set(key, []);
      }
      positionMap.get(key).push(property);
    });

    // Process each location group
    positionMap.forEach((propertiesAtLocation, locationKey) => {
      if (propertiesAtLocation.length === 1) {
        // Single property at this location - no offset needed
        offsetProperties.push({
          ...propertiesAtLocation[0],
          displayCoordinates: propertiesAtLocation[0].coordinates,
        });
      } else {
        // Multiple properties at same location - apply offsets
        const [baseLat, baseLng] = propertiesAtLocation[0].coordinates;

        propertiesAtLocation.forEach((property, index) => {
          let offsetLat = baseLat;
          let offsetLng = baseLng;

          if (index > 0) {
            // Calculate offset for properties after the first one
            // Create a small circular pattern around the original point
            const offsetDistance = 0.0001; // Small offset in degrees (~11 meters)
            const angle = (2 * Math.PI * index) / propertiesAtLocation.length;

            offsetLat = baseLat + offsetDistance * Math.cos(angle);
            offsetLng = baseLng + offsetDistance * Math.sin(angle);
          }

          offsetProperties.push({
            ...property,
            displayCoordinates: [offsetLat, offsetLng],
            originalCoordinates: property.coordinates,
            isOffset: index > 0,
          });
        });
      }
    });

    return offsetProperties;
  };

  // Fetch properties based on map bounds
  const fetchPropertiesByBounds = async (bounds) => {
    // Check if bounds have actually changed
    if (
      lastBoundsRef.current &&
      lastBoundsRef.current.neLat === bounds.neLat &&
      lastBoundsRef.current.neLng === bounds.neLng &&
      lastBoundsRef.current.swLat === bounds.swLat &&
      lastBoundsRef.current.swLng === bounds.swLng
    ) {
      return; // Skip if bounds haven't changed
    }

    // Update last bounds
    lastBoundsRef.current = bounds;

    console.log("Fetching properties for bounds:", bounds);
    setLoading(true);

    clearQueryParams();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/searchByBounds`,
        {
          params: {
            neLat: bounds.neLat,
            neLng: bounds.neLng,
            swLat: bounds.swLat,
            swLng: bounds.swLng,
          },
        }
      );

      console.log("Properties fetched by bounds:", response.data);

      if (response.data && response.data.projects) {
        const validProperties = response.data.projects.filter((property) => {
          const isValid = isValidCoordinates(property.coordinates);
          if (!isValid) {
            console.log(
              "Invalid coordinates for property:",
              property.project,
              property.coordinates
            );
          }
          return isValid;
        });

        console.log("Valid properties in bounds:", validProperties.length);
        setProperties(validProperties);
      } else {
        console.log("No properties found in bounds");
        setProperties([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching properties by bounds:", err);
      setError("Failed to fetch properties. Please try again.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // width setting
  const [width, setWidth] = useState(window.innerWidth);

  // Update width on window resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle map bounds change
  const handleBoundsChange = (bounds) => {
    if (width < 768) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        fetchPropertiesByBounds(bounds);
      }, 500);
      return;
    } else {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        fetchPropertiesByBounds(bounds);
      }, 500);

      window.scrollTo(0, 0);
      return;
    }
  };

  // Handle marker click
  const handleMarkerClick = (property) => {
    if(window.innerWidth <= 768) {
      // Scroll to section on mobile
      window.scrollTo(0, 0);
      // sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } 
    console.log("Marker clicked:", property.project);
    if (!isValidCoordinates(property.coordinates)) return;

    setSelectedProperty(property);

    // Use original coordinates for centering, not display coordinates
    // const [lat, lng] = property.originalCoordinates || property.coordinates;
    // setMapCenter([lat, lng]);
    // setZoom(15);
  };

  // Handle property card click
  const handlePropertyClick = (property) => {
    console.log("Property card clicked:", property.project);
    handleMarkerClick(property);
  };

  // Get valid properties for map with offset calculations
  const validPropertiesForMap = calculateMarkerPositions(
    properties.filter((property) => {
      const isValid = isValidCoordinates(property.coordinates);
      console.log(
        "Property:",
        property.project,
        "Valid coords:",
        isValid,
        "Coords:",
        property.coordinates
      );
      return isValid;
    })
  );

  console.log("Total properties:", properties.length);
  console.log("Valid properties for map:", validPropertiesForMap.length);
  console.log("Map center:", mapCenter);
  console.log("Map zoom:", zoom);

  // Function to get location from IP address (fallback)
const getLocationFromIP = async () => {
  try {
    // Using ipapi.co - free and reliable IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch IP location');
    }

    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city,
        region: data.region,
        country: data.country_name,
        accuracy: 50000 // IP-based location is less accurate
      };
    } else {
      throw new Error('Invalid location data from IP service');
    }
  } catch (error) {
    console.error('IP location service failed:', error);
    
    // Fallback to a second IP service
    try {
      const fallbackResponse = await fetch('http://ip-api.com/json/', {
        method: 'GET',
      });
      
      if (!fallbackResponse.ok) {
        throw new Error('Fallback IP service failed');
      }
      
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.status === 'success' && fallbackData.lat && fallbackData.lon) {
        return {
          lat: parseFloat(fallbackData.lat),
          lng: parseFloat(fallbackData.lon),
          city: fallbackData.city,
          region: fallbackData.regionName,
          country: fallbackData.country,
          accuracy: 50000
        };
      } else {
        throw new Error('Invalid data from fallback IP service');
      }
    } catch (fallbackError) {
      console.error('Fallback IP service also failed:', fallbackError);
      throw new Error('All location services failed');
    }
  }
};

  // Get user's current location with retry mechanism
  const getUserLocation = () => {
    return new Promise(async (resolve, reject) => {
      // First try browser geolocation with improved settings
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 300000, // 5 minutes cache
        };
  
        const tryGeolocation = () => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                source: 'gps'
              });
            },
            async (error) => {
              console.log('Geolocation failed, trying IP-based location:', error);
              // Fallback to IP-based location
              try {
                const ipLocation = await getLocationFromIP();
                resolve({
                  ...ipLocation,
                  source: 'ip'
                });
              } catch (ipError) {
                console.error('IP-based location also failed:', ipError);
                reject(new Error('Unable to determine your location. Please try searching for your city or area manually.'));
              }
            },
            options
          );
        };
  
        tryGeolocation();
      } else {
        // Browser doesn't support geolocation, try IP-based location
        try {
          const ipLocation = await getLocationFromIP();
          resolve({
            ...ipLocation,
            source: 'ip'
          });
        } catch (ipError) {
          reject(new Error('Geolocation is not supported by your browser. Please search for your location manually.'));
        }
      }
    });
  };


// Handle URL query parameters for coordinates
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const latitude = urlParams.get('latitude') || urlParams.get('lat');
  const longitude = urlParams.get('longitude') || urlParams.get('lng');

  if (latitude && longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Validate coordinates
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      console.log('Found coordinates in URL:', { lat, lng });
      
      // Set map center to URL coordinates
      setMapCenter([lat, lng]);
      setZoom(14);

      // Search for properties by coordinates
      const searchByUrlCoordinates = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/searchByCoordinates`,
            {
              params: {
                latitude: lat,
                longitude: lng,
                maxDistance: 5000, // 5km radius
              },
              timeout: 10000,
            }
          );

          if (response.data && response.data.projects) {
            const validProperties = response.data.projects.filter((property) => {
              return isValidCoordinates(property.coordinates);
            });

            console.log('Properties found by URL coordinates:', validProperties.length);
            setProperties(validProperties);
            setError(null);
          } else {
            console.log('No properties found at URL coordinates');
            setProperties([]);
            setError('No properties found at the specified location');
          }
        } catch (err) {
          console.error('Error searching by URL coordinates:', err);
          setError('Failed to load properties for the specified location');
          // Fallback to default search if coordinate search fails
          handleMasterSearch("");
        } finally {
          setLoading(false);
        }
      };

      searchByUrlCoordinates();
    } else {
      console.warn('Invalid coordinates in URL:', { latitude, longitude });
      // Fallback to default search if coordinates are invalid
      handleMasterSearch("");
    }
  } else {
    // No coordinates in URL, proceed with default search
    handleMasterSearch("");
  }
    window.scrollTo(0, 0);
}, []); 

// Enhanced handleUseLocation function with better error handling and multiple search strategies
const handleUseLocation = async () => {
  setIsLocating(true);
  setLocationError("");

  clearQueryParams();
  
  try {
    const location = await getUserLocation();
    console.log('User location obtained:', location);

    // Set map center
    setMapCenter([location.lat, location.lng]);
    setZoom(location.source === 'gps' ? 14 : 12); // Higher zoom for GPS, lower for IP

    // Try multiple search strategies
    let searchResults = [];
    
    // Strategy 1: Search by coordinates (your existing method)
    try {
      const coordinateResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/searchByCoordinates`,
        {
          params: {
            latitude: location.lat,
            longitude: location.lng,
            maxDistance: location.source === 'gps' ? 5000 : 25000, // Larger radius for IP-based location
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (coordinateResponse.data && coordinateResponse.data.projects) {
        searchResults = coordinateResponse.data.projects;
      }
    } catch (coordError) {
      console.log('Coordinate search failed:', coordError);
    }

    // Strategy 2: If coordinate search fails or returns no results, try city-based search
    if (searchResults.length === 0 && location.city) {
      try {
        const cityResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/search`,
          {
            params: { q: location.city },
            timeout: 10000,
          }
        );

        if (cityResponse.data && cityResponse.data.data && cityResponse.data.data.projects) {
          searchResults = cityResponse.data.data.projects;
        }
      } catch (cityError) {
        console.log('City search failed:', cityError);
      }
    }

    // Strategy 3: If still no results, try region-based search
    if (searchResults.length === 0 && location.region) {
      try {
        const regionResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/search`,
          {
            params: { q: location.region },
            timeout: 10000,
          }
        );

        if (regionResponse.data && regionResponse.data.data && regionResponse.data.data.projects) {
          searchResults = regionResponse.data.data.projects;
        }
      } catch (regionError) {
        console.log('Region search failed:', regionError);
      }
    }

    // Filter valid properties
    const validProperties = searchResults.filter((property) => {
      return isValidCoordinates(property.coordinates);
    });

    if (validProperties.length > 0) {
      setProperties(validProperties);
      setError(null);
      
      // Show success message with location source
      setLocationError(
        location.source === 'gps' 
          ? `Found ${validProperties.length} properties near your location`
          : `Found ${validProperties.length} properties near ${location.city || 'your area'} (approximate location)`
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => setLocationError(""), 3000);
    } else {
      setProperties([]);
      setError(
        `No properties found near ${location.city || 'your location'}. Try searching for a specific area or city.`
      );
    }

  } catch (error) {
    console.error('Error getting location:', error);
    setLocationError(error.message);
    
    // Clear error message after 5 seconds
    setTimeout(() => setLocationError(""), 5000);
  } finally {
    setIsLocating(false);
  }
};

  // Master search function
  const handleMasterSearch = async (query) => {
    clearQueryParams();
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/search`,
        {
          params: { q: query },
        }
      );

      const searchResults = response.data.data.projects || [];

      const validProperties = searchResults.filter((property) => {
        return isValidCoordinates(property.coordinates);
      });

      console.log("Valid properties found:", validProperties.length);
      setProperties(validProperties);

      if (validProperties.length > 0) {
        const firstProperty = validProperties[0];
        const [lat, lng] = firstProperty.coordinates;
        console.log("Setting map center to:", [lat, lng]);
        setMapCenter([lat, lng]);
        setZoom(12);
      } else {
        setError("No properties with valid locations found");
      }

      setError(null);
    } catch (err) {
      console.error("Error performing master search:", err);
      setError("Failed to search properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-fit  md:h-screen pt-28 md:pt-0 flex-col-reverse md:flex-row">
      {/* Property Cards Panel */}
      <div className="w-full  md:w-1/3 sm:pt-48 pt-0 p-4 bg-gray-50 relative">
        {/* Fixed header with solid background */}
        <div className="sm:absolute sm:top-0 sm:left-0  w-full  h-32 bg-gray-50 z-10 border-b border-gray-200">
          <div className="px-4 sm:pt-8 bg-gray-50">
            <div className="flex justify-between items-center mb-3 mt-4 md:mt-20">
              <h2 className="text-lg font-semibold">
                Properties ({properties.length})
              </h2>
            </div>
            <SearchBar onSearch={handleMasterSearch} />
          </div>
        </div>

        {/* Content area with padding to account for fixed header */}
        <div className="mt-2 sm:overflow-y-auto sm:h-[calc(100vh-14rem)] px-4 md:p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E1524]"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">{error}</div>
          ) : properties.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No properties found in this area
            </div>
          ) : (
            <div className="space-y-2">
              {properties.map((property) => (
                <div
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  className={`cursor-pointer ${
                    isValidCoordinates(property.coordinates) ? "" : "opacity-50"
                  }`}
                >
                  <PropertyCard
                    scrollToSection={scrollToSection}
                    property={property}
                    isSelected={selectedProperty?._id === property._id}
                  />
                  {!isValidCoordinates(property.coordinates) && (
                    <div className="text-xs text-red-500 mt-1">
                      Location not available
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Panel */}
      {/*  */}
      <div
        ref={sectionRef}
        className="w-full h-[50vh] md:h-auto z-10 md:pt-28 md:w-2/3 relative"
      >
        {/* <div className="absolute top-4 md:bottom-4 md:top-auto md:left-4 right-4 z-10 bg-white p-2 rounded shadow text-xs">
          Center: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)} |
          Markers: {validPropertiesForMap.length}
        </div> */}

        {/* Use My Location Button - Positioned in upper right corner */}
        <div className="absolute bottom-4 md:top-auto right-4 z-20">
    <button
      onClick={handleUseLocation}
      disabled={isLocating}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#0E1524] text-[#0E1524] rounded-md hover:bg-gray-50 disabled:opacity-50 shadow-md transition-all"
    >
      <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
      {isLocating ? "Locating..." : "Use My Location"}
    </button>
    {locationError && (
      <div className={`mt-2 text-sm p-2 rounded shadow-md max-w-xs ${
        locationError.includes('Found') 
          ? 'text-green-600 bg-green-50 border border-green-200' 
          : 'text-red-600 bg-red-50 border border-red-200'
      }`}>
        {locationError}
      </div>
    )}
  </div>

        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          key={`${mapCenter[0]}-${mapCenter[1]}-${zoom}`}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapController
            center={mapCenter}
            zoom={zoom}
            selectedProperty={selectedProperty}
          />

          {validPropertiesForMap.map((property) => {
            const [lat, lng] =
              property.displayCoordinates || property.coordinates;
            return (
              <Marker
                key={property._id}
                position={[lat, lng]}
                icon={customIcon}
                propertyId={property._id}
                eventHandlers={{
                  click: () => handleMarkerClick(property),
                }}
              >
                <Popup maxWidth={320} className="custom-popup z-[999999]">
                  <PropertyPopup property={property} />
                </Popup>
              </Marker>
            );
          })}

          <MapEvents onBoundsChange={handleBoundsChange} />
        </MapContainer>
      </div>
    </div>
  );
}
