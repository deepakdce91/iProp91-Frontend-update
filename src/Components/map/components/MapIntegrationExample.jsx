import React, { useState, useEffect } from 'react';
import MapComponent from './mapComponent';
import { PropertyCard } from '../../listingpage/components/property-card';
import '../../map/utils/MapIntegrationInit'; // Import to initialize the integration

/**
 * Example component showing the integration between property cards and map
 */
const MapIntegrationExample = () => {
  const [sampleProperties, setSampleProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading properties from an API
  useEffect(() => {
    // Sample property data
    const properties = [
      {
        _id: 'prop1',
        overview: 'Luxury Apartment',
        builder: 'Premium Builders',
        address: 'Green Park, New Delhi',
        bhk: '3',
        area: '1500 sq.ft',
        maximumPrice: '75,000',
        coordinates: [28.5621, 77.2040]
      },
      {
        _id: 'prop2',
        overview: 'Spacious Villa',
        builder: 'Prestige Homes',
        address: 'Vasant Kunj, New Delhi',
        bhk: '4',
        area: '2500 sq.ft',
        maximumPrice: '1,25,000',
        coordinates: [28.5266, 77.1534]
      },
      {
        _id: 'prop3',
        overview: 'Modern Studio',
        builder: 'Urban Living',
        address: 'Connaught Place, New Delhi',
        bhk: '1',
        area: '800 sq.ft',
        maximumPrice: '45,000',
        coordinates: [28.6304, 77.2177]
      }
    ];
    
    // Set properties in state
    setSampleProperties(properties);
    
    // Also set them in the window for the map component to use
    window.mapProperties = properties;
    
    // Simulate API loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Map Integration Example</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: Property cards */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Property Listings</h2>
          <p className="text-sm text-gray-600 mb-4">
            Click on a property card to view details. Use Ctrl+Click or the Map button to see it on the map.
          </p>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sampleProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
        
        {/* Right side: Map */}
        <div className="w-full md:w-2/3 h-[600px] border rounded-lg overflow-hidden map-container" data-map-container>
          <MapComponent />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Property cards can navigate to their locations on the map.</li>
          <li>The map component can highlight the corresponding property card when markers are clicked.</li>
          <li>This integration works across different components and pages.</li>
          <li>Try clicking on markers in the map to see the cards highlight.</li>
        </ul>
      </div>
    </div>
  );
};

export default MapIntegrationExample; 