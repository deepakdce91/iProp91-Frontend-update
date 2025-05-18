import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import './style.css';
import Header from './components/Header';
import PropertyNav from './components/PropertyNav';
import PropertyList from './components/PropertyList';
import PropertyDetails from './components/PropertyDetails';
import Map from './components/Map';
import FiltersModal from './components/FiltersModal';
import { fetchDataWithParams } from './data/mockProperties';

// Main Home component with property listings and map
function Home() {
  // Initialize properties as an empty array to prevent the "properties.map is not a function" error
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.4595, 77.0266]); // Gurgaon coordinates
  const [mapBounds, setMapBounds] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const fetchingRef = useRef(false); // Ref to track ongoing fetch operations
  const retryCountRef = useRef(0); // Ref to track retry count

  const url = `${process.env.REACT_APP_BACKEND_URL || 'https://iprop91new.onrender.com'}/api/projectDataMaster`;
  const params = filters;
  const MAX_RETRIES = 3;

  // When map bounds change, fetch properties for that area
  useEffect(() => {
    if (mapBounds) {
      fetchPropertiesInBounds();
    }
  }, [mapBounds, filters]);
  
  const fetchPropertiesInBounds = async (retryCount = 0) => {
    // If already fetching, don't start another fetch
    if (fetchingRef.current) {
      console.log("Fetch already in progress, skipping this request");
      return;
    }
    
    fetchingRef.current = true;
    setIsLoading(true);
    console.log(`Starting fetch attempt ${retryCount + 1}`);

    try {
      // Try to fetch real data
      const fetchedProperties = await fetchDataWithParams(url, params);
      console.log("Fetch response:", fetchedProperties);
  
      if (fetchedProperties && fetchedProperties.data && Array.isArray(fetchedProperties.data)) {
        console.log("Fetch successful, data is array:", fetchedProperties.data.length);
        setProperties(fetchedProperties.data);
        retryCountRef.current = 0; 
      } else if (fetchedProperties && Array.isArray(fetchedProperties)) {
        console.log("Fetch successful, data is root array:", fetchedProperties.length);
        setProperties(fetchedProperties);
        retryCountRef.current = 0; 
      } else {
        console.error("API response is not in expected format:", fetchedProperties);
        
        if (retryCount < MAX_RETRIES) {
          const nextRetryDelay = Math.pow(2, retryCount) * 1000; 
          console.log(`Retrying in ${nextRetryDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          
          setTimeout(() => {
            fetchingRef.current = false; 
            fetchPropertiesInBounds(retryCount + 1);
          }, nextRetryDelay);
          return; 
        } else {
          console.warn("Max retries reached, using fallback data");
          loadFallbackData();
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      
      // If retry count hasn't reached max, retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const nextRetryDelay = Math.pow(2, retryCount) * 1000;
        console.log(`Fetch failed. Retrying in ${nextRetryDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setTimeout(() => {
          fetchingRef.current = false; // Reset fetching flag before retry
          fetchPropertiesInBounds(retryCount + 1);
        }, nextRetryDelay);
        return; // Return early to keep isLoading true during retry
      } else {
        // Max retries reached, use dummy data instead
        console.warn("Max retries reached after errors, using fallback data");
        loadFallbackData();
      }
    } finally {
      // Only reset loading and fetching flags if we're not planning to retry
      if (retryCount >= MAX_RETRIES || 
          (fetchingRef.current && !isLoading)) { // Also reset if somehow out of sync
        console.log("Fetch complete, resetting flags");
        setIsLoading(false);
        fetchingRef.current = false;
      }
    }
  };

  // Helper function to use fallback data
  const loadFallbackData = () => {
    setProperties([
      {
        id: 1,
        title: "Modern apartment with great view",
        type: "Apartment",
        location: "Gurgaon",
        price: 25000,
        pricePerNight: "₹25,000/month",
        coords: [28.4595, 77.0266],
        rating: 4.9,
        reviews: 128,
        isNew: true,
        isFavorite: true,
        freeCancel: true,
        dates: "Available now",
        images: ["https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg"]
      }
    ]);
  };

  return (
    <>
      <Header setShowFilters={setShowFilters} />
      <PropertyNav />
      
      <main className="flex flex-grow relative mt-2.5">
        <section className="w-3/5 max-w-[850px] p-5 overflow-y-auto h-[calc(100vh-60px-77px)]">
          <div className="flex justify-between items-center mb-5 flex-wrap">
            <h2 className="text-[22px] font-semibold">
              {isLoading ? "Finding properties..." : `Over ${properties.length} places within map area`}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                Prices include all fees
              </div>
              <button 
                className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-full text-sm font-medium shadow-md hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                onClick={() => setShowFilters(true)}
              >
                <FaFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>
          <PropertyList 
            properties={properties} 
            setSelectedProperty={setSelectedProperty}
            isLoading={isLoading}       
          />
        </section>
        
        <section className="w-2/5 sticky top-[60px] right-0 h-[calc(100vh-60px-77px)]">
          <Map 
            properties={properties}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
            setMapBounds={setMapBounds}
          />
        </section>
      </main>
      
      {showFilters && (
        <FiltersModal closeModal={() => setShowFilters(false)} />
      )}
    </>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/search-properties/*" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
        </Routes>

    </div>
  );
}

export default App;
