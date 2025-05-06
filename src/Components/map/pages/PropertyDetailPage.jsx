import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// Import PropertyDetails component - using a dynamic import can help with some build issues
import PropertyDetails from '../components/PropertyDetails.jsx';

export default function PropertyDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // First clear any previous errors
    setError(null);
    
    // If we have the property data in location state, use it
    if (location.state?.property) {
      setProperty(location.state.property);
      return; // Exit early if we have data
    } 
    
    // Otherwise fetch it based on the ID in the URL
    if (!id) {
      setError('No property ID provided');
      return;
    }
    
    setLoading(true);
    
    // Try to fetch from your API
    const fetchPropertyData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`https://iprop-api.irentpro.com/api/v1/map-project/${id}`);
        
        if (response.data && response.data.projects && response.data.projects.length > 0) {
          setProperty(response.data.projects);
        } else {
          // If the API doesn't return expected data
          setError('Property not found or data format unexpected');
          // Create a fallback property
          setProperty({
            _id: id,
            title: 'Property Details',
            price: 'Price not available',
            location: 'Location information not available',
            // Ensure all required props are present
            images: [], // Add empty array for images
            features: [], // Add empty array for features
            amenities: [] // Add empty array for amenities
          });
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property data');
        
        // As a fallback, create a placeholder property with the ID
        setProperty({
          _id: id,
          title: 'Property Details',
          price: 'Price not available',
          location: 'Location information not available',
          // Ensure all required props are present
          images: [], // Add empty array for images
          features: [], // Add empty array for features
          amenities: [] // Add empty array for amenities
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPropertyData();
  }, [id, location.state]);
  
  // Handle going back to the property list
  const handleBack = () => {
    navigate('/');
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="p-8 text-center bg-white">
        <div className="w-12 h-12 border-t-2 border-b-2 border-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-800">Loading property details...</p>
      </div>
    );
  }
  
  // Show error state
  if (error && !property) {
    return (
      <div className="p-8 text-center bg-white">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="px-4 py-2 bg-black text-gold-500 rounded hover:bg-gray-900 transition" onClick={handleBack}>
          Back to Properties
        </button>
      </div>
    );
  }
  
  // Only render PropertyDetails when we have property data and not loading
  return (
    <PropertyDetails 
      property={property} 
      onBack={handleBack} 
    />
  );
}
