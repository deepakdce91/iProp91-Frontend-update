import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import ListedPropertyCard from '../CompoCards/Cards/ListedCards';

const ApprovedListedProperties = ({prop}) => {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/listings/fetchalllistings`, {
        headers: {
          "auth-token": token
        },
        params: { userId }
      });
      setListings(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings(); // Fetch listings when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  const handleDelete = async (listingId) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        // Fetch the property details before deletion
        const listingToDelete = listings.find(listing => listing._id === listingId);
        const propertyId = listingToDelete.propertyId; // Assuming propertyId is available in the listing

        // Delete the listing
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/listings/deletelisting/${listingId}`, {
          headers: {
            "auth-token": token
          },
          params: { userId },
        });

        // Update the property classification
        const propertyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}`, {
          headers: { "auth-token": token },
          params: { userId }
        });

        const currentClassification = propertyResponse.data.classification.toLowerCase(); // Ensure classification is in lowercase

        let newClassification;
        if (currentClassification === "rent") {
          newClassification = "unclassified"; // Update to unclassified
        } else if (currentClassification === "sell") {
          newClassification = "unclassified"; // Update to unclassified
        } else if (currentClassification === "rent and sell") {
          // Logic to determine which classification to keep
          const remainingListings = listings.filter(listing => listing.propertyId === propertyId);
          if (remainingListings.some(listing => listing.listingType === "rent")) {
            newClassification = "rent"; // Keep Rent classification
          } else if (remainingListings.some(listing => listing.listingType === "sell")) {
            newClassification = "sell"; // Keep Sell classification
          } else {
            newClassification = "unclassified"; // No listings left
          }
        }

        // Update the property classification
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${propertyId}`, 
          { classification: newClassification },
          {
            headers: { "auth-token": token },
            params: { userId }
          }
        );

        // Re-fetch listings after deletion
        fetchListings();

        alert("Listing deleted successfully.");
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing.");
      }
    }
  };

  return (
    <section className='border-t-[1px] border-t-gray-500 w-full min-h-[50vh]'>
      <p className='text-2xl  font-bold text-primary mt-5 mx-5'>My Listed Properties</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5'>
        {listings.map((listing) => (
          <ListedPropertyCard
            key={listing._id}
            propertyType={listing.sellDetails?.type || listing.rentDetails?.type }
            unitNo={listing.sellDetails?.unitNumber || listing.rentDetails?.unitNumber}
            size={listing.sellDetails?.size || listing.rentDetails?.size}
            price={listing.sellDetails?.expectedPrice || listing.rentDetails?.expectedRent}
            washrooms={listing.sellDetails?.numberOfWashrooms || listing.rentDetails?.numberOfWashrooms}
            floors={listing.sellDetails?.numberOfFloors || listing.rentDetails?.numberOfFloors}
            parkings={listing.sellDetails?.numberOfParkings || listing.rentDetails?.numberOfParkings}
            media={listing.sellDetails?.media || listing.rentDetails?.media}
            listingType={listing.sellDetails ? "sell" : "rent"}
            details={listing.sellDetails ? listing.sellDetails : listing.rentDetails}
            listingId={listing._id}
            onDelete={() => handleDelete(listing._id)}
          />
        ))}
      </div>
    </section>
  );
}

export default ApprovedListedProperties;