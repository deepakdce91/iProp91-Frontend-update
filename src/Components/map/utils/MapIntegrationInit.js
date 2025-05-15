import { setupPropertyCardMapIntegration, injectPropertyCardStyles } from './PropertyMapNavigation';

/**
 * Initialize the property card map integration
 * This will:
 * 1. Set up event listeners for property card clicks
 * 2. Set up event listeners for map marker clicks
 * 3. Inject CSS styles for property card highlighting
 */
export function initializeMapIntegration() {
  console.log("Initializing property card map integration...");
  
  // Inject CSS styles
  injectPropertyCardStyles();
  
  // Set up event listeners and store the cleanup function
  const cleanup = setupPropertyCardMapIntegration();
  
  // Add a debug helper to window for troubleshooting
  window.__mapIntegrationInitialized = true;
  
  // Return the cleanup function for use during app unmount if needed
  return cleanup;
}

// Auto-initialize when this module is imported
// This makes it simple to add the integration by just importing this file once
const cleanup = initializeMapIntegration();

// If we ever need to manually clean up (usually not needed in a single-page app)
export function cleanupMapIntegration() {
  if (typeof cleanup === 'function') {
    cleanup();
    window.__mapIntegrationInitialized = false;
  }
} 