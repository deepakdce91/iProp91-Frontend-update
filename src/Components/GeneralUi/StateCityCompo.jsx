import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import citiesData from "../../siteData/cities.json";
import { FixedSizeList as List } from 'react-window';

const cityStateData = citiesData;

const CityStateSelector = ({ setMainCity, setMainState, fromGuestForm, initialState, initialCity }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const wrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Constants for dropdown sizing
  const ITEM_HEIGHT = 40;
  const MAX_HEIGHT = 300;

  // Default cities to show when input is empty
  const defaultCities = useMemo(() => {
    return cityStateData.slice(0, 5).map(city => ({
      city: city.city,
      state: city.state
    }));
  }, []);

  // Calculate dynamic height based on number of items
  const getDropdownHeight = useMemo(() => {
    const itemCount = filteredCities.length || defaultCities.length;
    const totalHeight = itemCount * ITEM_HEIGHT;
    return Math.min(totalHeight, MAX_HEIGHT);
  }, [filteredCities.length, defaultCities.length]);

  // Memoize the filter function
  const filterCities = useMemo(() => {
    return (searchValue) => {
      if (!searchValue) return defaultCities;
      return cityStateData
        .filter(item => 
          item.city.toLowerCase().includes(searchValue.toLowerCase()))
        .slice(0, 100);
    };
  }, [defaultCities]);

  // Update filtered cities based on input value
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredCities([]); // Clear the list if input is empty
      setIsOpen(false); // Close the dropdown if input is empty
    } else {
      const filtered = citiesData.filter(city =>
        city.city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0); // Open dropdown only if there are matching cities
    }
  }, [inputValue]);

  // Debounced input handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    // Dropdown will open based on the filtered results
  }, []);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
    setFilteredCities(defaultCities);
  }, [defaultCities]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle initial city
  useEffect(() => {
    if (initialCity) {
      setInputValue(initialCity);
    }
  }, [initialCity]);

  const handleSelect = useCallback((cityData) => {
    setInputValue(cityData.city);
    setSelectedCity(cityData.city);
    setMainCity(cityData.city);
    setSelectedState(cityData.state);
    setMainState(cityData.state);
    setIsOpen(false);
  }, [setMainCity, setMainState]);

  // Memoized row renderer for virtualized list
  const Row = useCallback(({ index, style }) => {
    const cityData = filteredCities.length > 0 ? filteredCities[index] : defaultCities[index];
    return (
      <div
        style={style}
        className="px-4 py-2 hover:bg-blue-50 text-gray-700 cursor-pointer flex justify-between items-center"
        onClick={() => handleSelect(cityData)}
      >
        <span>{cityData.city}</span>
        <span className="text-xs text-gray-500">({cityData.state})</span>
      </div>
    );
  }, [filteredCities, defaultCities, handleSelect]);

  const displayedCities = filteredCities.length > 0 ? filteredCities : defaultCities;

  return (
    <div ref={wrapperRef} className="w-full my-2 xl:m-2 relative">
      <label
        className={`block text-sm font-medium ${
          fromGuestForm ? "text-gray-200 mb-3" : "text-gray-700"
        }`}
      >
        Select City
      </label>
      <input
      autoComplete="off"
        type="text"
        id="city"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={`mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white ${
          fromGuestForm ? "rounded-lg" : "rounded-lg"
        }`}
        placeholder="Type to search cities..."
      />

      {isOpen && displayedCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <List
            height={getDropdownHeight}
            itemCount={displayedCities.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
};

export default React.memo(CityStateSelector);