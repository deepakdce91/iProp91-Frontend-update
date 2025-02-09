import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import ListedPropertyCard from '../CompoCards/Cards/ListedCards';

const ApprovedListedProperties = ({ propertyData }) => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  

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
      
      // Filter listings based on propertyData
      if (propertyData && propertyData.length > 0) {
        const userPropertyIds = propertyData.map(property => property._id);
        console.log("User Property IDs:", userPropertyIds);
        
        const matchedListings = response.data.filter(listing => 
          userPropertyIds.includes(listing.propertyId)
        );
        
        console.log("Matched Listings:", matchedListings);
        setFilteredListings(matchedListings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [propertyData]); // Re-fetch when propertyData changes

  const handleUpdate = async (listingId, updatedDetails) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const listingToUpdate = listings.find(listing => listing._id === listingId);
    // Determine listing type based on which details object exists
    const listingType = listingToUpdate.rentDetails ? "rent" : "sell";

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/listings/update${listingType}listing/${listingId}`,
        updatedDetails,
        {
          headers: { "auth-token": token },
          params: { userId }
        }
      );

      console.log("Updated listing:", response.data);
      fetchListings();
      alert("Listing updated successfully.");
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing.");
    }
  };

  const handleDelete = async (listingId) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        // Fetch the property details before deletion
        const listingToDelete = listings.find(listing => listing._id === listingId);
        const propertyId = listingToDelete.propertyId;
        const listingType = listingToDelete.rentDetails ? "rent" : "sell"; // Determine listing type
        
        // Debug logs for the listing being deleted
        console.log("Listing to delete:", {
          listingId,
          propertyId,
          listingType,
          currentListings: listings.filter(l => l.propertyId === propertyId)
        });

        // Delete the listing
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/listings/deletelisting/${listingId}`, {
          headers: { "auth-token": token },
          params: { userId },
        });

        const propertyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}`, {
          headers: { "auth-token": token },
          params: { userId }
        });

        const currentClassification = propertyResponse.data.classification.toLowerCase();
        console.log("Current property classification:", currentClassification);

        let newClassification;
        if (currentClassification === "rent and sell") {
          // Get remaining listings BEFORE updating newClassification
          const remainingListings = listings.filter(listing => 
            listing.propertyId === propertyId && listing._id !== listingId
          );
          
          console.log("Remaining listings:", remainingListings.map(l => ({
            id: l._id,
            type: l.listingType
          })));

          // Check listing types in remaining listings
          const hasRentListing = remainingListings.some(listing => listing.listingType === "rent");
          const hasSellListing = remainingListings.some(listing => listing.listingType === "sell");

          console.log("Has rent listing:", hasRentListing);
          console.log("Has sell listing:", hasSellListing);

          if (listingToDelete.listingType === "rent" && hasSellListing) {
            newClassification = "sell";
          } else if (listingToDelete.listingType === "sell" && hasRentListing) {
            newClassification = "rent";
          } else {
            newClassification = "unclassified";
          }
        } else if (currentClassification === "rent" || currentClassification === "sell") {
          newClassification = "unclassified";
        }

        console.log("New classification will be:", newClassification);

        // Update the property classification
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${propertyId}`, 
          { classification: newClassification },
          {
            headers: { "auth-token": token },
            params: { userId }
          }
        );

        fetchListings();
        alert(`Listing deleted successfully. New classification: ${newClassification}`);
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing.");
      }
    }
  };

  return (
    <section className='border-t-[1px] border-t-gray-500 w-full '>
      <p className='text-2xl  font-bold text-primary mt-5 mx-5'>My Listings</p>
      <div className='grid grid-cols-1 gap-5 md:p-5 p-3'>
        {filteredListings.map((listing) => (
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
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </section>
  );
}

export default ApprovedListedProperties;