import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { 
  createNearbyHouseIcon, 
  createActiveHouseIcon, 
  createUserLocationIcon,
  createBlackHouseIcon,
  createHouseIcon,
} from '../utils/HouseIcons';
import {
  fetchPropertiesInBounds,
  debouncedFetchPropertiesInBounds,
  loadMoreProperties,
  clearResultsCache,
  getCurrentMapBounds
} from '../utils/mapFetchUtils';

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

// Component to handle map bounds changes with Airbnb-like property fetching
const MapBoundsHandler = ({ onBoundsChange, onPropertiesFetched, filters, searchAsIMove = true }) => {
  const map = useMap();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);
  const [lastCursor, setLastCursor] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  
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
  
  // Set up map event listeners for bounds changes
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

// Location button component
const LocationButton = ({ onFindLocation }) => {
  // Reference to the map
  const map = useMap();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Fly to location with animation
          map.flyTo([latitude, longitude], 14, {
            animate: true,
            duration: 1.5
          });
          
          // Call the callback with the location
          if (onFindLocation) {
            onFindLocation([latitude, longitude]);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please ensure location services are enabled.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className="absolute z-[999] bottom-24 right-4 bg-white hover:bg-gray-100 transition-colors p-3 rounded-full shadow-md"
      aria-label="Find my location"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  );
};

// Component for rendering the pulsing ring animation on active markers
const ActiveMarkerRing = ({ position }) => {
  const map = useMap();
  const divRef = useRef(null);
  const [pixel, setPixel] = useState({ x: 0, y: 0 });
  
  // Update pixel position when map or position changes
  useEffect(() => {
    if (!map || !position) return;
    
    const updatePosition = () => {
      updatePixel();
    };
    
    updatePosition();
    map.on('zoom', updatePosition);
    map.on('move', updatePosition);
    
    return () => {
      map.off('zoom', updatePosition);
      map.off('move', updatePosition);
    };
  }, [map, position]);
  
  // Convert lat/lng to pixel coordinates
  const updatePixel = () => {
    if (!map || !position) return;
    
    const point = map.latLngToContainerPoint([position[0], position[1]]);
    setPixel({
      x: point.x,
      y: point.y
    });
  };
  
  return (
    <div 
      ref={divRef}
      className="active-marker-ring"
      style={{ 
        left: `${pixel.x}px`, 
        top: `${pixel.y}px` 
      }}
    />
  );
};

// SearchThisAreaButton component
const SearchThisAreaButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-[999] top-24 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-100 transition-colors px-4 py-2 rounded-full shadow-md text-sm font-medium text-blue-600"
    >
      Search this area
    </button>
  );
};

// Toggle component for "Search as I move the map" functionality
const SearchAsIMoveToggle = ({ value, onChange }) => {
  return (
    <div className="absolute z-[999] bottom-4 left-4 bg-white p-2 rounded-lg shadow-md flex items-center space-x-2">
      <input 
        type="checkbox" 
        id="search-as-i-move"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="search-as-i-move" className="text-xs font-medium text-gray-700">
        Search as I move the map
      </label>
    </div>
  );
};

