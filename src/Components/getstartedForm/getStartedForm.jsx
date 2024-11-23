import React, { useState } from 'react';

const questions = {
  level1: {
    question: "What type of property are you looking for?",
    options: [
      { id: 'a', text: 'Residential', nextLevel: 'level2a' },
      { id: 'b', text: 'Commercial', nextLevel: 'level2b' },
      { id: 'c', text: 'Investment', nextLevel: 'level2c' },
      { id: 'd', text: 'Vacation Home', nextLevel: 'level2d' },
      { id: 'e', text: 'Land', nextLevel: 'level2e' },
    ]
  },
  level2a: {
    question: "What's your preferred residential property type?",
    options: [
      { id: 'a', text: 'Apartment', nextLevel: 'level3a1' },
      { id: 'b', text: 'Villa', nextLevel: 'level3a2' },
      { id: 'c', text: 'Townhouse', nextLevel: 'level3a3' },
      { id: 'd', text: 'Penthouse', nextLevel: 'level3a4' },
      { id: 'e', text: 'Independent House', nextLevel: 'level3a5' },
    ]
  },
  level2b: {
    question: "What type of commercial property interests you?",
    options: [
      { id: 'a', text: 'Office Space', nextLevel: 'level3b1' },
      { id: 'b', text: 'Retail Space', nextLevel: 'level3b2' },
      { id: 'c', text: 'Industrial', nextLevel: 'level3b3' },
      { id: 'd', text: 'Warehouse', nextLevel: 'level3b4' },
      { id: 'e', text: 'Mixed Use', nextLevel: 'level3b5' },
    ]
  },
  level2c: {
    question: "What's your investment goal?",
    options: [
      { id: 'a', text: 'Rental Income', nextLevel: 'level3c1' },
      { id: 'b', text: 'Property Flipping', nextLevel: 'level3c2' },
      { id: 'c', text: 'Long-term Appreciation', nextLevel: 'level3c3' },
      { id: 'd', text: 'Commercial Leasing', nextLevel: 'level3c4' },
      { id: 'e', text: 'Development Project', nextLevel: 'level3c5' },
    ]
  },
  level2d: {
    question: "What's your preferred vacation home location?",
    options: [
      { id: 'a', text: 'Beach Front', nextLevel: 'level3d1' },
      { id: 'b', text: 'Mountain View', nextLevel: 'level3d2' },
      { id: 'c', text: 'City Center', nextLevel: 'level3d3' },
      { id: 'd', text: 'Countryside', nextLevel: 'level3d4' },
      { id: 'e', text: 'Lake Front', nextLevel: 'level3d5' },
    ]
  },
  level2e: {
    question: "What's your intended use for the land?",
    options: [
      { id: 'a', text: 'Residential Development', nextLevel: 'level3e1' },
      { id: 'b', text: 'Commercial Development', nextLevel: 'level3e2' },
      { id: 'c', text: 'Agricultural', nextLevel: 'level3e3' },
      { id: 'd', text: 'Industrial Development', nextLevel: 'level3e4' },
      { id: 'e', text: 'Investment Only', nextLevel: 'level3e5' },
    ]
  },
  level3a1: {
    question: "What's your preferred apartment size?",
    options: [
      { id: 'a', text: 'Studio', nextLevel: 'level4a1' },
      { id: 'b', text: '1 Bedroom', nextLevel: 'level4a1' },
      { id: 'c', text: '2 Bedrooms', nextLevel: 'level4a1' },
      { id: 'd', text: '3 Bedrooms', nextLevel: 'level4a1' },
      { id: 'e', text: '4+ Bedrooms', nextLevel: 'level4a1' },
    ]
  },
  level3a2: {
    question: "What's your preferred villa style?",
    options: [
      { id: 'a', text: 'Modern', nextLevel: 'level4a2' },
      { id: 'b', text: 'Contemporary', nextLevel: 'level4a2' },
      { id: 'c', text: 'Traditional', nextLevel: 'level4a2' },
      { id: 'd', text: 'Mediterranean', nextLevel: 'level4a2' },
      { id: 'e', text: 'Colonial', nextLevel: 'level4a2' },
    ]
  },
  level3a3: {
    question: "How many floors do you prefer in your townhouse?",
    options: [
      { id: 'a', text: 'Single Floor', nextLevel: 'level4a3' },
      { id: 'b', text: 'Two Floors', nextLevel: 'level4a3' },
      { id: 'c', text: 'Three Floors', nextLevel: 'level4a3' },
      { id: 'd', text: 'Four Floors', nextLevel: 'level4a3' },
      { id: 'e', text: 'More than Four Floors', nextLevel: 'level4a3' },
    ]
  },
  level3a4: {
    question: "What penthouse features are most important to you?",
    options: [
      { id: 'a', text: 'Private Terrace', nextLevel: 'level4a4' },
      { id: 'b', text: 'City View', nextLevel: 'level4a4' },
      { id: 'c', text: 'Private Pool', nextLevel: 'level4a4' },
      { id: 'd', text: 'High Ceilings', nextLevel: 'level4a4' },
      { id: 'e', text: 'Multiple Levels', nextLevel: 'level4a4' },
    ]
  },
  level3a5: {
    question: "What's your preferred plot size for independent house?",
    options: [
      { id: 'a', text: 'Under 1,000 sq ft', nextLevel: 'level4a5' },
      { id: 'b', text: '1,000-2,000 sq ft', nextLevel: 'level4a5' },
      { id: 'c', text: '2,000-3,000 sq ft', nextLevel: 'level4a5' },
      { id: 'd', text: '3,000-4,000 sq ft', nextLevel: 'level4a5' },
      { id: 'e', text: 'Over 4,000 sq ft', nextLevel: 'level4a5' },
    ]
  },
  level3b1: {
    question: "What's your preferred office space size?",
    options: [
      { id: 'a', text: 'Under 1,000 sq ft', nextLevel: 'level4b1' },
      { id: 'b', text: '1,000-2,500 sq ft', nextLevel: 'level4b1' },
      { id: 'c', text: '2,500-5,000 sq ft', nextLevel: 'level4b1' },
      { id: 'd', text: '5,000-10,000 sq ft', nextLevel: 'level4b1' },
      { id: 'e', text: 'Over 10,000 sq ft', nextLevel: 'level4b1' },
    ]
  },
  level3b2: {
    question: "What type of retail space are you looking for?",
    options: [
      { id: 'a', text: 'Shopping Mall', nextLevel: 'level4b2' },
      { id: 'b', text: 'Street Shop', nextLevel: 'level4b2' },
      { id: 'c', text: 'Showroom', nextLevel: 'level4b2' },
      { id: 'd', text: 'Restaurant Space', nextLevel: 'level4b2' },
      { id: 'e', text: 'Multi-unit Retail', nextLevel: 'level4b2' },
    ]
  },
  level3b3: {
    question: "What type of industrial property do you need?",
    options: [
      { id: 'a', text: 'Manufacturing Unit', nextLevel: 'level4b3' },
      { id: 'b', text: 'Assembly Unit', nextLevel: 'level4b3' },
      { id: 'c', text: 'R&D Facility', nextLevel: 'level4b3' },
      { id: 'd', text: 'Storage Facility', nextLevel: 'level4b3' },
      { id: 'e', text: 'Distribution Center', nextLevel: 'level4b3' },
    ]
  },
  level3b4: {
    question: "What's your preferred warehouse location?",
    options: [
      { id: 'a', text: 'Industrial Area', nextLevel: 'level4b4' },
      { id: 'b', text: 'Port Proximity', nextLevel: 'level4b4' },
      { id: 'c', text: 'Highway Access', nextLevel: 'level4b4' },
      { id: 'd', text: 'Airport Proximity', nextLevel: 'level4b4' },
      { id: 'e', text: 'City Outskirts', nextLevel: 'level4b4' },
    ]
  },
  level3b5: {
    question: "What mix of usage are you looking for?",
    options: [
      { id: 'a', text: 'Retail + Office', nextLevel: 'level4b5' },
      { id: 'b', text: 'Office + Residential', nextLevel: 'level4b5' },
      { id: 'c', text: 'Retail + Residential', nextLevel: 'level4b5' },
      { id: 'd', text: 'All Three Uses', nextLevel: 'level4b5' },
      { id: 'e', text: 'Custom Mix', nextLevel: 'level4b5' },
    ]
  },
  level4a1: {
    question: "What's your budget range for the apartment?",
    options: [
      { id: 'a', text: 'Under $100,000', nextLevel: null },
      { id: 'b', text: '$100,000 - $200,000', nextLevel: null },
      { id: 'c', text: '$200,000 - $300,000', nextLevel: null },
      { id: 'd', text: '$300,000 - $500,000', nextLevel: null },
      { id: 'e', text: 'Over $500,000', nextLevel: null },
    ]
  },
  level4a2: {
    question: "What's your budget range for the villa?",
    options: [
      { id: 'a', text: 'Under $500,000', nextLevel: null },
      { id: 'b', text: '$500,000 - $1M', nextLevel: null },
      { id: 'c', text: '$1M - $2M', nextLevel: null },
      { id: 'd', text: '$2M - $5M', nextLevel: null },
      { id: 'e', text: 'Over $5M', nextLevel: null },
    ]
  },
  level4a3: {
    question: "What's your budget range for the townhouse?",
    options: [
      { id: 'a', text: 'Under $300,000', nextLevel: null },
      { id: 'b', text: '$300,000 - $500,000', nextLevel: null },
      { id: 'c', text: '$500,000 - $750,000', nextLevel: null },
      { id: 'd', text: '$750,000 - $1M', nextLevel: null },
      { id: 'e', text: 'Over $1M', nextLevel: null },
    ]
  },
  level4a4: {
    question: "What's your budget range for the penthouse?",
    options: [
      { id: 'a', text: 'Under $1M', nextLevel: null },
      { id: 'b', text: '$1M - $2M', nextLevel: null },
      { id: 'c', text: '$2M - $5M', nextLevel: null },
      { id: 'd', text: '$5M - $10M', nextLevel: null },
      { id: 'e', text: 'Over $10M', nextLevel: null },
    ]
  },
  level4a5: {
    question: "What's your budget range for the independent house?",
    options: [
      { id: 'a', text: 'Under $400,000', nextLevel: null },
      { id: 'b', text: '$400,000 - $700,000', nextLevel: null },
      { id: 'c', text: '$700,000 - $1M', nextLevel: null },
      { id: 'd', text: '$1M - $2M', nextLevel: null },
      { id: 'e', text: 'Over $2M', nextLevel: null },
    ]
  },
  level4b1: {
    question: "What's your budget range for the office space?",
    options: [
      { id: 'a', text: 'Under $500,000', nextLevel: null },
      { id: 'b', text: '$500,000 - $1M', nextLevel: null },
      { id: 'c', text: '$1M - $2M', nextLevel: null },
      { id: 'd', text: '$2M - $5M', nextLevel: null },
      { id: 'e', text: 'Over $5M', nextLevel: null },
    ]
  },
  // ... continue with all level 4 questions for other paths
};

const JourneyPage = () => {
  const [currentLevel, setCurrentLevel] = useState('level1');
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(25);

  const handleOptionClick = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentLevel]: option.text
    }));
    
    if (option.nextLevel) {
      setCurrentLevel(option.nextLevel);
      setProgress(prev => Math.min(prev + 25, 100));
    } else {
      // Handle form completion
      console.log('Journey completed:', answers);
    }
  };

  const currentQuestion = questions[currentLevel];

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white p-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2.5 mb-12">
        <div 
          className="bg-white h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Question */}
        <h2 className="text-3xl font-bold mb-8">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="grid gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className="p-6 text-left border border-gray-700 rounded-lg hover:border-white transition-all duration-300"
            >
              <span className="text-xl">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyPage;