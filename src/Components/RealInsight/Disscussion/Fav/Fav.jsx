import React, { useState } from 'react';

const images = [
  { id: 1, name: 'Mahira', src: './images/2.jpg' },
  { id: 2, name: 'Mahira', src: './images/2.jpg' },
  { id: 3, name: 'Mahira', src: './images/2.jpg' },
  { id: 4, name: 'Mahira', src: './images/2.jpg' },
  { id: 5, name: 'Mahira', src: './images/2.jpg' },
  { id: 6, name: 'Mahira', src: './images/2.jpg' },
  { id: 7, name: 'Mahira', src: './images/2.jpg' },
  { id: 8, name: 'Mahira', src: './images/2.jpg' },
 

 
];

const Favorites = () => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className='mt-4 '>
      <h2 className="text-lg font-bold mb-4">Favourites</h2>
      <div className="flex flex-row items-center justify-center w-[700px] mx-auto overflow-x-scroll  no-scrollbar">
        {images.map((image) => (
          <div
            key={image.id}
            className={`flex flex-col items-center cursor-pointer mx-2 
             `}
            onClick={() => setSelectedId(image.id)}
          >
            <img
              src={image.src}
              alt={image.name}
              className={`w-[60px] h-[60px] rounded-lg object-cover mb-2  ${selectedId === image.id ? 'border-2 border-orange-400 rounded-lg' : ''}`}
            />
            <span className={`text-sm ${selectedId === image.id ? 'text-orange-400 border-b-4 border-orange-500' : ''}`}>
              {image.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
