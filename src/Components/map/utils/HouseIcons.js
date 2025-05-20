import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { FaHouseChimney } from "react-icons/fa6";

// Import house icon images

const nearbyHouseIconUrl = 'https://cdn-icons-png.flaticon.com/128/609/609752.png';
const activeHouseIconUrl = 'https://cdn-icons-png.flaticon.com/128/609/609752.png';
const userLocationIconUrl = 'https://cdn-icons-png.flaticon.com/128/684/684908.png';
const blackHouseIconUrl = 'https://cdn-icons-png.flaticon.com/128/484/484167.png'; // Black house icon

// Create house icon using image URLs
export const createHouseIcon = () => {
  return L.divIcon({
    className: 'house-icon',
    html: <FaHouseChimney />,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

// Create black house icon
export const createBlackHouseIcon = () => {
  return new L.Icon({
    iconUrl: blackHouseIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
    className: 'black-house-icon'
  });
};

// Create nearby house icon
export const createNearbyHouseIcon = () => {
  return new L.Icon({
    iconUrl: nearbyHouseIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
    className: 'nearby-house-icon'
  });
};

// Active house icon
export const createActiveHouseIcon = () => {
  return new L.Icon({
    iconUrl: activeHouseIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -38],
    className: 'active-house-icon'
  });
};

// User location icon
export const createUserLocationIcon = () => {
  return new L.Icon({
    iconUrl: userLocationIconUrl,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: 'user-location-icon'
  });
};

// Base icon as fallback
export const baseHouseIcon = new L.Icon.Default(); 