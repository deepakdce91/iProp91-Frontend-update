import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { injectPropertyCardStyles, dispatchPropertyCardClick } from '../../map/utils/PropertyMapNavigation';

function PropertyCard({ property, isLoading = false, propertyId, onPropertySelect }) {
  const [propertyData, setPropertyData] = useState(property);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

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
        if (onPropertySelect) {
          onPropertySelect(propertyData);
        }
      }
    };
    window.addEventListener('property-marker-clicked', handleMarkerClick);
    return () => {
      window.removeEventListener('property-marker-clicked', handleMarkerClick);
    };
  }, [propertyData, onPropertySelect]);

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
    const url = `/property-details/${propertyData._id || propertyData.id}`;
    window.open(url, '_blank');
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
  

  // Loading skeleton UI
  if (isLoading || fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-2">
        <div className="w-full h-[160px] bg-gray-100 animate-pulse" />
        <div className="p-4">
          <div className="w-2/3 h-6 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="w-1/2 h-4 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="w-1/3 h-4 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="w-3/4 h-5 bg-gray-200 rounded mt-3 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error or no data UI
  if (!propertyData && !fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md p-4 m-2 bg-white">
        {fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : (
          <p className="text-gray-500">No property data available</p>
        )}
      </div>
    );
  }

  // Main card UI
  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative w-full cursor-pointer"
      data-property-id={propertyData?._id || propertyData?.id}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Image Section */}
        <img
          src={propertyData?.images?.[0] || propertyData?.imageUrl || "/iPropLogo.6ed8e014.svg"}
          alt={propertyData?.title}
          className="w-full h-[160px] object-contain bg-gray-50"
        />
        {/* Photo count overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-20">
          {propertyData?.images?.length || 0}+ Photos
        </div>
        {/* Posted time overlay */}
        <div className="absolute bottom-3 left-3 text-xs text-white bg-black/50 px-2 py-1 rounded-full z-20">
          {propertyData?.postedTime || "today"}
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {propertyData?.price || 'Price on request'}
            </h2>
          </div>
          <Link
            to={`/property-details/${propertyData?._id || propertyData?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer font-medium hover:bg-red-600 transition-colors"
            onClick={handleDetailsPage}
          >
            View Details
          </Link>
        </div>
        <h3 className="text-base font-medium text-gray-800 mb-1">
          {propertyData?.title || 'Property'}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MdLocationOn className="text-gray-400 mr-1 text-sm" />
          <p className="text-xs">{propertyData?.location || 'Location not available'}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">SUPER AREA</p>
            <div className="flex items-center mt-0.5">
              <FaRulerCombined className="text-gray-400 mr-1 text-xs" />
              <p className="font-medium text-xs">{propertyData?.area}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase">STATUS</p>
            <p className="font-medium text-xs mt-0.5">Ready to Move</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase">TYPE</p>
            <p className="font-medium text-xs mt-0.5">Resale</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center text-gray-600 text-xs">
            <MdLocationOn className="text-gray-400 mr-1" />
            <p>{propertyData?.landmark || "Opposite Singla Traders"}</p>
          </div>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {propertyData?.description}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={e => {
              e.stopPropagation();
              navigateToLocationOnMap(coordinates, propertyData?._id || propertyData?.id);
            }}
            className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaMapMarkerAlt className="mr-1" />
            <span>View on Map</span>
          </button>
          {coordinates && coordinates.length === 2 && (
            <div className="text-[8px] text-gray-400 mt-1">
              {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
