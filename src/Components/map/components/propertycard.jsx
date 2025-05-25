import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion as Motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaShareAlt, FaRulerCombined, FaMapMarkerAlt, FaHome } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Cache geocoding results to reduce requests
const coordinatesCache = new Map();

// 1) Helper to normalize any "image" into a URL string
function normalizeImage(image) {
  if (!image) return "/iPropLogo.6ed8e014.svg";
  if (typeof image === "string") return image;
  return image.path || image.url || image.src || "/iPropLogo.6ed8e014.svg";
}

// 2) Process raw API data into the exact shape our UI expects
function processProperty(raw) {
  // Check if raw exists and has necessary data
  if (!raw) return null;
  
  return {
    _id: raw._id || raw.id,
    title:
      raw.title ||
      raw.project ||
      `Property ${raw._id || raw.id}`,
    price:
      raw.price ||
      (raw.minimumPrice
        ? raw.maximumPrice
          ? `${raw.minimumPrice} - ${raw.maximumPrice}`
          : raw.minimumPrice
        : "Price on request"),
    location:
      raw.location ||
      [
        raw.address,
        raw.sector,
        raw.city,
        raw.state,
        raw.pincode,
      ]
        .filter(Boolean)
        .join(", "),
    images:
      Array.isArray(raw.images) && raw.images.length
        ? raw.images.map(normalizeImage)
        : raw.imageUrl
        ? [normalizeImage(raw.imageUrl)]
        : ["/iPropLogo.6ed8e014.svg"],
    bedrooms: raw.bhk || raw.numberOfBedrooms || "",
    bathrooms: raw.numberOfBathrooms || "",
    washrooms: raw.numberOfWashrooms || "",
    floors: raw.numberOfFloors || "",
    parkings: raw.numberOfParkings || "",
    area: raw.size ? `${raw.size} sq.ft` : "",
    description: raw.overview || "",
    postedTime: raw.postedTime || raw.postedAt || "today",
    project: raw.project,
    coordinates: raw.coordinates || null,
    // keep any other fields you need...
  };
}

