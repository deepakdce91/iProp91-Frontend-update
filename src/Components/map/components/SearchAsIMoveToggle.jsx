import React from 'react';

/**
 * SearchAsIMoveToggle - Toggle component for "Search as I move the map" functionality
 * Similar to Airbnb's map interaction toggle that controls automatic property fetching
 * 
 * @param {Object} props - Component props
 * @param {Boolean} props.value - Current toggle state
 * @param {Function} props.onChange - Function to call when toggle changes
 * @param {String} props.className - Additional CSS classes
 */
const SearchAsIMoveToggle = ({ value, onChange, className = '' }) => {
  return (
    <div className={`absolute z-[999] bottom-4 left-4 bg-white p-2 rounded-lg shadow-md flex items-center space-x-2 ${className}`}>
      <input 
        type="checkbox" 
        id="search-as-i-move"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="search-as-i-move" className="text-xs font-medium text-gray-700">
        Search as I move the map
      </label>
    </div>
  );
};

export default SearchAsIMoveToggle;
