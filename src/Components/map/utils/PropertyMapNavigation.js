/**
 * Utility functions for navigating to property locations on the map
 */

/**
 * Navigates to a property on the map using the global navigateToPropertyOnMap function
 * 
 * @param {string} propertyId - The ID of the property to navigate to
 * @param {object} options - Optional configuration options
 * @param {boolean} options.scrollToMap - Whether to scroll to the map container after navigation
 * @param {string} options.mapContainerSelector - CSS selector for the map container
 * @param {number} options.retryDelay - Delay in ms before retrying if map function not available
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {boolean} options.animatedZoom - Whether to use enhanced zoom animation
 * @param {number} options.initialZoom - Initial zoom level for animated zoom
 * @param {number} options.finalZoom - Final zoom level for animated zoom 
 * @returns {object} - Result object with success status and error message if applicable
 */
export const navigateToPropertyOnMap = (propertyId, options = {}) => {
  const {
    scrollToMap = true,
    mapContainerSelector = '.map-container, [data-map-container]',
    retryDelay = 1500,
    maxRetries = 2,
    animatedZoom = true,
    initialZoom = 16,
    finalZoom = 18
  } = options;
  
  // Default result object
  const result = {
    success: false,
    error: null
  };
  
  // Validate property ID
  if (!propertyId) {
    result.error = "Property ID not provided";
    return result;
  }
  
  // Check if map navigation function is available
  if (typeof window.navigateToPropertyOnMap !== 'function') {
    console.warn("Map navigation function not available. Make sure the map component is loaded.");
    result.error = "Map navigation not available";
    
    // If retries are allowed, set up retry
    if (maxRetries > 0) {
      setTimeout(() => {
        // Try again with one less retry
        return navigateToPropertyOnMap(propertyId, {
          ...options,
          maxRetries: maxRetries - 1
        });
      }, retryDelay);
    }
    
    return result;
  }
  
  // Try to navigate to the property on the map
  try {
    // Pass the zoom animation options to the navigation function
    const navigationSuccess = window.navigateToPropertyOnMap(propertyId, {
      animatedZoom,
      initialZoom,
      finalZoom
    });
    
    if (navigationSuccess) {
      result.success = true;
      
      // If we should scroll to the map, find the container and scroll to it
      if (scrollToMap) {
        const mapContainer = document.querySelector(mapContainerSelector);
        if (mapContainer) {
          mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          console.warn("Map container not found with selector:", mapContainerSelector);
        }
      }
    } else {
      result.error = "Property location not found on map";
    }
  } catch (error) {
    console.error("Error navigating to property on map:", error);
    result.error = "Error navigating to property";
  }
  
  return result;
};

/**
 * Creates an event handler function for navigating to a property on the map
 * 
 * @param {string} propertyId - The ID of the property to navigate to
 * @param {function} onSuccess - Callback function called on successful navigation
 * @param {function} onError - Callback function called on navigation error
 * @param {object} options - Additional options to pass to navigateToPropertyOnMap
 * @returns {function} - Event handler function
 */
export const createMapNavigationHandler = (propertyId, onSuccess, onError, options = {}) => {
  return (event) => {
    // Prevent default behavior and stop propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Navigate to the property on the map
    const result = navigateToPropertyOnMap(propertyId, options);
    
    // Call the appropriate callback based on the result
    if (result.success) {
      if (typeof onSuccess === 'function') {
        onSuccess(result);
      }
    } else {
      if (typeof onError === 'function') {
        onError(result.error);
      }
    }
    
    return result;
  };
};

/**
 * Sets up global event listeners to synchronize property cards and map markers
 * Call this function once when your app initializes
 * 
 * @returns {function} - Cleanup function to remove listeners
 */
export const setupPropertyCardMapIntegration = () => {
  // Create a custom event that property cards can dispatch
  const handlePropertyCardClick = (event) => {
    const { propertyId } = event.detail;
    if (propertyId && typeof window.navigateToPropertyOnMap === 'function') {
      window.navigateToPropertyOnMap(propertyId);
    }
  };
  
  // Create a custom event that map markers can dispatch
  const handleMarkerClick = (event) => {
    const { propertyId } = event.detail;
    if (propertyId) {
      // Find and highlight the property card
      const propertyCard = document.querySelector(`[data-property-id="${propertyId}"]`);
      if (propertyCard) {
        // Scroll the card into view
        propertyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a highlight effect
        propertyCard.classList.add('property-card-highlighted');
        
        // Remove the highlight after a delay
        setTimeout(() => {
          propertyCard.classList.remove('property-card-highlighted');
        }, 2000);
      }
    }
  };
  
  // Listen for property card clicks
  window.addEventListener('property-card-clicked', handlePropertyCardClick);
  
  // Listen for marker clicks
  window.addEventListener('property-marker-clicked', handleMarkerClick);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('property-card-clicked', handlePropertyCardClick);
    window.removeEventListener('property-marker-clicked', handleMarkerClick);
  };
};

/**
 * Helper function to dispatch a property card click event with zoom options
 * 
 * @param {string} propertyId - The ID of the property that was clicked
 * @param {object} options - Optional zoom animation options
 * @param {boolean} options.animatedZoom - Whether to use animated zoom
 * @param {number} options.initialZoom - Initial zoom level
 * @param {number} options.finalZoom - Final zoom level
 */
export const dispatchPropertyCardClick = (propertyId, options = {}) => {
  if (!propertyId) return;
  
  const event = new CustomEvent('property-card-clicked', {
    detail: { 
      propertyId,
      zoomOptions: options
    }
  });
  
  window.dispatchEvent(event);
};

// Add some CSS to your app for the highlighted property card effect
// You can either inject this or include it in your CSS file
export const injectPropertyCardStyles = () => {
  const styleId = 'property-card-map-styles';
  
  // Only add if not already present
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .property-card-highlighted {
        box-shadow: 0 0 0 3px #4285F4, 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        transform: translateY(-4px);
        transition: all 0.3s ease-in-out;
      }
      
      @keyframes pulse-border {
        0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
        100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
      }
    `;
    
    document.head.appendChild(style);
  }
}; 