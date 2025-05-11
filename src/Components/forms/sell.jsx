import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { client } from "../../config/s3client";
import { supabase } from "../../config/supabase";

const SellForm = ({ closeSellModal, propertyId, onRefresh }) => {
  const [formData, setFormData] = useState({
    unitNo: "",
    size: "",
    expectedPrice: "",
    propertyType: "",
    noOfWashrooms: "",
    numberOfFloors: "",
    numberOfParkings: "",
    numberOfBedrooms: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [titleDeeds, setTitleDeeds] = useState([]);
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyVideos, setPropertyVideos] = useState([]);

  // Fetch property details when component mounts
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view property details");
          return;
        }

        const tokenid = jwtDecode(token);
        const userId = tokenid.userId;

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}`,
          {
            headers: { "auth-token": token },
            params: { userId },
          }
        );

        const propertyData = response.data;
        
        // Pre-fill form data from property details
        setFormData({
          unitNo: propertyData.unitNo || "",
          size: propertyData.size || "",
          expectedPrice: propertyData.defaultPrice || "",
          propertyType: propertyData.propertyType || "",
          noOfWashrooms: propertyData.noOfWashrooms || "",
          numberOfFloors: propertyData.numberOfFloors || "",
          numberOfParkings: propertyData.numberOfParkings || "",
          numberOfBedrooms: propertyData.numberOfBedrooms || "",
        });

        // Check if property already has sell listing data
        if (propertyData.sellListings && propertyData.sellListings.length > 0) {
          const sellListing = propertyData.sellListings[0];
          
          setFormData({
            unitNo: sellListing.unitNumber || propertyData.unitNo || "",
            size: sellListing.size || propertyData.size || "",
            expectedPrice: sellListing.expectedPrice || propertyData.defaultPrice || "",
            propertyType: sellListing.type || propertyData.propertyType || "",
            noOfWashrooms: sellListing.numberOfWashrooms || propertyData.noOfWashrooms || "",
            numberOfFloors: sellListing.numberOfFloors || propertyData.numberOfFloors || "",
            numberOfParkings: sellListing.numberOfParkings || propertyData.numberOfParkings || "",
            numberOfBedrooms: sellListing.numberOfBedrooms || propertyData.numberOfBedrooms || "",
          });
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    } else {
      setIsLoading(false);
    }
  }, [propertyId]);

  const handleMediaChange = async (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "titleDeeds") {
      setTitleDeeds(files);
    } else if (type === "propertyImages") {
      setPropertyImages(files);
    } else if (type === "propertyVideos") {
      setPropertyVideos(files);
    }
  };

  // Helper function to remove spaces from filename
  const removeSpaces = (filename) => filename.replace(/\s/g, "");

  // Get signed URL for private file
  const getSignedUrlForPrivateFile = async (path) => {
    try {
      const getParams = {
        Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
        Key: path,
        ResponseContentDisposition: "inline",
      };

      const command = new GetObjectCommand(getParams);
      const signedUrl = await getSignedUrl(client, command, {
        expiresIn: 3600
      }); 

      return {
        name: path.split("/")[path.split("/").length - 1],
        url: signedUrl,
      };
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  // Upload file to cloud storage
  const uploadFileToCloud = async (myFile) => {
    const myFileName = removeSpaces(myFile.name);
    const myPath = `SellListings/${myFileName}`;

    try {
      const uploadParams = {
        Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
        Key: myPath,
        Body: myFile,
        ContentType: myFile.type,
      };

      const command = new PutObjectCommand(uploadParams);
      await client.send(command);

      // Get the signed URL after successful upload
      const signedUrlData = await getSignedUrlForPrivateFile(myPath);
      if (!signedUrlData) {
        throw new Error("Failed to get signed URL");
      }

      return signedUrlData; // Returns both the name and url
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const uploadMediaFiles = async () => {
    const titleDeedLinks = await Promise.all(titleDeeds.map(uploadFileToCloud));
    const propertyImageLinks = await Promise.all(
      propertyImages.map(uploadFileToCloud)
    );
    const propertyVideoLinks = await Promise.all(
      propertyVideos.map(uploadFileToCloud)
    );

    return {
      titleDeeds: titleDeedLinks,
      propertyImages: propertyImageLinks,
      propertyVideos: propertyVideoLinks,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    const userId = tokenid.userId;

    console.log("User ID:", userId); // Log the userId for debugging

    // Check if userId is defined
    if (!userId) {
      console.error("User ID is undefined. Cannot proceed with upload.");
      toast.error("User ID is undefined. Please log in again.");
      setIsUploading(false);
      return; // Exit the function if userId is not valid
    }

    try {
      // Upload all media files and collect their URLs
      const mediaLinks = await uploadMediaFiles();

      // First, get the current property details
      const propertyResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}`,
        {
          headers: { "auth-token": token },
          params: { userId },
        }
      );

      const currentClassification =
        propertyResponse.data.classification || "unclassified";
      let newClassification = "sell";

      // If property is already classified as "Rent", update to "Rent and Sell"
      if (currentClassification === "rent") {
        newClassification = "rent and sell";
      }

      // Update property classification
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${propertyId}`,
        { classification: newClassification },
        {
          headers: { "auth-token": token },
          params: { userId },
        }
      );

      // Add sell listing
      const reqBody = {
        propertyId: propertyId,
        sellDetails: {
          unitNumber: formData.unitNo,
          size: formData.size,
          expectedPrice: formData.expectedPrice,
          type: formData.propertyType,
          numberOfWashrooms: formData.noOfWashrooms,
          numberOfFloors: formData.numberOfFloors,
          numberOfParkings: formData.numberOfParkings,
          numberOfBedrooms: formData.numberOfBedrooms,
          titleDeed: mediaLinks.titleDeeds, // Save title deeds links
          propertyPhotos: mediaLinks.propertyImages, // Save property images links
          propertyVideos: mediaLinks.propertyVideos, // Save property videos links
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/listings/addsalelisting?userId=${userId}`,
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      toast.success("Property listed for sell successfully!");
      if (onRefresh) onRefresh(); // Call the callback to refresh listings
      closeSellModal();
    } catch (error) {
      console.error(error.message);
      toast.error("Error occurred while listing the property.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute top-0 z-50 flex items-center justify-center w-full left-0 h-screen">
        <div className="absolute w-full h-full bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[90%] lg:max-w-[50%] p-8 mx-4 animate-fadeIn">
          <span className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </span>
          <p className="text-center mt-4 text-gray-700">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 z-50 flex items-center justify-center w-full left-0 h-screen">
      {/* Backdrop */}
      <div
        onClick={closeSellModal}
        className="absolute w-full h-full bg-black/40 backdrop-blur-sm "
      />
      <div className="relative bg-white h-[80vh] lg:h-[90vh] rounded-lg shadow-xl w-full max-w-[90%] lg:max-w-[50%] mx-4 animate-fadeIn overflow-y-auto no-scrollbar mt-20 lg:mt-0 ">
        <form
          onSubmit={handleSubmit}
          className="relative space-y-6 px-7 md:px-14 py-10 rounded-lg shadow-md overflow-y-scroll h-screen "
        >
          <span
            onClick={closeSellModal}
            className="cursor-pointer absolute right-3"
          >
            <X />
          </span>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">List your property for sale</h2>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-800">Unit No</label>
                <input
                  type="text"
                  placeholder="Enter Unit No"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.unitNo}
                  onChange={(e) =>
                    setFormData({ ...formData, unitNo: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-800">Size</label>
                <input
                  type="text"
                  placeholder="Enter Size"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <label className="text-sm text-gray-800">Expected Price</label>
                <input
                  type="text"
                  placeholder="Enter Expected Price"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.expectedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedPrice: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-800">Type</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value })
                  }
                >
                  <option value="">Select Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">Independent House</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <label className="text-sm text-gray-800">No of Washrooms</label>
                <input
                  type="number"
                  placeholder="Enter No of Washrooms"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.noOfWashrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfWashrooms: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-800">Floor no.</label>
                <input
                  type="text"
                  placeholder="Enter Floor No."
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.numberOfFloors}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfFloors: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <label className="text-sm text-gray-800">
                  Number of Parkings
                </label>
                <input
                  type="number"
                  placeholder="Enter No of Parkings"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.numberOfParkings}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfParkings: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-800">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  placeholder="Enter No of Bedrooms"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.numberOfBedrooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfBedrooms: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Title Deeds Section */}
          <div>
            <label className="text-sm text-gray-800">Upload Title Deeds</label>
            <input
              type="file"
              multiple
              accept="application/pdf,image/*"
              onChange={(e) => handleMediaChange(e, "titleDeeds")}
              className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {titleDeeds.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Images Section */}
          <div>
            <label className="text-sm text-gray-800">
              Upload Property Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleMediaChange(e, "propertyImages")}
              className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {propertyImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Videos Section */}
          <div>
            <label className="text-sm text-gray-800">
              Upload Property Videos
            </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleMediaChange(e, "propertyVideos")}
              className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {propertyVideos.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full bg-white border-[2px] border-black px-4 py-2 text-black rounded-xl ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </button>
            <button 
              type="button"
              onClick={closeSellModal}
              className="w-full bg-black px-4 py-2 text-white rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellForm;