import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion as Motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
// Create custom house marker icon
const createHouseIcon = () => {
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#031273" width="24px" height="24px">
      <path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2zm0 2.84L19.5 12H18v7h-4v-6H10v6H6v-7H4.5L12 4.84z"/>
    </svg>
  `;

  const svgBlob = new Blob([svgTemplate], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);

  return new L.Icon({
    iconUrl: svgUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  });
};

function PropertyCard({ property, isLoading = false, propertyId }) {
  const [propertyData, setPropertyData] = useState(property);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [houseIcon] = useState(createHouseIcon);

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
      // Fetch coordinates from location string using Nominatim API
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              propertyData.location
            )}`
          );
          if (response.data && response.data[0]) {
            setCoordinates([
              parseFloat(response.data[0].lat),
              parseFloat(response.data[0].lon),
            ]);
          }
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      };
      fetchCoordinates();
    }
  }, [propertyData?.location]);

  const getImageUrl = (image) => {
    if (!image) return "/iPropLogo.6ed8e014.svg";
    if (image.startsWith("http")) return image;
    return `https://iprop-api.irentpro.com${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

  function handleDetailsPage(e) {
    e.stopPropagation();
    if (propertyData?._id) {
      navigate(`/property-details/${propertyData._id}`, {
        state: { property: propertyData },
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

  if (isLoading || fetchLoading) {
    return (
      <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 m-2">
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
      <div className="border rounded-xl overflow-hidden shadow-md p-4 m-2 bg-white">
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
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative w-full"
    >
      <div className="relative">
        <AnimatePresence>
          {isHovered && coordinates ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <MapContainer
                center={coordinates}
                zoom={15}
                style={{ height: "160px", width: "100%" }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={coordinates} icon={houseIcon}>
                  <Popup>
                    <div className="text-sm">
                      <strong>{propertyData?.title}</strong>
                      <br />
                      {propertyData?.location}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center text-white">
                  <FaHome className="mr-2" />
                  <p className="text-sm font-medium">
                    {propertyData?.location}
                  </p>
                </div>
              </div>
            </Motion.div>
          ) : null}
        </AnimatePresence>

        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-20">
          {propertyData?.images?.length || 0}+ Photos
        </div>
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLikeClick}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <BsHeart
              className={`text-lg ${
                isLiked ? "text-red-500" : "text-gray-600"
              }`}
            />
          </Motion.button>
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareClick}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <FaShareAlt className="text-lg text-gray-600" />
          </Motion.button>
        </div>
        <img
          src={getImageUrl(
            propertyData?.images?.[activeImageIndex] || propertyData?.imageUrl
          )}
          alt={propertyData?.title}
          className="w-full h-[160px] object-contain bg-gray-50"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <img
              src="/iPropLogo.6ed8e014.svg"
              alt="iProp Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
        )}
        <div className="absolute bottom-3 left-3 text-xs text-white bg-black/50 px-2 py-1 rounded-full z-20">
          {propertyData?.postedTime || "today"}
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {propertyData?.price}
            </h2>
          </div>
          <a
            href={`/property-details/${
              propertyData?._id || propertyData?.id || ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer font-medium hover:bg-red-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </a>
        </div>

        <h3 className="text-base font-medium text-gray-800 mb-1">
          {propertyData?.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MdLocationOn className="text-gray-400 mr-1 text-sm" />
          <p className="text-xs">{propertyData?.location}</p>
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
      </div>
    </Motion.div>
  );
}

export default PropertyCard;
