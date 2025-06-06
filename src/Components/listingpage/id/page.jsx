"use client";

import { useEffect, useState } from "react";
import {
  MoreVertical,
  Download,
  ArrowRight,
  Link,
  Locate,
  PinIcon,
  Map,
  MapPin,
  Building2,
  Baby,
  CreditCard,
  Phone,
  Lightbulb,
  Shield,
  Car,
  Dumbbell,
  Gamepad2,
  CloudRain,
  Droplet,
  Compass,
  Trash2,
  PlaySquare,
  FireExtinguisher,
  Building,
  CarTaxiFront,
  Tool,
  X,
  GlassWater,
  ListFilter,
  GlassWaterIcon,
  AlertCircle,
  Bed,
  Search,
  Calendar,
  CheckCircle2,
  Star,
  StarHalf,
  Book,
  Home,
  Bath,
  Square,ArrowUp, ArrowDown
} from "lucide-react";
import ContactUsForm from "../../forms/ContactUs";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../Landing/Breadcrumb";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Toolbar } from "@mui/material";
import Slider from "react-slick";

function PropertyDetail() {
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("");

  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const handleContactModalClose = () => {
    setContactModalOpen(false);
  };
  const handleContactModalOpen = () => {
    setContactModalOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setProperty(response.data.data.project);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching property details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  // Navbar items (removed Recent Transactions)
  const navbarItems = [
    { label: "Overview", id: "overview" },
    { label: "Amenities", id: "amenities" },
    { label: "About Project", id: "about-project" },
    { label: "About Locality", id: "location" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl w-full ">
      {/* Full-width Image */}
      <div className="relative">
        <img
        src={property.thumbnail?.path && property.thumbnail.path !== "" ? property.thumbnail.path : (property.images?.[0]?.path && property.images[0].path !== "" ? property.images[0].path : "/images/logo.svg")}
        // src={property.thumbnail?.path  || property.images?.[0]?.path || "/logo.svg"}
        //   src={()=>{
        //     // property.thumbnail?.path  || property.images?.[0]?.path || "/logo.svg"
        //     if (property.thumbnail?.path && property.thumbnail?.path != "") {
        //       return property.thumbnail.path;
        //   } else if(property.images && property.images.length > 0 && property.images[0].path != "") {
        //     return property.images[0].path;
        //   }else {
        //     return "/logo.svg";
        //   }
        // }}
          alt="Property"
          className="w-full h-96 object-contain rounded-t-xl z-0"
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          <h1 className="text-white text-2xl font-bold">{property.project}</h1>
          {property.images && property.images.length > 0 && (
            <button className="bg-white text-gray-800 px-4 py-2 rounded">
              {property.images.length} Photos
            </button>
          )}
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="flex justify-around p-4">
          {navbarItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-gray-800 hover:text-blue-500 ${
                activeSection === item.id ? " font-bold" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="w-full px-4 py-8">
        <div className="gap-6 w-full">
          <div className="col-span-2 space-y-6 w-full">
            <section id="overview">
              <PropertyHeader property={property} />
            </section>
            {property.amenities && property.amenities.length > 0 && (
              <section id="amenities">
                <Amenities amenities={property.amenities} />
              </section>
            )}
            <section id="about-project">
              <AboutProject about={property} />
            </section>
            {/* <section id="similarProperties">
              <SimilarProperties properties={property} />
            </section> */}
            <section id="project-details">
              <MoreDetails details={property} />
            </section>
            <section id="location">
              <LocationOverview handleContactModalOpen = {handleContactModalOpen} location={property} />
            </section>
          </div>
        </div>
      </div>

      
        <button onClick={handleContactModalOpen} className="fixed bottom-4 right-4 bg-gray-900 hover:scale-105 border border-white text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-black transition-colors z-50">
          Get More Details
        </button>
    

      {/* Contact Us Modal */}
            {isContactModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={handleContactModalClose}
                />
                <div className="relative bg-black rounded-lg shadow-xl  mx-4">
                  <button
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleContactModalClose}
                  >
                    
                  </button>
                  <ContactUsForm onClose={handleContactModalClose} />
                </div>
              </div>
            )}
    </div>
  );
}

const formatPrice = (price) => {
  if (!price || price === "none" || price === "") return "N/A";
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  
  if (numPrice >= 10000000) {
    return (numPrice / 10000000).toFixed(2) + " Cr";
  } else if (numPrice >= 100000) {
    return (numPrice / 100000).toFixed(2) + " Lac";
  } else if (numPrice >= 1000) {
    return (numPrice / 1000).toFixed(2) + "K";
  } else {
    return numPrice.toString();
  }
};

// Header Component with Gallery
// Enhanced PropertyHeader Component with Image Gallery
function PropertyHeader({ property }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const openImageModal = (image, index) => {
    setSelectedImage({ ...image, index });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!property.images || property.images.length === 0) return;
    
    const currentIndex = selectedImage.index;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === property.images.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage({ ...property.images[newIndex], index: newIndex });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showImageModal) return;
      
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showImageModal, selectedImage]);

  return (
    <div className="space-y-6 w-full">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-end gap-10">
          <div>
            {/* Title Section */}
            <div className="flex flex-col gap-6">
              <div className="flex gap-1">
                <div>
                  <div className="flex flex-col">
                    <h1 className="text-4xl font-semibold capitalize">
                      {property.project}
                    </h1>
                    {/* {property.builder && (
                      <h2 className="text-gray-700">By {property.builder}</h2>
                    )} */}
                    {property.address && (
                      <p className="flex text-sm gap-1 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        {property.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Price Section */}
                {(property.minimumPrice || property.maximumPrice) && (
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl text-gray-800">
                      {property.minimumPrice && property.maximumPrice ? (
                        <>
                          ₹ {formatPrice(property.minimumPrice)} - ₹{" "}
                          {formatPrice(property.maximumPrice)}
                        </>
                      ) : property.minimumPrice ? (
                        <>₹ {formatPrice(property.minimumPrice)}</>
                      ) : (
                        <>₹ {formatPrice(property.maximumPrice)}</>
                      )}
                    </h2>
                    {/* <a href="#" className="text-gray-600 underline text-sm">
                      Check Market Value
                    </a> */}
                  </div>
                )}
              </div>
            </div>

            {/* Property Details Section */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex items-center gap-2">
                {property.bhk && (
                  <span className="text-gray-700">{property.bhk} BHK</span>
                )}
                {property.type && (
                  <span className="text-gray-700 capitalize">{property.type}</span>
                )}
                {property.status && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded capitalize">
                    {property.status}
                  </span>
                )}
                {property.isTitleDeedVerified === "yes" && (
                  <span className="text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          {/* <div className="flex gap-4">
            <div>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
                Contact Now
              </button>
            </div> 
            <div>
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5 text-red-600" />
                Download Brochure
              </button>
            </div>
          </div> */}
        </div>

        {/* Property Quick Info */}
        <div className="flex items-center gap-8 py-4 border-t mt-4">
          {property.numberOfBedrooms && (
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-gray-600" />
              <span>{property.numberOfBedrooms} Bedrooms</span>
            </div>
          )}
          {property.numberOfBathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-gray-600" />
              <span>{property.numberOfBathrooms} Bathrooms</span>
            </div>
          )}
          {property.size && (
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-gray-600" />
              <span>{property.size}</span>
            </div>
          )}
          {property.numberOfParkings && (
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-600" />
              <span>{property.numberOfParkings} Parking</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Image Gallery Section */}
      {property.images && property.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Property Images ({property.images.length})
            </h3>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
              View All Photos
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {property.images.slice(0, 12).map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100"
                onClick={() => openImageModal(image, index)}
              >
                <img
                  src={image.path || "/logo.svg"}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {index === 11 && property.images.length > 12 && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{property.images.length - 12} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {property.videos && property.videos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <PlaySquare className="w-5 h-5 text-red-600" />
              Property Videos ({property.videos.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {property.videos.slice(0, 6).map((video, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-video bg-gray-100"
              >
                <video
                  src={video.path}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <PlaySquare className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floor Plans Section */}
      {property.floorPlan && property.floorPlan.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Floor Plans ({property.floorPlan.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {property.floorPlan.map((plan, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-[4/3] bg-gray-100 border-2 border-dashed border-gray-300"
                onClick={() => openImageModal(plan, index)}
              >
                <img
                  src={plan.path || "/logo.svg"}
                  alt={`Floor Plan ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fixed Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed -inset-6 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Close Button - Fixed positioning */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-8 z-60 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Counter - Fixed positioning */}
          <div className="absolute top-4 left-6 z-60 text-white text-sm bg-black bg-opacity-60 px-3 py-2 rounded">
            {selectedImage.index + 1} of {property.images?.length || property.floorPlan?.length || 1}
          </div>

          {/* Main Image Container - Full screen centered */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedImage.path || "/logo.svg"}
                alt="Property Preview"
                className="max-w-full max-h-full object-contain"
                style={{ 
                  maxHeight: 'calc(100vh - 4rem)',
                  maxWidth: 'calc(100vw - 4rem)'
                }}
              />

              {/* Navigation Arrows */}
              {(property.images?.length > 1 || property.floorPlan?.length > 1) && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-3 transition-all"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Image Info - Fixed positioning at bottom */}
          {selectedImage.name && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-60 text-center text-white bg-black bg-opacity-60 px-4 py-2 rounded">
              <p className="text-sm">{selectedImage.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Amenities = ({ amenities = [] }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!amenities || amenities.length === 0) return null;

  // All amenities with their icons and categories
  const allAmenities = [
    // Essential Services
    { name: "Power Back Up", icon: Lightbulb, category: "Essential Services" },
    { name: "Water Storage", icon: Droplet, category: "Essential Services" },
    { name: "Rain Water Harvesting", icon: CloudRain, category: "Essential Services" },
    { name: "Lift", icon: ArrowRight, category: "Essential Services" },
    { name: "Intercom Facility", icon: Phone, category: "Essential Services" },
    { name: "Maintenance Staff", icon: CheckCircle2, category: "Essential Services" },
    
    // Recreation
    { name: "Swimming Pool", icon: GlassWaterIcon, category: "Recreation" },
    { name: "Pool", icon: GlassWaterIcon, category: "Recreation" },
    { name: "Indoor Games Room", icon: Gamepad2, category: "Recreation" },
    { name: "Kids play area", icon: Baby, category: "Recreation" },
    { name: "Multipurpose Hall", icon: PlaySquare, category: "Recreation" },
    { name: "Club House", icon: Building, category: "Recreation" },
    { name: "Kids Club", icon: Baby, category: "Recreation" },
    
    // Convenience
    { name: "Waste Disposal", icon: Trash2, category: "Convenience" },
    { name: "Vaastu Compliant", icon: Compass, category: "Convenience" },
    { name: "Bank & ATM", icon: CreditCard, category: "Convenience" },
    
    // Security
    { name: "Security", icon: Shield, category: "Security" },
    { name: "Fire Fighting Equipment", icon: FireExtinguisher, category: "Security" },
    
    // Health & Fitness
    { name: "Gymnasium", icon: Dumbbell, category: "Health & Fitness" },
    { name: "Library", icon: Book, category: "Health & Fitness" },
    
    // Parking
    { name: "Visitor Parking", icon: Car, category: "Parking" },
    { name: "Reserved Parking", icon: Car, category: "Parking" }
  ];

  const availableAmenities = amenities.map(a => a.toLowerCase());

  // Sort amenities - available ones first, then unavailable
  const sortedAmenities = allAmenities.sort((a, b) => {
    const aAvailable = availableAmenities.some(amenity => 
      a.name.toLowerCase().includes(amenity) || amenity.includes(a.name.toLowerCase())
    );
    const bAvailable = availableAmenities.some(amenity => 
      b.name.toLowerCase().includes(amenity) || amenity.includes(b.name.toLowerCase())
    );
    
    // Available amenities come first
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return 0;
  });

  // Display amenities based on showAll state
  const displayedAmenities = showAll ? sortedAmenities : sortedAmenities.slice(0, 12);
  const hasMoreAmenities = sortedAmenities.length > 12;

  return (
    <div className="relative bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Amenities
        </h2>
        
        {/* Single Grid Layout for All Amenities */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
          {displayedAmenities.map((amenity, index) => {
            const AmenityIcon = amenity.icon;
            const isAvailable = availableAmenities.some(a => 
              amenity.name.toLowerCase().includes(a) || a.includes(amenity.name.toLowerCase())
            );
            
            return (
              <div 
                key={index} 
                className={`
                  group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg
                  ${isAvailable 
                    ? 'bg-white border-green-200 shadow-md hover:border-green-300 hover:shadow-xl' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Available Indicator */}
                <div className="absolute top-3 right-3 z-10">
                  {isAvailable ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-gray-300 rounded-full p-1">
                      <X size={14} className="text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="px-4 py-6 flex flex-col items-center text-center h-full justify-center min-h-[140px]">
                  {/* Icon */}
                  <div className={`mb-3 group-hover:scale-110 transition-transform duration-300 ${
                    isAvailable ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <AmenityIcon size={32} />
                  </div>
                  
                  {/* Amenity Name */}
                  <span className={`text-sm font-medium leading-tight ${
                    isAvailable ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {amenity.name}
                  </span>
                  
                  {/* Category Badge */}
                  <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isAvailable 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {amenity.category}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isAvailable 
                    ? 'bg-gradient-to-t from-green-50/50 to-transparent' 
                    : 'bg-gradient-to-t from-gray-100/50 to-transparent'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        {hasMoreAmenities && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              {showAll ? (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Show Less Amenities
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4" />
                  Show {sortedAmenities.length - 12} More Amenities
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Stats Summary */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-500 rounded-full p-1">
                <CheckCircle2 size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {displayedAmenities.filter(amenity => 
                  availableAmenities.some(a => 
                    amenity.name.toLowerCase().includes(a) || a.includes(amenity.name.toLowerCase())
                  )
                ).length} Available {showAll ? '' : '(showing first 12)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-300 rounded-full p-1">
                <X size={16} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {displayedAmenities.filter(amenity => 
                  !availableAmenities.some(a => 
                    amenity.name.toLowerCase().includes(a) || a.includes(amenity.name.toLowerCase())
                  )
                ).length} Not Available
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Total: {sortedAmenities.length} Amenities
          </div>
        </div>
        
        {/* Contact Button */}
        {/* <button className="w-full lg:w-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Contact Builder for Details
        </button> */}
      </div>
    </div>
  );
};

// Similar Properties Section
// function SimilarProperties({ properties }) {
//   return (
//     <div className="p-6 bg-white rounded-lg shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">
//           Other Properties in this Project and Nearby
//         </h2>
//         <button className="p-2 rounded-full hover:bg-gray-100">
//           <ArrowRight className="w-6 h-6" />
//         </button>
//       </div>
//       <div className="grid grid-cols-2 gap-4 capitalize">
//         <div className="group cursor-pointer">
//           <div className="relative aspect-[4/3]">
//             <img
//               src={properties.images?.[0]?.path || "/logo.svg"}
//               alt={properties.project}
//               className="w-full h-full object-cover rounded-lg"
//             />
//             {properties.images && properties.images.length > 0 && (
//               <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
//                 {properties.images.length} Photos
//               </div>
//             )}
//           </div>
//           {properties.appartmentSubType?.[0] && (
//             <h3 className="font-medium">{properties.appartmentSubType[0]}</h3>
//           )}
//           {(properties.minimumPrice || properties.maximumPrice) && (
//             <div className="flex gap-2 text-lg font-semibold">
//               <h2 className="text-xl text-gray-800">
//                 {properties.minimumPrice && properties.maximumPrice ? (
//                   <>
//                     ₹ {formatPrice(properties.minimumPrice)} - ₹{" "}
//                     {formatPrice(properties.maximumPrice)}
//                   </>
//                 ) : properties.minimumPrice ? (
//                   <>₹ {formatPrice(properties.minimumPrice)}</>
//                 ) : (
//                   <>₹ {formatPrice(properties.maximumPrice)}</>
//                 )}
//               </h2>
//               {properties.size && (
//                 <>
//                   <span className="text-gray-600">|</span>
//                   <span>{properties.size}</span>
//                 </>
//               )}
//             </div>
//           )}
//           <p className="text-gray-600">{properties.project}</p>
//           {properties.status && (
//             <p className="text-gray-600 capitalize">{properties.status}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// About Project Section
const AboutProject = ({ about }) => {
  const cardData = [
    {
      label: "Project Size",
      value: about?.size,
      icon: <MapPin className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Total Units",
      value: about?.unit,
      icon: <Home className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Total Towers",
      value: about?.tower,
      icon: <Building2 className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "BHK ",
      value: about?.bhk,
      icon: <Bed className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Floor Number",
      value: about?.floorNumber,
      icon: <Building className="w-6 h-6 text-amber-500" />,
    },
  ].filter(item => item.value && item.value !== "");

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="max-w-2xl ld:w-full p-6">
        <h1 className="text-3xl capitalize font-semibold text-gray-800 mb-4">
          About {about?.project}
        </h1>

        {about?.overview && (
          <div className="mb-6">
            <p className="text-gray-600">{about.overview}</p>
          </div>
        )}

        {/* Project Details Grid */}
        {cardData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            {cardData.map((card, index) => (
              <div key={index} className="p-4 border border-black/30 rounded-lg">
                <div className="text-gray-600 mb-2">{card.label}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{card.value}</span>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// More Details Section
function MoreDetails({ details }) {
  const detailedSection = [
    {
      title: "Maximum Price",
      items: details?.maximumPrice,
    },
    {
      title: "Minimum Price",
      items: details?.minimumPrice,
    },
    {
      title: "Address",
      items: details?.address,
    },
    {
      title: "Builder",
      items: details?.builder,
    },
    {
      title: "Floor Number",
      items: details?.floorNumber,
    },
    {
      title: "Status",
      items: details?.status,
    },
    {
      title: "Property Type",
      items: details?.type,
    },
    {
      title: "Category",
      items: details?.category,
    },
    {
      title: "Available For",
      items: details?.availableFor,
    },
    {
      title: "Number of Floors",
      items: details?.numberOfFloors,
    },
    {
      title: "Number of Bedrooms",
      items: details?.numberOfBedrooms,
    },
    {
      title: "Number of Bathrooms",
      items: details?.numberOfBathrooms,
    },
    {
      title: "Number of Washrooms",
      items: details?.numberOfWashrooms,
    },
    {
      title: "Parking Spaces",
      items: details?.numberOfParkings,
    },
    {
      title: "Title Deed Verified",
      items: details?.isTitleDeedVerified,
    },
  ].filter(item => item.items && item.items !== "" && item.items !== "none");

  if (detailedSection.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">More Details</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            {detailedSection.map((items, index) => (
              <div className="grid grid-cols-2 lg:w-[70%]" key={index}>
                <p className="text-gray-600">{items.title}</p>
                <p className="font-medium capitalize">{items.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const LocationOverview = ({ location, handleContactModalOpen }) => {
  // Define icons for each category
  const getCategoryIcon = (categoryTitle) => {
    const iconMap = {
      "Transportation Hubs": <CarTaxiFront className="w-5 h-5 text-blue-500" />,
      "Commercial Hubs": <Building2 className="w-5 h-5 text-purple-500" />,
      "Educational Institutions": <Book className="w-5 h-5 text-green-500" />,
      "Healthcare Facilities": <AlertCircle className="w-5 h-5 text-red-500" />,
      "Shopping Centers": <Building className="w-5 h-5 text-orange-500" />,
      "Hotels & Dining": <Home className="w-5 h-5 text-yellow-500" />,
    };
    return iconMap[categoryTitle] || <MapPin className="w-5 h-5 text-gray-500" />;
  };

  // Generate random but realistic distances/times
  const getRandomDistance = (categoryTitle) => {
    const ranges = {
      "Transportation Hubs": { min: 5, max: 30, suffix: "min" },
      "Commercial Hubs": { min: 1, max: 15, suffix: "km" },
      "Educational Institutions": { min: 0.5, max: 10, suffix: "km" },
      "Healthcare Facilities": { min: 0.5, max: 8, suffix: "km" },
      "Shopping Centers": { min: 0.2, max: 5, suffix: "km" },
      "Hotels & Dining": { min: 0.1, max: 3, suffix: "km" },
    };
    
    const range = ranges[categoryTitle] || { min: 1, max: 10, suffix: "km" };
    const distance = (Math.random() * (range.max - range.min) + range.min).toFixed(1);
    return `${distance} ${range.suffix}`;
  };

  const locationAdvantages = [
    {
      title: "Transportation Hubs",
      items: location.transportationHubs || [],
      description: "Easy connectivity to major transportation networks",
    },
    {
      title: "Commercial Hubs",
      items: location.commercialHubs || [],
      description: "Close proximity to business districts and offices",
    },
    {
      title: "Educational Institutions",
      items: location.educationalInstitutions || [],
      description: "Access to quality educational facilities",
    },
    {
      title: "Healthcare Facilities",
      items: location.hospitals || [],
      description: "Medical facilities and emergency services nearby",
    },
    {
      title: "Shopping Centers",
      items: location.shoppingCentres || [],
      description: "Retail and entertainment options",
    },
    {
      title: "Hotels & Dining",
      items: location.hotels || [],
      description: "Hospitality and dining experiences",
    },
  ].filter(category => category.items && category.items.length > 0);

  const hasLocationData = location.address || location.city || location.state || location.sector || location.pincode || locationAdvantages.length > 0;

  if (!hasLocationData) return null;

  return (
    <div className="bg-white shadow-sm rounded-xl">
      <div className="max-w-4xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-semibold text-gray-800">
            About {location.city || location.address || "Location"}
          </h1>
        </div>

        {/* Basic Location Info Card */}
        {(location.address || location.city || location.state || location.sector || location.pincode) && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Locate className="w-5 h-5 text-blue-500" />
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {location.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-600">{location.address}</p>
                  </div>
                </div>
              )}
              {location.city && location.state && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700">City:</span>
                  <span className="text-gray-600">{location.city}, {location.state}</span>
                </div>
              )}
              {location.sector && (
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700">Sector:</span>
                  <span className="text-gray-600">{location.sector}</span>
                </div>
              )}
              {location.pincode && (
                <div className="flex items-center gap-2">
                  <PinIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700">Pincode:</span>
                  <span className="text-gray-600">{location.pincode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Advantages */}
        {locationAdvantages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Location Advantages
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {locationAdvantages.map((category, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(category.title)}
                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {category.items.slice(0, 5).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 capitalize text-sm">
                            {item}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {getRandomDistance(category.title)}
                        </span>
                      </div>
                    ))}
                    
                    {category.items.length > 5 && (
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        +{category.items.length - 5} more {category.title.toLowerCase()}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coordinates Map Link (if coordinates are available) */}
        {location.coordinates && location.coordinates.length === 2 && 
         location.coordinates[0] !== 0 && location.coordinates[1] !== 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">View on Map</span>
              </div>
              <button 
                onClick={() => {
                  const [lat, lng] = location.coordinates;
                  window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Open Maps
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Coordinates: {location.coordinates[1]}, {location.coordinates[0]}
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-black">Interested in this location?</h3>
              <p className="text-sm text-gray-900">Get detailed locality information and site visit assistance</p>
            </div>
            <button onClick={handleContactModalOpen} className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
              Get More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;