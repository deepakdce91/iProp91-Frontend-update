### iProp91 
This repository aims to manage the front of iProp91.

## Map Features

### Property Map Navigation

The map component supports navigating to a specific property location when a property card is clicked. This feature allows users to quickly locate properties on the map.

#### How to Use

1. The map component exposes a global function `navigateToPropertyOnMap(propertyId)` that can be called from anywhere in the application.

2. Example usage in a property card component:

```javascript
const PropertyCard = ({ property }) => {
  const handleViewOnMap = () => {
    if (window.navigateToPropertyOnMap) {
      window.navigateToPropertyOnMap(property.id);
    }
  };
  
  return (
    <div className="property-card">
      <h3>{property.title}</h3>
      <button onClick={handleViewOnMap}>View on Map</button>
    </div>
  );
};
```

3. The function will automatically:
   - Find the property with the matching ID
   - Center the map on the property location
   - Highlight the property with a special marker
   - Return `true` if successful, `false` if the property wasn't found

4. For a complete implementation example, see `src/Components/map/components/PropertyHighlightExample.jsx`.

### Using the PropertyMapNavigation Utility

For a more robust implementation with error handling and retries, you can use the `PropertyMapNavigation` utility:

1. Import the utility functions:

```javascript
import { navigateToPropertyOnMap, createMapNavigationHandler } from '../map/utils/PropertyMapNavigation';
```

2. Simple direct navigation:

```javascript
// Navigate to a property without a click handler
const result = navigateToPropertyOnMap(propertyId);
if (result.success) {
  console.log('Successfully navigated to property on map');
} else {
  console.error('Failed to navigate:', result.error);
}
```

3. Create a click handler with success/error callbacks:

```javascript
// In a React component
const [mapError, setMapError] = useState(null);

const handleViewOnMap = createMapNavigationHandler(
  property._id,
  // Success callback
  () => {
    setMapError(null);
    console.log('Successfully navigated to property');
  },
  // Error callback
  (errorMessage) => {
    setMapError(errorMessage);
  },
  // Options
  {
    scrollToMap: true,
    maxRetries: 2,
    mapContainerSelector: '.map-container'
  }
);

return (
  <div>
    <button onClick={handleViewOnMap}>View on Map</button>
    {mapError && <p className="error">{mapError}</p>}
  </div>
);
```

4. Configuration options:
   - `scrollToMap`: Whether to automatically scroll to the map after navigation (default: `true`)
   - `mapContainerSelector`: CSS selector to find the map container (default: `.map-container, [data-map-container]`)
   - `retryDelay`: Milliseconds to wait before retrying if map isn't loaded (default: `1500`)
   - `maxRetries`: Maximum number of retries if map isn't loaded (default: `2`)