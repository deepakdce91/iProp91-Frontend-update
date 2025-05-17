import React from 'react';

/**
 * SearchThisAreaButton - An Airbnb-like "Search this area" button that appears when map is moved
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when button is clicked
 * @param {String} props.className - Additional CSS classes
 */
const SearchThisAreaButton = ({ onClick, className = '' }) => {
  return (
    <button
      className={`absolute z-[999] top-24 left-1/2 transform -translate-x-1/2 bg-white hover:bg-gray-100 
                 transition-colors px-4 py-2 rounded-full shadow-md text-sm font-medium text-blue-600 ${className}`}
      onClick={onClick}
    >
      Search this area
    </button>
  );
};

export default SearchThisAreaButton;
