import React, { useEffect, useState, useCallback, useRef } from "react";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";

const PropertyCards = ({
  filters,
  sortBy,
  activeCategory,
  favorites,
  onPropertyClick,
  onPropertySelect,
  nearbyProperties = [],
  showNearby = false
}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [/* error */, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation controls for card entrance
  const controls = useAnimation();
  
  // Reference to the container
  const containerRef = useRef(null);

  // Start animation controls immediately
  useEffect(() => {
    // Force visible state immediately on component mount
    controls.start("visible");
  }, [controls]);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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
      // Skip normal API fetch if we're showing nearby properties
      if (showNearby && nearbyProperties.length > 0) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

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

        // Always add these parameters
        if (activeCategory && activeCategory !== "all") {
          queryParams.append("category", activeCategory);
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
            coordinates: property.coordinates || [],
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
            setTotalProperties(response.data.data.projects.length);

          // Update properties state
          if (isLoadMore) {
            setProperties((prev) => [...prev, ...newProperties]);
          } else {
            setProperties(newProperties);
          }

          // Check if there are more properties to load
          setHasMore(newProperties.length === 20);
          
          // Animate cards in
          controls.start("visible");
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
    [filters, sortBy, activeCategory, favorites, onPropertyClick, showNearby, nearbyProperties.length, controls]
  );

  // Initial data fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchData(1, false);
  }, [filters, sortBy, activeCategory, fetchData]);

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

  // Store properties in window object for map access with better interface
  useEffect(() => {
    if (properties.length > 0) {
      // Make properties available for the map component
      window.mapProperties = properties;
      
      // Log properties with coordinates for debugging
      console.log('Properties with coordinates available:', 
        properties.filter(p => p.coordinates && Array.isArray(p.coordinates) && p.coordinates.length === 2).length,
        'out of', properties.length);
      
      // Create a custom event that the map component can listen for
      const event = new CustomEvent('properties-updated', {
        detail: { properties }
      });
      window.dispatchEvent(event);
    }
  }, [properties]);

  // Force visibility by running animation immediately
  useEffect(() => {
    controls.start("visible");
  }, [loading, properties.length, nearbyProperties.length, showNearby, controls]);

  // Determine which properties to display
  const displayProperties = showNearby ? nearbyProperties : properties;
  const displayTitle = showNearby ? 
    `${nearbyProperties.length} Properties Near You` : 
    `${totalProperties} Properties for Sale in ${getLocationLabel()}`;

  // No results message
  if (displayProperties.length === 0) {
    return (
      <motion.div 
        className="text-center py-8 text-gray-500 bg-white/50 rounded-lg shadow-sm"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        style={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showNearby ? 
          "No properties found near your location." : 
          "No properties found for the selected filters."}
      </motion.div>
    );
  }

  // Use inline styles to force visibility
  const forceVisibleStyle = {
    opacity: 1,
    visibility: "visible"
  };

  return (
    <motion.div 
      ref={containerRef}
      className="property-cards-container h-full bg-white flex-1 overflow-y-auto pb-20"
      style={forceVisibleStyle}
      {...(isMobile ? {
        drag: "y",
        dragDirectionLock: true,
        dragConstraints: { top: 100, bottom: 0 },
        dragElastic: 0.1,
        dragMomentum: true,
        dragPropagation: true,
        dragTransition: { bounceStiffness: 300, bounceDamping: 20 }
      } : {})}
    >
      <motion.h1 
        className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm py-2 px-1 rounded-lg shadow-sm z-10"
        style={forceVisibleStyle}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {displayTitle}
      </motion.h1>
      
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 max-w-full mx-auto"
        style={forceVisibleStyle}
      >
        {displayProperties.map((property, index) => (
          <div
            key={`${property.id || index}-card`}
            style={forceVisibleStyle}
            className="min-h-[340px] flex flex-col justify-between"
          >
            <PropertyCard
              property={{
                ...property,
                ...(showNearby && property.distance && {
                  distanceText: `${property.distance} km from your location`
                })
              }}
              isLoading={loading}
              propertyId={property._id || property.id}
              onPropertySelect={onPropertySelect}
            />
          </div>
        ))}
      </div>
      
      {/* Load more trigger */}
      {!showNearby && hasMore && (
        <div
          id="load-more-trigger"
          className="h-16 flex items-center justify-center mt-4 mb-10"
          style={forceVisibleStyle}
        >
          {loadingMore ? (
            <div className="text-gray-600 py-2 px-4 bg-white rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading more properties...
              </div>
            </div>
          ) : (
            <button 
              onClick={loadMore}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-full shadow-sm transition-colors"
            >
              Load more properties
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PropertyCards;
