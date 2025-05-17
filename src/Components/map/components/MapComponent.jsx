import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { 
  createNearbyHouseIcon, 
  createActiveHouseIcon, 
  createUserLocationIcon,
  createHouseIcon,
} from '../utils/HouseIcons';

// No longer needed - using internal implementations
// import MapBoundsHandler from './MapBoundsHandler';
// import SearchThisAreaButton from './SearchThisAreaButton';
// import SearchAsIMoveToggle from './SearchAsIMoveToggle';

// SearchThisAreaButton component implementation
const SearchThisAreaButton = ({ map, onClick }) => {
  const [visible, setVisible] = useState(true); // Starting visible by default
  
  // Function to handle the click
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
  };
  
  // Update visibility based on map movement
  useEffect(() => {
    if (!map) return;
    
    const handleMoveEnd = () => {
      setVisible(true);
    };
    
    map.on('moveend', handleMoveEnd);
    
    return () => {
      if (map) {
        map.off('moveend', handleMoveEnd);
      }
    };
  }, [map]);
  
  return (
    <div className={`absolute top-2 left-0 right-0 mx-auto w-max z-[999] ${visible ? 'block' : 'hidden'}`}>
      <button 
        onClick={handleClick}
        className="bg-white py-2 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none border border-gray-300"
      >
        <span className="flex items-center text-sm font-medium text-gray-700">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search this area
        </span>
      </button>
    </div>
  );
};

// Custom CSS for active markers
const activeMarkerStyle = `
  .active-property-marker {
    z-index: 1000 !important;
  }
  
  .active-property-marker img {
    animation: pulse-bounce 1.5s infinite alternate;
    filter: drop-shadow(0 0 6px rgba(255, 87, 34, 0.8));
    transform-origin: bottom center;
  }
  
  @keyframes pulse-bounce {
    0% {
      transform: translateY(0) scale(1);
      filter: drop-shadow(0 0 4px rgba(255, 87, 34, 0.6));
    }
    100% {
      transform: translateY(-10px) scale(1.2);
      filter: drop-shadow(0 0 12px rgba(255, 87, 34, 0.9));
    }
  }
  
  /* Ring animation around active marker */
  .active-marker-ring {
    position: absolute;
    pointer-events: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: -25px;
    margin-top: -25px;
    border: 3px solid #FF5722;
    animation: ring-pulse 1.5s infinite;
    z-index: 999;
  }
  
  @keyframes ring-pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.4;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  /* Make sure icons are visible */
  .house-icon, .nearby-house-icon, .active-house-icon, .user-location-icon {
    display: block !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
  
  .active-house-icon {
    z-index: 1000 !important;
    animation: pulse-icon 1.5s infinite alternate;
  }
  
  @keyframes pulse-icon {
    0% {
      transform: scale(1);
      filter: drop-shadow(0 0 4px rgba(255, 87, 34, 0.6));
    }
    100% {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px rgba(255, 87, 34, 0.9));
    }
  }
`;

// Calculate distance between two coordinates in kilometers using Haversine formula
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Helper to generate consistent random coordinates based on property ID
const generateConsistentCoordinates = (property, defaultCenter) => {
  // Use property ID or hash a unique property attribute
  const propertyId = property.id || 
    property._id || 
    property.title || 
    JSON.stringify({title: property.title, price: property.price, location: property.location});
  
  // Create a simple hash from the ID string
  const hash = propertyId.toString().split('').reduce((acc, char) => {
    return (acc * 31 + char.charCodeAt(0)) % 10000;
  }, 0);
  
  // Use the hash to generate a deterministic offset
  // Convert to a value between -1 and 1, then scale
  const offsetLat = ((hash % 100) / 50 - 1) * 2; // -2 to +2 degree offset
  const offsetLng = ((Math.floor(hash / 100) % 100) / 50 - 1) * 2; // -2 to +2 degree offset
  
  return [
    defaultCenter[0] + offsetLat,
    defaultCenter[1] + offsetLng
  ];
};

