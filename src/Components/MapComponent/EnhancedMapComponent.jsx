"use client";

import React, { useEffect, useState, useRef } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Search,
  DollarSign,
  SquareIcon as SquareFootage,
  Bed,
  MapPin,
  Calendar,
  CheckCircle,
  CheckSquare,
  HouseIcon,
  House,
  ChevronUp,
} from "lucide-react";
import CityStateSelector from "../GeneralUi/StateCityCompo";
import { toast } from "react-toastify";
import axios from "axios";
import { dummyLocations } from "./dummyData";
import { motion, useAnimation } from "framer-motion";

const EnhancedMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom, setZoom] = useState(4);
  const [filteredProperties, setFilteredProperties] = useState(dummyLocations); // Show all properties by default
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null); // State to track hovered property

  // Panel state management
  const [panelState, setPanelState] = useState("collapsed"); // "collapsed", "mid", "expanded"
  const controls = useAnimation();
  const containerRef = useRef(null);
  const panelRef = useRef(null);

  // Panel position variants
  const panelVariants = {
    collapsed: {
      y: "calc(100% - 130px)",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    mid: {
      y: "50%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    expanded: {
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // Initialize panel position
  useEffect(() => {
    // On desktop (lg screens), always show expanded
    if (window.innerWidth >= 1024) {
      setPanelState("expanded");
      controls.start("expanded");
    } else {
      controls.start("collapsed");
    }

    // Handle resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setPanelState("expanded");
        controls.start("expanded");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controls]);

  // Add this useEffect to properly position the panel within the container
  useEffect(() => {
    const updatePanelConstraints = () => {
      if (containerRef.current && panelRef.current) {
        // Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect();

        // Update panel position and constraints
        panelRef.current.style.width =
          window.innerWidth >= 1024 ? "450px" : "100%";

        panelRef.current.style.height = "85vh";
        panelRef.current.style.maxHeight = `${containerRect.height * 0.9}px`;

        // Update the panel position
        if (window.innerWidth >= 1024) {
          panelRef.current.style.position = "absolute";
          panelRef.current.style.top = "20px";
          panelRef.current.style.right = "20px";
          panelRef.current.style.bottom = "auto";
          panelRef.current.style.left = "auto";
        } else {
          panelRef.current.style.position = "absolute";
          panelRef.current.style.top = "auto";
          panelRef.current.style.right = "0";
          panelRef.current.style.bottom = "0";
          panelRef.current.style.left = "0";
        }
      }
    };

    updatePanelConstraints();
    window.addEventListener("resize", updatePanelConstraints);

    return () => window.removeEventListener("resize", updatePanelConstraints);
  }, []);

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
    <div
      className="relative w-full h-screen overflow-hidden p-3"
      ref={containerRef}
    >
      {/* Map container */}
      <div className="w-full h-full">
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
              <svg className="w-4 h-4" viewBox="0 0 16 16" version="1.1">
                <rect width="16" height="16" id="icon-bound" fill="none" />
                <polygon points="0,6 0,16 6,16 6,10 10,10 10,16 16,16 16,6 8,0" />
              </svg>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Updated property panel that's positioned within the container */}
      <motion.div
        ref={panelRef}
        className="absolute bottom-0 lg:right-[20px] lg:top-[20px] lg:bottom-auto
                 w-full lg:w-[450px] h-[85vh] max-h-[85vh]
                 flex flex-col bg-white shadow-xl 
                 rounded-t-2xl lg:rounded-lg border-t lg:border border-gray-200
                 overflow-hidden z-20"
        initial="collapsed"
        animate={controls}
        variants={panelVariants}
        drag={window.innerWidth >= 1024 ? false : "y"}
        dragConstraints={containerRef}
        dragElastic={0.1}
        dragMomentum={true}
        onDragEnd={handleDragEnd}
      >
        {/* Drag handle - mobile only */}
        <div className="lg:hidden py-4 w-full flex flex-col items-center border-b border-gray-200">
          <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-2" />

          {/* Panel state indicator */}
          <div className="flex items-center text-xs text-gray-500">
            <span>
              {panelState === "collapsed" && (
                <>
                  <ChevronUp className="w-3 h-3 inline mr-1" />
                  Drag up to see {filteredProperties.length} properties
                </>
              )}
              {panelState === "mid" && "Drag for more"}
              {panelState === "expanded" && "View properties"}
            </span>
          </div>
        </div>

        {/* Search section */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Find Properties</h2>
          </div>
          <CityStateSelector
            setMainCity={(city) => handleLocationSelect(city)}
            setMainState={(state) => {}}
            fromGuestForm={false}
          />
        </div>

        {/* Property listing section */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              {filteredProperties.length} Properties Found
            </h3>
          </div>

          {showNoDataMessage ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="bg-gray-100 rounded-full p-3 mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm text-center">
                No properties available in this location
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredProperties.map((property, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer
                            border ${
                              selectedLocation?.id === property.id
                                ? "border-black ring-1 ring-black"
                                : "border-gray-200"
                            }`}
                  onClick={() => {
                    setSelectedLocation(property);
                    setMapCenter(property.coordinates);
                    setZoom(12);
                  }}
                >
                  {/* Property card content (same as before) */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 text-base capitalize mb-1">
                        {property.project}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {property.builder}
                      </p>
                    </div>
                    <span className="text-xs bg-black text-white px-2.5 py-1 rounded-full">
                      {property.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">
                        ₹{property.minimumPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <SquareFootage className="w-4 h-4 text-gray-600" />
                      <span>{property.size} sq.ft</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="w-4 h-4 text-gray-600" />
                      <span>{property.bhk} BHK</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-gray-600" />
                      <span>{property.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {property.city}, {property.state}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        <CheckCircle className="w-3 h-3 mr-1 text-gray-600" />
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
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
    </div>
  );
};

export default EnhancedMapComponent;
