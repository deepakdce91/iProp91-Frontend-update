/**
 * Utilities for efficient property data fetching based on map interactions
 * Implements Airbnb-like fetching behaviors:
 * 1. Fetches properties only within visible map bounds
 * 2. Implements debouncing for map events
 * 3. Provides cursor-based pagination
 * 4. Includes caching for previously viewed areas
 */

// Cache to store previously fetched results by area
const resultsCache = new Map();

// Key generation for cache based on bounds and filters
const generateCacheKey = (bounds, filters) => {
  const boundsKey = bounds ? 
    `${bounds.southWest.lat.toFixed(4)},${bounds.southWest.lng.toFixed(4)},${bounds.northEast.lat.toFixed(4)},${bounds.northEast.lng.toFixed(4)}` : 
    'noBounds';
  
  const filtersKey = filters ? JSON.stringify(filters) : 'noFilters';
  return `${boundsKey}-${filtersKey}`;
};

// Debounce helper function
const debounce = (fn, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Fetches properties within the specified map bounds with pagination support
 * @param {Object} bounds - Map bounds (southWest and northEast coordinates)
 * @param {Object} filters - Filter criteria for properties
 * @param {String} cursor - Pagination cursor for fetching next batch
 * @param {Number} limit - Number of properties to fetch per request
 * @returns {Promise} - Promise resolving to properties and next cursor
 */
export const fetchPropertiesInBounds = async (bounds, filters = {}, cursor = null, limit = 20) => {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(bounds, filters);
    if (resultsCache.has(cacheKey) && !cursor) {
      console.log('Using cached results for', cacheKey);
      return resultsCache.get(cacheKey);
    }

    // Prepare query parameters
    const queryParams = new URLSearchParams();
    
    // Add map bounds
    if (bounds) {
      queryParams.append('swLat', bounds.southWest.lat);
      queryParams.append('swLng', bounds.southWest.lng);
      queryParams.append('neLat', bounds.northEast.lat);
      queryParams.append('neLng', bounds.northEast.lng);
    }
    
    // Add pagination parameters
    queryParams.append('limit', limit);
    if (cursor) {
      queryParams.append('cursor', cursor);
    }
    
    // Add filters
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType.join(','));
    if (filters.bhk) queryParams.append('bhk', filters.bhk.join(','));
    if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
    if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.city) queryParams.append('city', filters.city);
    
    // Make API request
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/projectDataMaster/inBounds?${queryParams.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process data to ensure all properties have coordinates
    const processedData = {
      properties: data.projects.map(property => ({
        ...property,
        latitude: property.coordinates[0] || 20.5937 + (Math.random() - 0.5) * 10,
        longitude: property.coordinates[1] || 78.9629 + (Math.random() - 0.5) * 10,
        coordinates: property.coordinates && property.coordinates.length === 2 
          ? property.coordinates 
          : [property.latitude || 20.5937 + (Math.random() - 0.5) * 10, 
             property.longitude || 78.9629 + (Math.random() - 0.5) * 10]
      })),
      nextCursor: data.nextCursor || null,
      total: data.total || data.projects.length
    };
    
    // Store in cache if this is the first page
    if (!cursor) {
      resultsCache.set(cacheKey, processedData);
    }
    
    return processedData;
  } catch (error) {
    console.error('Error fetching properties in bounds:', error);
    // Return empty results on error
    return { properties: [], nextCursor: null, total: 0 };
  }
};

/**
 * Creates a debounced version of the fetchPropertiesInBounds function
 * Uses a 300ms delay to prevent excessive API calls during rapid map movement
 */
export const debouncedFetchPropertiesInBounds = debounce(fetchPropertiesInBounds, 300);

/**
 * Loads more properties using pagination cursor
 * @param {String} cursor - Pagination cursor from previous fetch
 * @param {Object} bounds - Current map bounds
 * @param {Object} filters - Current filters
 * @returns {Promise} - Promise resolving to additional properties and next cursor
 */
export const loadMoreProperties = async (cursor, bounds, filters) => {
  if (!cursor) return { properties: [], nextCursor: null, total: 0 };
  return await fetchPropertiesInBounds(bounds, filters, cursor);
};

/**
 * Clears the results cache
 * Call this when filters are changed significantly
 */
export const clearResultsCache = () => {
  resultsCache.clear();
};

/**
 * Gets the current visible bounds from the map object
 * @param {Object} map - Leaflet map object
 * @returns {Object} - Bounds object with southWest and northEast coordinates
 */
export const getCurrentMapBounds = (map) => {
  if (!map) return null;
  
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
