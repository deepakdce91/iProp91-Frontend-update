import { MapPin, Building, Bed, Bath, MaximizeIcon, Map } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  createMapNavigationHandler, 
  dispatchPropertyCardClick,
  injectPropertyCardStyles 
} from '../../map/utils/PropertyMapNavigation'

export function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [mapError, setMapError] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Inject CSS styles for card highlighting (only once)
  useEffect(() => {
    injectPropertyCardStyles();
  }, []);
  
  // Listen for marker clicks to highlight this card if it matches
  useEffect(() => {
    const handleMarkerClick = (event) => {
      const { propertyId } = event.detail;
      if (propertyId === property._id) {
        // Highlight this card
        setIsHighlighted(true);
        
        // Remove highlight after some time
        setTimeout(() => {
          setIsHighlighted(false);
        }, 3000);
      }
    };
    
    window.addEventListener('property-marker-clicked', handleMarkerClick);
    
    return () => {
      window.removeEventListener('property-marker-clicked', handleMarkerClick);
    };
  }, [property._id]);

  const handleViewDetails = () => {
    navigate(`/property-for-sale/${property._id}`, { state: { property } });
  };

  // Enhanced map navigation handler with zoom animation
  const handleViewOnMap = createMapNavigationHandler(
    property?._id,
    // Success callback
    () => {
      // Clear any previous errors
      setMapError(null);
      
      // Also dispatch the event for better integration
      dispatchPropertyCardClick(property?._id, {
        animatedZoom: true,
        initialZoom: 16,
        finalZoom: 18
      });
      
      // Highlight this card
      setIsHighlighted(true);
      
      // Remove highlight after some time
      setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
    },
    // Error callback
    (errorMessage) => {
      setMapError(errorMessage);
    },
    // Options
    {
      scrollToMap: true,
      maxRetries: 2,
      animatedZoom: true
    }
  );
  
  // Handle click on the entire card
  const handleCardClick = (e) => {
    // If holding Ctrl/Cmd key, navigate to map instead of details
    if (e.ctrlKey || e.metaKey) {
      handleViewOnMap(e);
    } else {
      handleViewDetails();
    }
  };

  // Determine card styling based on highlighted state
  const cardClasses = `w-full max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
    isHighlighted ? 'property-card-highlighted' : ''
  }`;

  return (
    <div 
      className={cardClasses}
      onClick={handleCardClick}
      data-property-id={property?._id}
    >
      <div className="relative h-48">
        <img
          src={"/images/propcat.jpg"}
          className="object-cover rounded-t-lg"
        />
        
        {/* Add map hint overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="text-white text-sm bg-black bg-opacity-60 px-3 py-2 rounded">
            <span>Click to view details</span>
            <br />
            <span className="text-xs">Ctrl+Click to view on map</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{property.overview}</h3>
        <p className="text-sm text-gray-500 mb-2">{property.builder}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{property.address}</span>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{property.bhk} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{property.bhk} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <MaximizeIcon className="w-4 h-4" />
            <span className="text-sm">{property?.area ? property.area : ""}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className='space-x-2'>
            <span className="font-bold text-lg">₹ {property.maximumPrice}</span>
            <span className="text-sm text-gray-500">Onwards</span>
          </div>
          <div className="space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleViewDetails();
              }}
              className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              View Details
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleViewOnMap(e);
              }}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Map className="w-3 h-3 inline-block mr-1" />
              Map
            </button>
          </div>
        </div>
         {/* {property.marketedBy && (
          <p className="text-xs text-gray-500 mt-3">
            Marketed by {property.marketedBy}
          </p>
        )} */}
        {mapError && (
          <p className="text-xs text-red-500 mt-2">{mapError}</p>
        )}
      </div> 
    </div>
  )
}

