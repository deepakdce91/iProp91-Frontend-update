import React, { useState } from 'react';

const countries = [
  { code: 'IN', name: 'India', dial_code: '+91' },
  { code: 'US', name: 'United States', dial_code: '+1' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44' },
  { code: 'CA', name: 'Canada', dial_code: '+1' },
  { code: 'AU', name: 'Australia', dial_code: '+61' },
  // Add more countries as needed
];

const PhoneInput = ({selectedCountry,setSelectedCountry,phone,setPhone}) => {
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  return (
    <div className="w-full py-1 m-2 font-semibold flex items-center border border-black/20  focus-within:ring-2 focus-within:ring-gray-400 overflow-hidden bg-white rounded-xl text-gray-900 text-sm  focus:ring-gray-500  " >
      {/* Country Code Selector inside the input */}
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className="h-full p-2 bg-white border-r focus:outline-none"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.dial_code}>
            {country.dial_code}
          </option>
        ))}
      </select>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="Enter phone number"
        className="w-full p-2 bg-white focus:outline-none placeholder:text-gray-500"
      />
    </div>
  );
};

export default PhoneInput;
