// States and Cities data for search suggestions
export const statesAndCities = [
  // Maharashtra
  {
    name: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.0760, 72.8777]
  },
  {
    name: "Pune",
    state: "Maharashtra",
    coordinates: [18.5204, 73.8567]
  },
  {
    name: "Nagpur",
    state: "Maharashtra",
    coordinates: [21.1458, 79.0882]
  },
  // Delhi NCR
  {
    name: "Delhi",
    state: "Delhi",
    coordinates: [28.6139, 77.2090]
  },
  {
    name: "Gurgaon",
    state: "Haryana",
    coordinates: [28.4595, 77.0266]
  },
  {
    name: "Noida",
    state: "Uttar Pradesh",
    coordinates: [28.5355, 77.3910]
  },
  // Karnataka
  {
    name: "Bangalore",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946]
  },
  {
    name: "Mysore",
    state: "Karnataka",
    coordinates: [12.2958, 76.6394]
  },
  // Telangana
  {
    name: "Hyderabad",
    state: "Telangana",
    coordinates: [17.3850, 78.4867]
  },
  // Tamil Nadu
  {
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: [13.0827, 80.2707]
  },
  // West Bengal
  {
    name: "Kolkata",
    state: "West Bengal",
    coordinates: [22.5726, 88.3639]
  },
  // Gujarat
  {
    name: "Ahmedabad",
    state: "Gujarat",
    coordinates: [23.0225, 72.5714]
  }
];

