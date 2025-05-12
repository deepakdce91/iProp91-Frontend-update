import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../Components/Landing/Navbar";
import MapComponent from "../Components/map/components/mapComponent";
import PropertyCards from "../Components/map/components/propertyCards";
import SearchBar from "../Components/map/components/searchbar";
import FiltersPanel from "../Components/map/components/FiltersPage";
import axios from "axios";

function AirbnbMapClone() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusedProperty, setFocusedProperty] = useState(null);

  // Get propertyId from URL query params
  const propertyId = searchParams.get("propertyId");

  // Process location state if passed
  useEffect(() => {
    if (location.state && location.state.focusedProperty) {
      setFocusedProperty(location.state.focusedProperty);
      console.log("Focusing on property:", location.state.focusedProperty);
    }
  }, [location.state]);

  // Focus on a property based on URL query parameter
  useEffect(() => {
    if (propertyId) {
      setFocusedProperty(propertyId);
      console.log("Property ID from URL:", propertyId);
      
      // Fetch the property details if needed
      const fetchPropertyDetails = async () => {
        try {
          const response = await axios.get(
            `https://iprop91new.onrender.com/api/projectsDataMaster/property/${propertyId}`
          );
          
          if (response.data.status === "success" && response.data.data) {
            console.log("Property details fetched:", response.data.data);
            
            // Navigate to the property on the map using window function
            if (window.navigateToPropertyOnMap) {
              window.navigateToPropertyOnMap(propertyId, {
                animatedZoom: true,
                initialZoom: 14,
                finalZoom: 16
              });
            }
            
            // Also dispatch the event as a fallback
            if (typeof window.dispatchEvent === 'function') {
              const event = new CustomEvent('property-card-clicked', {
                detail: {
                  propertyId,
                  zoomOptions: {
                    animatedZoom: true,
                    initialZoom: 14,
                    finalZoom: 16
                  }
                }
              });
              window.dispatchEvent(event);
            }
          }
        } catch (error) {
          console.error("Error fetching property details:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPropertyDetails();
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  // Helper function to toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="pt-16 flex flex-col h-[calc(100vh-64px)]">
        {/* Map Section */}
        <div className="relative flex-grow">
          <MapComponent />
          
          {/* Overlay for search bar and filters */}
          <div className="absolute top-0 left-0 right-0 z-10">
            {showSearchBar && <SearchBar onFilterToggle={toggleFilters} />}
            {showFilters && (
              <FiltersPanel 
                onClose={() => setShowFilters(false)} 
                onApply={() => setShowFilters(false)} 
              />
            )}
          </div>
          
          {/* Property cards section */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-2xl shadow-lg">
            <PropertyCards focusedPropertyId={focusedProperty} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirbnbMapClone; 