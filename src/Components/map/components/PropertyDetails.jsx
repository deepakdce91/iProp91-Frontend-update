import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import mockProperties from '../data/mockProperties';
import Header from './Header';
import PropertyNav from './PropertyNav';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the property data from an API
    // Here we're just filtering from our mock data
    setLoading(true);
    setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === parseInt(id));
      setProperty(foundProperty || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <>
        <Header setShowFilters={setShowFilters} />
        <PropertyNav setShowFilters={setShowFilters} />
        <div className="property-details-page loading">
          <div className="loading-spinner"></div>
          <p>Loading property details...</p>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header setShowFilters={setShowFilters} />
        <PropertyNav setShowFilters={setShowFilters} />
        <div className="property-details-page not-found">
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to listings
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header setShowFilters={setShowFilters} />
      <PropertyNav setShowFilters={setShowFilters} />
      <div className="property-details-page">
        <div className="details-header">
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to listings
          </Link>
          <h1>{property.title}</h1>
          <div className="details-subheader">
            {property.rating > 0 ? (
              <div className="rating">
                <FaStar /> {property.rating} ({property.reviews} reviews)
              </div>
            ) : (
              <div className="rating new">New Property</div>
            )}
            <div className="location">{property.type} in {property.location}</div>
          </div>
        </div>
        
        <div className="property-gallery">
          {property.images.map((image, index) => (
            <div key={index} className="gallery-image">
              <img src={image} alt={`${property.title} - Image ${index + 1}`} />
            </div>
          ))}
        </div>
        
        <div className="details-content">
          <div className="details-main">
            <div className="details-section">
              <h2>About this place</h2>
              <p>
                This beautiful {property.type.toLowerCase()} is located in the heart of {property.location}. 
                Perfect for a comfortable stay, with all amenities you need for a memorable experience.
              </p>
            </div>
            
            <div className="details-section">
              <h2>What this place offers</h2>
              <ul className="amenities-list">
                <li>Free WiFi</li>
                <li>Air conditioning</li>
                <li>Dedicated workspace</li>
                <li>Free parking on premises</li>
                <li>TV with standard cable</li>
                <li>Kitchen</li>
              </ul>
            </div>
          </div>
          
          <div className="details-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <span className="price">{property.pricePerNight}</span>
              </div>
              
              <div className="booking-dates">
                <div className="check-in">
                  <label>Check-in</label>
                  <div className="date-input">{property.dates.split('-')[0]}</div>
                </div>
                <div className="check-out">
                  <label>Check-out</label>
                  <div className="date-input">{property.dates.split('-')[1]}</div>
                </div>
              </div>
              
              <button className="reserve-button">Reserve</button>
              
              {property.freeCancel && (
                <p className="cancel-policy">Free cancellation</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails; 