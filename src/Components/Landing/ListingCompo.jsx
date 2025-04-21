import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Mic,
  TrendingUp,
  Calculator,
  LineChart,
  FileText,
  ListCheck,
  Map,
} from "lucide-react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { Carousel } from "../listingpage/components/carousel";
import { PropertyCard } from "../listingpage/components/property-card";
import EnhancedMapComponent from "../MapComponent/EnhancedMapComponent";

// Enhanced dummy data

const categories = [
  {
    title: "Owner Properties",
    description: "Verified listings from property owners",
    image: "/images/propcat.jpg",
    link: "/owner-properties",
    count: "15,800+ Properties",
  },
  {
    title: "New Projects",
    description: "Upcoming and ongoing projects",
    image: "/images/propcat.jpg",
    link: "/new-projects",
    count: "1,200+ Properties",
  },
  {
    title: "Ready to Move",
    description: "Immediate possession properties",
    image: "/images/propcat.jpg",
    link: "/ready-to-move",
    count: "8,500+ Properties",
  },
  {
    title: "Budget Homes",
    description: "Affordable housing options",
    image: "/images/propcat.jpg",
    link: "/budget-homes",
    count: "3,200+ Properties",
  },
];

const categoryTypes = [
  {
    title: "Pre Launch Projects",
    description: "Upcoming pre-launch properties",
    type: "pre_launch",
  },
  {
    title: "Verified Owner Properties",
    description: "Direct from property owners",
    type: "verified_owner",
  },
  {
    title: "New Projects",
    description: "Latest property launches",
    type: "new_projects",
  },
  {
    title: "Upcoming Projects",
    description: "Soon to be launched properties",
    type: "upcoming_projects",
  },
  {
    title: "New Sale Properties",
    description: "Fresh properties for sale",
    type: "new_sale",
  },
];
const ListingCompo = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [allFetchedProjects, setAllFetchedProjects] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categorizedProjects, setCategorizedProjects] = useState({});
  const [location, setLocation] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedBhkTypes, setSelectedBhkTypes] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMinPrice, setShowMinPrice] = useState(false);
  const [showMaxPrice, setShowMaxPrice] = useState(false);

  // Property type options - only residential now
  const propertyTypes = ["Flat", "House/Villa", "Plot"];

  // BHK options (will show after residential property selection)
  const bhkOptions = ["1 Bhk", "2 Bhk", "3 Bhk", "4 Bhk", "5 Bhk", "5+ Bhk"];

  // Budget options
  const minPriceOptions = [
    "₹5 Lac",
    "₹10 Lac",
    "₹20 Lac",
    "₹30 Lac",
    "₹40 Lac",
    "₹50 Lac",
    "₹60 Lac",
  ];
  const maxPriceOptions = [
    "₹10 Lac",
    "₹20 Lac",
    "₹30 Lac",
    "₹40 Lac",
    "₹50 Lac",
    "₹75 Lac",
    "₹1 Cr",
  ];

  // Handle property type selection
  const togglePropertyType = (type) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(
        selectedPropertyTypes.filter((item) => item !== type)
      );

      // If we unselect Flat or House/Villa and no other residential properties are selected,
      // hide BHK options and clear selections
      if (
        (type === "Flat" || type === "House/Villa") &&
        !selectedPropertyTypes.some(
          (item) => (item === "Flat" || item === "House/Villa") && item !== type
        )
      ) {
        setSelectedBhkTypes([]);
      }
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  // Handle BHK selection
  const toggleBhkType = (bhk) => {
    if (selectedBhkTypes.includes(bhk)) {
      setSelectedBhkTypes(selectedBhkTypes.filter((item) => item !== bhk));
    } else {
      setSelectedBhkTypes([...selectedBhkTypes, bhk]);
    }
  };

  // Handle price selection
  const selectMinPrice = (price) => {
    setMinPrice(price);
    setShowMinPrice(false);
  };

  const selectMaxPrice = (price) => {
    setMaxPrice(price);
    setShowMaxPrice(false);
  };

  // Check if BHK options should be displayed
  const shouldShowBhkOptions = selectedPropertyTypes.some(
    (type) => type === "Flat" || type === "House/Villa"
  );

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    setShowPropertyDropdown(false);
    setShowBudgetDropdown(false);
    setShowMinPrice(false);
    setShowMaxPrice(false);
  };

  // Function to filter projects based on search criteria
  const filterProjects = () => {
    if (!allFetchedProjects) return;

    let filtered = [...allFetchedProjects];

    // Filter by active tab (availableFor)
    if (activeTab) {
      filtered = filtered.filter(
        (project) =>
          project.availableFor?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by city/location
    if (location) {
      filtered = filtered.filter((project) =>
        project.address?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by property type and subtype
    if (selectedPropertyTypes.length > 0) {
      filtered = filtered.filter((project) => {
        const matchesType = project.appartmentType?.some((type) =>
          selectedPropertyTypes.includes(type)
        );
        const matchesSubType = project.appartmentSubType?.some((subType) =>
          selectedPropertyTypes.includes(subType)
        );
        return matchesType || matchesSubType;
      });
    }

    // Filter by BHK
    if (selectedBhkTypes.length > 0) {
      filtered = filtered.filter((project) =>
        selectedBhkTypes.includes(project.bhk)
      );
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filtered = filtered.filter((project) => {
        const projectPrice = parseFloat(project.minimumPrice);
        const minPriceValue = minPrice
          ? parseFloat(minPrice.replace(/[₹,]/g, ""))
          : 0;
        const maxPriceValue = maxPrice
          ? parseFloat(maxPrice.replace(/[₹,]/g, ""))
          : Infinity;

        return projectPrice >= minPriceValue && projectPrice <= maxPriceValue;
      });
    }

    setFilteredProjects(filtered);

    // Update categorized projects
    if (filtered.length > 0) {
      const categorized = {
        pre_launch: filtered.filter(
          (project) => project.category === "pre_launch"
        ),
        verified_owner: filtered.filter(
          (project) => project.category === "verified_owner"
        ),
        new_project: filtered.filter(
          (project) => project.category === "new_project"
        ),
        upcoming_project: filtered.filter(
          (project) => project.category === "upcoming_project"
        ),
        new_sale: filtered.filter((project) => project.category === "new_sale"),
      };
      setCategorizedProjects(categorized);
    }
  };

  // Call filterProjects whenever search parameters change
  useEffect(() => {
    filterProjects();
  }, [
    location,
    selectedPropertyTypes,
    selectedBhkTypes,
    minPrice,
    maxPrice,
    activeTab,
    allFetchedProjects,
  ]);

  // Update the search button click handler
  const handleSearch = () => {
    filterProjects();
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchAllProjects`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        const allProjects = await response.data;
        setAllFetchedProjects(allProjects);
        // toast.success("projects fetched successfully")
        console.log(allProjects);

        if (allProjects) {
          const categorized = {
            pre_launch: allProjects.filter(
              (project) => project.category === "pre_launch"
            ),
            verified_owner: allProjects.filter(
              (project) => project.category === "verified_owner"
            ),
            new_project: allProjects.filter(
              (project) => project.category === "new_project"
            ),
            upcoming_project: allProjects.filter(
              (project) => project.category === "upcoming_project"
            ),
            new_sale: allProjects.filter(
              (project) => project.category === "new_sale"
            ),
          };
          setCategorizedProjects(categorized);
        }
        return;
      }
      toast.error("Error fetching projects");
    };
    fetchProjects();
  }, []);

  const [showMap, setShowMap] = useState(false);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <main className="min-h-screen  relative bg-white py-10">
      {/* Hero Section with Enhanced Search */}
      <div className="relative ">
        {/* <img
        src="/images/lishero.jpg"
        alt="Property Hero"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      /> */}
        <div className=" flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl text-black font-bold mb-8 text-center">
            Find a home you'll love
          </h1>
          {!showMap && (
            <div className="w-full max-w-5xl mx-auto space-y-4 ">
              <div className="flex max-w-4xl mx-auto flex-wrap ">
                {["Buy", "Rent", "New Launch", "Plots/Land", "Projects"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium transition-colors
                  ${
                    activeTab === tab
                      ? "text-black border-b-2 border-black"
                      : "text-gray-600 hover:text-black/90"
                  }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
              <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col max-sm:flex-row sm:flex-row items-center rounded-full border border-gray-300 bg-white shadow-sm pr-3">
                  {/* Location Input */}
                  <div className="flex items-center px-4 max-sm:px-0 py-2 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Enter City, Locality, Project"
                      className="w-full p-2 outline-none max-sm:p-0 max-sm:placeholder:text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="max-sm:hidden relative w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300">
                    <div
                      className="flex items-center justify-between max-sm:px-0 px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setShowPropertyDropdown(!showPropertyDropdown);
                        setShowBudgetDropdown(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-black"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="text-gray-700">
                          {selectedPropertyTypes.length > 0
                            ? selectedPropertyTypes.join(", ")
                            : "Property Type"}
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          showPropertyDropdown ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Property Type Dropdown Content */}
                    {showPropertyDropdown && (
                      <div className="absolute max-sm:hidden top-full left-0 z-10 bg-white w-full lg:w-[150%] shadow-lg rounded-lg border border-gray-200 mt-1 py-2">
                        <div className="px-3 py-2">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Residential
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {propertyTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => togglePropertyType(type)}
                                className={`px-4 py-1 rounded-full text-sm ${
                                  selectedPropertyTypes.includes(type)
                                    ? "bg-gray-100 text-black border border-black"
                                    : "bg-gray-100 text-gray-800 border border-gray-300"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* BHK Options (only show if Flat or House/Villa is selected) */}
                        {shouldShowBhkOptions && (
                          <div className="px-3 py-2 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              {bhkOptions.map((bhk) => (
                                <button
                                  key={bhk}
                                  onClick={() => toggleBhkType(bhk)}
                                  className={`px-4 py-1 rounded-full text-sm ${
                                    selectedBhkTypes.includes(bhk)
                                      ? "bg-gray-100 text-black border border-black"
                                      : "bg-gray-100 text-gray-800 border border-gray-300"
                                  }`}
                                >
                                  {bhk}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Budget Dropdown */}
                  <div className=" max-sm:hiddenrelative w-full md:w-1/3">
                    <div
                      className="flex items-center justify-between px-4 py-2 cursor-pointer"
                      onClick={() => {
                        setShowBudgetDropdown(!showBudgetDropdown);
                        setShowPropertyDropdown(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-black"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092c-.647.19-1.23.51-1.633.919a.75.75 0 101.06 1.061c.213-.215.587-.38.933-.449v2.5a1.502 1.502 0 01-.21-.016 1.318 1.318 0 01-.67-.295.75.75 0 00-1.05 1.072c.37.369.988.65 1.72.765V11h.5v.9c.722.12 1.352.422 1.744.8a.75.75 0 101.102-1.016c-.309-.3-.764-.538-1.346-.653v-2.5a2.59 2.59 0 01.62.12c.304.108.548.274.719.445a.75.75 0 001.06-1.06c-.47-.47-1.156-.793-1.9-.945V5a1 1 0 10-2 0v.09z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">
                          {minPrice && maxPrice
                            ? `${minPrice} - ${maxPrice}`
                            : minPrice
                            ? `Min: ${minPrice}`
                            : maxPrice
                            ? `Max: ${maxPrice}`
                            : "Budget"}
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${
                          showBudgetDropdown ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* Budget Dropdown Content */}
                    {showBudgetDropdown && (
                      <div className="absolute top-full left-0 z-10 bg-white w-full lg:w-[110%] shadow-lg rounded-lg border border-gray-200 mt-1 py-2 px-3">
                        <div className="flex space-x-2 mb-4">
                          {/* Min Price Button */}
                          <div className="relative w-1/2">
                            <button
                              onClick={() => {
                                setShowMinPrice(!showMinPrice);
                                setShowMaxPrice(false);
                              }}
                              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:border-gray-400 focus:outline-none"
                            >
                              {minPrice || "Min Price"}
                            </button>

                            {/* Min Price Dropdown */}
                            {showMinPrice && (
                              <div className=" top-full left-0 z-20 w-full mt-1   max-h-48 overflow-y-auto">
                                {minPriceOptions.map((price) => (
                                  <div
                                    key={price}
                                    onClick={() => selectMinPrice(price)}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    {price}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Max Price Button */}
                          <div className="relative w-1/2">
                            <button
                              onClick={() => {
                                setShowMaxPrice(!showMaxPrice);
                                setShowMinPrice(false);
                              }}
                              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:border-gray-400 focus:outline-none"
                            >
                              {maxPrice || "Max Price"}
                            </button>

                            {/* Max Price Dropdown */}
                            {showMaxPrice && (
                              <div className=" top-full left-0 z-20 w-full mt-1  max-h-48 overflow-y-auto">
                                {maxPriceOptions.map((price) => (
                                  <div
                                    key={price}
                                    onClick={() => selectMaxPrice(price)}
                                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                  >
                                    {price}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <button className="bg-black max-sm:w-[30vw] hover:bg-black/80 text-white font-medium px-6 py-3 w-full max-sm:px-0 max-sm:text-sm md:w-auto transition-colors rounded-full">
                    <div className="flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="max-sm:hidden">Search</span>
                    </div>
                  </button>
                </div>

                {/* Overlay to close dropdowns when clicking outside */}
                {(showPropertyDropdown ||
                  showBudgetDropdown ||
                  showMinPrice ||
                  showMaxPrice) && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={handleClickOutside}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Categories */}
      {!showMap && (
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              We've got properties for everyone
            </h2>
            <Link
              href="/all-categories"
              className="text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={category.link} key={index}>
                <div className="relative h-64 rounded-lg overflow-hidden group">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="text-white text-xl font-bold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {category.description}
                    </p>
                    <span className="text-white/90 text-sm font-medium">
                      {category.count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Conditionally render carousels based on showMap state */}
      {!showMap &&
        categoryTypes.map((category) => {
          // Only render carousel if there are projects in this category
          const categoryProjects = categorizedProjects[category.type];
          if (!categoryProjects || categoryProjects.length === 0) {
            return null; // Don't render anything if no projects
          }

          return (
            <section
              key={category.type}
              className="py-12 px-4 max-w-7xl mx-auto bg-white"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{category.title}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <Link
                  to={`/category/${category.type}`}
                  className="text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>
              <Carousel
                items={categoryProjects}
                renderItem={(project) => <PropertyCard property={project} />}
                className="pb-4"
              />
            </section>
          );
        })}

      <div className="mt-5">{showMap && <EnhancedMapComponent />}</div>
      <button
        onClick={toggleMap}
        className="px-4 py-3 sticky bottom-10 left-[45%] bg-black hover:bg-black/80 text-white rounded-xl "
      >
        {showMap ? (
          <p className="flex gap-2">
            Show List <ListCheck />
          </p>
        ) : (
          <p className="flex gap-2">
            Show Map <Map />
          </p>
        )}
      </button>
    </main>
  );
};

export default ListingCompo;