// Component that handles map interactions and ensures everything is enabled
const MapInteractionHandler = ({ onMapReady }) => {
  const map = useMap();
  
  // Set up the map when it's ready
  useEffect(() => {
    if (!map) return;
    
    // Ensure all interactions are enabled
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.keyboard.enable();
    
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);
  
  return null;
};

// Enhanced MapBoundsHandler component
const EnhancedMapBoundsHandler = ({ onBoundsChange, onPropertiesFetched, filters, searchAsIMove }) => {
  const map = useMap();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);
  const [lastCursor, setLastCursor] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  
  // Helper function to get current map bounds
  const getCurrentMapBounds = (mapInstance) => {
    const bounds = mapInstance.getBounds();
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
      zoom: mapInstance.getZoom()
    };
  };
  
  // Function to clear cache of results
  const clearResultsCache = () => {
    // Implement if needed
    console.log('Clearing results cache');
  };
  
  // Fetch properties in bounds from API
  const fetchPropertiesInBounds = async (bounds, filters) => {
    console.log('Fetching properties in bounds', bounds, filters);
    try {
      // Convert bounds to query parameters
      const queryParams = new URLSearchParams();
      
      // Add bounds parameters
      queryParams.append("north", bounds.north);
      queryParams.append("south", bounds.south);
      queryParams.append("east", bounds.east);
      queryParams.append("west", bounds.west);
      queryParams.append("zoom", bounds.zoom);
      
      // Add additional filters
      if (filters.state) queryParams.append("state", filters.state);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.propertyType?.length) queryParams.append("propertyType", filters.propertyType.join(","));
      if (filters.bhk?.length) queryParams.append("bhk", filters.bhk.join(","));
      if (filters.minBudget) queryParams.append("minBudget", filters.minBudget);
      if (filters.maxBudget) queryParams.append("maxBudget", filters.maxBudget);
      if (filters.amenities?.length) queryParams.append("amenities", filters.amenities.join(","));
      
      // Always add pagination parameters
      queryParams.append("page", "1");
      queryParams.append("limit", "20");
      
      console.log("Query params for map bounds:", queryParams.toString());
      
      // Make API call
      const response = await fetch(`https://iprop91new.onrender.com/api/projectsDataMaster?${queryParams.toString()}`);
      const data = await response.json();
      
      console.log('API response:', data);
      
      if (data.success) {
        return { 
          properties: data.docs || [], 
          nextCursor: data.hasNextPage ? data.nextPage.toString() : null, 
          total: data.totalDocs || 0 
        };
      } else {
        console.error('API returned error:', data.message);
        return { properties: [], nextCursor: null, total: 0 };
      }
    } catch (error) {
      console.error('Error fetching properties for bounds:', error);
      return { properties: [], nextCursor: null, total: 0 };
    }
  };
  
  // Load more properties function
  const loadMoreProperties = async (cursor, bounds, filters) => {
    console.log('Loading more properties', cursor, bounds, filters);
    try {
      // Convert bounds to query parameters
      const queryParams = new URLSearchParams();
      
      // Add bounds parameters
      queryParams.append("north", bounds.north);
      queryParams.append("south", bounds.south);
      queryParams.append("east", bounds.east);
      queryParams.append("west", bounds.west);
      queryParams.append("zoom", bounds.zoom);
      
      // Add additional filters
      if (filters.state) queryParams.append("state", filters.state);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.propertyType?.length) queryParams.append("propertyType", filters.propertyType.join(","));
      if (filters.bhk?.length) queryParams.append("bhk", filters.bhk.join(","));
      if (filters.minBudget) queryParams.append("minBudget", filters.minBudget);
      if (filters.maxBudget) queryParams.append("maxBudget", filters.maxBudget);
      if (filters.amenities?.length) queryParams.append("amenities", filters.amenities.join(","));
      
      // Add pagination parameters
      queryParams.append("page", cursor);
      queryParams.append("limit", "20");
      
      console.log("Query params for loading more:", queryParams.toString());
      
      // Make API call
      const response = await fetch(`https://iprop91new.onrender.com/api/projectsDataMaster?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        return { 
          properties: data.docs || [], 
          nextCursor: data.hasNextPage ? data.nextPage.toString() : null, 
          total: data.totalDocs || 0 
        };
      } else {
        console.error('API returned error:', data.message);
        return { properties: [], nextCursor: null, total: 0 };
      }
    } catch (error) {
      console.error('Error loading more properties:', error);
      return { properties: [], nextCursor: null, total: 0 };
    }
  };
  
  // Use real debounce function to prevent excessive API calls during map interaction
  const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };
  
  // Debounced version of fetch properties
  const debouncedFetchPropertiesInBoundsRef = useRef(debounce(async (bounds, filters) => {
    console.log('Debounced fetch executing with bounds:', bounds);
    const result = await fetchPropertiesInBounds(bounds, filters);
    if (onPropertiesFetched) {
      onPropertiesFetched(result.properties, false, result.total);
    }
    setLastCursor(result.nextCursor);
    setHasMoreProperties(!!result.nextCursor);
  }, 500));
  
  // Expose for use in event handlers
  const debouncedFetchPropertiesInBounds = useCallback((bounds, filters) => {
    console.log('Debounced fetch properties called');
    debouncedFetchPropertiesInBoundsRef.current(bounds, filters);
    // Return a promise for backwards compatibility
    return Promise.resolve({ properties: [], nextCursor: null, total: 0 });
  }, []);
  
  // Function to fetch properties based on current bounds
  const fetchPropertiesForCurrentBounds = useCallback(async (isLoadMore = false) => {
    if (!map || (!isLoadMore && isFetching)) return;
    
    try {
      setIsFetching(true);
      const bounds = getCurrentMapBounds(map);
      
      if (onBoundsChange) {
        onBoundsChange(bounds);
      }
      
      // If loading more, use cursor-based pagination
      let result;
      if (isLoadMore && lastCursor) {
        result = await loadMoreProperties(lastCursor, bounds, filters);
      } else {
        // Initial fetch or bounds change fetch
        result = await fetchPropertiesInBounds(bounds, filters);
      }
      
      // Process results
      const { properties, nextCursor, total } = result;
      
      // Update state
      setLastCursor(nextCursor);
      setHasMoreProperties(!!nextCursor);
      
      // Notify parent component
      if (onPropertiesFetched) {
        onPropertiesFetched(properties, isLoadMore, total);
      }
      
      setIsInitialFetch(false);
    } catch (error) {
      console.error('Error fetching properties for bounds:', error);
    } finally {
      setIsFetching(false);
    }
  }, [map, filters, isFetching, lastCursor, onBoundsChange, onPropertiesFetched]);
  
  // Handle initial load and filter changes
  useEffect(() => {
    if (map && (isInitialFetch || filters)) {
      // Reset pagination on filter changes
      setLastCursor(null);
      setHasMoreProperties(true);
      
      // Clear cache when filters change significantly
      clearResultsCache();
      
      // Fetch properties with the new filters
      fetchPropertiesForCurrentBounds();
    }
  }, [map, filters, fetchPropertiesForCurrentBounds, isInitialFetch]);
  
  useMapEvents({
    moveend: () => {
      // Only fetch on moveend if searchAsIMove is enabled
      if (searchAsIMove) {
        // Use debounced version to prevent too many requests during panning
        debouncedFetchPropertiesInBounds(
          getCurrentMapBounds(map), 
          filters
        ).then(result => {
          if (onPropertiesFetched) {
            onPropertiesFetched(result.properties, false, result.total);
          }
          setLastCursor(result.nextCursor);
          setHasMoreProperties(!!result.nextCursor);
        });
      }
    },
    zoomend: () => {
      // Always fetch on zoom changes as this impacts the granularity of results
      if (searchAsIMove) {
        debouncedFetchPropertiesInBounds(
          getCurrentMapBounds(map), 
          filters
        ).then(result => {
          if (onPropertiesFetched) {
            onPropertiesFetched(result.properties, false, result.total);
          }
          setLastCursor(result.nextCursor);
          setHasMoreProperties(!!result.nextCursor);
        });
      }
    }
  });
  
  // Method to manually load more properties
  const loadMore = useCallback(() => {
    if (hasMoreProperties && !isFetching) {
      fetchPropertiesForCurrentBounds(true);
    }
  }, [hasMoreProperties, isFetching, fetchPropertiesForCurrentBounds]);
  
  // Method to manually trigger a search for the current bounds
  const searchThisArea = useCallback(() => {
    setLastCursor(null);
    fetchPropertiesForCurrentBounds();
  }, [fetchPropertiesForCurrentBounds]);
  
  // Expose methods to parent component through ref
  useEffect(() => {
    if (map) {
      // Attach methods to map instance for external access
      map.loadMoreProperties = loadMore;
      map.searchThisArea = searchThisArea;
    }
  }, [map, loadMore, searchThisArea]);
  
  return null;
};

// Separate component to handle map events
const MapEventLogger = () => {
  // Log when interactions happen to verify they're working
  useMapEvents({
    drag: () => console.log("Map is being dragged"),
    zoom: () => console.log("Map is being zoomed"),
    click: (e) => console.log("Map clicked at", e.latlng)
  });
  
  return null;
};

// Location button component
const LocationButton = ({ onFindLocation }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use browser geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (onFindLocation) {
          onFindLocation([latitude, longitude]);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to access your location. Please check your permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };
  
  return (
    <button 
      type="button"
      onClick={handleClick}
      className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none absolute top-2 right-2 z-[9999]"
    >
      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};
// Active Marker Ring component for animated ring around active marker
const ActiveMarkerRing = ({ position }) => {
  return (
    <div 
      className="active-marker-ring"
      style={{
        left: position[1],
        top: position[0]
      }}
    />
  );
};

// Main Map Component
const MapComponent = ({ defaultCenter = [20.5937, 78.9629], searchRadius = 5, filters = {} }) => {
  // State variables
  const [properties, setProperties] = useState([]);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activePropertyId, setActivePropertyId] = useState(null);
  
  // Refs
  const mapRef = useRef(null);
  const initialLocationZoomDoneRef = useRef(false);
  const propertiesLoadedRef = useRef(false);
  
  // Create map icons
  const houseIcon = useMemo(() => createHouseIcon(), []);
  const nearbyHouseIcon = useMemo(() => createNearbyHouseIcon(), []);
  const activeHouseIcon = useMemo(() => createActiveHouseIcon(), []);
  const userLocationIcon = useMemo(() => createUserLocationIcon(), []);
  
  // Function to handle properties with inconsistent coordinate formats
  const processLegacyProperties = useCallback((properties) => {
    if (!Array.isArray(properties)) {
      console.warn("Properties is not an array:", properties);
      return;
    }
    
    const propertiesWithCoords = properties.map((property) => {
      if (!property) {
        console.warn("Encountered null or undefined property in properties");
        return null;
      }
      let validCoordinates = false;
      // Case 1: Property already has coordinates in the correct format
      if (property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2) {
        const [lat, lng] = property.coordinates;
        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return property;
        } else {
          console.warn(`Property ${property.id || property.title} has invalid array coordinates:`, property.coordinates);
        }
      }
      // Case 2: Property has coordinates in object format
      if (!validCoordinates && property.coordinates && typeof property.coordinates === 'object' && property.coordinates.lat !== undefined && property.coordinates.lng !== undefined) {
        const lat = parseFloat(property.coordinates.lat);
        const lng = parseFloat(property.coordinates.lng);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return {
            ...property,
            coordinates: [lat, lng]
          };
        } else {
          console.warn(`Property ${property.id || property.title} has invalid object coordinates:`, property.coordinates);
        }
      }
      // Case 3: Property has separate latitude and longitude properties
      if (!validCoordinates && property.latitude !== undefined && property.longitude !== undefined) {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return {
            ...property,
            coordinates: [lat, lng]
          };
        } else {
          console.warn(`Property ${property.id || property.title} has invalid lat/lng values:`, {lat: property.latitude, lng: property.longitude});
        }
      }
      // Case 4: As a last resort, generate deterministic coordinates
      const consistentCoords = generateConsistentCoordinates(property, defaultCenter);
      console.log(`Property ${property.id || property.title} using consistent generated coordinates:`, consistentCoords);
      return {
        ...property,
        coordinates: consistentCoords
      };
    });
    const validProperties = propertiesWithCoords.filter(p => p !== null);
    console.log("Final property data with coordinates:", validProperties.length, "valid properties");
    setProperties(validProperties);
    propertiesLoadedRef.current = true;
  }, [defaultCenter]);
  
  // Listen for property updates from propertyCards component
  useEffect(() => {
    // Create handlers with the current value of processLegacyProperties
    const handlePropertiesUpdated = (event) => {
      const { properties } = event.detail;
      console.log('Map received properties update:', properties.length, 'properties');
      processLegacyProperties(properties);
    };
    
    // Also check for global window.mapProperties
    const checkGlobalProperties = () => {
      if (window.mapProperties && Array.isArray(window.mapProperties) && window.mapProperties.length > 0) {
        console.log('Map found global mapProperties:', window.mapProperties.length, 'properties');
        processLegacyProperties(window.mapProperties);
      }
    };
    
    // Initial check for global properties
    checkGlobalProperties();
    
    // Listen for future updates
    window.addEventListener('properties-updated', handlePropertiesUpdated);
    
    // Set up an interval to check for global properties updates as a fallback
    const intervalId = setInterval(checkGlobalProperties, 3000);
    
    return () => {
      window.removeEventListener('properties-updated', handlePropertiesUpdated);
      clearInterval(intervalId);
    };
  }, [processLegacyProperties]); // Added processLegacyProperties as a dependency
  
  // Calculate nearby properties
  useEffect(() => {
    if (!userLocation || properties.length === 0) return;
    
    console.log("Calculating nearby properties with radius:", searchRadius);
    
    const nearby = properties
      .filter(property => {
        const distance = calculateDistance(userLocation, property.coordinates);
        return distance <= searchRadius;
      })
      .map(property => ({
        ...property,
        distance: calculateDistance(userLocation, property.coordinates).toFixed(2)
      }));
    
    console.log(`Found ${nearby.length} nearby properties within ${searchRadius}km`);
    setNearbyProperties(nearby);
    window.nearbyProperties = nearby;
    
  }, [userLocation, properties, searchRadius]);

  // Add the custom CSS for active markers to the document
  useEffect(() => {
    // Add the styles only if they don't already exist
    if (!document.getElementById('map-marker-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'map-marker-styles';
      styleElement.textContent = activeMarkerStyle;
      document.head.appendChild(styleElement);
      
      return () => {
        // Clean up on unmount
        const styleEl = document.getElementById('map-marker-styles');
        if (styleEl) {
          document.head.removeChild(styleEl);
        }
      };
    }
  }, []);
  
  // Handler for when map is ready
  const handleMapReady = useCallback((map) => {
    mapRef.current = map;
    // Expose map to window for use by other components
    window.leafletMap = map;
    console.log("Map is ready and fully interactive");
    
    // Try to get user location automatically when map is ready
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Auto-detected user location:", latitude, longitude);
          setUserLocation([latitude, longitude]);
          
          // Only zoom to location if it's the first time
          if (!initialLocationZoomDoneRef.current && mapRef.current) {
            console.log("Initial zoom to user location");
            mapRef.current.flyTo([latitude, longitude], 12, {
              duration: 1.5
            });
            initialLocationZoomDoneRef.current = true;
          }
          
          // Update searchbar if that function exists
          if (window.updateSearchbarLocation) {
            window.updateSearchbarLocation(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting initial location:", error);
          // Don't show alert for automatic location detection
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    }
  }, []);
  
  // Clean up window references on unmount
  useEffect(() => {
    return () => {
      delete window.leafletMap;
    };
  }, []);
  
  // Handler for when user location is found
  const handleLocationFound = useCallback(([lat, lng]) => {
    console.log("Location button clicked, updating user location:", lat, lng);
    setUserLocation([lat, lng]);
    
    // Always center on user location when the location button is clicked
    if (mapRef.current) {
      console.log("Centering map on user location");
      mapRef.current.flyTo([lat, lng], 14, {
        duration: 1.5
      });
      // Still set initialLocationZoomDoneRef to true for other functionality
      initialLocationZoomDoneRef.current = true;
    }
    
    // Update searchbar if that function exists
    if (window.updateSearchbarLocation) {
      window.updateSearchbarLocation(lat, lng);
    }
  }, []);
  
  // Handler to navigate to a property on the map
  const navigateToProperty = useCallback((propertyId, options = {}) => {
    console.log("Navigating to property:", propertyId);
    
    const {
      animatedZoom = true,
      initialZoom = 16,
      finalZoom = 18
    } = options;
    
    // Find the property by ID
    const property = [...properties, ...nearbyProperties].find(p => 
      (p.id && p.id.toString() === propertyId.toString()) || 
      (p._id && p._id.toString() === propertyId.toString())
    );
    
    // Check if property exists and has valid coordinates
    if (!property) {
      console.warn("Property not found:", propertyId);
      return false;
    }
    
    if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
      console.warn("Property has invalid coordinates:", property.coordinates);
      return false;
    }
    
    if (mapRef.current) {
      console.log("Found property, navigating to:", property.coordinates);
      
      // Set this property as active (can be used to highlight it)
      setActivePropertyId(propertyId);
      
      if (animatedZoom) {
        // Fly to the property location with enhanced animation
        mapRef.current.flyTo(property.coordinates, initialZoom, {
          duration: 2,
          easeLinearity: 0.25
        });
        
        // Add a small delay before zooming in further for a dramatic effect
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.flyTo(property.coordinates, finalZoom, {
              duration: 1.5
            });
          }
        }, 1000);
      } else {
        // Simple zoom without the two-step animation
        mapRef.current.flyTo(property.coordinates, finalZoom, {
          duration: 2
        });
      }
      
      // Dispatch a custom event so other components can react
      const event = new CustomEvent('property-marker-clicked', { 
        detail: { propertyId, coordinates: property.coordinates }
      });
      window.dispatchEvent(event);
      
      return true;
    } else {
      console.warn("Map reference not available");
      return false;
    }
  }, [properties, nearbyProperties]);
  
  // New function to handle marker click
  const handleMarkerClick = useCallback((propertyId, options = {}) => {
    // Set this property as active (will highlight it)
    setActivePropertyId(propertyId);
    
    // Find the property by ID
    const property = [...properties, ...nearbyProperties].find(
      p => p.id === propertyId || (p._id && p._id.toString() === propertyId.toString())
    );
    
    // Check if property exists and has valid coordinates
    if (!property) {
      console.warn("Property not found for marker click:", propertyId);
      return false;
    }
    
    if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
      console.warn("Property has invalid coordinates for marker click:", property.coordinates);
      return false;
    }
    
    if (mapRef.current) {
      const {
        animatedZoom = true,
        initialZoom = 16,
        finalZoom = 18
      } = options;
      
      if (animatedZoom) {
        // Fly to the property location with enhanced animation
        mapRef.current.flyTo(property.coordinates, initialZoom, {
          duration: 2
        });
        
        // Add a small delay before zooming in further for a dramatic effect
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.flyTo(property.coordinates, finalZoom, {
              duration: 1.5
            });
          }
        }, 1000);
      } else {
        // Simple zoom without the two-step animation
        mapRef.current.flyTo(property.coordinates, finalZoom, {
          duration: 2
        });
      }
      
      // Dispatch a custom event so other components can react
      const event = new CustomEvent('property-marker-clicked', { 
        detail: { propertyId, coordinates: property.coordinates }
      });
      window.dispatchEvent(event);
      
      return true;
    }
    
    return false;
  }, [properties, nearbyProperties]);
  
  // Function to handle property card click event
  const handlePropertyCardClick = useCallback((event) => {
    const { propertyId, zoomOptions } = event.detail;
    if (propertyId) {
      navigateToProperty(propertyId, zoomOptions);
    }
  }, [navigateToProperty]);
  
  // Listen for property card click events
  useEffect(() => {
    window.addEventListener('property-card-clicked', handlePropertyCardClick);
    
    return () => {
      window.removeEventListener('property-card-clicked', handlePropertyCardClick);
    };
  }, [handlePropertyCardClick]);
  
  // Add function to navigate directly to coordinates
  const navigateToCoordinates = useCallback((coordinates, options = {}) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      console.warn("Invalid coordinates provided:", coordinates);
      return false;
    }
    
    if (!mapRef.current) {
      console.warn("Map reference not available");
      return false;
    }
    
    const {
      animatedZoom = true,
      initialZoom = 16,
      finalZoom = 18,
      propertyId = null
    } = options;
    
    console.log("Navigating to coordinates:", coordinates);
    
    try {
      // If a property ID was provided, set it as active
      if (propertyId) {
        setActivePropertyId(propertyId);
      }
      
      if (animatedZoom) {
        // Fly to the coordinates with enhanced animation
        mapRef.current.flyTo(coordinates, initialZoom, {
          duration: 2,
          easeLinearity: 0.25
        });
        
        // Add a small delay before zooming in further
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.flyTo(coordinates, finalZoom, {
              duration: 1.5
            });
          }
        }, 1000);
      } else {
        // Simple zoom without the two-step animation
        mapRef.current.flyTo(coordinates, finalZoom, {
          duration: 2
        });
      }
      
      // If a property ID was provided, dispatch an event
      if (propertyId) {
        const event = new CustomEvent('property-marker-clicked', { 
          detail: { propertyId, coordinates }
        });
        window.dispatchEvent(event);
      }
      
      return true;
    } catch (error) {
      console.error("Error navigating to coordinates:", error);
      return false;
    }
  }, []);

  // Expose the function to the window
  useEffect(() => {
    window.navigateToCoordinatesOnMap = navigateToCoordinates;
    
    return () => {
      delete window.navigateToCoordinatesOnMap;
    };
  }, [navigateToCoordinates]);

  // Expose the navigate function to the window so it can be called from outside
  useEffect(() => {
    window.navigateToPropertyOnMap = navigateToProperty;
    
    return () => {
      // Clean up when component unmounts
      delete window.navigateToPropertyOnMap;
    };
  }, [navigateToProperty]);
  
  // Expose a function to get the currently active property ID
  useEffect(() => {
    window.getActivePropertyId = () => activePropertyId;
    
    return () => {
      delete window.getActivePropertyId;
    };
  }, [activePropertyId]);
  
  // Define processApiProperties function
  // Process API properties function - used for handling properties from API
// Used when fetching properties from API endpoints
const processApiProperties = useCallback((projects) => {
    if (!Array.isArray(projects)) {
      console.error("Projects is not an array:", projects);
      return;
    }
    console.log(`Processing ${projects.length} properties from API response`);
    const propertiesWithCoords = projects.map(property => {
      const propertyData = {
        id: property._id || property.propertyId,
        title: property.project || property.propertyId || "Unnamed Property",
        price: property.minimumPrice ? `₹${property.minimumPrice}${property.maximumPrice && property.maximumPrice !== property.minimumPrice ? ` - ₹${property.maximumPrice}` : ''}` : "Price on request",
        location: [
          property.address,
          property.sector,
          property.city,
          property.state,
          property.pincode
        ].filter(Boolean).join(", "),
        type: property.type,
        status: property.status,
        bhk: property.bhk,
        availableFor: property.availableFor,
        thumbnail: property.thumbnail,
        amenities: property.amenities || [],
        features: property.features || [],
        overview: property.overview || "",
        rawData: property
      };
      let validCoordinates = false;
      // Case 1: Property has coordinates in the expected format
      if (property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2) {
        const [lat, lng] = property.coordinates;
        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return {
            ...propertyData,
            coordinates: [lat, lng]
          };
        }
      }
      // Case 2: Property has separate latitude and longitude properties
      if (!validCoordinates && property.latitude !== undefined && property.longitude !== undefined) {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return {
            ...propertyData,
            coordinates: [lat, lng]
          };
        }
      }
      // Case 3: Property has location.coordinates (nested structure)
      if (!validCoordinates && property.location && property.location.coordinates && 
          Array.isArray(property.location.coordinates) && property.location.coordinates.length === 2) {
        const [lat, lng] = property.location.coordinates;
        if (typeof lat === 'number' && typeof lng === 'number' && 
            !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates = true;
          return {
            ...propertyData,
            coordinates: property.location.coordinates
          };
        }
      }
      // Case 4: As a last resort, generate deterministic coordinates
      const consistentCoords = generateConsistentCoordinates(propertyData, defaultCenter);
      return {
        ...propertyData,
        coordinates: consistentCoords
      };
    });
    setProperties(propertiesWithCoords);
    propertiesLoadedRef.current = true;
  }, [defaultCenter]);



  return (
    <div className="relative h-full w-full">
      <LocationButton onFindLocation={handleLocationFound} />
      
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="map-container"
        data-map-container
      >
        <MapInteractionHandler onMapReady={handleMapReady} />
        <MapEventLogger />
        <EnhancedMapBoundsHandler 
          searchAsIMove={true} 
          filters={filters} 
          onBoundsChange={(bounds) => console.log('Bounds changed', bounds)} 
          onPropertiesFetched={(props, isLoadMore, total) => {
            if (props && Array.isArray(props)) {
              if (props[0] && (props[0].project || props[0].propertyId)) {
                // Data is from API in projectsDataMaster format
                processApiProperties(props);
              } else {
                // Handle legacy format properties
                processLegacyProperties(props);
              }
            }
          }}
        />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Add the Search This Area button */}
        {mapRef.current && (
          <SearchThisAreaButton 
            map={mapRef.current} 
            onClick={() => {
              console.log('Search this area clicked');
              // Call your search function here
              if (mapRef.current) {
                const bounds = mapRef.current.getBounds();
                console.log('Current map bounds:', bounds);
                // Implement searchThisArea functionality
              }
            }} 
          />
        )}
        
        {userLocation && (
          <>
            <Marker 
              position={userLocation}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Your Location</h3>
                </div>
              </Popup>
            </Marker>
            
            <Circle 
              center={userLocation}
              radius={searchRadius * 1000}
              pathOptions={{
                color: '#14B8A6',
                fillColor: '#14B8A6',
                fillOpacity: 0.05,
                weight: 1,
                interactive: false
              }}
            />
          </>
        )}
        
        {/* Add Active Marker Animation Ring */}
        {activePropertyId && (
          <>
            {properties.concat(nearbyProperties)
              .filter(property => property && property.coordinates && 
                     Array.isArray(property.coordinates) && 
                     property.coordinates.length === 2)
              .map((property) => {
                const isActive = 
                  (property.id && property.id === activePropertyId) || 
                  (property._id && property._id.toString() === activePropertyId?.toString());
                
                if (isActive && property.coordinates) {
                  return (
                    <ActiveMarkerRing 
                      key={`ring-${property.id || property._id}`}
                      position={property.coordinates} 
                    />
                  );
                }
                return null;
              })}
          </>
        )}
        
        {properties.filter(p => !nearbyProperties.some(np => np.id === p.id)).map((property, index) => {
          const isActive = (property.id && property.id === activePropertyId) || 
                         (property._id && property._id.toString() === activePropertyId?.toString());
          
          // Check for valid coordinates before rendering
          if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
            console.warn(`Property ${property.id || property._id || index} has invalid coordinates:`, property.coordinates);
            return null;
          }
          
          return (
            <Marker
              key={property.id || `property-${index}`}
              position={property.coordinates}
              icon={houseIcon}
              eventHandlers={{
                click: (e) => {
                  const id = property.id || property._id;
                  if (id) {
                    handleMarkerClick(id);
                  }
                }
              }}
              className={isActive ? 'active-property-marker' : ''}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{property.title}</h3>
                  <p className="text-xs text-gray-600">{property.price}</p>
                  <p className="text-xs text-gray-500">{property.location}</p>
                  {property.type && <p className="text-xs text-blue-500">{property.type} • {property.availableFor}</p>}
                  {property.bhk && <p className="text-xs text-teal-500">{property.bhk} BHK</p>}
                  {property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Coords: {property.coordinates[0].toFixed(4)}, {property.coordinates[1].toFixed(4)}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {nearbyProperties.map((property, index) => {
          const isActive = (property.id && property.id === activePropertyId) || 
                         (property._id && property._id.toString() === activePropertyId?.toString());
          
          // Check for valid coordinates before rendering
          if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
            console.warn(`Nearby property ${property.id || property._id || index} has invalid coordinates:`, property.coordinates);
            return null;
          }
          
          return (
            <Marker
              key={property.id || `nearby-${index}`}
              position={property.coordinates}
              icon={isActive ? activeHouseIcon : nearbyHouseIcon}
              eventHandlers={{
                click: (e) => {
                  const id = property.id || property._id;
                  if (id) {
                    handleMarkerClick(id);
                  }
                }
              }}
              className={isActive ? 'active-property-marker' : ''}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{property.title}</h3>
                  <p className="text-xs text-gray-600">{property.price}</p>
                  <p className="text-xs text-gray-500">{property.location}</p>
                  {property.type && <p className="text-xs text-blue-500">{property.type} • {property.availableFor}</p>}
                  {property.bhk && <p className="text-xs text-teal-500">{property.bhk} BHK</p>}
                  {property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Coords: {property.coordinates[0].toFixed(4)}, {property.coordinates[1].toFixed(4)}
                    </p>
                  )}
                  <p className="text-xs text-teal-600 font-medium mt-1">
                    {property.distance} km from your location
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
