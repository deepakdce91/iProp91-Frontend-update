import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, X, ChevronDown, ArrowUpDown, MapPin, Building, Bed, Bath, Square, Tag, Home, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PropertySearchComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const sectorDropdownRef = useRef(null);
  
  // State management
  const [properties, setProperties] = useState([]);
  const [originalProperties, setOriginalProperties] = useState([]); // Store original data for local sorting
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // City suggestion states
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Dropdown states
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [sectorSuggestions, setSectorSuggestions] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  
  // Search and filter states
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for general search
  const [filters, setFilters] = useState({
    city: '',
    sector: '',
    minPrice: '',
    maxPrice: '',
    bhk: '',
    amenities: [],
    status: '',
    availableFor: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Common amenities for filter options
  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Security', 'Park', 
    'Parking', 'Club House', 'Play Area', 'Garden'
  ];
  
  // Status options
  const statusOptions = ['Ready to Move', 'Under Construction', 'Upcoming'];
  
  // BHK options
  const bhkOptions = ['1', '2', '3', '4', '5+'];

  // Available For options
  const availableForOptions = ['Rent', 'Buy', 'Both'];

  // Parse URL query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Extract filter values from URL query parameters
    const filtersFromUrl = {
      city: queryParams.get('city') || '',
      sector: queryParams.get('sector') || '',
      minPrice: queryParams.get('minPrice') || '',
      maxPrice: queryParams.get('maxPrice') || '',
      bhk: queryParams.get('bhk') || '',
      status: queryParams.get('status') || '',
      availableFor: queryParams.get('availableFor') || '',
      sortBy: queryParams.get('sortBy') || 'createdAt',
      sortOrder: queryParams.get('sortOrder') || 'desc',
      amenities: queryParams.get('amenities') ? queryParams.get('amenities').split(',') : []
    };
    
    // Extract search query from URL
    const searchQueryFromUrl = queryParams.get('q') || '';
    
    // Update state with URL parameters
    setFilters(filtersFromUrl);
    setSearchCity(filtersFromUrl.city);
    setSearchQuery(searchQueryFromUrl);
    setSelectedCity(filtersFromUrl.city);
    setSelectedSector(filtersFromUrl.sector);
    
    // If city is selected from URL, fetch sectors
    if (filtersFromUrl.city) {
      fetchSectorsByCity(filtersFromUrl.city);
    }
    
    // If there's a search query, perform master search, otherwise fetch with filters
    if (searchQueryFromUrl) {
      performMasterSearch(searchQueryFromUrl);
    } else {
      fetchProperties(filtersFromUrl);
    }
    
    // Fetch cities for suggestions
    fetchCitySuggestions();
  }, [location.search]);
  
  // Fetch unique cities for suggestions
  const fetchCitySuggestions = async () => {
    setLoadingCities(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/cities/unique`);
      setCitySuggestions(response.data.data || []);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    } finally {
      setLoadingCities(false);
    }
  };
  
  // Fetch sectors by city
  const fetchSectorsByCity = async (city) => {
    if (!city) {
      setSectorSuggestions([]);
      return;
    }
    
    setLoadingSectors(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/getSectorsByCity/${encodeURIComponent(city)}`);
      setSectorSuggestions(response.data.sectors || []);
    } catch (err) {
      console.error("Error fetching sectors:", err);
      setSectorSuggestions([]);
    } finally {
      setLoadingSectors(false);
    }
  };
  
  // Master search function using the new API endpoint
  const performMasterSearch = async (query) => {
    if (!query.trim()) {
      // If query is empty, fetch all properties with current filters
      fetchProperties();
      return;
    }
    
    console.log("Performing master search with query:", query);
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/search?q=${encodeURIComponent(query)}`);
      const fetchedProperties = response.data.data.projects || [];
      
      // Store original data
      setOriginalProperties(fetchedProperties);
      console.log("Fetched properties via master:", fetchedProperties);
      
      // Apply local sorting
      const sortedProperties = applySorting(fetchedProperties, filters.sortBy, filters.sortOrder);
      setProperties(sortedProperties);
      
      // Update URL with search query
      updateUrlWithSearch(query);
    } catch (err) {
      console.error("Error performing master search:", err);
      setError("Failed to search properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Filter city suggestions based on input
  const getFilteredCitySuggestions = () => {
    if (!searchCity && !searchQuery) return citySuggestions;
    
    const searchTerm = searchQuery || searchCity;
    return citySuggestions.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Handle amenity selection
  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };
  
  // Handle city selection from dropdown
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedSector(''); // Reset sector when city changes
    setShowCityDropdown(false);
    
    // Clear search query when using city filter
    setSearchQuery('');
    
    // Fetch sectors for the selected city
    fetchSectorsByCity(city);
    
    // Update filters and fetch properties
    const newFilters = { ...filters, city, sector: '' };
    setFilters(newFilters);
    fetchProperties(newFilters);
  };
  
  // Handle sector selection from dropdown
  const handleSectorSelect = (sector) => {
    setSelectedSector(sector);
    setShowSectorDropdown(false);
    
    // Clear search query when using sector filter
    setSearchQuery('');
    
    // Update filters and fetch properties
    const newFilters = { ...filters, sector };
    setFilters(newFilters);
    fetchProperties(newFilters);
  };
  
  // Function to fetch properties with applied filters
  const fetchProperties = async (customFilters = {}) => {
    console.log("Fetching properties with filters:", { ...filters, ...customFilters });
    setLoading(true);
    setError(null);
    
    // Merge current filters with any custom filters
    const appliedFilters = { ...filters, ...customFilters };
    
    try {
      // Build query params from filters
      let url = `${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster?`;
      
      if (appliedFilters.city) {
        url += `city=${appliedFilters.city}&`;
      }
      
      if (appliedFilters.sector) {
        url += `sector=${appliedFilters.sector}&`;
      }
      
      if (appliedFilters.bhk) {
        url += `bhk=${appliedFilters.bhk}&`;
      }
      
      if (appliedFilters.status) {
        url += `status=${appliedFilters.status}&`;
      }
      
      if (appliedFilters.availableFor) {
        url += `availableFor=${appliedFilters.availableFor}&`;
      }
      
      if (appliedFilters.minPrice) {
        url += `minPrice=${appliedFilters.minPrice}&`;
      }
      
      if (appliedFilters.maxPrice) {
        url += `maxPrice=${appliedFilters.maxPrice}&`;
      }
      
      if (appliedFilters.amenities.length > 0) {
        url += `amenities=${appliedFilters.amenities.join(',')}&`;
      }
      
      // For local sorting, we'll still include sort parameters on API request
      // but we'll also sort locally after data is returned
      url += `sortBy=${appliedFilters.sortBy}&sortOrder=${appliedFilters.sortOrder}`;
      
      const response = await axios.get(url);
      const fetchedProperties = response.data.data.projects;
      
      // Store original data
      setOriginalProperties(fetchedProperties);
      
      // Apply local sorting
      const sortedProperties = applySorting(fetchedProperties, appliedFilters.sortBy, appliedFilters.sortOrder);
      setProperties(sortedProperties);
      
      // Update URL with applied filters
      updateUrlWithFilters(appliedFilters);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle local sorting
  const applySorting = (propertiesToSort, sortBy, sortOrder) => {
    if (!propertiesToSort || propertiesToSort.length === 0) return [];
    
    return [...propertiesToSort].sort((a, b) => {
      let valueA, valueB;
      
      // Determine sorting values based on sortBy field
      switch (sortBy) {
        case 'minimumPrice':
          valueA = a.minimumPrice || 0;
          valueB = b.minimumPrice || 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt || 0).getTime();
          valueB = new Date(b.createdAt || 0).getTime();
          break;
        default:
          valueA = a[sortBy] || 0;
          valueB = b[sortBy] || 0;
      }
      
      // Apply sort order
      if (sortOrder === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  };
  
  // Update URL with current filters
  const updateUrlWithFilters = (appliedFilters) => {
    const queryParams = new URLSearchParams();
    
    if (appliedFilters.city) queryParams.set('city', appliedFilters.city);
    if (appliedFilters.sector) queryParams.set('sector', appliedFilters.sector);
    if (appliedFilters.minPrice) queryParams.set('minPrice', appliedFilters.minPrice);
    if (appliedFilters.maxPrice) queryParams.set('maxPrice', appliedFilters.maxPrice);
    if (appliedFilters.bhk) queryParams.set('bhk', appliedFilters.bhk);
    if (appliedFilters.status) queryParams.set('status', appliedFilters.status);
    if (appliedFilters.availableFor) queryParams.set('availableFor', appliedFilters.availableFor);
    if (appliedFilters.amenities.length > 0) queryParams.set('amenities', appliedFilters.amenities.join(','));
    queryParams.set('sortBy', appliedFilters.sortBy);
    queryParams.set('sortOrder', appliedFilters.sortOrder);
    
    // Update URL without triggering a refresh
    navigate(`?${queryParams.toString()}`, { replace: true });
  };
  
  // Update URL with search query
  const updateUrlWithSearch = (query) => {
    const queryParams = new URLSearchParams();
    if (query) queryParams.set('q', query);
    
    // Update URL without triggering a refresh
    navigate(`?${queryParams.toString()}`, { replace: true });
  };
  
  // Handle city selection from search dropdown
  const handleCitySelectFromSearch = (city) => {
    setSearchCity(city);
    setSearchQuery(city); // Update search query as well
    setShowCitySuggestions(false);
    
    // Perform master search with the selected city
    performMasterSearch(city);
  };
  
  // Modified search handler to use master search API
  const handleSearch = () => {
    const query = searchQuery || searchCity;
    if (query.trim()) {
      performMasterSearch(query.trim());
    } else {
      // If search is empty, fetch all properties with current filters
      fetchProperties();
    }
    setShowCitySuggestions(false);
  };
  
  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchCity(value); // Keep both in sync for backwards compatibility
  };
  
  // Apply all filters
  const applyFilters = () => {
    // Clear search query when applying filters
    setSearchQuery('');
    fetchProperties();
    setShowFilters(false);
  };
  
  // Reset all filters
  const resetFilters = () => {
    const resetState = {
      city: '',
      sector: '',
      minPrice: '',
      maxPrice: '',
      bhk: '',
      amenities: [],
      status: '',
      availableFor: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    setFilters(resetState);
    setSearchCity('');
    setSearchQuery('');
    setSelectedCity('');
    setSelectedSector('');
    setSectorSuggestions([]);
    fetchProperties(resetState);
    setShowFilters(false);
  };

  // Function to handle view all button click
  const handleViewAll = () => {
    // Reset all filters
    const resetState = {
      city: '',
      sector: '',
      minPrice: '',
      maxPrice: '',
      bhk: '',
      amenities: [],
      status: '',
      availableFor: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    // Update state
    setFilters(resetState);
    setSearchCity('');
    setSearchQuery('');
    setSelectedCity('');
    setSelectedSector('');
    setSectorSuggestions([]);
    
    // Fetch all properties (no filters)
    fetchProperties(resetState);
    
    // Clear all query parameters from URL
    navigate('', { replace: true });
  };
  
  // Handle sort change with local sorting
  const handleSortChange = (sortKey) => {
    const newSortOrder = filters.sortBy === sortKey && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...filters, sortBy: sortKey, sortOrder: newSortOrder };
    setFilters(newFilters);
    
    // Apply local sorting to existing data
    const sortedProperties = applySorting(originalProperties, sortKey, newSortOrder);
    setProperties(sortedProperties);
    
    // Update URL with new sort parameters
    if (searchQuery) {
      // If we're in search mode, maintain the search query
      updateUrlWithSearch(searchQuery);
    } else {
      // Otherwise update with filters
      updateUrlWithFilters(newFilters);
    }
  };
  
  // Navigate to property details page
  const navigateToPropertyDetails = (propertyId) => {
    navigate(`/property-details/${propertyId}`);
  };

  // Format price to readable format
  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    
    if (price >= 10000000) { // 1 crore or more
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) { // 1 lakh or more
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setShowSectorDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const filteredCitySuggestions = getFilteredCitySuggestions();
  
    return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pt-32 ">
      {/* Search Header */}
      <div className="mb-8 ml-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Dream Property</h1>
        <p className="text-gray-600">Search from thousands of properties across India</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          {/* Search Input with Suggestions - Modified for general search */}
          <div className="relative flex-grow w-full" ref={searchInputRef}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]"
              placeholder="Search properties, locations, projects..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowCitySuggestions(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            
            {/* City Suggestions Dropdown - Show when focusing on search */}
            {showCitySuggestions && searchQuery && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingCities ? (
                  <div className="p-3 text-center text-gray-500">Loading suggestions...</div>
                ) : filteredCitySuggestions.length > 0 ? (
                  filteredCitySuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleCitySelectFromSearch(city)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No suggestions found</div>
                )}
              </div>
            )}
          </div>
          
          {/* Search Button - Modified to use master search */}
          <button
            className="w-full md:w-auto px-6 py-3 bg-[#0E1524] text-white font-medium rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
          
          {/* Filter Toggle Button */}
          <button
            className={`w-full md:w-auto px-6 py-3 font-medium rounded-lg flex items-center justify-center gap-2 ${
              showFilters ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
          
          {/* View All Button */}
          <button
            className="w-full md:w-40 px-6 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={handleViewAll}
          >
            View All
          </button>
                </div>

        {/* City and Sector Dropdowns */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* City Dropdown */}
          <div className="relative flex-1" ref={cityDropdownRef}>
            <button
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524] flex justify-between items-center bg-white hover:bg-gray-50"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              <span className={selectedCity ? 'text-gray-900' : 'text-gray-500'}>
                {selectedCity || 'Select City'}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showCityDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingCities ? (
                  <div className="p-3 text-center text-gray-500">Loading cities...</div>
                ) : citySuggestions.length > 0 ? (
                  citySuggestions.map((city, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        selectedCity === city ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                      </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No cities found</div>
                )}
                      </div>
            )}
                      </div>
          
          {/* Sector Dropdown */}
          <div className="relative flex-1" ref={sectorDropdownRef}>
            <button
              className={`w-full py-3 px-4 border border-gray-300 rounded-lg flex justify-between items-center bg-white ${
                selectedCity 
                  ? 'hover:bg-gray-50 focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]' 
                  : 'bg-gray-100 cursor-not-allowed'
              }`}
              onClick={() => selectedCity && setShowSectorDropdown(!showSectorDropdown)}
              disabled={!selectedCity}
            >
              <span className={selectedSector ? 'text-gray-900' : selectedCity ? 'text-gray-500' : 'text-gray-400'}>
                {selectedSector || (selectedCity ? 'Select Sector' : 'Select City First')}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                showSectorDropdown ? 'rotate-180' : ''
              } ${!selectedCity ? 'opacity-50' : ''}`} />
            </button>
            
            {showSectorDropdown && selectedCity && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {loadingSectors ? (
                  <div className="p-3 text-center text-gray-500">Loading sectors...</div>
                ) : sectorSuggestions.length > 0 ? (
                  sectorSuggestions.map((sector, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        selectedSector === sector ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => handleSectorSelect(sector)}
                    >
                      {sector}
                      </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No sectors found</div>
                )}
                      </div>
            )}
                    </div>
                  </div>
        
        {/* Expanded Filters Section */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0E1524] focus:border-[#0E1524]"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>
              
              {/* BHK Options */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">BHK</label>
                <div className="flex flex-wrap gap-2">
                  {bhkOptions.map(bhk => (
                    <button
                      key={bhk}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.bhk === bhk 
                          ? 'bg-[#0E1524] text-white border border-[#0E1524]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                      onClick={() => setFilters({...filters, bhk: filters.bhk === bhk ? '' : bhk})}
                    >
                      {bhk} BHK
                    </button>
                  ))}
            </div>
          </div>
              
              {/* Status Options */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.status === status 
                          ? 'bg-[#0E1524] text-white border border-[#0E1524]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                      onClick={() => setFilters({...filters, status: filters.status === status ? '' : status})}
                    >
                      {status}
                    </button>
                  ))}
        </div>
      </div>
              
              {/* Amenities */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.slice(0, 4).map(amenity => (
                  <button
                      key={amenity}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.amenities.includes(amenity) 
                          ? 'bg-[#0E1524] text-white border border-[#0E1524]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Available For Options - New Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Available For</label>
                <div className="flex flex-wrap gap-2">
                  {availableForOptions.map(option => (
                    <button
                      key={option}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.availableFor === option.toLowerCase() 
                          ? 'bg-[#0E1524] text-white border border-[#0E1524]' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }`}
                      onClick={() => setFilters({...filters, availableFor: filters.availableFor === option.toLowerCase() ? '' : option.toLowerCase()})}
                    >
                      {option}
                  </button>
                  ))}
                </div>
              </div>
          </div>

            {/* Filter Action Buttons */}
            <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-gray-200">
              <button
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                onClick={resetFilters}
              >
                Reset All
              </button>
              <button
                className="px-4 py-2 bg-[#0E1524] text-white font-medium rounded hover:bg-opacity-90"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Sort Options */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
              filters.sortBy === 'minimumPrice' ? 'bg-[#0E1524] text-white' : 'bg-gray-100'
            }`}
            onClick={() => handleSortChange('minimumPrice')}
          >
            Price
            <ArrowUpDown className="h-3 w-3" />
          </button>
          
          <button 
            className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
              filters.sortBy === 'createdAt' ? 'bg-[#0E1524] text-white' : 'bg-gray-100'
            }`}
            onClick={() => handleSortChange('createdAt')}
          >
            Latest
            <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>

      {/* Property Results */}
{loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E1524]"></div>
  </div>
) : error ? (
  <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
    {error}
  </div>
) : properties.length === 0 ? (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-800 mb-2">No properties found</h3>
    <p className="text-gray-600">Try adjusting your search criteria or explore other locations</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {properties.map((property) => (
      <div key={property._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0].path || "/images/Logo1.png"} 
              alt={property.project || "Property"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={"/images/Logo1.png"} 
              alt={"Property"} 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Status Badge */}
          {property.status && (
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                property.status.toLowerCase().includes('ready') 
                  ? 'bg-green-100 text-green-800' 
                  : property.status.toLowerCase().includes('construction')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }`}>
                {property.status === "completed" ? "Ready to Move" : property.status}
              </span>
            </div>
          )}
          
          {/* Available For Badge */}
          {property.availableFor && (
            <div className="absolute bottom-2 right-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                property.availableFor.toLowerCase() === 'rent' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : property.availableFor.toLowerCase() === 'buy'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-indigo-100 text-indigo-800'
              }`}>
                {property.availableFor === "Both" ? "For Rent & Sale" : property.availableFor}
              </span>
            </div>
          )}
        </div>

        {/* Property Details - This section will stretch as needed */}
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {property.project || "Unnamed Project"}
            </h3>
            <div className="text-[#0E1524] font-semibold">
              {formatPrice(property.minimumPrice)}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {[property.sector, property.city, property.state].filter(Boolean).join(', ')}
            </span>
          </div>
          
          {/* Property Features */}
          <div className="flex flex-wrap gap-3 my-3">
            {property.bhk && (
              <div className="flex items-center text-gray-700 text-sm">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bhk} BHK</span>
              </div>
            )}
            
            {property.size && (
              <div className="flex items-center text-gray-700 text-sm">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.size} {property.sizeUnit || 'sq.ft'}</span>
              </div>
            )}
            
            {property.appartmentType && (
              <div className="flex items-center text-gray-700 text-sm">
                <Building className="h-4 w-4 mr-1" />
                <span>{property.appartmentType}</span>
              </div>
            )}
          </div>
          
          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-3 border-t pt-3 border-gray-100">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Builder Info */}
          {/* {property.builder && (
            <div className="mt-3 text-xs text-gray-500">
              By: {property.builder}
            </div>
          )} */}
          
          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>
          
          {/* View Details Button - Always at bottom */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button 
              className="w-full py-2 bg-[#0E1524] hover:bg-opacity-90 text-white font-medium rounded text-center transition-colors"
              onClick={() => navigateToPropertyDetails(property._id)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

<button
        onClick={() => navigate('/search-properties')}
        className="fixed bottom-10 right-4 px-4 py-3 bg-black hover:bg-black/80 text-white rounded-xl shadow-lg transition-all duration-300 z-50 flex items-center gap-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Show Map
      </button>
    </div>
  );
}