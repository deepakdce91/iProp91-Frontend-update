import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import ContactForm from "../../Landing/ContactForm";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowContactForm(true)}
          className="bg-[#FF6B00] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#E65C00] transition-colors flex items-center gap-2"
        >
          <BsFillTelephoneFill className="w-5 h-5" />
          Get More Details
        </button>
      </div>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ContactForm onClose={() => setShowContactForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B00]"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      ) : property ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Property Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {property.verified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <MdVerified className="w-5 h-5" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FaBed className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-medium">{property.bedrooms || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-medium">{property.bathrooms || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaRulerCombined className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="font-medium">{property.area || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Floor</p>
                  <p className="font-medium">{property.floor || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities Section */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PropertyDetails; 