"use client";

import React, { useEffect, useState } from "react";
import { Map, Marker } from "pigeon-maps";
import {
  Search,
  DollarSign,
  SquareIcon as SquareFootage,
  Bed,
  MapPin,
  CheckCircle,
  CheckSquare,
} from "lucide-react";
import CityStateSelector from "../GeneralUi/StateCityCompo";
import { toast } from "react-toastify";
import axios from "axios";
import { dummyLocations } from "./dummyData";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const EnhancedMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(4);
  const [filteredProperties, setFilteredProperties] = useState(dummyLocations);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [drawerState, setDrawerState] = useState("collapsed"); // "collapsed", "partial", or "expanded"

  // Initial position will be at the bottom with just the header showing
  const y = useMotionValue(0);

  // Transform values based on drag position
  const borderRadius = useTransform(
    y,
    [0, -200],
    [24, 8] // Border radius decreases as drawer expands
  );

  // Handle drawer drag end to determine final position
  const handleDragEnd = (_, info) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // If dragged up with sufficient velocity or distance
    if (velocity < -500 || offset < -100) {
      // Expand the drawer
      y.set(-300);
      setDrawerState("expanded");
    }
    // If dragged down with sufficient velocity or distance
    else if (velocity > 500 || offset > 100) {
      // Collapse the drawer
      y.set(0);
      setDrawerState("collapsed");
    }
    // If not dragged enough in either direction, snap to previous state
    else {
      if (drawerState === "expanded") {
        y.set(-300);
      } else {
        y.set(0);
      }
    }
  };

  const handleLocationSelect = (city, state) => {
    const nearbyProperties = dummyLocations.filter(
      (property) => property.city === city || property.state === state
    );
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

  // Handle drawer open when user clicks on the header
  const handleDrawerHeaderClick = () => {
    if (drawerState === "expanded") {
      y.set(0);
      setDrawerState("collapsed");
    } else {
      y.set(-300);
      setDrawerState("expanded");
    }
  };

  return (
    <div className="relative w-full px-3 overflow-hidden">
      <div className="w-full h-[90vh] rounded-xl">
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

      <motion.div
        drag="y"
        dragConstraints={{ top: -100, bottom: 200 }}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        initial={{ y: 0 }}
        style={{
          y,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
        className="absolute bottom-0 left-0 right-0 w-full bg-white shadow-xl rounded-t-xl max-h-[90vh] overflow-hidden"
      >
        <div
          className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 cursor-pointer"
          onClick={handleDrawerHeaderClick}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-900">
                Find Properties
              </h2>
            </div>
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
          </div>
          <CityStateSelector
            setMainCity={(city) => handleLocationSelect(city)}
            setMainState={(state) => {}}
            fromGuestForm={false}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 max-h-[60vh]">
          <div className="flex justify-between items-center px-2 py-3">
            <h3 className="text-sm font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h3>
            {filteredProperties.length > 0 && (
              <span className="text-xs text-gray-500">Scroll to see more</span>
            )}
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
                      <DollarSign className="w-3 h-3 text-gray-700 capitalize" />
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
    </div>
  );
};

export default EnhancedMapComponent;
