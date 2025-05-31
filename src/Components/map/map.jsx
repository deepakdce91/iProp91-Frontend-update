import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Building, Bed, Bath, Square, Tag, Search, Navigation } from 'lucide-react';
import axios from 'axios'; 

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/home-icon.png',
  iconRetinaUrl: '/home-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'custom-house-icon'
});

// Map controller component to handle center changes
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  return null;
}

// Map event handler component
function MapEvents({ onBoundsChange }) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      onBoundsChange({
        neLat: bounds.getNorthEast().lat,
        neLng: bounds.getNorthEast().lng,
        swLat: bounds.getSouthWest().lat,
        swLng: bounds.getSouthWest().lng
      });
    };

    map.on('moveend', handleMoveEnd);
    
    // Trigger initial bounds fetch
    handleMoveEnd();
    
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onBoundsChange]);

  return null;
}

// Search Bar Component
const SearchBar = ({ onSearch, onUseLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      await onSearch(searchQuery);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = async () => {
    setIsLocating(true);
    setLocationError('');
    try {
      await onUseLocation();
    } catch (error) {
      setLocationError(error.message);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="mb-6 bg-white">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          placeholder="Search by name, city, sector etc"
          className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-[#0E1524] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={handleUseLocation}
          disabled={isLocating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#0E1524] text-[#0E1524] rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <Navigation className="h-4 w-4" />
          {isLocating ? 'Getting Location...' : 'Use My Location'}
    </button>
        {locationError && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, isSelected }) => {
  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-3 mb-3 hover:shadow-lg transition-shadow ${
      isSelected ? 'ring-2 ring-[#0E1524]' : ''
    }`}>
      <div className="relative h-32 overflow-hidden bg-gray-200 rounded-lg mb-2">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0].path} 
            alt={property.project} 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img 
              src={"/iPropLogo.6ed8e014.svg"} 
              alt={property.project} 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {property.status && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              property.status.toLowerCase().includes('ready') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {property.status}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {property.project}
      </h3>

      <div className="flex items-center text-gray-600 text-xs mb-1">
        <MapPin className="h-3 w-3 mr-1" />
        <span className="line-clamp-1">
          {[property.sector, property.city].filter(Boolean).join(', ')}
        </span>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="text-[#0E1524] font-semibold text-sm">
          {formatPrice(property.minimumPrice)}
        </div>
        {property.bhk && (
          <div className="text-gray-600 text-xs">
            {property.bhk} BHK
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {property.amenities?.slice(0, 3).map((amenity, index) => (
          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function MapComponent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi coordinates
  const [zoom, setZoom] = useState(10);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const lastBoundsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Sample data for testing - coordinates in [lat, lng] format as received from backend
  const sampleProperties = [
    {
      _id: '1',
      project: 'Sample Project 1',
      city: 'New Delhi',
      sector: 'Sector 18',
      coordinates: [28.6139, 77.2090], // [lat, lng] format from backend
      minimumPrice: 5000000,
      bhk: '3',
      status: 'Ready to Move',
      amenities: ['Swimming Pool', 'Gym', 'Park'],
      images: []
    },
    {
      _id: '2',
      project: 'Sample Project 2',
      city: 'Mumbai',
      sector: 'Andheri',
      coordinates: [19.0760, 72.8777], // [lat, lng] format from backend
      minimumPrice: 8000000,
      bhk: '2',
      status: 'Under Construction',
      amenities: ['Gym', 'Security', 'Parking'],
      images: []
    },
    {
      _id: '3',
      project: 'Sample Project 3',
      city: 'Bangalore',
      sector: 'Whitefield',
      coordinates: [12.9698, 77.7500], // [lat, lng] format from backend
      minimumPrice: 3500000,
      bhk: '4',
      status: 'Ready to Move',
      amenities: ['Pool', 'Garden', 'Clubhouse'],
      images: []
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    handleMasterSearch("");
  }, []);

  // Helper function to validate coordinates
  const isValidCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return false;
    }
    const [lat, lng] = coordinates; // Backend sends [lat, lng]
    const isValid = !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180 &&
           lat !== 0 && lng !== 0;
    return isValid;
  };

  // Fetch properties based on map bounds
  const fetchPropertiesByBounds = async (bounds) => {
    if (isSearchMode) return; // Don't fetch by bounds if in search mode
    
    // Check if bounds have actually changed
    if (lastBoundsRef.current &&
        lastBoundsRef.current.neLat === bounds.neLat &&
        lastBoundsRef.current.neLng === bounds.neLng &&
        lastBoundsRef.current.swLat === bounds.swLat &&
        lastBoundsRef.current.swLng === bounds.swLng) {
      return; // Skip if bounds haven't changed
    }
    
    // Update last bounds
    lastBoundsRef.current = bounds;
    
    console.log('Fetching properties for bounds:', bounds);
    setLoading(true);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/searchByBounds`, {
        params: {
          neLat: bounds.neLat,
          neLng: bounds.neLng,
          swLat: bounds.swLat,
          swLng: bounds.swLng
        }
      });
      
      console.log('Properties fetched by bounds:', response.data);
      
      if (response.data && response.data.projects) {
        const validProperties = response.data.projects.filter(property => {
          const isValid = isValidCoordinates(property.coordinates);
          if (!isValid) {
            console.log('Invalid coordinates for property:', property.project, property.coordinates);
          }
          return isValid;
        });
        
        console.log('Valid properties in bounds:', validProperties.length);
        setProperties(validProperties);
      } else {
        console.log('No properties found in bounds');
        setProperties([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching properties by bounds:', err);
      setError('Failed to fetch properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle map bounds change
  const handleBoundsChange = (bounds) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchPropertiesByBounds(bounds);
    }, 500);
  };

  // Handle marker click
  const handleMarkerClick = (property) => {
    console.log('Marker clicked:', property.project);
    if (!isValidCoordinates(property.coordinates)) return;
    
    setSelectedProperty(property);
    const [lat, lng] = property.coordinates; // Backend sends [lat, lng]
    setMapCenter([lat, lng]); // Leaflet expects [lat, lng]
    setZoom(15);
  };

  // Handle property card click
  const handlePropertyClick = (property) => {
    console.log('Property card clicked:', property.project);
    handleMarkerClick(property);
  };

  // Reset search and show all properties
  const handleResetSearch = () => {
    setIsSearchMode(false);
    setProperties(sampleProperties);
    setSelectedProperty(null);
    setMapCenter([28.6139, 77.2090]);
    setZoom(10);
  };

  // Get valid properties for map
  const validPropertiesForMap = properties.filter(property => {
    const isValid = isValidCoordinates(property.coordinates);
    console.log('Property:', property.project, 'Valid coords:', isValid, 'Coords:', property.coordinates);
    return isValid;
  });

  console.log('Total properties:', properties.length);
  console.log('Valid properties for map:', validPropertiesForMap.length);
  console.log('Map center:', mapCenter);
  console.log('Map zoom:', zoom);

  // Get user's current location with retry mechanism
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // Increased timeout to 10 seconds
        maximumAge: 0
      };

      const successCallback = (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      };

      const errorCallback = (error) => {
        let errorMessage = 'Unable to get your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please try again or use the search bar.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage += 'An unknown error occurred. Please try again.';
        }
        
        reject(new Error(errorMessage));
      };

      // Try to get location
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    });
  };

  // Handle use location button click
  const handleUseLocation = async () => {
    try {
      const location = await getUserLocation();
      console.log('User location:', location);
      
      setMapCenter([location.lat, location.lng]);
      setZoom(12);
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/searchByCoordinates`, {
        params: {
          latitude: location.lat,
          longitude: location.lng,
          maxDistance: 5000
        }
      });
      
      if (response.data && response.data.projects) {
        setProperties(response.data.projects);
      } else {
        setProperties([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  };

  // Master search function
  const handleMasterSearch = async (query) => {
    setLoading(true);
    setIsSearchMode(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/search`, {
        params: { q: query }
      });
      
      const searchResults = response.data.data.projects || [];
      
      const validProperties = searchResults.filter(property => {
        return isValidCoordinates(property.coordinates);
      });
      
      console.log('Valid properties found:', validProperties.length);
      setProperties(validProperties);
      
      if (validProperties.length > 0) {
        const firstProperty = validProperties[0];
        const [lat, lng] = firstProperty.coordinates;
        console.log('Setting map center to:', [lat, lng]);
        setMapCenter([lat, lng]);
        setZoom(12);
        } else {
        setError('No properties with valid locations found');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error performing master search:', err);
      setError('Failed to search properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="flex h-screen">
      {/* Property Cards Panel */}
      <div className="w-1/3 pt-64 overflow-y-auto p-4  bg-gray-50 relative">
        {/* Fixed header with solid background */}
        <div className="fixed top-0 left-0 w-1/3 h-32 bg-gray-50 z-10 border-b border-gray-200">
          <div className="px-4 pt-8 bg-white">
            <div className="flex justify-between items-center mb-3 mt-20">
              <h2 className="text-lg font-semibold">Properties ({properties.length})</h2>
            </div>
            <SearchBar 
              onSearch={handleMasterSearch} 
              onUseLocation={handleUseLocation}
            />
          </div>
        </div>

        {/* Content area with padding to account for fixed header */}
        <div className="mt-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E1524]"></div>
        </div>
          ) : error ? (
            <div className="text-red-600 text-center p-4">{error}</div>
          ) : properties.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              {isSearchMode ? 'No properties found matching your search' : 'No properties found in this area'}
                    </div>
          ) : (
            <div className="space-y-2">
              {properties.map((property) => (
                <div 
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  className={`cursor-pointer ${isValidCoordinates(property.coordinates) ? '' : 'opacity-50'}`}
                >
                  <PropertyCard 
                    property={property} 
                    isSelected={selectedProperty?._id === property._id}
                  />
                  {!isValidCoordinates(property.coordinates) && (
                    <div className="text-xs text-red-500 mt-1">
                      Location not available
                    </div>
                  )}
                </div>
              ))}
                </div>
              )}
            </div>
          </div>

      {/* Map Panel */}
      <div className="w-2/3 relative">
        <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow text-xs">
          Center: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)} | 
          Markers: {validPropertiesForMap.length}
        </div>

        {/* Floating Map Search Switch */}
        <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Map Search</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!isSearchMode}
                onChange={(e) => {
                  setIsSearchMode(!e.target.checked);
                  if (!e.target.checked) {
                    const map = document.querySelector('.leaflet-container');
                    if (map) {
                      const leafletMap = map._leaflet_map;
                      if (leafletMap) {
                        const bounds = leafletMap.getBounds();
                        handleBoundsChange({
                          neLat: bounds.getNorthEast().lat,
                          neLng: bounds.getNorthEast().lng,
                          swLat: bounds.getSouthWest().lat,
                          swLng: bounds.getSouthWest().lng
                        });
                      }
                    }
                  }
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            </div>
          <div className="mt-1 text-xs text-gray-500">
            {!isSearchMode ? 'Auto-search while moving map' : 'Using search results'}
          </div>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          key={`${mapCenter[0]}-${mapCenter[1]}-${zoom}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapController center={mapCenter} zoom={zoom} />
          
          {validPropertiesForMap.map((property) => {
            const [lat, lng] = property.coordinates;
            return (
              <Marker
                key={property._id}
                position={[lat, lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(property)
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-[#0E1524]">{property.project}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.city}</p>
                    <p className="text-sm font-medium text-[#0E1524] mb-3">
                      {property.minimumPrice ? `₹${(property.minimumPrice / 100000).toFixed(2)} L` : 'Price on Request'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/property-details/${property._id}`;
                      }}
                      className="w-full bg-[#0E1524] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium"
                    >
                      View Property
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapEvents onBoundsChange={handleBoundsChange} />
        </MapContainer>
      </div>
      </div>
  );
}