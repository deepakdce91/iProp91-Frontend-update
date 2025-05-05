import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHouse } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PropertyCard({ property, isLoading = false, onClick, propertyId }) {
  // Development-only logs that should be removed in production
  const DEBUG = process.env.NODE_ENV === "development";

  if (DEBUG) {
    console.log("PropertyCard rendered with:", { property, propertyId });
  }

  const navigate = useNavigate();

  // If propertyId is provided but no property data, we can fetch it
  const [propertyData, setPropertyData] = useState(property);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (DEBUG) {
      console.log("PropertyCard useEffect triggered");
    }

    // If we already have property data, use it
    if (property) {
      setPropertyData(property);
      return;
    }

    // If propertyId is provided but no property data, fetch it
    if (propertyId && !property) {
      setFetchLoading(true);

      const fetchPropertyData = async () => {
        try {
          // Use the same API endpoint as in PropertyDetailPage
          const response = await axios.get(
            `https://iprop-api.irentpro.com/api/v1/map-project/${propertyId}`
          );

          if (response.data && response.data.data) {
            // Process the property using similar logic as in App.jsx
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
  }, [property, propertyId, processProperty]);

  // Function to process property data similar to App.jsx
  const processProperty = React.useCallback((rawProperty) => {
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
          ? rawProperty.images
          : ["/dummy-image.png"],
      propertyType: rawProperty.type || "Residential",
      bedrooms: rawProperty.bhk || rawProperty.numberOfBedrooms || "",
      bathrooms: rawProperty.numberOfBathrooms || "",
      washrooms: rawProperty.numberOfWashrooms || "",
      floors: rawProperty.numberOfFloors || "",
      parkings: rawProperty.numberOfParkings || "",
      area: rawProperty.size ? `${rawProperty.size} sq.ft` : "",
      description: rawProperty.overview || "",
      distance:
        rawProperty.distance ||
        `${Math.floor(Math.random() * 500) + 50} kilometres away`,
    };
  }, []);

  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const dummyImages = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
  ];

  // Use property.images or fallback to dummy images
  const images =
    propertyData?.images?.length > 0 ? propertyData.images : dummyImages;

  // Show loading skeleton when isLoading or fetchLoading is true
  if (isLoading || fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-2">
        {/* Image skeleton */}
        <Skeleton height={240} width="100%" />

        {/* Content skeleton */}
        <div className="p-4">
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={16} style={{ marginTop: 8 }} />
          <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
          <Skeleton width="70%" height={20} style={{ marginTop: 12 }} />
        </div>
      </div>
    );
  }

  // Basic fallback if property data is missing and we're not loading
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

  // Use propertyData from state (either from props or fetched)
  // If we're not loading but don't have data yet, return early
  if (!propertyData && !fetchLoading) return null;

  // Calculate a fake distance if not provided
  const distance =
    propertyData?.distance ||
    `${Math.floor(Math.random() * 500) + 50} kilometres away`;

  // Format dates for stay period if not provided
  const stayPeriod = propertyData?.stayPeriod || "6-11 May";

  // Rating with 1 decimal place (4.5, 4.8, etc)
  const rating = propertyData?.rating || (4 + Math.random()).toFixed(1);

  // Price
  const price =
    propertyData?.price || `₹${Math.floor(Math.random() * 50000) + 10000}`;
  const nights = propertyData?.nights || "5 nights";

  // Location data
  const location = propertyData?.city || "Unknown Location";

  // Whether it's a guest favorite
  const isFavorite =
    propertyData?.isFavorite !== undefined
      ? propertyData.isFavorite
      : Math.random() > 0.5;

  // Animation variants
  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, y: -5 },
    tap: { scale: 0.98, y: 0 },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.08 },
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (propertyData && onClick) {
      // Only handle map repositioning here
      onClick(propertyData);
    }
  };

  // Get property ID with fallbacks for different ID formats
  const getPropertyId = () => {
    if (!propertyData) return null;

    // Try multiple possible ID fields
    return (
      propertyData._id ||
      propertyData.id ||
      propertyData.propertyId ||
      propertyData.property_id
    );
  };

  // Get the correct property ID
  const propId = getPropertyId();

  // Create a proper absolute URL to ensure consistency
  const detailsUrl = propId ? `/property-details/${propId}` : null;

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-md m-2 cursor-pointer bg-white h-auto"
      onClick={handleCardClick}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Image with heart and guest favorite overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={images[activeImageIndex]}
          alt={`${location} - Image ${activeImageIndex + 1}`}
          className="w-full h-48 object-cover"
          variants={imageVariants}
          transition={{ duration: 0.3 }}
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {activeImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full p-1 hover:bg-black/60 transition-colors duration-200"
              onClick={handlePrevImage}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 rounded-full p-1 hover:bg-black/60 transition-colors duration-200"
              onClick={handleNextImage}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Guest favorite tag */}
        <AnimatePresence>
          {isFavorite && (
            <motion.div
              className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium text-gold-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              Guest favourite
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart button */}
        <motion.button
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
            }`}
          />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center">
            <FaHouse className="text-gold-500 mr-1" />
            <h3 className="font-semibold text-lg text-gray-900">{location}</h3>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-current text-gold-500 mr-1" />
            <span>{rating}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-1">{distance}</p>
        <p className="text-gray-600 mb-3">{stayPeriod}</p>

        <p className="font-semibold">
          <span className="text-lg">{price}</span>
          <span className="text-gray-600 font-normal"> for {nights}</span>
        </p>

        <div className="flex justify-end items-center mt-4">
          {detailsUrl ? (
            <a
              href={detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-black text-gold-500 rounded-md text-sm font-medium flex items-center hover:bg-gray-900 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View details of property in ${location}`}
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          ) : (
            <span className="text-gray-400 text-sm">No details available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;
