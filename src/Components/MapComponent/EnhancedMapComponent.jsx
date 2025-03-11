"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import CityStateSelector from "../GeneralUi/StateCityCompo";
import { toast } from "react-toastify";
import axios from "axios";
import { dummyLocations } from "./dummyData";

const EnhancedMapComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom, setZoom] = useState(4);
  const [filteredProperties, setFilteredProperties] = useState(dummyLocations); // Show all properties by default
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null); // State to track hovered property

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

  return (
    <div className="relative w-full px-3 ">
      {/* Full width map with fixed height */}
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
              onMouseOver={() => setHoveredProperty(property)} // Set hovered property on mouse over
              onMouseOut={() => setHoveredProperty(null)} // Clear hovered property on mouse out
            >
              {/* <House className="w-7 h-7  text-gray-700" /> */}
              <svg className="w-4 h-4"
                viewBox="0 0 16 16"
                version="1.1"
              >
                <rect width="16" height="16" id="icon-bound" fill="none" />
                <polygon points="0,6 0,16 6,16 6,10 10,10 10,16 16,16 16,6 8,0" />
              </svg>
            </Marker>
          ))}
        </Map>
      </div>

      {/* Tooltip for hovered property */}
      {hoveredProperty && (
        <div
          className="absolute bg-white p-2 rounded shadow-lg"
          style={{
            left: `${hoveredProperty.coordinates[1]}px`, // Adjust position based on coordinates
            top: `${hoveredProperty.coordinates[0]}px`, // Adjust position based on coordinates
          }}
        >
          <h3 className="font-semibold">{hoveredProperty.name}</h3>
          <p>Price: ₹{hoveredProperty.price}</p>
          <p>
            Location: {hoveredProperty.city}, {hoveredProperty.state}
          </p>
        </div>
      )}

      {/* Absolute positioned search and property panel */}
      <div className="absolute top-4 right-4 w-96 max-h-[calc(90vh-32px)] flex flex-col bg-white/95 shadow-xl rounded-lg  border border-gray-200 overflow-y-scroll">
        {/* Search section */}
        <div className="p-4 border-b border-gray-200">
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
        <div className="flex-1 overflow-y-auto p-2">
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
                  className={`bg-white border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer  ${
                    selectedLocation?.id === property.id
                      ? "border-black ring-1 ring-black"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedLocation(property);
                    setMapCenter(property.coordinates); // Move map to the selected property's coordinates
                    setZoom(12); // Set zoom to maximum for the selected location
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
      </div>

      {/* No Data Message */}
      {/* {showNoDataMessage && (
        <div className="absolute top-20 left-4 z-10 bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-900 text-sm flex items-center">
            <Search className="w-4 h-4 mr-2 text-gray-700" />
            No properties found in this location
          </p>
        </div>
      )} */}
    </div>
  );
};

export default EnhancedMapComponent;
