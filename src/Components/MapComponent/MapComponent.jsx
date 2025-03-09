import React, { useState } from 'react';
import { Map, Marker } from 'pigeon-maps';

const PigeonMap = () => {
  // State to track which marker is being hovered and its position
  const [hoverInfo, setHoverInfo] = useState(null);
  
  // Coordinates for New Delhi
  const center = [28.6139, 77.2090];
  
  // Dummy data for 5 random locations in New Delhi with random prices
  const locations = [
    { id: 1, name: 'India Gate', position: [28.6129, 77.2295], price: '₹500' },
    { id: 2, name: 'Connaught Place', position: [28.6315, 77.2167], price: '₹700' },
    { id: 3, name: 'Lotus Temple', position: [28.5535, 77.2588], price: '₹300' },
    { id: 4, name: 'Red Fort', position: [28.6562, 77.241], price: '₹600' },
    { id: 5, name: 'Qutub Minar', position: [28.5245, 77.1855], price: '₹400' },
  ];

  return (
    <div className='w-full min-h-[50vh]'>
      <Map 
        center={center} 
        zoom={12} 
        height={600}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            anchor={location.position}
            payload={location}
            onMouseOver={({ payload, anchor }) => {
              setHoverInfo({
                location: payload,
                x: anchor[1],
                y: anchor[0]
              });
            }}
            onMouseOut={() => setHoverInfo(null)}
            onClick={({ payload }) => {
              // You can still keep click functionality if needed
              console.log(`Clicked on ${payload.name}`);
            }}
          />
        ))}
      </Map>
      
      {/* Tooltip that appears on hover */}
      {hoverInfo && (
        <div className='absolute left-[45%] bottom-[20%] translate-x-12 bg-white shadow-md cursor-pointer p-2 rounded-xl   '
          
        >
          <div style={{ fontWeight: 'bold' }}>{hoverInfo.location.name}</div>
          <div>Price: {hoverInfo.location.price}</div>
        </div>
      )}
    </div>
  );
};

export default PigeonMap;