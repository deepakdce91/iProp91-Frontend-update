import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Home,
  MapPin,
  Grid,
  Bed,
  Bath,
  Tag,
  Building,
  Calendar,
  Calculator,
  Mail,
  Phone,
  User,
  Camera,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PropertyListing({ property, onBack }) {
  // States for various UI components
  const [activeAmenityCategory, setActiveAmenityCategory] =
    useState("Convenience");

  // States for loan calculator
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("8.5");
  const [loanTenure, setLoanTenure] = useState("20");
  const [emi, setEmi] = useState(null);

  // States for contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // States for image gallery
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);

  // Function to calculate EMI - memoized with useCallback to prevent unnecessary recalculations
  const calculateEMI = useCallback(() => {
    // Convert values to numbers and validate
    const principal = parseFloat(loanAmount.replace(/,/g, ""));
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTenure) * 12; // Total months

    // Validate inputs
    if (
      isNaN(principal) ||
      isNaN(rate) ||
      isNaN(time) ||
      principal <= 0 ||
      rate <= 0 ||
      time <= 0
    ) {
      setEmi(null);
      return;
    }

    // EMI calculation formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue =
      (principal * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
    setEmi(emiValue.toFixed(2));
  }, [loanAmount, interestRate, loanTenure]);

  // Check if user is logged in and fetch user data if they are
  useEffect(() => {
    // Simulate checking if user is logged in
    // In a real app, you would check your auth state here
    const checkLoginStatus = () => {
      // Mock implementation - replace with actual auth check
      const userLoggedIn = localStorage.getItem("user") !== null;
      setIsLoggedIn(userLoggedIn);

      if (userLoggedIn) {
        try {
          const userData = JSON.parse(localStorage.getItem("user"));
          setFormData((prevData) => ({
            ...prevData,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          }));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Calculate EMI when loan parameters change
  useEffect(() => {
    if (loanAmount && interestRate && loanTenure) {
      calculateEMI();
    }
  }, [loanAmount, interestRate, loanTenure, calculateEMI]);

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

  // Amenities with categories and SVG icons
  const amenitiesData = property.amenitiesData || {
    categories: ["Convenience", "Leisure", "Environment", "Security", "Sports"],
    items: {
      Convenience: [
        {
          name: "Maintenance Staff",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Power Back Up",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 18h.02M12 18h.02M16 18h.02M12 2v6l3-3"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.56 6.06A10.97 10.97 0 0 0 3 16.44M21 16.44c0-3.6-1.86-6.95-4.87-8.85"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM17 10a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 16v-4a6 6 0 0 1 12 0v4a2 2 0 0 0 2 2H4a2 2 0 0 0 2 2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Vaastu Compliant",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
              <path d="M12 2v20M2 12h20" stroke="#C9A254" strokeWidth="1.5" />
              <path
                d="M12 12L7 7M12 12l5-5M12 12l-5 5M12 12l5 5"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ],
      Leisure: [
        {
          name: "Visitor Parking",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="6"
                width="18"
                height="13"
                rx="2"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
              <path d="M3 10h18" stroke="#C9A254" strokeWidth="1.5" />
              <path d="M16 14H8v3h8v-3z" stroke="#C9A254" strokeWidth="1.5" />
              <path d="M6 18V4" stroke="#C9A254" strokeWidth="1.5" />
              <path d="M18 18V4" stroke="#C9A254" strokeWidth="1.5" />
            </svg>
          ),
        },
        {
          name: "Lift",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="5"
                y="2"
                width="14"
                height="20"
                rx="2"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
              <path d="M12 2v20" stroke="#C9A254" strokeWidth="1.5" />
              <path
                d="M9 8l-2 2M9 10L7 8"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 14l-2 2M16 16l-2-2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Air Conditioned",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="7"
                width="20"
                height="10"
                rx="2"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
              <path
                d="M6 11h.01M10 11h4M18 11h.01"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M2 10h20M2 14h20" stroke="#C9A254" strokeWidth="1.5" />
            </svg>
          ),
        },
      ],
      Environment: [],
      Security: [],
      Sports: [
        {
          name: "Multipurpose Hall",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7V5a2 2 0 0 1 2-2h2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 3h2a2 2 0 0 1 2 2v2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 17v2a2 2 0 0 1-2 2h-2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 21H5a2 2 0 0 1-2-2v-2"
                stroke="#C9A254"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="7"
                y="7"
                width="10"
                height="10"
                rx="2"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
            </svg>
          ),
        },
        {
          name: "Reserved Parking",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 10H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
              <path d="M14 15h-4v3h4v-3z" stroke="#C9A254" strokeWidth="1.5" />
              <path
                d="M17 4H7l.868 6h8.264L17 4z"
                stroke="#C9A254"
                strokeWidth="1.5"
              />
            </svg>
          ),
        },
      ],
    },
  };

  // Format currency input with commas
  const formatCurrency = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle loan input changes
  const handleLoanInputChange = (e, setter) => {
    const { value } = e.target;

    if (e.target.name === "loanAmount") {
      setter(formatCurrency(value));
    } else {
      setter(value);
    }
  };

  // Handle contact form input changes
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;

    // Don't allow changes to email and phone if user is logged in
    if (isLoggedIn && (name === "email" || name === "phone")) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // Validate contact form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Phone number must be 10 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Form submitted:", formData);
        setSubmitSuccess(true);

        // Reset form if not logged in
        if (!isLoggedIn) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
        } else {
          // Just reset message if logged in
          setFormData((prevData) => ({
            ...prevData,
            message: "",
          }));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Dummy images array
  const dummyImages = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1473&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fHx8fHx8fDE3MDg5NjQ0NTR8&auto=format&fit=crop&w=1470&q=80",
  ];

  // Use property.images or fallback to dummy images
  const images =
    property.images && property.images.length > 0
      ? property.images
      : dummyImages;

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Property Header */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {property.project ||
              property.builder ||
              "Property ID: " + property._id}
          </h1>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-1" />
            <span>
              {[
                property.address,
                property.sector,
                property.city,
                property.state,
                property.pincode,
              ]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center">
              <Tag className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div className="font-medium">
                  {property.minimumPrice
                    ? property.maximumPrice
                      ? `${property.minimumPrice} - ${property.maximumPrice}`
                      : property.minimumPrice
                    : "Price on Request"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Grid className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">Size</div>
                <div className="font-medium">
                  {property.size ? `${property.size} sq.ft` : "Not specified"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Bed className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">BHK</div>
                <div className="font-medium">
                  {property.bhk || property.numberOfBedrooms || "Not specified"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Bath className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">Bathrooms</div>
                <div className="font-medium">
                  {property.numberOfBathrooms || "Not specified"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Building className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium capitalize">
                  {property.type || "Not specified"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 text-gold-500" size={18} />
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium capitalize">
                  {property.status || "Not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="my-6">
          <h3 className="text-xl font-bold mb-4">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Property ID</span>
                  <span className="font-medium">
                    {property.propertyId || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Listing ID</span>
                  <span className="font-medium">
                    {property.listingId || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Builder</span>
                  <span className="font-medium">
                    {property.builder || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Project</span>
                  <span className="font-medium">
                    {property.project || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Unit</span>
                  <span className="font-medium">{property.unit || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Tower</span>
                  <span className="font-medium">{property.tower || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">House Number</span>
                  <span className="font-medium">
                    {property.houseNumber || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Floor Number</span>
                  <span className="font-medium">
                    {property.floorNumber || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    Number of Floors
                  </span>
                  <span className="font-medium">
                    {property.numberOfFloors || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    Number of Parkings
                  </span>
                  <span className="font-medium">
                    {property.numberOfParkings || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">
                    Number of Washrooms
                  </span>
                  <span className="font-medium">
                    {property.numberOfWashrooms || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Available For</span>
                  <span className="font-medium capitalize">
                    {property.availableFor || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-3">Overview</h4>
              <p className="text-gray-700">
                {property.overview ||
                  "No overview available for this property."}
              </p>

              {property.features && property.features.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-md font-medium mb-2">Features</h5>
                  <ul className="list-disc pl-5">
                    {property.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <h5 className="text-md font-medium mb-2">Property Details</h5>
                <div className="flex flex-col space-y-1">
                  <div className="flex">
                    <span className="text-gray-500 w-40">Created</span>
                    <span>
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-40">Last Updated</span>
                    <span>
                      {new Date(property.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-40">
                      Title Deed Verified
                    </span>
                    <span className="capitalize">
                      {property.isTitleDeedVerified || "No"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-40">Category</span>
                    <span className="capitalize">
                      {property.category || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {property.appartmentType &&
                property.appartmentType.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-md font-medium mb-2">Apartment Type</h5>
                    <div className="flex flex-wrap gap-2">
                      {property.appartmentType.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="my-6">
          <h3 className="text-xl font-bold mb-4">Amenities</h3>

          {/* Category Tabs */}
          <div className="flex flex-wrap mb-6 gap-2">
            {amenitiesData.categories.map((category) => (
              <button
                key={category}
                className={`py-2 px-4 rounded-full text-sm font-medium transition ${
                  activeAmenityCategory === category
                    ? "bg-gold-100 text-gold-800 border border-gold-500"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setActiveAmenityCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {property.amenities && property.amenities.length > 0
              ? property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="text-gold-500 flex items-center justify-center">
                      <Home size={18} />
                    </div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))
              : amenitiesData.items[activeAmenityCategory]?.map(
                  (amenity, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      <div className="text-gold-500 flex items-center justify-center">
                        {amenity.icon}
                      </div>
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  )
                )}
          </div>

          {/* Download Brochure Link */}
          <div className="mt-6">
            <a
              href="#"
              className="flex items-center gap-2 text-gray-700 hover:text-gold-600 transition"
            >
              <Download size={18} />
              <span className="font-medium">Download Brochure</span>
            </a>
          </div>
        </div>

        {/* Nearby Section */}
        {(property.commercialHubs?.length > 0 ||
          property.hospitals?.length > 0 ||
          property.hotels?.length > 0 ||
          property.shoppingCentres?.length > 0 ||
          property.transportationHubs?.length > 0 ||
          property.educationalInstitutions?.length > 0) && (
          <div className="my-6">
            <h3 className="text-xl font-bold mb-4">Nearby</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.commercialHubs?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Commercial Hubs</h4>
                  <ul className="list-disc pl-5">
                    {property.commercialHubs.map((hub, index) => (
                      <li key={index} className="text-gray-700">
                        {hub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.hospitals?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Hospitals</h4>
                  <ul className="list-disc pl-5">
                    {property.hospitals.map((hospital, index) => (
                      <li key={index} className="text-gray-700">
                        {hospital}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.educationalInstitutions?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">
                    Educational Institutions
                  </h4>
                  <ul className="list-disc pl-5">
                    {property.educationalInstitutions.map((school, index) => (
                      <li key={index} className="text-gray-700">
                        {school}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {property.transportationHubs?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium mb-2">Transportation</h4>
                  <ul className="list-disc pl-5">
                    {property.transportationHubs.map((hub, index) => (
                      <li key={index} className="text-gray-700">
                        {hub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loan Calculator Section */}
        <div className="my-6 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b p-4">
            <div className="flex items-center">
              <Calculator className="text-gold-500 mr-2" size={24} />
              <h3 className="text-xl font-bold">Home Loan Calculator</h3>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Calculate your estimated monthly EMI for this property
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Loan Amount (₹)
                </label>
                <input
                  type="text"
                  name="loanAmount"
                  value={loanAmount}
                  onChange={(e) => handleLoanInputChange(e, setLoanAmount)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="e.g., 60,00,000"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={interestRate}
                  onChange={(e) => handleLoanInputChange(e, setInterestRate)}
                  min="1"
                  max="20"
                  step="0.1"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="e.g., 8.5"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-2 text-sm font-medium">
                  Loan Tenure (Years)
                </label>
                <input
                  type="number"
                  name="loanTenure"
                  value={loanTenure}
                  onChange={(e) => handleLoanInputChange(e, setLoanTenure)}
                  min="1"
                  max="30"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            <button
              onClick={calculateEMI}
              className="bg-gold-500 text-white hover:bg-gold-600 px-6 py-2 rounded-md font-medium transition-colors duration-300"
            >
              Calculate EMI
            </button>

            {emi && (
              <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-md">
                <h4 className="font-semibold text-lg mb-2">
                  Estimated Monthly Payment
                </h4>
                <p className="text-2xl font-bold text-gold-700">
                  ₹ {parseFloat(emi).toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  This is an estimate based on the information provided.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="my-6 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b p-4">
            <div className="flex items-center">
              <Mail className="text-gold-500 mr-2" size={24} />
              <h3 className="text-xl font-bold">Contact Agent</h3>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {isLoggedIn
                ? "Send a message to the property agent."
                : "Please fill in your details to contact the property agent."}
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                <p className="font-medium">Thank you for your inquiry!</p>
                <p className="text-sm mt-1">
                  The property agent will get back to you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-600 mb-2 text-sm font-medium">
                    Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormInputChange}
                      className={`w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Your name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-red-500 text-sm">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-2 text-sm font-medium">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormInputChange}
                      disabled={isLoggedIn}
                      className={`w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      } ${isLoggedIn ? "bg-gray-100" : ""}`}
                      placeholder="Your contact number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-red-500 text-sm">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-2 text-sm font-medium">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormInputChange}
                      disabled={isLoggedIn}
                      className={`w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } ${isLoggedIn ? "bg-gray-100" : ""}`}
                      placeholder="Your email address"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-red-500 text-sm">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-600 mb-2 text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormInputChange}
                    rows="4"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold-500 text-white hover:bg-gold-600 px-6 py-3 rounded-md font-medium transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="relative">
          <div className="relative aspect-video bg-gray-200">
            <img
              src={"/images/logo.svg"}
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
              {property.type || "Not specified"}
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
            onClick={() =>
              setActiveImage((activeImage - 1 + images.length) % images.length)
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full hover:bg-black/80 transition"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <button
            onClick={() => setActiveImage((activeImage + 1) % images.length)}
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
                  src={"/images/logo.svg"}
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

        {onBack && (
          <div className="mt-8 mb-4">
            <button
              className="px-4 py-2 bg-black text-gold-500 rounded hover:bg-gray-900 transition"
              onClick={onBack}
            >
              Back to Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
