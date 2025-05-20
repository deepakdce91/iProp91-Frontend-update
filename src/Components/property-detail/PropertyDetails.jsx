import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Phone,
  Heart,
  Share,
  X,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Info,
  ArrowRight,
  Home,
  Check,
  BarChart,
  Users,
  User,
  BedDouble,
  Bath,
  Grid,
  Building,
  Camera,
  UserCheck,
  Building2,
  Leaf,
  Car,
  Wifi,
} from "lucide-react";

// Custom icon components
const VisitorParkingIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gold-500"
  >
    <rect
      x="3"
      y="6"
      width="18"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 14H8v3h8v-3z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Amenities data structure
const getAmenitiesWithStatus = (propertyAmenities) => {
  // Define all possible amenities
  const allAmenities = [
    { name: "Fire Safety System", category: "Building Features" },
    { name: "Power Backup", category: "Building Features" },
    { name: "Elevator", category: "Building Features" },
    { name: "Intercom Facility", category: "Building Features" },
    { name: "Swimming Pool", category: "Common Areas" },
    { name: "Gym", category: "Common Areas" },
    { name: "Children's Play Area", category: "Common Areas" },
    { name: "Clubhouse", category: "Common Areas" },
    { name: "Garden", category: "Common Areas" },
    { name: "Resident Parking", category: "Parking" },
    { name: "Visitor Parking", category: "Parking" },
    { name: "High-Speed Internet", category: "Connectivity" },
    { name: "Nearby Shopping", category: "Connectivity" },
    { name: "Schools Within 1KM", category: "Connectivity" },
    { name: "Green Spaces", category: "Environment" },
    { name: "Good Ventilation", category: "Environment" },
    { name: "Vaastu Compliant", category: "Environment" }
  ];

  // Map through all amenities and check if they exist in propertyAmenities
  return allAmenities.map(amenity => ({
    ...amenity,
    available: Array.isArray(propertyAmenities) && propertyAmenities.includes(amenity.name)
  }));
};

// Category definitions with their icons
const categoryDefinitions = {
  "Building Features": { icon: Building2, iconColor: "text-amber-500" },
  "Common Areas": { icon: Users, iconColor: "text-amber-500" },
  "Parking": { icon: Car, iconColor: "text-amber-500" },
  "Connectivity": { icon: Wifi, iconColor: "text-amber-500" },
  "Environment": { icon: Leaf, iconColor: "text-amber-500" }
};

