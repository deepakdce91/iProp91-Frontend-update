import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShareAlt,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { dispatchPropertyCardClick, injectPropertyCardStyles } from '../utils/PropertyMapNavigation';
import { createHouseIcon, baseHouseIcon } from '../utils/HouseIcons';

function PropertyCard({ property, isLoading = false, propertyId, onPropertySelect }) {
  const [propertyData, setPropertyData] = useState(property);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [houseIcon] = useState(() => {
    try {
      return createHouseIcon();
    } catch (error) {
      console.warn("Error creating house icon:", error);
      return baseHouseIcon;
    }
  });
  const [isHighlighted, setIsHighlighted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (property) {
      setPropertyData(property);
      return;
    }

    if (propertyId && !property) {
      setFetchLoading(true);

      const fetchPropertyData = async () => {
        try {
          const response = await axios.get(
            `https://iprop-api.irentpro.com/api/v1/map-project/${propertyId}`
          );

          if (response.data && response.data.data) {
            const processedProperty = processProperty(response.data.data);
            setPropertyData(processedProperty);
          } else {
            setFetchError("Property data not found");
          }
        } catch (err) {
          console.error("Error fetching property data:", err);
          setFetchError("Failed to load property data");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchPropertyData();
    }
  }, [property, propertyId]);

  useEffect(() => {
    if (propertyData?.location) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              propertyData.location
            )}`
          );
          if (response.data && response.data[0]) {
            const newCoords = [
              parseFloat(response.data[0].lat),
              parseFloat(response.data[0].lon),
            ];
            setCoordinates(newCoords);
            // Update property data with coordinates
            setPropertyData(prev => ({
              ...prev,
              coordinates: newCoords
            }));
            
            // If this is the initial property data load, notify parent
            if (onPropertySelect && property?._id === propertyData?._id) {
              onPropertySelect({
                ...propertyData,
                coordinates: newCoords
              });
            }
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      };
      fetchCoordinates();
    }
  }, [propertyData?.location, onPropertySelect, property?._id]);

  // Inject property card styles for highlighting
  useEffect(() => {
    injectPropertyCardStyles();
  }, []);
  
  // Listen for marker clicks to highlight this card if it matches
  useEffect(() => {
    const handleMarkerClick = (event) => {
      const { propertyId } = event.detail;
      if (propertyId && propertyData && 
          (propertyId === propertyData._id || propertyId === propertyData.id)) {
        // Highlight this card
        setIsHighlighted(true);
        
        // Remove highlight after some time
        setTimeout(() => {
          setIsHighlighted(false);
        }, 3000);
      }
    };
    
    window.addEventListener('property-marker-clicked', handleMarkerClick);
    
    return () => {
      window.removeEventListener('property-marker-clicked', handleMarkerClick);
    };
  }, [propertyData]);

  const getImageUrl = (image) => {
    if (!image) return "/iPropLogo.6ed8e014.svg";
    if (image.startsWith("http")) return image;
    return `https://iprop-api.irentpro.com${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

  function handleDetailsPage(e) {
    e.stopPropagation();
    if (propertyData?._id || propertyData?.id) {
      // Create a clean copy of the property data without any functions
      const cleanPropertyData = { ...propertyData };
      
      // Remove any functions or non-serializable data
      Object.keys(cleanPropertyData).forEach(key => {
        if (typeof cleanPropertyData[key] === 'function') {
          delete cleanPropertyData[key];
        } else if (key === 'onPropertyClick' || key === 'onPropertySelect') {
          delete cleanPropertyData[key];
        }
      });
      
      navigate(`/property/${propertyData._id || propertyData.id}`, {
        state: { property: cleanPropertyData },
      });
    }
  }

  const processProperty = (rawProperty) => {
    return {
      ...rawProperty,
      title:
        rawProperty.title ||
        rawProperty.project ||
        `Property ${rawProperty._id}`,
      price:
        rawProperty.price ||
        (rawProperty.minimumPrice
          ? rawProperty.maximumPrice
            ? `${rawProperty.minimumPrice} - ${rawProperty.maximumPrice}`
            : rawProperty.minimumPrice
          : "Price on request"),
      location: [
        rawProperty.address,
        rawProperty.sector,
        rawProperty.city,
        rawProperty.state,
        rawProperty.pincode,
      ]
        .filter(Boolean)
        .join(", "),
      images:
        Array.isArray(rawProperty.images) && rawProperty.images.length > 0
          ? rawProperty.images.map((img) => getImageUrl(img))
          : [getImageUrl(rawProperty.imageUrl)],
      propertyType: rawProperty.type || "Residential",
      bedrooms: rawProperty.bhk || rawProperty.numberOfBedrooms || "",
      bathrooms: rawProperty.numberOfBathrooms || "",
      washrooms: rawProperty.numberOfWashrooms || "",
      floors: rawProperty.numberOfFloors || "",
      parkings: rawProperty.numberOfParkings || "",
      area: rawProperty.size ? `${rawProperty.size} sq.ft` : "",
      description: rawProperty.overview || "",
    };
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (propertyData?._id) {
      // Example API call:
      // axios.post(`/api/properties/${propertyData._id}/favorite`, { isFavorite: !isLiked });
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: propertyData?.title,
          text: `Check out this property: ${propertyData?.title} - ${propertyData?.price}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      const shareUrl = window.location.href;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
        });
    }
  };

  // Enhanced card click handler that uses the coordinates directly
  const handleCardClick = (e) => {
    e.preventDefault();
    if (propertyData && coordinates) {
      // Create property object with coordinates for the map
      const propertyWithCoords = {
        ...propertyData,
        coordinates,
        id: propertyData._id || propertyData.id
      };
      
      if (onPropertySelect) {
        onPropertySelect(propertyWithCoords);
      }
      
      // Navigate to location on map using coordinates directly
      navigateToLocationOnMap(coordinates, propertyWithCoords.id);
    }
  };
  
  // Function to navigate to location using coordinates
  const navigateToLocationOnMap = (coords, propertyId) => {
    if (!coords || !Array.isArray(coords) || coords.length !== 2) {
      console.warn("Invalid coordinates:", coords);
      return;
    }
    
    // First try the direct coordinates navigation function
    if (typeof window.navigateToCoordinatesOnMap === 'function') {
      window.navigateToCoordinatesOnMap(coords, {
        animatedZoom: true,
        initialZoom: 16,
        finalZoom: 18,
        propertyId: propertyId
      });
      return;
    }
    
    // Fall back to property ID navigation if available
    if (window.navigateToPropertyOnMap && propertyId) {
      window.navigateToPropertyOnMap(propertyId, {
        animatedZoom: true,
        initialZoom: 16,
        finalZoom: 18
      });
    } else if (window.leafletMap) {
      // If global navigation not available, try to use map directly
      try {
        window.leafletMap.flyTo(coords, 18, {
          duration: 2
        });
      } catch (error) {
        console.error("Error navigating to coordinates:", error);
      }
    }
    
    // Also dispatch custom event for integration with other components
    if (propertyId) {
      dispatchPropertyCardClick(propertyId, {
        animatedZoom: true,
        initialZoom: 16,
        finalZoom: 18
      });
    }
  };
  
  // Handle click on map preview
  const handleMapPreviewClick = (e) => {
    e.stopPropagation();
    if (coordinates) {
      navigateToLocationOnMap(coordinates, propertyData?._id || propertyData?.id);
    }
  };

  // Force visible styles
  const visibleStyle = {
    opacity: 1,
    visibility: "visible",
    display: "block"
  };

  if (isLoading || fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-2" style={visibleStyle}>
        <Skeleton height={240} width="100%" />
        <div className="p-4">
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={16} style={{ marginTop: 8 }} />
          <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
          <Skeleton width="70%" height={20} style={{ marginTop: 12 }} />
        </div>
      </div>
    );
  }

  if (!propertyData && !fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md p-4 m-2 bg-white" style={visibleStyle}>
        {fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : (
          <p className="text-gray-500">No property data available</p>
        )}
      </div>
    );
  }

  if (!propertyData && !fetchLoading) return null;

  return (
    <div
      onClick={handleCardClick}
      className={`property-card bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative w-full cursor-pointer ${isHighlighted ? 'property-card-highlighted' : ''}`}
      data-property-id={propertyData?._id || propertyData?.id}
      style={visibleStyle}
    >
      <div className="relative h-32 md:h-36" style={visibleStyle}>
        {isHovered && coordinates ? (
          <div
            className="absolute inset-0 z-10"
            style={visibleStyle}
          >
            <MapContainer
              center={coordinates}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={coordinates}
                icon={houseIcon}
                eventHandlers={{
                  click: handleMapPreviewClick,
                }}
              >
                <Popup>{propertyData?.title}</Popup>
              </Marker>
            </MapContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-[10px] shadow-md hover:bg-blue-700 transition-colors z-20"
                onClick={handleMapPreviewClick}
              >
                View on Full Map
              </button>
            </div>
          </div>
        ) : null}

        {isLoading || fetchLoading ? (
          <Skeleton height={"100%"} />
        ) : (
          <img
            src={propertyData?.images?.[activeImageIndex] || propertyData?.image}
            alt={propertyData?.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            style={visibleStyle}
          />
        )}

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={visibleStyle}>
            <img
              src="/iPropLogo.6ed8e014.svg"
              alt="iProp Logo"
              className="w-16 h-16 object-contain opacity-50"
            />
          </div>
        )}
        <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded-sm z-20">
          {propertyData?.postedTime || "today"}
        </div>
      </div>

      <div className="p-2.5" style={visibleStyle}>
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <h2 className="text-sm font-bold text-gray-900 line-clamp-1">
              {propertyData?.price}
            </h2>
          </div>
          <Link
            to={`/property-details/${propertyData?._id || propertyData?.id}`}
            className="bg-red-500 text-white px-2 py-1 rounded-md text-[10px] cursor-pointer font-medium hover:bg-red-600 transition-colors"
            onClick={handleDetailsPage}
          >
            Details
          </Link>
        </div>

        <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-1">
          {propertyData?.title}
        </h3>

        <div className="flex items-start mb-1.5">
          <MdLocationOn className="text-gray-500 w-3 h-3 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-gray-500 ml-1 line-clamp-1">
            {propertyData?.location}
          </p>
        </div>
        
        {propertyData?.distanceText && (
          <div className="flex items-start mb-1.5">
            <FaMapMarkerAlt className="text-teal-600 w-3 h-3 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-teal-600 ml-1">
              {propertyData.distanceText}
            </p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {propertyData?.propertyType && (
            <span className="inline-flex items-center bg-gray-100 px-1.5 py-0.5 rounded-sm text-[10px] text-gray-700">
              <FaHome className="mr-1 w-2 h-2" />
              {propertyData.propertyType}
            </span>
          )}
          
          {propertyData?.area && (
            <span className="inline-flex items-center bg-gray-100 px-1.5 py-0.5 rounded-sm text-[10px] text-gray-700">
              <FaRulerCombined className="mr-1 w-2 h-2" />
              {propertyData.area}
            </span>
          )}
          
          {propertyData?.bedrooms && (
            <span className="inline-flex items-center bg-gray-100 px-1.5 py-0.5 rounded-sm text-[10px] text-gray-700">
              {propertyData.bedrooms} BHK
            </span>
          )}
        </div>

        <div className="mt-2 flex justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToLocationOnMap(coordinates, propertyData?._id || propertyData?.id);
            }}
            className="flex items-center text-[10px] text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded-md"
          >
            <FaMapMarkerAlt className="mr-1 w-2 h-2" />
            <span>View on Map</span>
          </button>
          
          {coordinates && coordinates.length === 2 && (
            <div className="text-[8px] text-gray-400">
              {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
