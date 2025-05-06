import { useState, useEffect } from "react";
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
import "../styles/goldTheme.css";
import axios from "axios";

// Sub-components
const ImageGallery = ({ images, activeImage, setActiveImage }) => {
  const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <div className="relative aspect-video bg-gray-200">
        <img
          src={images[activeImage]}
          alt={`Property image ${activeImage + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Camera size={16} className="mr-1" />
          <span>
            {activeImage + 1}/{images.length}
          </span>
        </div>
      </div>

      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
        aria-label="Next image"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      <div className="flex overflow-x-auto p-3 space-x-3 bg-white border-t border-gray-200">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`relative cursor-pointer transition-all duration-300 flex-shrink-0`}
            aria-label={`View image ${index + 1}`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-16 object-cover rounded ${
                activeImage === index
                  ? "ring-2 ring-gold-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const PropertyHighlights = ({ property }) => {
  const highlights = [
    { icon: BedDouble, label: "Bedrooms", value: property.bhk?.split(" ")[0] },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms || "2" },
    {
      icon: Grid,
      label: "Carpet Area",
      value: property.size || property.area || "1350 Sq.ft.",
    },
    {
      icon: Building,
      label: "Status",
      value:
        property.possessionStatus || property.possession || "Ready to Move",
    },
    {
      icon: Home,
      label: "Furnishing",
      value:
        property.furnishingStatus || property.furnishing || "Semi-Furnished",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 mt-4 pb-2">
      {highlights.map(({ icon: Icon, label, value }, index) => (
        <div key={index} className="flex items-center">
          <Icon size={20} className="text-gray-400 mr-2" />
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const LoanCalculator = ({ property, showPopup, setShowPopup }) => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = loanTenure * 12;
    const emi =
      (principal * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
    setEmi(Math.round(emi));
    setShowPopup(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
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
  );
};

export default function PropertyDetail({ property, onBack }) {
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPopup, setShowPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  if (!property) {
    return (
      <div className="p-8 text-center bg-white">
        <p className="text-gray-800">No property selected.</p>
        {onBack && (
          <button
            className="mt-4 px-4 py-2 bg-black text-gold-500 rounded hover:bg-gray-900 transition"
            onClick={onBack}
          >
            Back to Properties
          </button>
        )}
      </div>
    );
  }

  const dummyImages = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
  ];

  // Use property.images or fallback to dummy images
  const images = property?.images?.length > 0 ? property.images : dummyImages;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="p-6">
          <div className="pt-20 max-w-6xl mx-auto px-4 py-6">
            {/* Breadcrumb Navigation */}
            <nav className="text-sm mb-4">
              <ol className="flex flex-wrap items-center">
                <li className="flex items-center">
                  <button className="text-gray-500 hover:text-black">
                    Home
                  </button>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li className="flex items-center">
                  <button className="text-gray-500 hover:text-black">
                    New Delhi
                  </button>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li className="flex items-center">
                  <button className="text-gray-500 hover:text-black">
                    Sector 25 Rohini
                  </button>
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
              <div className="border-b border-gray-200">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {property.title}
                      </h1>
                      <div className="flex items-center mt-2 text-gray-600">
                        <MapPin size={16} className="text-gold-500 mr-1" />
                        <p>
                          {property.location ||
                            property.address ||
                            "Sector 25 Rohini, New Delhi"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 lg:mt-0">
                      <div className="flex items-center">
                        <p className="text-2xl md:text-3xl font-bold text-gold-600">
                          {property.price || "₹75.5 L"}
                        </p>
                        <span className="ml-2 text-gray-500 text-sm">
                          ({property.pricePerSqft || "₹5,600 per sq.ft."})
                        </span>
                      </div>
                    </div>
                  </div>

                  <PropertyHighlights property={property} />
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery
              images={images}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
            />

            {/* Loan Calculator */}
            <LoanCalculator
              property={property}
              showPopup={showPopup}
              setShowPopup={setShowPopup}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
