/**
 * AirbnbFetchHelper.js - Utility functions for implementing Airbnb-like map data fetching
 * 
 * This module provides functions for:
 * 1. Efficient bounds-based property fetching
 * 2. Debounced map interaction handling
 * 3. Pagination support for property loading
 * 4. Caching of previously viewed areas
 */

// Cache for storing previously fetched results
const resultsCache = new Map();

/**
 * Generate a unique cache key based on map bounds and filters
 */
const generateCacheKey = (bounds, filters = {}) => {
  if (!bounds) return 'global';
  
  const boundsKey = `${bounds.southWest.lat.toFixed(4)},${bounds.southWest.lng.toFixed(4)},${bounds.northEast.lat.toFixed(4)},${bounds.northEast.lng.toFixed(4)}`;
  const filtersKey = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(',')}`;
      }
      return `${key}=${value}`;
    })
    .join('&');
    
  return `${boundsKey}${filtersKey ? `|${filtersKey}` : ''}`;
};

/**
 * Debounce function to prevent excessive API calls during rapid map movements
 */
const debounce = (fn, delay = 300) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Fetch properties within map bounds with filtering and pagination
 * 
 * @param {Object} apiEndpoint - API endpoint URL
 * @param {Object} bounds - Map bounds (southWest and northEast lat/lng)
 * @param {Object} filters - Property filters
 * @param {String} cursor - Pagination cursor
 * @param {Number} limit - Number of items per page
 * @param {Boolean} useCache - Whether to use cached results
 * @returns {Promise} - Properties data with pagination info
 */
const fetchPropertiesInBounds = async (
  apiEndpoint,
  bounds = null,
  filters = {},
  cursor = null,
  limit = 20,
  useCache = true
) => {
  try {
    // Check cache first (only for initial requests, not for pagination)
    const cacheKey = generateCacheKey(bounds, filters);
    if (useCache && !cursor && resultsCache.has(cacheKey)) {
      console.log('Using cached results for', cacheKey);
      return resultsCache.get(cacheKey);
    }
    
    // Prepare URL and query parameters
    let url = apiEndpoint;
    const queryParams = new URLSearchParams();
    
    // Add bounds parameters if available
    if (bounds) {
      queryParams.append('swLat', bounds.southWest.lat);
      queryParams.append('swLng', bounds.southWest.lng);
      queryParams.append('neLat', bounds.northEast.lat);
      queryParams.append('neLng', bounds.northEast.lng);
    }
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value);
      }
    });
    
    // Add pagination parameters
    queryParams.append('limit', limit);
    if (cursor) {
      queryParams.append('cursor', cursor);
    }
    
    // Make API request
    const response = await fetch(`${url}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the properties to ensure all necessary data is available
    const processedData = {
      properties: data.projects.map(property => ({
        ...property,
        coordinates: property.coordinates && Array.isArray(property.coordinates) && property.coordinates.length === 2
          ? property.coordinates
          : [
              property.latitude || 20.5937 + (Math.random() - 0.5) * 10,
              property.longitude || 78.9629 + (Math.random() - 0.5) * 10
            ]
      })),
      nextCursor: data.nextCursor || null,
      total: data.total || data.projects.length
    };
    
    // Store in cache if this is not a pagination request
    if (!cursor) {
      resultsCache.set(cacheKey, processedData);
    }
    
    return processedData;
  } catch (error) {
    console.error('Error fetching properties in bounds:', error);
    return { properties: [], nextCursor: null, total: 0 };
  }
};

/**
 * Get current visible map bounds from a Leaflet map instance
 */
const getCurrentMapBounds = (map) => {
  if (!map || !map.getBounds) return null;
  
  const bounds = map.getBounds();
  return {
    southWest: {
      lat: bounds.getSouthWest().lat,
      lng: bounds.getSouthWest().lng
    },
    northEast: {
      lat: bounds.getNorthEast().lat,
      lng: bounds.getNorthEast().lng
    }
  };
};

/**
 * Clear the results cache
 */
const clearCache = () => {
  resultsCache.clear();
};

/**
 * Create a debounced version of the fetch function
 */
const debouncedFetch = debounce(fetchPropertiesInBounds, 300);

export {
  fetchPropertiesInBounds,
  debouncedFetch,
  getCurrentMapBounds,
  clearCache,
  generateCacheKey
};
