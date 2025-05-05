import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import SearchBar from "./searchbar"; // Import the SearchBar component

// Fix for default marker icon issue with webpack/vite
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- End of fix ---

function MapComponent({ properties, center, zoom = 10 }) {
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleSearch = (searchTerm) => {
    const filtered = properties.filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  return (
    <div className="h-full w-full">
      <SearchBar onSearch={handleSearch} />
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredProperties.map(
          (property) =>
            property.coordinates && ( // Check if coordinates exist
              <Marker
                key={property._id}
                position={[
                  property.coordinates.latitude,
                  property.coordinates.longitude,
                ]}
              >
                <Popup>
                  <div className="text-sm">
                    <img
                      src={property.images?.[0] || "/dummy-image.png"}
                      alt={property.title}
                      className="w-full h-16 object-cover mb-1 rounded"
                    />
                    <h4 className="font-semibold">
                      {property.title || "Property"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {property.location || "Location"}
                    </p>
                    <p className="text-xs font-bold">
                      {property.price || "Price on request"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
