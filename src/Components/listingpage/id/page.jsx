'use client'

import { useParams, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, MaximizeIcon } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const property = location.state?.property;

  if (!property) {
    return <div className="py-12 px-4 max-w-7xl mx-auto">Property not found</div>;
  }

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{property.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
            <img
              src={property.image}
              alt={property.title}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="flex gap-2 mb-4">
            {property.tags?.map((tag, index) => (
              <span key={index} className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">{property.location}</span>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="text-2xl font-bold mb-1">{property.price.amount}</div>
              <div className="text-gray-600">{property.price.type}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Bed className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm font-medium">{property.specifications.bedrooms} Beds</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Bath className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm font-medium">{property.specifications.bathrooms} Baths</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <MaximizeIcon className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm font-medium">{property.specifications.area}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Developer</h3>
              <p className="text-gray-600">{property.developer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
