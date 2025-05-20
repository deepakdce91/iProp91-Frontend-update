import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, setSelectedProperty }) => {
  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => setSelectedProperty(property)}
    >
      <div className="relative h-[200px] overflow-hidden rounded-xl">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        
        {property.isNew && (
          <div className="absolute top-4 left-4 bg-white py-1 px-2 rounded text-xs font-semibold">
            New
          </div>
        )}
        
        <div className="absolute top-4 left-4 z-[2]">
          {property.isFavorite && (
            <div className="bg-white py-1 px-2 rounded text-xs font-semibold">
              Guest favourite
            </div>
          )}
        </div>
      </div>
      
      <div className="py-3">
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-[15px] font-medium">
            {property.type} in {property.location}
          </h3>
          {property.rating > 0 ? (
            <div className="flex items-center text-sm font-medium">
              <FaStar className="mr-1" /> {property.rating} ({property.reviews})
            </div>
          ) : (
            <div className="text-sm">New</div>
          )}
        </div>
        
        <p className="text-[15px] text-gray-500 mb-1.5">{property.title}</p>
        
        {property.freeCancel && (
          <p className="text-sm mb-1">Free cancellation</p>
        )}
        <p className="text-sm text-gray-500 mb-1">{property.dates}</p>
        
        <div className="flex justify-between items-center mt-2.5">
          <p className="font-semibold text-[15px]">{property.pricePerNight}</p>
          <Link 
            to={`/property-details/${property.id}`} 
            className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium transition-all hover:bg-[#e13151] hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            More Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const PropertyList = ({ properties, setSelectedProperty, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard 
          key={property.id}
          property={property}
          setSelectedProperty={setSelectedProperty}
        />
      ))}
    </div>
  );
};

export default PropertyList; 