// Dummy property data
export const dummyLocations = [
  // Mumbai properties
  {
    "id": "MUM001",
    "project": "Lodha World Towers",
    "builder": "Lodha Group",
    "minimumPrice": "5.5 Cr",
    "size": "1850",
    "city": "Mumbai",
    "state": "Maharashtra",
    "coordinates": [19.0760, 72.8777],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Garden", "Club House"],
    "image": "https://example.com/lodha.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "DEL001",
    "project": "DLF Camellias",
    "builder": "DLF Limited",
    "minimumPrice": "12 Cr",
    "size": "3500",
    "city": "Delhi",
    "state": "Delhi",
    "coordinates": [28.4595, 77.0266],
    "type": "Apartment",
    "bhk": "4",
    "amenities": ["Swimming Pool", "Gym", "Spa", "Club House", "Park"],
    "image": "https://example.com/dlf-camellias.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "BLR001",
    "project": "Prestige Lakeside Habitat",
    "builder": "Prestige Group",
    "minimumPrice": "4.2 Cr",
    "size": "2200",
    "city": "Bangalore",
    "state": "Karnataka",
    "coordinates": [12.9716, 77.5946],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Garden", "Club House", "Tennis Court"],
    "image": "https://example.com/prestige-lakeside.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "HYD001",
    "project": "My Home Jewel",
    "builder": "My Home Group",
    "minimumPrice": "3.8 Cr",
    "size": "2000",
    "city": "Hyderabad",
    "state": "Telangana",
    "coordinates": [17.3850, 78.4867],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Children's Play size"],
    "image": "https://example.com/myhome-jewel.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "CHN001",
    "project": "Godrej Platinum",
    "builder": "Godrej Properties",
    "minimumPrice": "2.5 Cr",
    "size": "1800",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "coordinates": [13.0827, 80.2707],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Jogging Track"],
    "image": "https://example.com/godrej-platinum.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "PUN001",
    "project": "Kumar Prospera",
    "builder": "Kumar Urban Development",
    "minimumPrice": "1.8 Cr",
    "size": "1500",
    "city": "Pune",
    "state": "Maharashtra",
    "coordinates": [18.5204, 73.8567],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Garden", "Club House"],
    "image": "https://example.com/kumar-prospera.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "KOL001",
    "project": "South City Projects",
    "builder": "South City Projects Ltd",
    "minimumPrice": "2.2 Cr",
    "size": "1600",
    "city": "Kolkata",
    "state": "West Bengal",
    "coordinates": [22.5726, 88.3639],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/south-city.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "AHM001",
    "project": "Adani Shantigram",
    "builder": "Adani Realty",
    "minimumPrice": "1.5 Cr",
    "size": "1400",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "coordinates": [23.0225, 72.5714],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/adani-shantigram.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "GOA001",
    "project": "Casa Bella Vista",
    "builder": "Casa Group",
    "minimumPrice": "2.8 Cr",
    "size": "1700",
    "city": "Goa",
    "state": "Goa",
    "coordinates": [15.2993, 74.1240],
    "type": "Villa",
    "bhk": "3",
    "amenities": ["Private Pool", "Garden", "Gym", "Club House"],
    "image": "https://example.com/casa-bella-vista.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "JAIP001",
    "project": "Golfshire Greens",
    "builder": "Golfshire Greens",
    "minimumPrice": "1.2 Cr",
    "size": "1200",
    "city": "Jaipur",
    "state": "Rajasthan",
    "coordinates": [26.9124, 75.7873],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/golfshire-greens.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "LKO001",
    "project": "Eldeco Greens",
    "builder": "Eldeco Group",
    "minimumPrice": "1.1 Cr",
    "size": "1100",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "coordinates": [26.8467, 80.9462],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/eldecogreens.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "CHD001",
    "project": "DLF City Floors",
    "builder": "DLF Limited",
    "minimumPrice": "3.5 Cr",
    "size": "2000",
    "city": "Chandigarh",
    "state": "Chandigarh",
    "coordinates": [30.7333, 76.7794],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/dlf-city-floors.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "IND001",
    "project": "Godrej Woodsman Estate",
    "builder": "Godrej Properties",
    "minimumPrice": "1.7 Cr",
    "size": "1500",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "coordinates": [22.7196, 75.8577],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/godrej-woodsman.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "COI001",
    "project": "Golden Palms",
    "builder": "Golden Developers",
    "minimumPrice": "2.3 Cr",
    "size": "1800",
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "coordinates": [11.0168, 76.9558],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/golden-palms.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "KOCH001",
    "project": "Lulu Bolgatty",
    "builder": "Lulu Group",
    "minimumPrice": "2.6 Cr",
    "size": "1900",
    "city": "Kochi",
    "state": "Kerala",
    "coordinates": [9.9312, 76.2673],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/lulu-bolgatty.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "BHUJ001",
    "project": "Shreeji Greens",
    "builder": "Shreeji Developers",
    "minimumPrice": "75 L",
    "size": "1000",
    "city": "Bhuj",
    "state": "Gujarat",
    "coordinates": [23.2420, 69.6669],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House"],
    "image": "https://example.com/shreeji-greens.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "NAG001",
    "project": "Orchid Greens",
    "builder": "Orchid Developers",
    "minimumPrice": "1.3 Cr",
    "size": "1300",
    "city": "Nagpur",
    "state": "Maharashtra",
    "coordinates": [21.1458, 79.0882],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/orchid-greens.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "SUR001",
    "project": "Arya Heights",
    "builder": "Arya Developers",
    "minimumPrice": "1.4 Cr",
    "size": "1400",
    "city": "Surat",
    "state": "Gujarat",
    "coordinates": [21.1702, 72.8311],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/arya-heights.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "VSKP001",
    "project": "Ocean View Residency",
    "builder": "Ocean Developers",
    "minimumPrice": "1.6 Cr",
    "size": "1600",
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "coordinates": [17.6868, 83.2185],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/ocean-view.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "PAT001",
    "project": "Ganga Residency",
    "builder": "Ganga Developers",
    "minimumPrice": "95 L",
    "size": "1100",
    "city": "Patna",
    "state": "Bihar",
    "coordinates": [25.5941, 85.1376],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House"],
    "image": "https://example.com/ganga-residency.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "JAI001",
    "project": "Pink City Residency",
    "builder": "Pink City Developers",
    "minimumPrice": "1.1 Cr",
    "size": "1200",
    "city": "Jaipur",
    "state": "Rajasthan",
    "coordinates": [26.9124, 75.7873],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/pink-city.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "DEH001",
    "project": "Himalaya Residency",
    "builder": "Himalaya Developers",
    "minimumPrice": "1.2 Cr",
    "size": "1300",
    "city": "Dehradun",
    "state": "Uttarakhand",
    "coordinates": [30.3165, 78.0322],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/himalaya-residency.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "RAN001",
    "project": "Jharkhand Residency",
    "builder": "Jharkhand Developers",
    "minimumPrice": "85 L",
    "size": "1000",
    "city": "Ranchi",
    "state": "Jharkhand",
    "coordinates": [23.3441, 85.3096],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House"],
    "image": "https://example.com/jharkhand-residency.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "BHOP001",
    "project": "Lake View Residency",
    "builder": "Lake View Developers",
    "minimumPrice": "1.3 Cr",
    "size": "1400",
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "coordinates": [23.2599, 77.4126],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/lake-view.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "RAJ001",
    "project": "Royal Residency",
    "builder": "Royal Developers",
    "minimumPrice": "1.4 Cr",
    "size": "1500",
    "city": "Rajkot",
    "state": "Gujarat",
    "coordinates": [22.3039, 70.8022],
    "type": "Apartment",
    "bhk": "3",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/royal-residency.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "JOD001",
    "project": "Marwar Residency",
    "builder": "Marwar Developers",
    "minimumPrice": "1.1 Cr",
    "size": "1200",
    "city": "Jodhpur",
    "state": "Rajasthan",
    "coordinates": [26.2389, 73.0243],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Park"],
    "image": "https://example.com/marwar-residency.jpg",
    "status": "Ready to Move"
  },
  {
    "id": "AMR001",
    "project": "Punjab Residency",
    "builder": "Punjab Developers",
    "minimumPrice": "1.2 Cr",
    "size": "1300",
    "city": "Amritsar",
    "state": "Punjab",
    "coordinates": [31.6340, 74.8723],
    "type": "Apartment",
    "bhk": "2",
    "amenities": ["Swimming Pool", "Gym", "Club House", "Garden"],
    "image": "https://example.com/punjab-residency.jpg",
    "status": "Ready to Move"
  },
  {
    id: "MUM002",
    name: "Imperial Heights",
    builder: "Raunak Group",
    minimumPrice: "2.8 Cr",
    size: "1200",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: [19.0825, 72.8900],
    type: "Apartment",
    bhk: "2",
    amenities: ["Gym", "Garden"],
    image: "https://example.com/imperial.jpg",
    status: "Ready to Move"
  },
  // Delhi properties
  {
    id: "DEL001",
    name: "DLF Kings Court",
    builder: "DLF",
    minimumPrice: "4.2 Cr",
    size: "2200",
    city: "Delhi",
    state: "Delhi",
    coordinates: [28.6139, 77.2090],
    type: "Apartment",
    bhk: "4",
    amenities: ["Swimming Pool", "Gym", "Tennis Court"],
    image: "https://example.com/dlf.jpg",
    status: "Dec 2024"
  },
  // Bangalore properties
  {
    id: "BLR001",
    name: "Prestige Lakeside Habitat",
    builder: "Prestige Group",
    minimumPrice: "3.1 Cr",
    size: "1750",
    city: "Bangalore",
    state: "Karnataka",
    coordinates: [12.9716, 77.5946],
    type: "Apartment",
    bhk: "3",
    amenities: ["Swimming Pool", "Gym", "Lake View"],
    image: "https://example.com/prestige.jpg",
    status: "Ready to Move"
  },
  // Add more properties for each city...
];

// You can add 40+ more properties following the same pattern
// ... (I'll provide more if needed) 