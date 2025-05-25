import React from 'react';
import PropertyCard from './propertycard'; // Adjust the import path as needed
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Set up a default number of skeleton loaders to show while loading
const NUM_SKELETONS = 4;

function PropertyList({ properties, setSelectedProperty, isLoading }) {
  // Log the properties to check if they're being received properly
  console.log("PropertyList received properties:", properties);

  return (
    <div className="space-y-4">
      {isLoading ? (
        // Show skeleton loaders when loading
        Array(NUM_SKELETONS).fill().map((_, index) => (
          <div key={`skeleton-${index}`} className="mb-4">
            <Skeleton height={260} />
          </div>
        ))
      ) : properties && properties.length > 0 ? (
        // Map through properties to display PropertyCards
        properties.map((property) => (
          <div key={property.id || property._id || `prop-${Math.random()}`} className="mb-4">
            <PropertyCard 
              property={property} 
              onSelect={() => setSelectedProperty(property)} 
            />
          </div>
        ))
      ) : (
        // Show message when no properties are found
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No properties found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or try a different location.
          </p>
        </div>
      )}
    </div>
  );
}

export default PropertyList;