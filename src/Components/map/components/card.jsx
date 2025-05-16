import { motion } from "framer-motion";
import { FaBed, FaBath, FaRulerCombined, FaShareAlt } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { useState } from "react";

const PropertyCard = ({ property }) => {
  const [imageError, setImageError] = useState(false);

  // Function to get the correct image URL
  const getImageUrl = (image) => {
    if (!image)
      return "https://via.placeholder.com/400x300?text=Property+Image";

    // If image is a full URL, return it
    if (image.startsWith("http")) return image;

    // If image is a relative path, prepend the API base URL
    return `https://iprop-api.irentpro.com${
      image.startsWith("/") ? "" : "/"
    }${image}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] max-w-2xl mx-auto rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {property.photos}+ Photos
        </div>
        <img
          src={getImageUrl(property.image)}
          alt={property.title}
          className="w-full h-[150px] object-cover"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <BsHeart className="text-[#031273]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white p-2 rounded-full shadow-md"
          >
            <FaShareAlt className="text-[#031273]" />
          </motion.button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-xl font-semibold text-[#031273]">
              ₹{property.price}
            </h3>
            <p className="text-gray-500 text-sm">
              ₹{property.pricePerSqft} per sqft
            </p>
          </div>
          <button className="text-[#031273] text-sm font-medium hover:underline">
            Contact Owner
          </button>
        </div>

        <h4 className="text-lg font-medium text-gray-800 mb-1 text-left">
          {property.title}
        </h4>
        <p className="text-gray-600 text-sm mb-2 text-left">
          {property.location}
        </p>

        <div className="grid grid-cols-3 gap-4 py-2 border-y border-gray-200">
          <div className="flex flex-col items-start text-left">
            <span className="text-gray-600 text-xs uppercase">Carpet Area</span>
            <span className="font-medium">{property.area} sqft</span>
          </div>
          <div className="flex flex-col items-start text-left border-x border-gray-200 px-4">
            <span className="text-gray-600 text-xs uppercase">Status</span>
            <span className="font-medium">Ready to Move</span>
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-gray-600 text-xs uppercase">Floor</span>
            <span className="font-medium">{property.floor}</span>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-1 text-left">
            {property.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <img
                src={property.ownerImage || "https://via.placeholder.com/24"}
                alt="owner"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                Owner: {property.owner}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Updated {property.postedTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
