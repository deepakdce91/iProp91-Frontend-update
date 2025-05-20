import axios from 'axios';

// Default empty array for mockProperties
const Properties = [];

// Improved fetch function with proper error handling
async function fetchDataWithParams(url, params) {
  try {
    const response = await axios.get(url, {
      params: params,
    });
    console.log(response)
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty array instead of throwing the error
    return [];
  }
}

export { fetchDataWithParams };

export default Properties; 