import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaHome, FaLocationArrow, FaUser } from 'react-icons/fa';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Custom marker icon
const createCustomIcon = (price) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-content">₹${price}</div>`,
    iconSize: [50, 30],
  });
};

// Custom user location icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-location-pulse-container">
        <div class="user-location-outer-circle"></div>
        <div class="user-location-middle-circle"></div>
        <div class="user-location-inner-dot"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to handle map events with debounce
const MapEvents = ({ setMapBounds }) => {
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const map = useMapEvents({
    movestart: () => {
      setIsLoading(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    moveend: () => {
      // Clear any existing timeout to reset the timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout that will trigger after 1 second
      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        setMapBounds({
          ne: [bounds._northEast.lat, bounds._northEast.lng],
          sw: [bounds._southWest.lat, bounds._southWest.lng]
        });
        setIsLoading(false);
      }, 1000);
    }
  });
  
  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <>
      {isLoading && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow-md z-[1000] flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
          <span className="text-sm font-medium">Loading...</span>
        </div>
      )}
    </>
  );
};

// Component to update map center when prop changes
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

// Map Controls
const MapControls = ({ userLocation, centerOnUserLocation }) => {
  const map = useMap();
  const [locationClicked, setLocationClicked] = useState(false);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleCenterOnUserLocation = () => {
    centerOnUserLocation();
    
    // Visual feedback when clicked
    setLocationClicked(true);
    setTimeout(() => {
      setLocationClicked(false);
    }, 1000);
  };

  return (
    <div className="absolute right-2.5 top-2.5 z-[1000] flex flex-col gap-2.5">
      <button 
        className={`w-12 h-12 flex items-center justify-center ${locationClicked ? 'bg-blue-500 text-white' : 'bg-white'} border ${userLocation ? 'border-blue-500' : 'border-gray-300'} rounded-lg shadow-md text-lg cursor-pointer hover:bg-blue-50 transition-all ${locationClicked ? 'animate-pulse' : ''}`}
        onClick={handleCenterOnUserLocation}
        title="Go to your location"
      >
        <FaLocationArrow className={userLocation ? (locationClicked ? "text-white" : "text-blue-500") : ""} size={20} />
      </button>
      <button 
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md text-lg cursor-pointer hover:scale-105 transition-transform" 
        onClick={handleZoomIn}
        title="Zoom in"
      >
        +
      </button>
      <button 
        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md text-lg cursor-pointer hover:scale-105 transition-transform" 
        onClick={handleZoomOut}
        title="Zoom out"
      >
        -
      </button>
    </div>
  );
};

// Property popup component
const PropertyPopup = ({ property }) => {
  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <img 
        src={property.images[0]} 
        alt={property.title}
        className="w-full h-[150px] object-cover" 
      />
      <div className="p-3">
        <h3 className="text-base font-medium mb-2">{property.title}</h3>
        <div className="flex justify-between">
          <p className="text-sm">{property.type} in {property.location}</p>
          <p className="text-sm font-semibold">{property.pricePerNight}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Map = ({ properties, selectedProperty, setSelectedProperty, mapCenter, setMapCenter, setMapBounds }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [useUserLocationOnLoad, setUseUserLocationOnLoad] = useState(
    localStorage.getItem("useUserLocationOnLoad") !== "false" // Default to true
  );
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  
  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            console.log("User location obtained:", userCoords);
            setUserLocation(userCoords);
          
            // Center on user's location when component first loads if the preference is enabled
            if (useUserLocationOnLoad) {
              console.log("Centering on user location on initial load:", userCoords);
              setMapCenter(userCoords);
            }
          
            setShowUserLocation(true);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setLocationError(error.message);
            
            // Show more specific error messages based on error code
            let errorMsg = "Unable to get your location.";
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg += " Please enable location services in your browser settings.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg += " Location information is unavailable. Try again later.";
                break;
              case error.TIMEOUT:
                errorMsg += " The request to get your location timed out.";
                break;
              default:
                errorMsg += " Please enable location services and try again.";
            }
            alert(errorMsg);
          },
          {
            enableHighAccuracy: true,  // Request high accuracy
            timeout: 10000,            // Wait for 10 seconds max
            maximumAge: 0              // Don't use cached position
          }
        );
    }
  }, [useUserLocationOnLoad]);
  
  // Function to center map on user location
  const centerOnUserLocation = () => {
    console.log("centerOnUserLocation called, userLocation:", userLocation);
    
    if (userLocation) {
      console.log("Setting map center to user location:", userLocation);
      // Force a higher zoom level when centering on user location
      setMapCenter(userLocation);
      
      // Update the map view using the ref if available
      if (mapRef.current) {
        console.log("Directly setting view on map instance");
        mapRef.current.setView(userLocation, 15);
      }
      
      // Store user preference to center on their location
      setUseUserLocationOnLoad(true);
      localStorage.setItem("useUserLocationOnLoad", "true");
    } else {
      console.error("Can't center on user location - location not available");
      alert("Unable to get your location. Please enable location services and try again.");
      
      // Try to get the location again
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            console.log("User location obtained on retry:", userCoords);
            setUserLocation(userCoords);
            setMapCenter(userCoords);
            setShowUserLocation(true);
          },
          (error) => {
            console.error("Error getting user location on retry:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    }
  };
  
  // Add CSS for the user location marker
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .user-location-pulse-container {
        position: relative;
        width: 30px;
        height: 30px;
      }
      
      .user-location-outer-circle {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(37, 99, 235, 0.2);
        opacity: 0.8;
        animation: pulse 2s infinite;
      }
      
      .user-location-middle-circle {
        position: absolute;
        left: 5px;
        top: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(37, 99, 235, 0.4);
      }
      
      .user-location-inner-dot {
        position: absolute;
        left: 10px;
        top: 10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgb(37, 99, 235);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        border: 1px solid white;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.8;
        }
        70% {
          transform: scale(1.5);
          opacity: 0;
        }
        100% {
          transform: scale(0.8);
          opacity: 0;
        }
      }
    `;
    
    // Append style element to the document head
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={mapCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Array.isArray(properties) && properties.map(property => (
          <Marker 
            key={property.id} 
            position={property.coords}
            icon={createCustomIcon(property.price)}
            eventHandlers={{
              click: () => setSelectedProperty(property)
            }}
          />
        ))}
        
        {showUserLocation && userLocation && (
          <Marker 
            position={userLocation}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="flex items-center gap-2 p-1">
                <FaUser className="text-blue-500" />
                <span className="font-medium">Your location</span>
              </div>
            </Popup>
          </Marker>
        )}
        
        <ChangeMapView center={mapCenter} />
        <MapEvents setMapBounds={setMapBounds} />
        <MapControls userLocation={userLocation} centerOnUserLocation={centerOnUserLocation} />
      </MapContainer>
      
      {/* Property popup when selected */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[300px] bg-white rounded-xl shadow-lg overflow-hidden z-[1000]">
            <PropertyPopup property={selectedProperty} />
            <button 
              className="absolute top-2.5 right-2.5 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md border-none text-xl cursor-pointer"
              onClick={() => setSelectedProperty(null)}
            >
              &times;
            </button>
          </div>
        )}
      </AnimatePresence>
      
      {locationError && (
        <div className="absolute bottom-5 left-5 bg-white p-3 rounded-lg shadow-md z-[1000]">
          <p className="text-red-500">Location error: {locationError}</p>
        </div>
      )}
    </div>
  );
};

export default Map; 