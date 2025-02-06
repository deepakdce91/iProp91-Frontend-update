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
} from "lucide-react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchProject/${id}`,
        {
          params: {
            userId: decoded.userId,
          },
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      setProperty(response.data);
      console.log(response.data);

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

  // Map API data to component props
  const mappedProperty = {
    appartmentSubType: property?.appartmentSubType || [],
    bookingAmount: property.minimumPrice || "N/A",
    status: property.status || "N/A",
    registeredDate: property?.registeredDate || "N/A",
    floorNumber: property?.floorNumber || "N/A",
    launchDate: property?.launchDate || "N/A",
    size: property?.size || "N/A",
    tower: property?.tower || "N/A",
    unit: property.unit || "N/A",
    bhk: property.bhk,
    maximumPrice: property.maximumPrice,
    minimumPrice: property.minimumPrice,
    location: property.address,
    project: property.project,
    builder: property.builder,
    title: property.overview || "No title available",
    imgs: property.images?.map((img) => img.url) || [],
    beds: property.bhk || "0",
    baths: property.bhk || "0", // Using bhk as bathroom count if not available
    balcony: "0", // Default value as not in API
    furnishing: "Unfurnished", // Default value as not in API
    amenities: property.amenities || [],
    commercialHubs:property.commercialHubs || [],
    educationalInstitutions:property.educationalInstitutions || [],
    transportationHubs:property.transportationHubs || [],
    shoppingCentres:property.shoppingCentres || [],
    hotels:property.hotels || [],
    hospitals:property.hospitals || [],
  };

  // Navbar items
  const navbarItems = [
    { label: "Overview", id: "overview" },
    { label: "Amenities", id: "amenities" },
    { label: "About Project", id: "about-project" },
    { label: "About Locality", id: "location" },
    { label: "Recent Transactions", id: "recentTransactions" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl w-full ">
      {/* Full-width Image */}
      <div className="relative">
        <img
          // src={property.images[0]?.url}
          src={"/images/image.jpg"}
          alt="Property"
          className="w-full h-96 object-cover rounded-t-xl z-0"
        />
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          <h1 className="text-white text-2xl font-bold">{property.title}</h1>
          <button className="bg-white text-gray-800 px-4 py-2 rounded">
            50 Photos
          </button>
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

      <div className="w-full  px-4 py-8">
        <div className=" gap-6 w-full">
          <div className="col-span-2 space-y-6 w-full">
            <section id="overview">
              <PropertyHeader property={mappedProperty} />
            </section>
            <section id="amenities">
              <Amenities amenities={mappedProperty} />
            </section>
            <section id="about-project">
              <AboutProject about={mappedProperty} />
            </section>
            <section id="similarProperties">
              <SimilarProperties properties={mappedProperty} />
            </section>
            <section id="project-details">
              <MoreDetails details={mappedProperty} />
            </section>
            <section id="location">
              <LocationOverview location={mappedProperty} />
            </section>
            <section id="recentTransactions">
              <RecentTransactions recent={mappedProperty} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

const currentUrl = window.location.href;
const parts = currentUrl.split("/"); // Split the URL into an array
const secondLastPart = parts[parts.length - 2]; // Access the second-to-last element
const baseUrl = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
const breadcrumbItems = [
  { label: "Concierge", link: "/concierge" },
  { label: secondLastPart, link: "/property-for-sale" },
  { label: baseUrl },
];
const formatPrice = (price) => {
  if (price >= 10000000) {
    // Convert to crores
    return (price / 10000000).toFixed(2) + " Cr";
  } else if (price >= 100000) {
    // Convert to lakhs
    return (price / 100000).toFixed(2) + " Lac";
  } else if (price >= 1000) {
    // Convert to thousands
    return (price / 1000).toFixed(2) + "K";
  } else {
    // Return as is
    return price.toString();
  }
};

// Header Component with Gallery
function PropertyHeader({ property }) {
  return (
    <div className="space-y-4 w-full">
      <Breadcrumb
        items={breadcrumbItems}
        className={"flex text-sm items-center space-x-1 text-black"}
      />
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-end gap-10">
          <div>
            {/* Title Section */}
            <div className="flex flex-col gap-6">
              <div className="flex   gap-1">
                <div>
                  <div className="flex  flex-col">
                    <h1 className="text-4xl font-semibold capitalize">
                      {property.project}
                    </h1>
                    <h1 className="text-gray-700">By {property.builder}</h1>
                    <p className="flex justify-center text-sm gap-1 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-4 ">
                {/* Price and Market Value Section */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl  text-gray-800">
                    ₹ {formatPrice(property.minimumPrice)} - ₹{" "}
                    {formatPrice(property.maximumPrice)}
                  </h2>
                  <a href="#" className="text-gray-600 underline text-sm">
                    Check Market Value
                  </a>
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{property.bhk} BHK Flat</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                  {property.unit} Units Available
                </span>
                <span className="text-green-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex gap-4">
            <div>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
                Contact Now
              </button>
            </div>
            <div>
              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Download Brochure
              </button>
            </div>
          </div>
        </div>
        {/* Property Quick Info */}
        {/* <div className="flex items-center justify-center gap-14 py-4 border-t border-b">
          <div className="flex items-center gap-2">
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.balcony} Balcony</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.furnishing}</span>
          </div>
        </div> */}

        {/* <ListedCards 
          size={property.moreDetails.size}
          pricePerSqft={property.moreDetails.pricePerSqft}
          developer={property.moreDetails.developer}
          project={property.about.project}
          floors={property.moreDetails.floors}
          transactionType={property.moreDetails.transactionType}
          status={property.moreDetails.status}
          facing={property.moreDetails.facing}
          ageOfConstruction={property.moreDetails.ageOfConstruction}
        /> */}
      </div>
    </div>
  );
}

// Amenities Section
const Amenities = ({ amenities = [] }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const amenityIcons = {
    "Power Back Up": Lightbulb,
    "Swimming Pool": GlassWaterIcon,
    Lift: ListFilter,
    Security: Shield,
    "Visitor Parking": Car,
    Gymnasium: Dumbbell,
    "Indoor Games Room": Gamepad2,
    "Rain Water Harvesting": CloudRain,
    "Water Storage": Droplet,
    "Vaastu Compliant": Compass,
    "Waste Disposal": Trash2,
    "Multipurpose Hall": Building2,
    "Kids play area": PlaySquare,
    "Fire Fighting Equipment": FireExtinguisher,
    "No Club House": Building,
    "No Reserved Parking": CarTaxiFront,
    "No Intercom Facility": Phone,
    "No Maintenance Staff": Toolbar,
    "No Bank & ATM": CreditCard,
    "No Kids Club": Baby,
  };

  const allAmenitiesList = [
    "Power Back Up",
    "Swimming Pool",
    "Lift",
    "Security",
    "Visitor Parking",
    "Gymnasium",
    "Indoor Games Room",
    "Rain Water Harvesting",
    "Water Storage",
    "Vaastu Compliant",
    "Waste Disposal",
    "Multipurpose Hall",
    "Kids play area",
    "Fire Fighting Equipment",
    "No Club House",
    "No Reserved Parking",
    "No Intercom Facility",
    "No Maintenance Staff",
    "No Bank & ATM",
    "No Kids Club",
  ];

  const visibleAmenities = amenities.amenities.slice(0, 12);

  const renderAmenityItem = (amenity, disabled = false) => {
    const IconComponent = amenityIcons[amenity] || Building2;
    return (
      <div
        key={amenity}
        className={`flex flex-col items-center p-4 border border-black/20 rounded-lg ${
          disabled ? "opacity-40" : "hover:shadow-md"
        } transition-all duration-200`}
      >
        <IconComponent className="w-8 h-8 mb-2 text-gray-600" />
        <span className="text-sm text-center text-gray-700">{amenity}</span>
      </div>
    );
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm">
      {/* Main Amenities Display */}
      <div className="p-6   shadow-sm lg:max-w-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 capitalize">
          Amenities {amenities.project}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleAmenities.map((amenity) => renderAmenityItem(amenity))}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setShowAllAmenities(true)}
            className="text-red-600 hover:text-red-700 transition-colors font-semibold text-sm"
          >
            Show all {allAmenitiesList.length} amenities
          </button>
        </div>
        <button className="mt-6 w-full lg:w-[50%] bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
          Contact Builder
        </button>
      </div>

      {/* All Amenities Sidebar Modal */}
      {showAllAmenities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Amenities</h3>
                <button
                  onClick={() => setShowAllAmenities(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                {allAmenitiesList.map((amenity) =>
                  renderAmenityItem(
                    amenity,
                    !amenities.amenities.includes(amenity)
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Similar Properties Section
function SimilarProperties({ properties }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Other Properties in this Project and Nearby
        </h2>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 capitalize">
        {/* {properties?.map((property, index) => ( */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[4/3] ">
            <img
              src="/images/prophero.jpg"
              alt={properties?.project}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {properties?.imgs} Photos
            </div>
          </div>
          {properties?.appartmentSubType?.[0] && (
            <h3 className="font-medium">{properties.appartmentSubType[0]}</h3>
          )}
          <div className="flex gap-2 text-lg font-semibold">
            <h2 className="text-xl  text-gray-800">
              ₹ {formatPrice(properties?.minimumPrice)} - ₹{" "}
              {formatPrice(properties?.maximumPrice)}
            </h2>
            <span className="text-gray-600">|</span>
            <span>{properties?.size}</span>
          </div>
          <p className="text-gray-600">{properties?.project}</p>
          <p className="text-gray-600">{properties?.possession}</p>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
}

// About Project Section
function AboutProject({ about }) {
  const cardData = [
    {
      label: "Project Size",
      value: about?.size,
      icon: <MapPin className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Launch Date",
      value: about?.launchDate,
      icon: <Calendar className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Total Units",
      value: about?.unit,
      icon: <Search className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "Total Towers",
      value: about?.tower,
      icon: <Building2 className="w-6 h-6 text-amber-500" />,
    },
    {
      label: "BHK",
      value: about?.bhk,
      icon: <Bed className="w-6 h-6 text-amber-500" />,
    },
  ];
  return (
    <div className=" bg-white shadow-sm rounded-xl">
      <div className="max-w-2xl  p-6">
        <h1 className="text-3xl capitalize font-semibold text-gray-800 mb-4">
          About {about?.project}
        </h1>

        <div className="mb-6">
          <p className="text-gray-600">{about?.title}</p>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
      </div>
    </div>
  );
}

// Recent Transactions Section
function RecentTransactions({ recent }) {
  return (
    <div className="bg-white rounded-lg shadow-sm w-full">
      <div className="p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Most Recent Property Transactions in City
        </h2>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg capitalize">
            <h3 className="font-medium mb-4">{recent?.project}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  Registered on:{" "}
                  <span className="font-medium">{recent?.registeredDate}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <span className="text-sm">
                  Area: <span className="font-medium">{recent?.size}</span>
                </span>
              </div>
              <button className="text-red-600 text-sm">
                View Agreement Price
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// More Details Section
function MoreDetails({ details }) {
  const detailedSection = [
    {
      title: "Price Breakup",
      items: details?.maximumPrice,
    },
    {
      title: "Booking Amount",
      items: details?.bookingAmount,
    },
    {
      title: "Address",
      items: details?.location,
    },
    {
      title: "Furnishing",
      items: details?.furnishing,
    },
    {
      title: "Flooring",
      items: details?.floorNumber,
    },
    {
      title: "Type of Ownership",
      items: details?.status,
    },
  ];
  return (
    <div className=" bg-white rounded-lg shadow-sm">
      <div className="p-6 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">More Details</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            {detailedSection?.map((items, index) => (
              <div className="grid grid-cols-2 lg:w-[70%]" key={index}>
                <p className="text-gray-600">{items.title}</p>
                <p className="font-medium">{items.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ListedCards Component
function ListedCards({
  size,
  pricePerSqft,
  developer,
  project,
  floors,
  transactionType,
  status,
  facing,
  ageOfConstruction,
}) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-4 py-4">
      <div>
        <p className="text-sm text-gray-500">Super Built-Up Area</p>
        <p className="font-medium">
          {size}{" "}
          <span className="text-gray-500 text-sm">₹{pricePerSqft}/sqft</span>
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Developer</p>
        <p className="font-medium">{developer}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Project</p>
        <p className="font-medium">{project}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Floor</p>
        <p className="font-medium">{floors}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Transaction Type</p>
        <p className="font-medium">{transactionType}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-medium">{status}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Facing</p>
        <p className="font-medium">{facing}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Age Of Construction</p>
        <p className="font-medium">{ageOfConstruction}</p>
      </div>
    </div>
  );
}

const LocationOverview = ({
  location,
  rating = 3.8,
  totalReviews = 88,
  rank = 214,
  totalLocalities = 4752,
  description = "Situated along the New Airport Road, Hennur Main Road a prime liking road of the Hennur area to the surrounding localities. About 6 kilometers northwe...",
  highlights = [
    "Emerging locality with numerous developed and under-construction projects",
    "Proximity to IT hubs and numerous MNCs",
  ],
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="w-5 h-5 fill-yellow-400 text-yellow-400"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };
  // Group location advantages by category
  const locationAdvantages = [
    {
      title: "Transportation",
      items: location.transportationHubs || [],
      suffix: "min",
    },
    {
      title: "Commercial Hubs",
      items: location.commercialHubs || [],
      suffix: "Km",
    },
    {
      title: "Education",
      items: location.educationalInstitutions || [],
      suffix: "Km",
    },
    {
      title: "Healthcare",
      items: location.hospitals || [],
      suffix: "Km",
    },
    {
      title: "Shopping",
      items: location.shoppingCentres || [],
      suffix: "Km",
    },
    {
      title: "Hotels & Dining",
      items: location.hotels || [],
      suffix: "Km",
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl ">
      <div className="max-w-2xl p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          About {location.address}
        </h1>

        {/* Rating Section */}
        <div className="flex flex-wrap items-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">{rating}</span>
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-gray-500">({totalReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Rank {rank}</span>
            <span className="text-gray-500">
              out of {totalLocalities} Localities
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Highlights */}
        <div className="space-y-3 mb-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex  gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-600">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Location Advantages */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Location Advantages
          </h2>
          <div className="space-y-4">
            {locationAdvantages.map(
              (category, index) =>
                category.items &&
                category.items.length > 0 && (
                  <div key={index} className="space-y-1">
                    <h3 className="font-medium text-gray-700 capitalize">
                      {category.title}
                    </h3>
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 capitalize ">
                          {item}{" "}
                          {Math.floor(Math.random() * 10) + 1} {category.suffix}
                        </span>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
