import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const PropertyDetail = ({ properties }) => {
  const { id } = useParams();
  const property = properties.find(prop => prop.id === parseInt(id));
  console.log('Properties:', properties);
  console.log('Selected Property:', property);

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{property.title}</h2>
      <div className="relative h-48 mb-4">
        <img
          src={property.image}
          alt={property.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
        <MapPin className="w-4 h-4" />
        <span>{property.location}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{property.description}</p>
      <p className="font-bold text-lg">{property.price}</p>
    </div>
  );
};

export default PropertyDetail;
