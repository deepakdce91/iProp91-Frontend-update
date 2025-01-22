import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange,  
  placeholder,
  name 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
    setSearchTerm('');
    inputRef.current?.blur(); // Remove focus after selection
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="w-full my-2 xl:m-2" ref={dropdownRef}>
      <label className="block mb-3 text-sm font-medium text-gray-200">
        {label}
      </label>
      <div className="relative">
        <div className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer flex items-center justify-between">
          <input
            ref={inputRef}
            type="text"
            className="w-full focus:outline-none text-gray-700"
            placeholder={placeholder}
            value={searchTerm || value}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={handleInputFocus}
          />
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => handleSelect(option.name)}
                >
                  {option.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown; 