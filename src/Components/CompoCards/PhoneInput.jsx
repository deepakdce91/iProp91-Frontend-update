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

    setSelectedCountry(countries[0].dial_code);
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  return (
    <div className="w-full m-2 font-sm flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-400 overflow-hidden bg-white border border-yellow-600 text-gray-900 text-sm focus:ring-blue-500 focus:border-yellow-500 block w-full font-sm" style={{borderRadius:'20px'}}>
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
        className="w-full p-2 bg-white focus:outline-none"
      />
    </div>
  );
};

export default PhoneInput;