// Utility functions
const groupByCategory = (amenitiesList) => {
  const categories = [];
  const categoryNames = [...new Set(amenitiesList.map(item => item.category))];
  
  categoryNames.forEach(categoryName => {
    if (categoryDefinitions[categoryName]) {
      categories.push({
        name: categoryName,
        icon: categoryDefinitions[categoryName].icon,
        iconColor: categoryDefinitions[categoryName].iconColor,
        amenities: amenitiesList.filter(item => item.category === categoryName)
      });
    }
  });
  
  return categories;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Group amenities by category
const categorizedAmenities = groupByCategory(getAmenitiesWithStatus([]));

export default function PropertyDetails({ onBack = () => {} }) {
  // State management
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showContact, setShowContact] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("8.5");
  const [loanTenure, setLoanTenure] = useState("20");
  const [emi, setEmi] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user authentication - replace with your actual auth context
  const isAuthenticated = false;
  const user = null;

  // Event handlers
  const handleImageError = useCallback((e) => {
    e.target.src = "/assets/images/fallback-image.jpg";
    e.target.alt = "Image not available";
  }, []);

  const nextImage = useCallback((totalImages) => {
    setActiveImage(prev => (prev + 1) % totalImages);
  }, []);

  const prevImage = useCallback((totalImages) => {
    setActiveImage((prev) => (prev - 1 + totalImages) % totalImages);
  }, []);

  const calculateEmi = useCallback(() => {
    if (!loanAmount || !interestRate || !loanTenure) {
      toast.error("Please fill all loan details");
      return;
    }

    try {
      const principal = parseFloat(loanAmount.replace(/[^0-9.]/g, ""));
      const rate = parseFloat(interestRate) / 100 / 12;
      const time = parseFloat(loanTenure) * 12;

      if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        toast.error("Please enter valid numbers");
        return;
      }

      const emiValue =
        (principal * rate * Math.pow(1 + rate, time)) /
        (Math.pow(1 + rate, time) - 1);
      setEmi(emiValue.toFixed(2));
    } catch (error) {
      console.error("EMI calculation error:", error);
      toast.error("Error calculating EMI");
    }
  }, [loanAmount, interestRate, loanTenure]);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (formErrors[name]) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [formErrors]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (isAuthenticated && !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isAuthenticated]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        toast.success("Your inquiry has been submitted successfully!");
        setShowContact(false);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          message: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("There was an error submitting your inquiry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, user]
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const toggleContact = useCallback(() => {
    setShowContact((prev) => !prev);
  }, []);

  const togglePhone = useCallback(() => {
    setPhoneVisible((prev) => !prev);
  }, []);

  // Data fetching
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) {
        console.error("No property ID provided");
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/${id}`
        );

        if (response.data.status === "success" && response.data.data.project) {
          console.log("Property data:", response.data.data.project);
          const propertyData = response.data.data.project;
          const processedProperty = {
            id: propertyData._id,
            propertyId: propertyData.propertyId,
            listingId: propertyData.listingId,
            state: propertyData.state,
            city: propertyData.city,
            builder: propertyData.builder,
            project: propertyData.project,
            overview: propertyData.overview,
            address: propertyData.address,
            pincode: propertyData.pincode,
            status: propertyData.status,
            type: propertyData.type,
            availableFor: propertyData.availableFor,
            category: propertyData.category,
            minimumPrice: propertyData.minimumPrice,
            maximumPrice: propertyData.maximumPrice,
            bhk: propertyData.bhk,
            appartmentType: propertyData.appartmentType || [],
            appartmentSubType: propertyData.appartmentSubType || [],
            features: propertyData.features || [],
            amenities: propertyData.amenities || [],
            commercialHubs: propertyData.commercialHubs || [],
            hospitals: propertyData.hospitals || [],
            hotels: propertyData.hotels || [],
            shoppingCentres: propertyData.shoppingCentres || [],
            transportationHubs: propertyData.transportationHubs || [],
            educationalInstitutions: propertyData.educationalInstitutions || [],
            images: propertyData.images || [],
            floorPlan: propertyData.floorPlan || [],
            enable: propertyData.enable,
            isViewed: propertyData.isViewed,
            createdAt: propertyData.createdAt,
            updatedAt: propertyData.updatedAt,
            floorNumber: propertyData.floorNumber,
            houseNumber: propertyData.houseNumber,
            isTitleDeedVerified: propertyData.isTitleDeedVerified,
            numberOfBathrooms: propertyData.numberOfBathrooms,
            numberOfBedrooms: propertyData.numberOfBedrooms,
            numberOfFloors: propertyData.numberOfFloors,
            numberOfParkings: propertyData.numberOfParkings,
            numberOfWashrooms: propertyData.numberOfWashrooms,
            sector: propertyData.sector,
            size: propertyData.size,
            thumbnail: propertyData.thumbnail,
            tower: propertyData.tower,
            unit: propertyData.unit,
            videos: propertyData.videos || [],
            coordinates: Array.isArray(propertyData.coordinates) && propertyData.coordinates.length === 2 ? propertyData.coordinates : [0,0],
            area: propertyData.size || "N/A",
            status: propertyData.status || "N/A",
            bathrooms: propertyData.numberOfBathrooms || "N/A",
            balconies: propertyData.balconies || "N/A",
            flooring: propertyData.flooring || "N/A",
            electrical: propertyData.electrical || "N/A",
            doors: propertyData.doors || "N/A",
            possessionStatus: propertyData.status || "N/A",
            furnishingStatus: propertyData.furnishingStatus || "N/A",
            pricePerSqft: propertyData.pricePerSqft || "N/A",
            parking: propertyData.numberOfParkings || "N/A",
            transactionType: propertyData.availableFor || "N/A",
            category: propertyData.category || "N/A",
            overview: propertyData.overview || "No description available",
            project: propertyData.project || "N/A",
            totalFloors: propertyData.numberOfFloors || "N/A",
            floorNumber: propertyData.floorNumber || "N/A",
            age: propertyData.age || "N/A",
          };

          setProperty(processedProperty);
        } else {
          console.error("Invalid API response format:", response.data);
          toast.error("Failed to load property details");
          setProperty(null);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Failed to load property details");
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!property) {
    return (
      <div className="p-8 text-center bg-black">
        <p className="text-gray-300">Property not found or failed to load.</p>
        <button
          className="mt-4 px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
          onClick={() => navigate("/")}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  // Extract property details with fallbacks
  const images = property.images && property.images.length > 0
    ? property.images
    : ["/assets/images/property-placeholder-1.jpg"];

  const propertyType = property.type || "Residential";
  const propertySize = property.area || "N/A";
  const bhkInfo = property.bhk || "N/A";
  const propertyPrice = property.price || "Price on Request";
  const propertyLocation = property.location || "Location not available";
  const amenities = Array.isArray(property.amenities) && property.amenities.length > 0
    ? property.amenities
    : ["Basic Amenities"];
  const possessionStatus = property.possessionStatus || "N/A";
  const furnishingStatus = property.furnishingStatus || "N/A";

  console.log(property.amenities)
  return (
    <div className="bg-black pt-[14vh]">
      <div className="bg-white text-gray-800 min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-black shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={onBack}
              className="flex items-center text-yellow-400 hover:text-yellow-500"
            >
              <ChevronLeft className="mr-1" size={20} />
              <span className="font-medium">Back to Search</span>
            </button>
            <div className="flex items-center gap-4">
              <button className="flex items-center text-white hover:text-yellow-400 transition">
                <Share size={18} className="mr-1" />
                <span className="text-sm">Share</span>
              </button>
              <button
                className="flex items-center hover:text-yellow-400 transition"
                onClick={() => setLiked(!liked)}
              >
                <Heart
                  className={`${
                    liked ? "text-yellow-400 fill-yellow-400" : "text-white"
                  } mr-1`}
                  size={18}
                />
                <span className="text-sm">{liked ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="pb-2">
          {/* Image Gallery */}
          <div className="relative h-[25vh] md:h-[30vh] bg-black">
            <img
              src={images[activeImage]}
              alt={`Property ${activeImage + 1}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
              aria-label={`Property image ${activeImage + 1} of ${images.length}`}
            />
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
              onClick={() => prevImage(images.length)}
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white"
              onClick={() => nextImage(images.length)}
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    activeImage === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 py-2">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Column - Property Details */}
              <div className="lg:w-2/3">
                {/* Property Header */}
                <div className="mb-3">
                  <div className="flex items-center mb-1">
                    <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded text-sm font-medium mr-2">
                      {propertyType}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ID: {property._id || "N/A"}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {bhkInfo} Apartment in {propertyLocation}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {propertyLocation}
                  </p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b mb-3">
                  <div className="flex overflow-x-auto">
                    {["overview", "specifications", "amenities"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-2 font-medium capitalize transition-colors ${
                          activeTab === tab
                            ? "border-b-2 border-gold-500 text-gold-600"
                            : "text-gray-600 hover:text-gold-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mb-2">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="p-4 border rounded-lg flex flex-col items-center">
                          <BedDouble className="text-gold-500 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Bedrooms</p>
                          <p className="font-semibold">{bhkInfo.split(" ")[0]}</p>
                        </div>
                        <div className="p-4 border rounded-lg flex flex-col items-center">
                          <Bath className="text-gold-500 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Bathrooms</p>
                          <p className="font-semibold">
                            {property.bathrooms || "2"}
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg flex flex-col items-center">
                          <Grid className="text-gold-500 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Area</p>
                          <p className="font-semibold">{propertySize}</p>
                        </div>
                        <div className="p-4 border rounded-lg flex flex-col items-center">
                          <Building className="text-gold-500 mb-2" size={24} />
                          <p className="text-sm text-gray-600">Furnishing</p>
                          <p className="font-semibold">{furnishingStatus}</p>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-4">
                        About this property
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {property.description ||
                          `This ${bhkInfo} ${propertyType.toLowerCase()} is located in ${propertyLocation}. 
                        It offers a perfect blend of comfort and convenience with a total area of ${propertySize}.
                        The property is ${furnishingStatus.toLowerCase()} and is ${possessionStatus.toLowerCase()}.
                        Perfect for families looking for a modern lifestyle with excellent amenities and connectivity.`}
                      </p>

                      <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                        {amenities.slice(0, 6).map((amenity, index) => (
                          <div key={index} className="flex items-center">
                            <Check size={18} className="text-gold-500 mr-2" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specifications Tab */}
                  {activeTab === "specifications" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Property Specifications
                      </h3>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Construction Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Floors</span>
                            <span className="font-medium">
                              {property.totalFloors || "10"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Floor Number</span>
                            <span className="font-medium">
                              {property.floorNumber || "5"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Age of Property</span>
                            <span className="font-medium">
                              {property.age || "2 years"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Possession Status
                            </span>
                            <span className="font-medium">
                              {possessionStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Room Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bedrooms</span>
                            <span className="font-medium">
                              {bhkInfo.split(" ")[0]}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bathrooms</span>
                            <span className="font-medium">
                              {property.bathrooms || "2"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Balconies</span>
                            <span className="font-medium">
                              {property.balconies || "1"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Furnishing Status
                            </span>
                            <span className="font-medium">
                              {furnishingStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amenities Tab */}
                  {activeTab === "amenities" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Amenities & Features
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {categorizedAmenities.map((category, i) => {
                          const CategoryIcon = category.icon;
                          const categoryAmenities = getAmenitiesWithStatus(property.amenities);
                          
                          return (
                            <div key={i} className="flex flex-col">
                              <div className="flex items-center mb-4">
                                <div className={`${category.iconColor} mr-2`}>
                                  <CategoryIcon size={20} />
                                </div>
                                <span className="text-gray-800 font-medium">{category.name}</span>
                              </div>
                              
                              <div className="space-y-3">
                                {categoryAmenities
                                  .filter(amenity => amenity.category === category.name)
                                  .map((amenity, j) => (
                                    <div key={j} className="flex items-center">
                                      {amenity.available ? (
                                        <>
                                          <Check size={16} className="text-amber-500 mr-2" />
                                          <span className="text-gray-900 font-medium">{amenity.name}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Check size={16} className="text-gray-300 mr-2" />
                                          <span className="text-gray-400">{amenity.name}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:w-1/3">
                {/* Price Card */}
                <div className="bg-white shadow-lg rounded p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {propertyPrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 mb-4">
                    <button
                      onClick={toggleContact}
                      className="bg-gold-600 text-white hover:bg-gold-700 px-6 py-3 rounded-md font-medium flex items-center justify-center"
                      aria-label="Contact property agent"
                    >
                      <UserCheck className="mr-2" size={18} />
                      More Information
                    </button>
                  </div>
                </div>

                {/* Loan Calculator */}
                <div className="bg-white shadow-lg rounded p-4 mb-4">
                  <div className="flex items-center mb-4">
                    <BarChart className="text-gold-600 mr-2" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Home Loan Calculator
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    Calculate your estimated EMI for this property
                  </p>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        Loan Amount
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="₹60,00,000"
                        aria-label="Loan amount"
                        id="loan-amount"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        name="loanAmount"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        Interest Rate (%)
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="8.5%"
                        aria-label="Interest rate"
                        id="interest-rate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        name="interestRate"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 text-sm">
                        Loan Tenure
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="20 years"
                        aria-label="Loan tenure"
                        id="loan-tenure"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(e.target.value)}
                        name="loanTenure"
                      />
                    </div>
                  </div>
                  <button
                    className="bg-gold-600 text-white hover:bg-gold-700 px-6 py-2 rounded-md font-medium"
                    onClick={calculateEmi}
                    aria-label="Calculate EMI"
                    type="button"
                  >
                    Calculate EMI
                  </button>

                  {emi && (
                    <div className="mt-4 p-3 bg-gold-50 border border-gold-200 rounded-md">
                      <p className="font-semibold text-gray-800">
                        Estimated Monthly EMI:
                      </p>
                      <p className="text-xl text-gold-600 font-bold">₹{emi}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContact && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  More Information
                </h3>
                <button
                  onClick={toggleContact}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500 ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={isAuthenticated && user?.name}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Email Address{" "}
                    {isAuthenticated && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    className={`w-full border rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={isAuthenticated && user?.email}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`w-full border rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500 ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    disabled={isAuthenticated && user?.phone}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Your Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500 h-24"
                    placeholder="I'm interested in this property and would like more information..."
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                {!isAuthenticated && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agree"
                      className="mr-2"
                      required
                    />
                    <label htmlFor="agree" className="text-sm text-gray-600">
                      I agree to receive communications via WhatsApp, SMS, phone
                      calls, and emails
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gold-600 text-white py-3 rounded font-semibold hover:bg-gold-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

PropertyDetails.propTypes = {
  onBack: PropTypes.func,
};