// Main map component
const MapComponent = ({
  properties = [],
  nearbyProperties = [],
  activePropertyId,
  filters = {},
  onPropertySelect,
  handleMarkerClick,
  userLocation,
  onLocationFound,
  className = "",
  containerClassName = "",
  onMapReady,
  onPropertiesFetched
}) => {
  // Default center of the map (center of India)
  const defaultCenter = useMemo(() => [20.5937, 78.9629], []);
  
  // State for map functionality
  const [mapInstance, setMapInstance] = useState(null);
  const [activeMarkerPosition, setActiveMarkerPosition] = useState(null);
  const [searchAsIMove, setSearchAsIMove] = useState(true);
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(userLocation || null);
  const [searchRadius, setSearchRadius] = useState(5); // 5km radius
  
  // Create marker icons
  const houseIcon = useMemo(() => createHouseIcon(), []);
  const activeHouseIcon = useMemo(() => createActiveHouseIcon(), []);
  const nearbyHouseIcon = useMemo(() => createNearbyHouseIcon(), []);
  const userLocationIcon = useMemo(() => createUserLocationIcon(), []);
  
  // Handle adding the active marker styles to the document
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = activeMarkerStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Handle finding user location
  const handleFindLocation = useCallback((coords) => {
    setUserCoordinates(coords);
    
    if (onLocationFound) {
      onLocationFound(coords);
    }
  }, [onLocationFound]);
  
  // Handle map being ready
  const handleMapReady = useCallback((map) => {
    setMapInstance(map);
    
    if (onMapReady) {
      onMapReady(map);
    }
  }, [onMapReady]);
  
  // Handle bounds change
  const handleBoundsChange = useCallback((bounds) => {
    setMapBounds(bounds);
    
    // When bounds change and search-as-i-move is off, show the search this area button
    if (!searchAsIMove) {
      setShowSearchAreaButton(true);
    } else {
      setShowSearchAreaButton(false);
    }
  }, [searchAsIMove]);
  
  // Handle search-as-i-move toggle change
  const handleSearchAsIMoveChange = useCallback((value) => {
    setSearchAsIMove(value);
    
    if (value && mapBounds) {
      // If turning it on, immediately perform a search
      setShowSearchAreaButton(false);
      
      if (mapInstance && mapInstance.searchThisArea) {
        mapInstance.searchThisArea();
      }
    } else if (!value) {
      // If turning it off, show the search this area button
      setShowSearchAreaButton(true);
    }
  }, [mapBounds, mapInstance]);
  
  // Handle "Search this area" button click
  const handleSearchThisArea = useCallback(() => {
    if (mapInstance && mapInstance.searchThisArea) {
      mapInstance.searchThisArea();
      setShowSearchAreaButton(false);
    }
  }, [mapInstance]);
  
  // Update active marker position when activePropertyId changes
  useEffect(() => {
    if (!activePropertyId) {
      setActiveMarkerPosition(null);
      return;
    }
    
    // Find the active property
    const activeProperty = 
      properties.find(p => (p.id === activePropertyId || p._id === activePropertyId)) ||
      nearbyProperties.find(p => (p.id === activePropertyId || p._id === activePropertyId));
    
    if (activeProperty && activeProperty.coordinates && 
        Array.isArray(activeProperty.coordinates) && 
        activeProperty.coordinates.length === 2) {
      setActiveMarkerPosition(activeProperty.coordinates);
      
      // Fly to the active property
      if (mapInstance) {
        mapInstance.flyTo(activeProperty.coordinates, 15, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [activePropertyId, properties, nearbyProperties, mapInstance]);
  
  return (
    <div className={`relative w-full h-full ${containerClassName}`}>
      {/* Add the map style */}
      <MapContainer
        center={defaultCenter}
        zoom={5}
        className={`w-full h-full ${className}`}
        whenCreated={setMapInstance}
      >
        {/* Base map layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map interaction handler */}
        <MapInteractionHandler onMapReady={handleMapReady} />
        
        {/* Bounds handler for Airbnb-like property fetching */}
        <MapBoundsHandler 
          onBoundsChange={handleBoundsChange}
          onPropertiesFetched={onPropertiesFetched}
          filters={filters}
          searchAsIMove={searchAsIMove}
        />
        
        {/* Location button */}
        <LocationButton onFindLocation={handleFindLocation} />
        
        {/* User location marker */}
        {userCoordinates && (
          <>
            <Marker
              position={userCoordinates}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Your Location</h3>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userCoordinates}
              radius={searchRadius * 1000} // Convert km to meters
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />
          </>
        )}
        
        {/* Active marker animation */}
        {activeMarkerPosition && (
          <ActiveMarkerRing position={activeMarkerPosition} />
        )}
        
        {/* Property markers */}
        {properties.map((property, index) => {
          const isActive = (property.id && property.id === activePropertyId) || 
                       (property._id && property._id === activePropertyId);
          
          // Check for valid coordinates before rendering
          if (!property.coordinates || !Array.isArray(property.coordinates) || property.coordinates.length !== 2) {
            console.warn(`Property ${property.id || property._id || index} has invalid coordinates:`, property.coordinates);
            return null;
          }
          
          return (
            <Marker
              key={property.id || `property-${index}`}
              position={property.coordinates}
              icon={isActive ? activeHouseIcon : houseIcon}
              eventHandlers={{
                click: (e) => {
                  const id = property.id || property._id;
                  if (id && handleMarkerClick) {
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
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Nearby property markers */}
        {nearbyProperties.map((property, index) => {
          const isActive = (property.id && property.id === activePropertyId) || 
                       (property._id && property._id === activePropertyId);
          
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
                  if (id && handleMarkerClick) {
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
                  {property.distance && (
                    <p className="text-xs text-teal-600 font-medium mt-1">
                      {property.distance.toFixed(1)} km from your location
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* UI Elements outside of MapContainer */}
      {showSearchAreaButton && (
        <SearchThisAreaButton onClick={handleSearchThisArea} />
      )}
      
      <SearchAsIMoveToggle
        value={searchAsIMove}
        onChange={handleSearchAsIMoveChange}
      />
    </div>
  );
};

export default MapComponent;
