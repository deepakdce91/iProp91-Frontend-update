import React, { useEffect, useState, useCallback, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { motion, useAnimation } from "framer-motion";

const PropertyCards = ({
  properties,
  filters,
  sortBy,
  activeCategory,
  favorites,
  onPropertyClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
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

  // Update total properties count when properties change
  useEffect(() => {
    setTotalProperties(properties.length);
  }, [properties]);

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
        {totalProperties} Properties for Sale in {getLocationLabel()}
      </h1>
      {properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No properties found for the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-full lg:max-w-[1400px] mx-auto">
            {properties.map((property, index) => (
              <PropertyCard
                key={`${property.id}-${index}`}
                property={property}
                onClick={property.onClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Route 11: Get array of unique city names
router.get("/cities/unique", async (req, res) => {
  try {
    // Aggregate to get distinct city values
    const cities = await ProjectsDataMaster.aggregate([
      // Match only enabled projects if needed (you can remove this if you want all cities)
      { $match: { enable: "true" } },
      
      // Project only the city field
      { $project: { city: 1 } },
      
      // Group by city name to get distinct values
      { $group: { _id: "$city" } },
      
      // Filter out null or empty values
      { $match: { _id: { $ne: null, $ne: "" } } },
      
      // Sort alphabetically
      { $sort: { _id: 1 } },
      
      // Format the output
      { $project: { _id: 0, name: "$_id" } }
    ]);
    
    // Return the array of unique city names
    res.status(200).json({
      status: "success",
      data: cities.map(city => city.name)
    });
  } catch (error) {
    console.error("Error fetching unique cities:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch unique cities",
      error: error.message
    });
  }
});

export default PropertyCards;