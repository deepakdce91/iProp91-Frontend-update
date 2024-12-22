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

  // Calculate dynamic height based on number of items
  const getDropdownHeight = useMemo(() => {
    const totalHeight = filteredCities.length * ITEM_HEIGHT;
    return Math.min(totalHeight, MAX_HEIGHT);
  }, [filteredCities.length]);

  // Memoize the filter function
  const filterCities = useMemo(() => {
    return (searchValue) => {
      if (!searchValue) return [];
      // Limit results to first 100 matches for better performance
      return cityStateData
        .filter(item => 
          item.city.toLowerCase().includes(searchValue.toLowerCase()))
        .slice(0, 100);
    };
  }, []);

  // Debounced input handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for filtering
    debounceTimerRef.current = setTimeout(() => {
      const filtered = filterCities(value);
      setFilteredCities(filtered);

      // Check for exact match
      const exactMatch = filtered.find(
        item => item.city.toLowerCase() === value.toLowerCase()
      );

      if (exactMatch) {
        setSelectedCity(exactMatch.city);
        setMainCity(exactMatch.city);
        setSelectedState(exactMatch.state);
        setMainState(exactMatch.state);
      } else {
        setSelectedCity("");
        setMainCity("");
        setSelectedState("");
        setMainState("");
      }
    }, 300); // 300ms debounce delay
  }, [filterCities, setMainCity, setMainState]);

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
    const cityData = filteredCities[index];
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
  }, [filteredCities, handleSelect]);

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
        type="text"
        id="city"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className={`mt-1 block w-full text-gray-900 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white ${
          fromGuestForm ? "rounded-lg" : "rounded-3xl"
        }`}
        placeholder="Type to search cities..."
      />

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <List
            height={getDropdownHeight}
            itemCount={filteredCities.length}
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