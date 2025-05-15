import React from 'react';

// Example property card component that would appear in a listing page
const PropertyCard = ({ property, onClick }) => {
  const handleNavigateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick(property.id || property._id);
    }
  };
  
  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-lg mb-2">{property.title}</h3>
      <p className="text-gray-700 mb-2">{property.price}</p>
      <p className="text-gray-500 mb-4">{property.location}</p>
      
      <div className="flex justify-between items-center">
        <button 
          onClick={handleNavigateClick}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          View on Map
        </button>
        <a href="#" className="text-sm text-blue-500 hover:underline">
          View Details
        </a>
      </div>
    </div>
  );
};

// Example property listing component
const PropertyHighlightExample = () => {
  // Sample properties - in a real app these would come from your data source
  const sampleProperties = [
    { id: '1', title: 'Modern Apartment', price: '₹25,000/month', location: 'Koramangala, Bangalore' },
    { id: '2', title: 'Spacious Villa', price: '₹75,000/month', location: 'HSR Layout, Bangalore' },
    { id: '3', title: 'Studio Apartment', price: '₹15,000/month', location: 'Indiranagar, Bangalore' },
  ];
  
  const handlePropertyMapClick = (propertyId) => {
    console.log("Navigating to property on map:", propertyId);
    
    // Check if the navigation function is available (map component is loaded)
    if (window.navigateToPropertyOnMap) {
      const result = window.navigateToPropertyOnMap(propertyId);
      
      if (result) {
        // Optional: Scroll to the map section if needed
        const mapElement = document.querySelector('.map-container');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        alert('Property location not found on the map');
      }
    } else {
      console.error("Map navigation function not available. Make sure the map component is loaded.");
      alert('Map not loaded yet. Please try again in a moment.');
    }
  };
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onClick={handlePropertyMapClick} 
          />
        ))}
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>Click on "View on Map" to navigate to the property location on the map.</p>
        <p>This example shows how to integrate the map navigation functionality with your property listings.</p>
      </div>
    </div>
  );
};

export default PropertyHighlightExample; 