import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Phone,
  Heart,
  Share,
  Menu,
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
  SquareGantt,
  Ruler,
  Cog,
  Camera,
  UserCheck,
  Building,
  Clock,
} from "lucide-react";
// Import the gold theme CSS
import axios from "axios";
import { toast } from "react-hot-toast";

export default function PropertyDetail({ onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPopup, setShowPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    console.log("PropertyDetail mounted with ID:", id);

    const fetchPropertyDetails = async () => {
      if (!id) {
        console.error("No property ID provided");
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching property details for ID:", id);

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/projectsDataMaster/${id}`
        );
        console.log("API Response:", response.data);

        if (response.data.status === "success" && response.data.data) {
          const propertyData = response.data.data;
          console.log("Processing property data:", propertyData);

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
            doors: propertyData.doors,
            possessionStatus:
              propertyData.possessionStatus || propertyData.status,
            furnishingStatus: propertyData.furnishingStatus,
            pricePerSqft: propertyData.pricePerSqft,
            parking: propertyData.parking,
            transactionType: propertyData.transactionType,
            category: propertyData.category,
            // Add any additional fields you need
          };

          console.log("Setting processed property:", processedProperty);
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
  }, [id]); // Only depend on id

  // Add debug logging for render
  console.log("PropertyDetail rendering with:", { id, property, isLoading });

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

  // Use property.images or fallback
  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://via.placeholder.com/800x500?text=No+Image",
          "https://via.placeholder.com/800x500?text=No+Image+2",
          "https://via.placeholder.com/800x500?text=No+Image+3",
        ];

  // Get property type from data or fallback
  const propertyType = property.type || "Residential";

  // Format property details
  const propertySize = property.size || property.area || "1350 Sq.ft.";
  const bhkInfo = property.bhk || "3 BHK";
  const propertyPrice = property.price || "₹75.5 L";
  const propertyLocation =
    property.location || property.address || "Sector 25 Rohini, New Delhi";

  // Amenities (either from API or fallbacks)
  const amenities = property.amenities || [
    "Lift",
    "Power Backup",
    "Car Parking",
    "Park",
    "Security",
    "Visitor Parking",
    "Swimming Pool",
    "Gym",
    "Club House",
  ];

  // Construction status
  const possessionStatus =
    property.possessionStatus || property.possession || "Ready to Move";
  const furnishingStatus =
    property.furnishingStatus || property.furnishing || "Semi-Furnished";

  // Carousel navigation
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle contact form display
  const toggleContact = () => {
    setShowContact((prev) => !prev);
  };

  // Handle phone number display
  const togglePhone = () => {
    setPhoneVisible((prev) => !prev);
  };

  // Calculate EMI
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100; // Monthly interest rate
    const time = loanTenure * 12; // Total months

    const emi =
      (principal * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
    setEmi(Math.round(emi));
    setShowPopup(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main content */}
        <div className="p-6">
          {/* MagicBricks-style Header Section */}
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

          <div className="pt-20 max-w-6xl mx-auto px-4 py-6">
            {/* Breadcrumb Navigation */}
            <nav className="text-sm mb-4">
              <ol className="flex flex-wrap items-center">
                <li className="flex items-center">
                  <a href="#" className="text-gray-500 hover:text-black">
                    Home
                  </a>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li className="flex items-center">
                  <a href="#" className="text-gray-500 hover:text-black">
                    New Delhi
                  </a>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li className="flex items-center">
                  <a href="#" className="text-gray-500 hover:text-black">
                    Sector 25 Rohini
                  </a>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li>
                  <span className="text-black font-medium">
                    {property.title}
                  </span>
                </li>
              </ol>
            </nav>
            {/* Main Property Container */}
            <div className="bg-white shadow-lg rounded mb-6 overflow-hidden">
              {/* Property Title and Price Section - MagicBricks Style */}
              <div className="border-b border-gray-200">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.title}
                      </h1>
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin size={16} className="text-gold-500 mr-1" />
                        <p>{propertyLocation}</p>
                      </div>
                    </div>

                    <div className="mt-3 lg:mt-0">
                      <div className="flex items-center">
                        <p className="text-2xl md:text-3xl font-bold text-gold-600">
                          {propertyPrice}
                        </p>
                        <span className="ml-2 text-gray-500 text-sm">
                          ({property.pricePerSqft || "₹5,600 per sq.ft."})
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Possession: {possessionStatus}
                      </p>
                    </div>
                  </div>

                  {/* Property Highlights - Key Features */}
                  <div className="flex flex-wrap gap-6 mt-4 pb-2">
                    <div className="flex items-center">
                      <BedDouble size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium">{bhkInfo.split(" ")[0]}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Bath size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-medium">
                          {property.bathrooms || "2"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Grid size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Carpet Area</p>
                        <p className="font-medium">{propertySize}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Building size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{possessionStatus}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Home size={20} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Furnishing</p>
                        <p className="font-medium">{furnishingStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Tabs */}
              <div className="mt-8 border-b border-gray-800">
                <div className="flex space-x-6 overflow-x-auto pb-2">
                  {[
                    "overview",
                    "details",
                    "amenities",
                    "location",
                    "contact",
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 capitalize whitespace-nowrap transition ${
                        activeTab === tab
                          ? "text-yellow-500 border-b-2 border-yellow-500"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MagicBricks-style Image Gallery */}
            <div className="relative">
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={images[activeImage]}
                  alt={`Property image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Camera size={16} className="mr-1" />
                  <span>
                    {activeImage + 1}/{images.length}
                  </span>
                </div>

                {/* Property Type Badge */}
                <div className="absolute top-4 left-4 bg-gold-600 text-white px-3 py-1 rounded-sm text-sm font-medium">
                  {propertyType}
                </div>

                {/* Save/Share Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={20}
                      className={
                        liked ? "text-red-500 fill-red-500" : "text-gray-600"
                      }
                    />
                  </button>
                  <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                    <Share size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              {/* Thumbnails */}
              <div className="flex overflow-x-auto p-3 space-x-3 bg-white border-t border-gray-200">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer transition-all duration-300 flex-shrink-0`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-16 object-cover rounded ${
                        activeImage === index
                          ? "ring-2 ring-gold-500"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setActiveImage(index)}
                    />
                    {activeImage === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-black border border-gray-800 shadow-lg rounded-lg p-6">
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 transition font-semibold"
                >
                  <Calendar size={18} />
                  <span>Schedule Visit</span>
                </button>

                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg ${
                    liked
                      ? "bg-red-900 text-red-300"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Heart size={18} fill={liked ? "currentColor" : "none"} />
                  <span>{liked ? "Saved" : "Save"}</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Property details content will go here */}
              </div>
            </div>

            {/* Description */}
            <div className="bg-black border border-gray-800 shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-500 flex items-center">
                <Info size={20} className="mr-2" />
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {property.description}
              </p>
              <button className="mt-4 text-yellow-500 flex items-center hover:text-yellow-400 transition">
                <span>Read more</span>
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>

            {/* Amenities */}
            <div className="bg-black border border-gray-800 shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-500">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-900 p-3 rounded-lg border border-gray-800 hover:border-yellow-800 transition"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Overview Section */}
            <div className="p-6 bg-white">
              <div className={activeTab === "overview" ? "block" : "hidden"}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Overview
                </h3>
                <p className="text-gray-700 mb-4">
                  {property.description ||
                    `This ${bhkInfo} apartment in ${propertyLocation} offers modern amenities and luxurious living. 
                  The property features ${propertySize} of carpet area with excellent connectivity and amenities.`}
                </p>

                {/* Key Details Table */}
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <tbody className="divide-y">
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">
                          Property Type
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {property.category || "Residential Apartment"}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-600">Super Area</td>
                        <td className="py-3 px-4 font-medium">
                          {propertySize}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">Status</td>
                        <td className="py-3 px-4 font-medium">
                          {possessionStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-600">
                          Transaction Type
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {property.transactionType || "New Property"}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">Furnishing</td>
                        <td className="py-3 px-4 font-medium">
                          {furnishingStatus}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-600">Car Parking</td>
                        <td className="py-3 px-4 font-medium">
                          {property.parking || "1 Covered"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amenities Section */}
              <div className={activeTab === "amenities" ? "block" : "hidden"}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check size={18} className="text-gold-500 mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications Section */}
              <div
                className={activeTab === "specifications" ? "block" : "hidden"}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-3">Rooms</h4>
                    <ul className="space-y-2">
                      <li className="flex">
                        <span className="text-gray-600 w-40">Bedrooms:</span>
                        <span className="font-medium">
                          {bhkInfo.split(" ")[0]}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-600 w-40">Bathrooms:</span>
                        <span className="font-medium">
                          {property.bathrooms || "2"}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-600 w-40">Balconies:</span>
                        <span className="font-medium">
                          {property.balconies || "2"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-lg mb-3">Fittings</h4>
                    <ul className="space-y-2">
                      <li className="flex">
                        <span className="text-gray-600 w-40">Flooring:</span>
                        <span className="font-medium">
                          {property.flooring || "Vitrified Tiles"}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-600 w-40">Electrical:</span>
                        <span className="font-medium">
                          {property.electrical || "Copper Wiring"}
                        </span>
                      </li>
                      <li className="flex">
                        <span className="text-gray-600 w-40">Doors:</span>
                        <span className="font-medium">
                          {property.doors || "Hardwood"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Interested in this property?
                  </h3>
                  <p className="text-gray-600">
                    Contact the property agent for more details
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={togglePhone}
                    className="bg-white border border-gold-600 text-gold-600 hover:bg-gold-50 px-6 py-3 rounded-md font-medium flex items-center justify-center"
                  >
                    <Phone className="mr-2" size={18} />
                    {phoneVisible ? "+91 98765 43210" : "View Phone Number"}
                  </button>
                  <button
                    onClick={toggleContact}
                    className="bg-gold-600 text-white hover:bg-gold-700 px-6 py-3 rounded-md font-medium flex items-center justify-center"
                  >
                    <UserCheck className="mr-2" size={18} />
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Calculator Section */}
          <div className="bg-white shadow-lg rounded p-6 mb-6">
            <div className="flex items-center mb-4">
              <BarChart className="text-gold-600 mr-2" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Home Loan Calculator
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Calculate your estimated EMI for this property
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Loan Amount
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  placeholder="₹60,00,000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  placeholder="8.5%"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 text-sm">
                  Loan Tenure (years)
                </label>
                <input
                  type="number"
                  className="w-full border rounded-md p-2"
                  placeholder="20 years"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                />
              </div>
            </div>
            <button
              className="bg-gold-600 text-white hover:bg-gold-700 px-6 py-2 rounded-md font-medium"
              onClick={calculateEMI}
            >
              Calculate EMI
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-yellow-500">
                  Gold<span className="text-white">Estate</span>
                </h2>
                <p className="text-gray-400 mt-2">
                  Premium Real Estate Solutions
                </p>
              </div>

              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Properties
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-yellow-500 transition"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
              <p>© 2025 GoldEstate. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Contact Form Popup */}
        {showContact && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Contact Property Agent
                </h3>
                <button
                  onClick={toggleContact}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Your Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 text-gray-800 focus:outline-none focus:border-gold-500 h-24"
                    placeholder="I'm interested in this property and would like more information..."
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="agree" className="mr-2" />
                  <label htmlFor="agree" className="text-sm text-gray-600">
                    I agree to receive communications via WhatsApp, SMS, phone
                    calls, and emails
                  </label>
                </div>

                <button className="w-full bg-gold-600 text-white py-3 rounded font-semibold hover:bg-gold-700 transition">
                  Submit Inquiry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMI Result Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  EMI Calculation Result
                </h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Monthly EMI</span>
                    <span className="text-xl font-bold text-gold-600">
                      {formatCurrency(emi)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="text-gray-800">
                      {formatCurrency(emi * loanTenure * 12 - loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Payment</span>
                    <span className="text-gray-800">
                      {formatCurrency(emi * loanTenure * 12)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p className="mb-2">* EMI calculation is based on:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Principal Amount: {formatCurrency(loanAmount)}</li>
                    <li>Interest Rate: {interestRate}% per annum</li>
                    <li>Loan Tenure: {loanTenure} years</li>
                  </ul>
                </div>

                <button
                  className="w-full bg-gold-600 text-white py-3 rounded font-semibold hover:bg-gold-700 transition"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
