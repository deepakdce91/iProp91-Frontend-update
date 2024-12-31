import { MapPin, Building, Bed, Bath, MaximizeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PropertyCard({ property }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property-for-sale/${property.id}`, { state: { property } });
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={property.image}
          alt={property.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.tags?.map((tag, index) => (
            <span key={index} className="bg-white px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{property.developer}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span className="text-sm">{property.specifications.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span className="text-sm">{property.specifications.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <MaximizeIcon className="w-4 h-4" />
            <span className="text-sm">{property.specifications.area}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">{property.price.amount}</span>
            <span className="text-sm text-gray-500"> {property.price.type}</span>
          </div>
          <button 
            onClick={handleViewDetails}
            className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
        </div>
        {property.marketedBy && (
          <p className="text-xs text-gray-500 mt-3">
            Marketed by {property.marketedBy}
          </p>
        )}
      </div>
    </div>
  )
}

