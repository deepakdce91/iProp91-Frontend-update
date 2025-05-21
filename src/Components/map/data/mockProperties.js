import axios from 'axios';

// Default empty array for mockProperties
const Properties = [];

// Improved fetch function with proper error handling
async function fetchDataWithParams(url, params) {
  try {
    // Debug: Log the params to verify they're being sent correctly
    console.log("Sending request with params:", params);
    
    const response = await axios.get(url, {
      params: params,
      // Add a paramsSerializer to ensure complex objects like arrays are properly formatted
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => {
            // Handle arrays specifically (like priceRange)
            if (Array.isArray(value)) {
              return `${key}=${value.join(',')}`;
            }
            // Handle other types of values
            return `${key}=${encodeURIComponent(JSON.stringify(value) === '{}' ? '' : value)}`;
          })
          .join('&');
      }
    });
    
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    
    // Return empty array as fallback
    return [];
  }
}


export { fetchDataWithParams };

export default Properties;