import React, { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import axios from "axios";

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
          const getCoordinates = (property) => {
            // If property has coordinates, use them
            if (
              property.location &&
              property.location.coordinates &&
              Array.isArray(property.location.coordinates)
            ) {
              return property.location.coordinates;
            }
            // Fallback: use a deterministic generator based on id/city/state
            // This should match the logic in mapComponent.jsx (generateConsistentCoordinates)
            const defaultCenter = [20.5937, 78.9629]; // Center of India
            const propertyId =
              property._id ||
              property.id ||
              property.title ||
              JSON.stringify({
                title: property.title,
                price: property.minimumPrice,
                location: property.location,
              });
            const hash = propertyId
              .toString()
              .split("")
              .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 10000, 0);
            const offsetLat = ((hash % 100) / 50 - 1) * 2;
            const offsetLng = ((Math.floor(hash / 100) % 100) / 50 - 1) * 2;
            return [defaultCenter[0] + offsetLat, defaultCenter[1] + offsetLng];
          };

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
            coordinates: getCoordinates(property),
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
    [filters, sortBy, activeCategory, favorites, onPropertyClick]
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
