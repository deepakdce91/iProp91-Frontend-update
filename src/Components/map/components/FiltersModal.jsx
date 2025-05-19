import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { sortArrayByName } from '../utils/sortArrey';


const FiltersModal = ({ closeModal }) => {
  const [priceRange, setPriceRange] = useState([1000, 20000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [propertyType, setPropertyType] = useState('Any');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [city, setCity] = useState('Any');
  const [state, setState] = useState('Any');

  // Example lists, replace with your dynamic data if needed
  const stateOptions = ['Any', 'Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'West Bengal'];
  const cityOptions = {
    Any: ['Any'],
    Maharashtra: ['Any', 'Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Any', 'Bangalore', 'Mysore'],
    Delhi: ['Any', 'New Delhi', 'Dwarka'],
    'Tamil Nadu': ['Any', 'Chennai', 'Coimbatore'],
    'West Bengal': ['Any', 'Kolkata', 'Howrah'],
  };
  
  const minRangeRef = useRef(null);
  const maxRangeRef = useRef(null);
  const rangeTrackRef = useRef(null);
  
  const amenitiesList = [
    'WiFi', 'Kitchen', 'Washer', 'Air conditioning', 'Pool', 
    'Free parking', 'Hot tub', 'Gym', 'Breakfast', 'Indoor fireplace'
  ];
  
  const propertyTypes = ['Any', 'House', 'Apartment', 'Villa', 'Hotel', 'Guest house'];
  
  const MIN_PRICE = 1000;
  const MAX_PRICE = 50000;
  const PRICE_GAP = 1000;

  const filters = {
    priceRange,
    bedrooms,
    bathrooms,
    propertyType,
    selectedAmenities,
    city,
    state,
  }

  useEffect(() => {
    const fetchCitiesByState = (currentStateCode) => {
      axios
        .get(`https://api.countrystatecity.in/v1/countries/IN/states/${currentStateCode}/cities`, {
          headers: {
            'X-CSCAPI-KEY': process.env.REACT_APP_CSC_API,
          },
        })
        .then((response) => {
          setCity(sortArrayByName(response.data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchCitiesByState(state);
  }, [state]);
  
  useEffect(() => {
    const fetchAllStates = () => {
      axios
        .get('https://api.countrystatecity.in/v1/countries/IN/states', {
          headers: {
            "X-CSCAPI-KEY": process.env.REACT_APP_CSC_API,
          },
        })
        .then((response) => {
          setState(sortArrayByName(response.data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
  
    fetchAllStates();
  }, []);
  
  
  useEffect(() => {
    updateRangeProgress();
  },[priceRange[0], priceRange[1]]);
  
  const handleMinPriceChange = (e) => {
    const minVal = parseInt(e.target.value);
    if (minVal + PRICE_GAP <= priceRange[1]) {
      setPriceRange([minVal, priceRange[1]]);
    }
  };
  
  const handleMaxPriceChange = (e) => {
    const maxVal = parseInt(e.target.value);
    if (maxVal - PRICE_GAP >= priceRange[0]) {
      setPriceRange([priceRange[0], maxVal]);
    }
  };
  
  const handleInputChange = (index, value) => {
    const newValue = parseInt(value) || MIN_PRICE;
    if (index === 0 && newValue < priceRange[1] - PRICE_GAP) {
      setPriceRange([Math.max(MIN_PRICE, newValue), priceRange[1]]);
    } else if (index === 1 && newValue > priceRange[0] + PRICE_GAP) {
      setPriceRange([priceRange[0], Math.min(MAX_PRICE, newValue)]);
    }
  };

  const updateRangeProgress = () => {
    if (rangeTrackRef.current) {
      const percent1 = ((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      const percent2 = ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      rangeTrackRef.current.style.background = `linear-gradient(to right, #e5e7eb ${percent1}%, #FF385C ${percent1}%, #FF385C ${percent2}%, #e5e7eb ${percent2}%)`;
    }
  };
  
  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  const handleApplyFilters = () => {
    // In a real app, you would pass these filters to a parent component
    // and use them to fetch filtered properties
    closeModal();
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl w-[90%] max-w-[780px] max-h-[90vh] overflow-y-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <div className="sticky top-0 flex items-center justify-center py-5 border-b border-gray-200 bg-white z-10">
          <button className="absolute left-5 bg-transparent border-none text-lg cursor-pointer" onClick={closeModal}>
            <FaTimes />
          </button>
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="p-5">
          <section className="mb-8">
            <h3 className="text-lg mb-4">Price range</h3>
            <div className="mb-10">
              <div className="flex gap-5 mb-5">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Min price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-[13px] text-gray-500">₹</span>
                    <input 
                      type="number" 
                      value={priceRange[0]}
                      onChange={(e) => handleInputChange(0, e.target.value)}
                      className="w-full p-2.5 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Max price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-[13px] text-gray-500">₹</span>
                    <input 
                      type="number" 
                      value={priceRange[1]}
                      onChange={(e) => handleInputChange(1, e.target.value)}
                      className="w-full p-2.5 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-12 relative">
                <div 
                  ref={rangeTrackRef} 
                  className="h-1.5 w-full bg-gray-200 rounded-lg absolute top-1/2 -translate-y-1/2"
                ></div>
                
                <div className="relative h-2">
                  <input 
                    ref={minRangeRef}
                    type="range" 
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="100"
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="absolute w-full appearance-none bg-transparent h-2 cursor-pointer z-20"
                  />
                  <input 
                    ref={maxRangeRef}
                    type="range" 
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="100"
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="absolute w-full appearance-none bg-transparent h-2 cursor-pointer z-20"
                  />
                </div>
                
                <div className="relative mt-6">
                  <div className="absolute left-0 -translate-x-1/4">₹{MIN_PRICE}</div>
                  <div className="absolute right-0 translate-x-1/4">₹{MAX_PRICE}</div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-lg mb-4">Rooms and beds</h3>
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2.5">
                <span className="font-medium">Bedrooms</span>
                <div className="flex items-center gap-4">
                  <button 
                    className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-base transition-all
                      ${bedrooms === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                    disabled={bedrooms === 0}
                    onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                  >-</button>
                  <span className="w-8 text-center">{bedrooms === 0 ? 'Any' : bedrooms}</span>
                  <button 
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-base cursor-pointer hover:bg-gray-100 transition-all"
                    onClick={() => setBedrooms(bedrooms + 1)}
                  >+</button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <span className="font-medium">Bathrooms</span>
                <div className="flex items-center gap-4">
                  <button 
                    className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-base transition-all
                      ${bathrooms === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                    disabled={bathrooms === 0}
                    onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
                  >-</button>
                  <span className="w-8 text-center">{bathrooms === 0 ? 'Any' : bathrooms}</span>
                  <button 
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-base cursor-pointer hover:bg-gray-100 transition-all"
                    onClick={() => setBathrooms(bathrooms + 1)}
                  >+</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h3 className="text-lg font-medium mb-4">Location</h3>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-600">State</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={state}
                  onChange={e => {
                    setState(e.target.value);
                    setCity('Any'); // Reset city if state changes
                  }}
                >
                  {stateOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-600">City</label>
                <select
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  disabled={state === 'Any'}
                >
                  {cityOptions[state]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-medium mb-4">Property type</h3>
            <div className="flex flex-wrap gap-2.5">
              {propertyTypes.map(type => (
                <button
                  key={type}
                  className={`py-2.5 px-4 border rounded-xl transition-all
                    ${propertyType === type 
                      ? 'border-primary bg-primary text-white shadow-md' 
                      : 'border-gray-300 bg-transparent hover:bg-gray-50'}`}
                  onClick={() => setPropertyType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>
          
          <section className="mb-16">
            <h3 className="text-lg font-medium mb-4">Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-5 h-5 mr-3 accent-primary"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-base cursor-pointer">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="sticky bottom-0 flex justify-between items-center px-5 py-4 border-t border-gray-200 bg-white">
          <button 
            className="font-medium text-base underline"
            onClick={() => {
              setPropertyType('Any');
              setBedrooms(0);
              setBathrooms(0);
              setPriceRange([MIN_PRICE, MAX_PRICE]);
              setSelectedAmenities([]);
              setState('Any');
              setCity('Any');
            }}
          >
            Clear all
          </button>
          <button 
            className="bg-primary text-white py-3 px-6 rounded-lg font-medium"
            onClick={handleApplyFilters}
          >
            Show results
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FiltersModal; 