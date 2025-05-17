import React, { useState, useEffect, useCallback } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { fetchPropertiesInBounds, debouncedFetch, getCurrentMapBounds, clearCache } from '../utils/AirbnbFetchHelper';

/**
 * Component that handles map bounds changes and implements Airbnb-like property fetching
 * 
 * Features:
 * - Fetches properties only within visible map bounds
 * - Debounced fetching on map pan/zoom to prevent excessive API calls
 * - Support for "Search as I move the map" toggle
 * - Pagination for loading more properties
 */
const MapBoundsHandler = ({ 
  apiEndpoint, 
  filters, 
  searchAsIMove = true, 
  onBoundsChange, 
  onPropertiesFetched,
  onLoadingStateChange
}) => {
  const map = useMap();
  const [isFetching, setIsFetching] = useState(false);
  const [lastCursor, setLastCursor] = useState(null);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  
  // Function to fetch properties based on current map bounds
  const fetchPropertiesForCurrentBounds = useCallback(async (isLoadMore = false) => {
    if (!map || (!isLoadMore && isFetching)) return;
    
    try {
      setIsFetching(true);
      if (onLoadingStateChange) onLoadingStateChange(true);
      
      const bounds = getCurrentMapBounds(map);
      
      // Notify parent component about bounds change
      if (onBoundsChange) {
        onBoundsChange(bounds);
      }
      
      // Determine which API call to make based on whether we're loading more
      let result;
      if (isLoadMore && lastCursor) {
        // Load next page using cursor
        result = await fetchPropertiesInBounds(
          apiEndpoint,
          bounds, 
          filters, 
          lastCursor,
          20,
          false // Don't use cache for pagination
        );
      } else {
        // Initial fetch or bounds/filter change
        result = await fetchPropertiesInBounds(
          apiEndpoint,
          bounds, 
          filters,
          null, 
          20,
          true // Use cache if available
        );
      }
      
      // Process results
      const { properties, nextCursor, total } = result;
      
      // Update pagination state
      setLastCursor(nextCursor);
      setHasMoreProperties(!!nextCursor);
      
      // Notify parent component about properties
      if (onPropertiesFetched) {
        onPropertiesFetched(properties, isLoadMore, total);
      }
      
      setIsInitialFetch(false);
    } catch (error) {
      console.error('Error fetching properties for bounds:', error);
    } finally {
      setIsFetching(false);
      if (onLoadingStateChange) onLoadingStateChange(false);
    }
  }, [map, apiEndpoint, filters, isFetching, lastCursor, onBoundsChange, onPropertiesFetched, onLoadingStateChange]);
  
  // Handle initial load and filter changes
  useEffect(() => {
    if (!map) return;
    
    if (isInitialFetch || filters) {
      // Reset pagination on initial load or filter changes
      setLastCursor(null);
      setHasMoreProperties(true);
      
      // Clear cache when filters change
      if (!isInitialFetch) {
        clearCache();
      }
      
      // Fetch properties
      fetchPropertiesForCurrentBounds();
    }
  }, [map, filters, fetchPropertiesForCurrentBounds, isInitialFetch]);
  
  // Set up map event listeners for bounds changes
  useMapEvents({
    moveend: () => {
      // Only fetch on moveend if searchAsIMove is enabled
      if (searchAsIMove) {
        debouncedFetch(
          apiEndpoint,
          getCurrentMapBounds(map), 
          filters
        ).then(result => {
          if (onPropertiesFetched) {
            onPropertiesFetched(result.properties, false, result.total);
          }
          setLastCursor(result.nextCursor);
          setHasMoreProperties(!!result.nextCursor);
        });
      }
    },
    zoomend: () => {
      // Always fetch on zoom changes as this impacts the granularity of results
      if (searchAsIMove) {
        debouncedFetch(
          apiEndpoint,
          getCurrentMapBounds(map), 
          filters
        ).then(result => {
          if (onPropertiesFetched) {
            onPropertiesFetched(result.properties, false, result.total);
          }
          setLastCursor(result.nextCursor);
          setHasMoreProperties(!!result.nextCursor);
        });
      }
    }
  });
  
  // Expose methods to parent component through ref
  useEffect(() => {
    if (!map) return;
    
    // Add methods to map instance for external access
    map.loadMoreProperties = () => {
      if (hasMoreProperties && !isFetching) {
        fetchPropertiesForCurrentBounds(true);
        return true;
      }
      return false;
    };
    
    map.searchThisArea = () => {
      setLastCursor(null);
      fetchPropertiesForCurrentBounds();
    };
    
    map.getHasMoreProperties = () => hasMoreProperties;
    
    return () => {
      // Clean up when unmounted
      delete map.loadMoreProperties;
      delete map.searchThisArea;
      delete map.getHasMoreProperties;
    };
  }, [map, hasMoreProperties, isFetching, fetchPropertiesForCurrentBounds]);
  
  return null; // This component doesn't render anything
};

export default MapBoundsHandler;
