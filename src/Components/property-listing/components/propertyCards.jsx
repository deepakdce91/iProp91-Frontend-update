import React, { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-gold-400 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-gold-400 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
};

const PropertyCards = ({
  filters,
  sortBy,
  activeCategory,
  favorites,
  onPropertyClick,
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  const propertyCategories = [
    { id: "all", label: "All Properties", count: totalProperties },
    { id: "residential", label: "Residential", count: 0 },
    { id: "commercial", label: "Commercial", count: 0 },
    { id: "plots", label: "Plots", count: 0 },
    { id: "apartments", label: "Apartments", count: 0 },
    { id: "villas", label: "Villas", count: 0 },
    { id: "farmhouses", label: "Farmhouses", count: 0 },
    { id: "builder-floors", label: "Builder Floors", count: 0 },
  ];

  const handleCategoryClick = (categoryId) => {
    // Handle category click - you can implement your own logic here
    console.log("Category clicked:", categoryId);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  // Helper to get state/city label
  const getLocationLabel = () => {
    if (filters.city && filters.state) {
      return `${filters.city}, ${filters.state}`;
    } else if (filters.state) {
      return filters.state;
    } else {
      return "All Locations";
    }
  };

  const fetchData = useCallback(
    async (page = 1, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const queryParams = new URLSearchParams();

        // Check if location filters (state and city) are applied
        const hasLocationFilters = filters.state || filters.city;

        // Add all filter parameters if they exist
        if (filters.state) queryParams.append("state", filters.state);
        if (filters.city) queryParams.append("city", filters.city);
        if (filters.propertyType?.length)
          queryParams.append("propertyType", filters.propertyType.join(","));
        if (filters.bhk?.length)
          queryParams.append("bhk", filters.bhk.join(","));
        if (filters.minBudget)
          queryParams.append("minBudget", filters.minBudget);
        if (filters.maxBudget)
          queryParams.append("maxBudget", filters.maxBudget);
        if (filters.amenities?.length)
          queryParams.append("amenities", filters.amenities.join(","));

        // Get category from URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category');
        
        // Use category from URL if available
        if (categoryFromUrl) {
          queryParams.append("category", categoryFromUrl);
        }

        // Add sort parameter
        if (sortBy) {
          queryParams.append("sort", sortBy);
        }

        // Add pagination parameters
        queryParams.append("page", page.toString());
        queryParams.append("limit", "20");

        // Add random parameter when no location filters are applied
        if (!hasLocationFilters) {
          queryParams.append("random", "true");
        }

        console.log("Current filters:", filters);
        console.log("Has location filters:", hasLocationFilters);
        console.log("Query params:", queryParams.toString());

        const apiUrl = `https://iprop91new.onrender.com/api/projectsDataMaster?${queryParams.toString()}`;
        console.log("API URL:", apiUrl);

        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data);

        if (
          response.data.status === "success" &&
          response.data.data?.projects
        ) {
          const newProperties = response.data.data.projects.map((property) => ({
            id: property._id,
            title: `${property.bhk || ""} ${property.type || "Property"} in ${
              property.project || ""
            }`,
            price: property.minimumPrice
              ? `₹${property.minimumPrice}`
              : "Price on Request",
            pricePerSqft: property.size
              ? `₹${Math.round(
                  parseInt(property.minimumPrice) / parseInt(property.size)
                )}`
              : "",
            location: `${property.city}, ${property.state}`,
            area: property.size || "",
            floor: property.floorNumber
              ? `${property.floorNumber} out of ${property.numberOfFloors}`
              : "",
            photos: property.images?.length || 0,
            description: property.overview || "",
            owner: property.builder || "Owner",
            postedTime: "Updated recently",
            image: property.images?.[0]?.name || "",
            amenities: property.amenities || [],
            features: property.features || [],
            isFavorite: favorites?.includes(property._id),
            onFavoriteClick: property.onFavoriteClick,
            onClick: () => onPropertyClick && onPropertyClick(property),
          }));

          // Update total properties count
          if (response.data.data.total) {
            setTotalProperties(response.data.data.total);
          }

          // Update properties state
          if (isLoadMore) {
            setProperties((prev) => [...prev, ...newProperties]);
          } else {
            setProperties(newProperties);
          }

          // Check if there are more properties to load
          setHasMore(newProperties.length === 20);
        } else {
          console.log("Invalid API response format:", response.data);
          setError("Invalid response format from server");
          if (!isLoadMore) {
            setProperties([]);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        }
        setError("Failed to fetch properties");
        if (!isLoadMore) {
          setProperties([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, sortBy, favorites, onPropertyClick]
  );

  // Initial data fetch
  useEffect(() => {
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    
    // Only fetch if we have a category from URL or if we have other filters
    if (categoryFromUrl || Object.keys(filters).length > 0) {
      setCurrentPage(1);
      fetchData(1, false);
    }
  }, [filters, sortBy, fetchData]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, true);
    }
  }, [currentPage, loadingMore, hasMore, fetchData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const loadMoreTrigger = document.getElementById("load-more-trigger");
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => {
      if (loadMoreTrigger) {
        observer.unobserve(loadMoreTrigger);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading properties...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
        {properties.length} Properties for Sale in {getLocationLabel()}
      </h1>
      {properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No properties found for the selected filters.
        </div>
      ) : (
        <>
          <div className="mb-8">
            <Slider {...sliderSettings}>
              {propertyCategories.map((category) => (
                <div
                  key={category.id}
                  className={`px-3 py-2 cursor-pointer text-center ${
                    activeCategory === category.id
                      ? "text-gold-400 font-semibold border-b-2 border-gold-400"
                      : "text-gray-600 hover:text-gold-400"
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {category.label}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-full lg:max-w-[1400px] mx-auto">
            {properties.map((property, index) => (
              <PropertyCard
                key={`${property.id}-${index}`}
                property={property}
                onClick={property.onClick}
              />
            ))}
          </div>
          {hasMore && (
            <div
              id="load-more-trigger"
              className="h-10 flex items-center justify-center mt-4"
            >
              {loadingMore && (
                <div className="text-gray-600">Loading more properties...</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyCards;
