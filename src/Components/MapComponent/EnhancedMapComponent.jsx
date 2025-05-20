"use client";

import React, { useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  SquareIcon as SquareFootage,
  Bed,
  MapPin,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CityStateSelector from "../GeneralUi/StateCityCompo";
import { dummyLocations } from "./dummyData";
import { motion, useAnimation } from "framer-motion";

const EnhancedMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom, setZoom] = useState(4);
  const [filteredProperties, setFilteredProperties] = useState(dummyLocations); // Show all properties by default
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null); // State to track hovered property
  const [isPanelExpanded, setIsPanelExpanded] = useState(true); // State to control panel expansion

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchAllProjects`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response) {
  //       const allProjects = await response.data;
  //       setFilteredProperties(allProjects);
  //       // toast.success("projects fetched successfully")
  //       console.log(allProjects);

  //       return;
  //     }
  //     toast.error("Error fetching projects");
  //   };
  //   fetchProjects();
  // }, []);

  // Handle location selection from CityStateSelector
  const handleLocationSelect = (city, state) => {
    // Find the matching location from dummyLocations
    const nearbyProperties = dummyLocations.filter(
      (property) => property.city === city || property.state === state
    );

    // Find coordinates for the selected city
    const selectedProperty = dummyLocations.find(
      (property) => property.city === city
    );

    if (selectedProperty) {
      setMapCenter(selectedProperty.coordinates);
      setZoom(12);
      setShowNoDataMessage(false);
    }

    if (nearbyProperties.length > 0) {
      setFilteredProperties(nearbyProperties);
      setShowNoDataMessage(false);
    } else {
      setFilteredProperties([]);
      setShowNoDataMessage(true);
    }
  };

  // Handle panel drag end
  const handleDragEnd = (_, info) => {
    const threshold = 50;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Fast drag down
    if (velocity > 500) {
      setPanelState("collapsed");
      controls.start("collapsed");
      return;
    }

    // Fast drag up
    if (velocity < -500) {
      setPanelState("expanded");
      controls.start("expanded");
      return;
    }

    // Based on current state and drag distance
    if (panelState === "collapsed") {
      if (offset < -threshold) {
        setPanelState("mid");
        controls.start("mid");
      } else {
        controls.start("collapsed");
      }
    } else if (panelState === "mid") {
      if (offset > threshold) {
        setPanelState("collapsed");
        controls.start("collapsed");
      } else if (offset < -threshold) {
        setPanelState("expanded");
        controls.start("expanded");
      } else {
        controls.start("mid");
      }
    } else if (panelState === "expanded") {
      if (offset > threshold) {
        setPanelState("mid");
        controls.start("mid");
      } else {
        controls.start("expanded");
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map Container with dynamic height based on panel state */}
      <div className={`absolute inset-0 transition-all duration-300 ${!isPanelExpanded ? 'bottom-24' : 'bottom-[40vh]'}`}>
        <Map
          center={mapCenter}
          zoom={zoom}
          onBoundsChanged={({ center, zoom }) => {
            setMapCenter(center);
            setZoom(zoom);
          }}
        >
          {filteredProperties.map((property, index) => (
            <Marker
              key={index}
              width={50}
              anchor={property.coordinates}
              onClick={() => setSelectedLocation(property)}
              onMouseOver={() => setHoveredProperty(property)}
              onMouseOut={() => setHoveredProperty(null)}
            >
              <div className={`p-2 rounded-full ${hoveredProperty === property ? 'bg-black text-white' : 'bg-white'} shadow-lg border-2 border-gray-300`}>
                <svg className="w-4 h-4" viewBox="0 0 16 16" version="1.1">
                  <rect width="16" height="16" id="icon-bound" fill="none" />
                  <polygon points="0,6 0,16 6,16 6,10 10,10 10,16 16,16 16,6 8,0" fill="currentColor" />
                </svg>
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <CityStateSelector 
          setMainCity={(city) => handleLocationSelect(city)}
          setMainState={(state) => handleLocationSelect(null, state)}
          fromGuestForm={false}
        />
      </div>

      {/* Sliding Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isPanelExpanded ? '60%' : '85%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-10"
          style={{ height: '80vh' }}
        >
          {/* Panel Handle */}
          <div 
            className="absolute -top-2 left-0 right-0 flex flex-col items-center cursor-pointer py-4"
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
            {isPanelExpanded ? (
              <ChevronDown className="text-gray-500" />
            ) : (
              <ChevronUp className="text-gray-500" />
            )}
          </div>

          {/* Panel Content */}
          <div className="p-4 mt-8 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {filteredProperties.length} Properties Found
              </h2>
            </div>

            {showNoDataMessage ? (
              <div className="text-center py-6 px-4">
                <p className="text-gray-500 text-sm">
                  No properties available in this location
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProperties.map((property, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${
                      selectedLocation?.id === property.id
                        ? "border-black ring-1 ring-black"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedLocation(property);
                      setMapCenter(property.coordinates);
                      setZoom(12);
                    }}
                    onMouseEnter={() => setHoveredProperty(property)}
                    onMouseLeave={() => setHoveredProperty(null)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 text-sm capitalize">
                        {property.project}
                      </h3>
                      <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                        {property.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-2 capitalize">
                      {property.builder}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-700" />
                        <span>₹{property.minimumPrice}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SquareFootage className="w-3 h-3 text-gray-700" />
                        <span>{property.size} sq.ft</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-gray-700" />
                        <span>{property.bhk} BHK</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-gray-700" />
                        <span>{property.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-gray-700" />
                      <span>
                        {property.city}, {property.state}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {property.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                        >
                          <CheckCircle className="w-2 h-2 mr-1 text-gray-700" />
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMapComponent;