// 3) Create a custom Leaflet icon for the map marker
const createHouseIcon = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#031273" width="24" height="24">
      <path d="M12 2L1 12h3v9h6v-6h4v-6h6v-9h3L12 2zm0 2.84L19.5 12H18v7h-4v-6H10v6H6v-7H4.5L12 4.84z"/>
    </svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  return new L.Icon({
    iconUrl: URL.createObjectURL(blob),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function PropertyCard({ property, isLoading = false, propertyId, onSelect }) {
  const [propertyData, setPropertyData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [houseIcon] = useState(createHouseIcon);
  const [mapNavigationError, setMapNavigationError] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const hoverTimerRef = useRef(null);
  const locationRef = useRef(null);
  const navigate = useNavigate();

  // Log received property prop to debug data flow
  console.log("PropertyCard received property:", property);

  // 4) Always normalize incoming `property`, or fetch by ID
  useEffect(() => {
    if (property) {
      const processed = processProperty(property);
      console.log("Processed property:", processed);
      setPropertyData(processed);
      return;
    }
    if (propertyId) {
      setFetchLoading(true);
      axios
        .get(
          `https://iprop-api.irentpro.com/api/v1/map-project/${propertyId}`
        )
        .then((res) => {
          if (res.data?.data) {
            setPropertyData(processProperty(res.data.data));
          } else {
            setFetchError("Property data not found");
          }
        })
        .catch(() => setFetchError("Failed to load property data"))
        .finally(() => setFetchLoading(false));
    }
  }, [property, propertyId]);

  // 5) Use property coordinates if available, otherwise geocode the location
  useEffect(() => {
    if (!propertyData) return;
    
    // First try to use coordinates directly from property data
    if (propertyData.coordinates && Array.isArray(propertyData.coordinates) && propertyData.coordinates.length === 2) {
      console.log("Using coordinates from property data:", propertyData.coordinates);
      setCoordinates(propertyData.coordinates);
      return;
    }
    
    // Otherwise try to geocode the location
    if (!propertyData.location) return;
    
    const loc = propertyData.location;
    if (coordinatesCache.has(loc)) {
      setCoordinates(coordinatesCache.get(loc));
      return;
    }
    if (locationRef.current === loc) return;
    locationRef.current = loc;

    const timeoutId = setTimeout(() => {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: { format: "json", q: loc, limit: 1 },
          headers: { "User-Agent": "iProp-PropertyApp/1.0" },
        })
        .then((res) => {
          const hit = res.data[0];
          if (hit) {
            const coords = [parseFloat(hit.lat), parseFloat(hit.lon)];
            coordinatesCache.set(loc, coords);
            setCoordinates(coords);
          }
        })
        .catch(console.error);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [propertyData]);

  // 6) Listen for external marker-click events
  useEffect(() => {
    const onMarkerClick = (e) => {
      const { propertyId: id } = e.detail;
      if (!propertyData) return;
      if (id === propertyData._id) {
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 3000);
      }
    };
    window.addEventListener("property-marker-clicked", onMarkerClick);
    return () =>
      window.removeEventListener("property-marker-clicked", onMarkerClick);
  }, [propertyData]);

  // Hover → show map preview after 2s
  const handleHoverStart = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => setShowMap(true), 2000);
  };
  const handleHoverEnd = () => {
    setIsHovered(false);
    setShowMap(false);
    clearTimeout(hoverTimerRef.current);
  };

  // Navigate to details or map
  const handleDetailsPage = (e) => {
    e?.stopPropagation();
    if (!propertyData?._id) return;
    navigate(`/property/${propertyData._id}`, {
      state: { property: propertyData },
    });
  };
  const navigateToMapPage = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!propertyData?._id) return;
    navigate(`/search-properties?propertyId=${propertyData._id}`, {
      state: {
        focusedProperty: propertyData._id,
        location: propertyData.location,
        coordinates,
      },
    });
  };
  const handleCardClick = (e) => {
    // Notify parent component when property is selected
    if (onSelect) {
      onSelect(propertyData);
    }
    
    if (e.ctrlKey || e.metaKey) return handleDetailsPage(e);
    navigateToMapPage(e);
  };

  if (isLoading || fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md m-2">
        <Skeleton height={240} width="100%" />
        <div className="p-4 space-y-2">
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="50%" height={16} />
          <Skeleton width="70%" height={20} />
        </div>
      </div>
    );
  }
  if (!propertyData) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md p-4 text-center">
        {fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : (
          <p>No property data available</p>
        )}
      </div>
    );
  }

  // Main component render
  return (
    <Motion.div
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={`border rounded-xl overflow-hidden shadow-md m-2 cursor-pointer transition-all duration-300 ${
        isHighlighted ? "ring-4 ring-blue-500" : ""
      }`}
    >
      {/* Property Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={
            imageError
              ? "/iPropLogo.6ed8e014.svg"
              : propertyData.images[activeImageIndex]
          }
          alt={propertyData.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Like Button */}
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <BsHeart
            className={`${isLiked ? "text-red-500" : "text-gray-400"}`}
            size={18}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-2 left-2 bg-blue-800 text-white px-3 py-1 rounded-md">
          {typeof propertyData.price === "number"
            ? `₹${propertyData.price.toLocaleString()}`
            : propertyData.price}
        </div>
      </div>

      {/* Property Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{propertyData.title}</h3>
        
        <div className="flex items-center text-gray-600 my-1">
          <MdLocationOn className="mr-1" />
          <p className="truncate text-sm">{propertyData.location}</p>
        </div>
        
        {/* Property Features */}
        <div className="flex flex-wrap gap-2 my-2">
          {propertyData.bedrooms && (
            <div className="flex items-center text-sm">
              <FaHome className="mr-1" />
              <span>{propertyData.bedrooms} BHK</span>
            </div>
          )}
          
          {propertyData.area && (
            <div className="flex items-center text-sm">
              <FaRulerCombined className="mr-1" />
              <span>{propertyData.area}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          <button
            onClick={handleDetailsPage}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            View Details
          </button>
          
          <button
            onClick={navigateToMapPage}
            className="flex items-center text-blue-600 px-2"
          >
            <FaMapMarkerAlt className="mr-1" />
            <span>Map</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
            className="flex items-center text-gray-500 px-2"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
      
      {/* Map Preview on Hover */}
      <AnimatePresence>
        {isHovered && showMap && coordinates && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 200 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden"
          >
            <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: "200px", width: "100%" }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordinates} icon={houseIcon}>
                <Popup>{propertyData.title}</Popup>
              </Marker>
            </MapContainer>
            
            {mapNavigationError && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <p className="text-white text-center p-2">
                  {mapNavigationError}
                </p>
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
}

export default PropertyCard;