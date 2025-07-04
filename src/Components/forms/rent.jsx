import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { client, getSignedUrlForPrivateFile } from "../../config/s3client";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { supabase } from "../../config/supabase";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BuyForm = ({ closeBuyModal, propertyId }) => {
  const [formData, setFormData] = useState({ 
    unitNumber: "",
    size: "",
    expectedRent: "",
    availableFrom: "",
    propertyType: "",
    noOfWashrooms: "",
    floor: "",
    parking: "",
    securityDeposit: "",
    furnished: "non-furnished",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch property details on component mount
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const tokenid = jwtDecode(token);
        const userId = tokenid.userId;

        // Fetch property details to pre-fill the form
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}`,
          {
            headers: { "auth-token": token },
            params: { userId },
          }
        );

        const propertyData = response.data;

        console.log(`Fetched property data:`, propertyData);
        
        // Check if there's an existing rent listing for this property
        // and pre-fill the form with that data
        if (propertyData) {
          // If there's a rentListing property, use it to pre-fill the form
          if (propertyData) {

            const rentDetails = propertyData;
            setFormData({
              unitNumber: rentDetails.unit || "",
              size: rentDetails.size || propertyData.size || "",
              expectedRent: rentDetails.expectedRent || "",
              availableFrom: rentDetails.availableFrom ? rentDetails.availableFrom.split('T')[0] : "",
              propertyType: rentDetails.type || propertyData.type || "",
              noOfWashrooms: rentDetails.numberOfWashrooms || propertyData.noOfWashrooms || "",
              floor: rentDetails.numberOfFloors || propertyData.floor || "",
              parking: rentDetails.numberOfParkings || propertyData.parking || "",
              securityDeposit: rentDetails.securityDeposit || "",
              furnished: rentDetails.furnishedStatus || "non-furnished",
            });
          } else {
            // Otherwise just pre-fill with property basic details
            setFormData({
              ...formData,
              size: propertyData.size || "",
              propertyType: propertyData.type || "",
              noOfWashrooms: propertyData.noOfWashrooms || "",
              floor: propertyData.floor || "",
              // Keep other fields as they are
            });
          }
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
    }
  }, [propertyId]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  //  Helper function to remove spaces from filename
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
      const myPath = `RentListings/${myFileName}`;
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    const userId = tokenid.userId;

    try {
      // Upload files and get media data
      const mediaPaths = await Promise.all(
        mediaFiles.map((file) => uploadFileToCloud(file, userId))
      );

      // Format media data as array of objects
      const formattedMedia = mediaPaths.map((media) => ({
        name: media.name,
        url: media.url,
      }));

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
      let newClassification = "rent";

      if (currentClassification === "sell") {
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

      // Add rent listing with formatted media
      const reqBody = {
        propertyId: propertyId,
        rentDetails: {
          unitNumber: formData.unitNumber,
          size: formData.size,
          expectedRent: formData.expectedRent,
          availableFrom: formData.availableFrom || "",
          type: formData.propertyType,
          securityDeposit: formData.securityDeposit || "",
          furnishedStatus: formData.furnished,
          numberOfWashrooms: formData.noOfWashrooms || "",
          numberOfFloors: formData.floor || "",
          numberOfParkings: formData.parking || "",
          media: formattedMedia, // Use the formatted media array
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/listings/addrentlisting?userId=${userId}`,
        reqBody,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

      toast.success("Property listed for rent successfully!");
      closeBuyModal();
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
        <div
          onClick={closeBuyModal}
          className="absolute w-full h-full bg-black/40 backdrop-blur-sm"
        />
        <div className="relative bg-white h-32 rounded-lg shadow-xl w-full max-w-[90%] lg:max-w-[50%] mx-4 animate-fadeIn flex items-center justify-center">
          <div className="text-xl">Loading property details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 z-50 flex items-center justify-center w-full left-0 h-screen">
      {/* Backdrop */}
      <div
        onClick={closeBuyModal}
        className="absolute w-full h-full bg-black/40 backdrop-blur-sm"
      />

      <div className="relative bg-white h-[80vh] lg:h-[90vh] rounded-lg shadow-xl w-full max-w-[90%] lg:max-w-[50%] mx-4 animate-fadeIn overflow-y-auto no-scrollbar mt-20 lg:mt-0">
        <form
          onSubmit={handleSubmit}
          className="relative space-y-6 px-7 md:px-14 py-5 rounded-lg shadow-md overflow-y-scroll"
        >
          <span
            onClick={closeBuyModal}
            className="cursor-pointer absolute right-3"
          >
            <X />
          </span>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">List your property for rent</h2>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label className="text-sm text-gray-800">Unit No</label>
                <input
                  type="text"
                  placeholder="Enter Unit Number"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.unitNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, unitNumber: e.target.value })
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
                <label className="text-sm text-gray-800">Expected Rent</label>
                <input
                  type="text"
                  placeholder="Enter Expected Rent"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.expectedRent}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedRent: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-800">Available From</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.availableFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, availableFrom: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
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

              <div className="flex-1">
                <label className="text-sm text-gray-800">No of Washrooms</label>
                <input
                  type="number"
                  placeholder="Enter Number of Washrooms"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.noOfWashrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, noOfWashrooms: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-800">Floor</label>
                <input
                  type="text"
                  placeholder="Enter Floor Number"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-800">Parking</label>
                <input
                  type="text"
                  placeholder="Enter Parking Details"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.parking}
                  onChange={(e) =>
                    setFormData({ ...formData, parking: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <label className="text-sm text-gray-800">
                  Security Deposit (in Rs)
                </label>
                <input
                  type="text"
                  placeholder="Enter Security Deposit"
                  className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                  value={formData.securityDeposit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      securityDeposit: e.target.value,
                    })
                  }
                />
              </div>

              {/* Furnished or Non-Furnished */}
              <div className="space-y-2 flex-1 ">
                <label className="text-sm text-gray-800">
                  Furnished Status
                </label>
                <div className="flex gap-4">
                  {["furnished", "non-furnished"].map((status) => (
                    <label key={status} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="furnished"
                        value={status}
                        checked={formData.furnished === status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            furnished: e.target.value,
                          })
                        }
                        className="h-4 w-4 accent-gray-700"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-800">Upload Media</label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {mediaFiles.map((file, index) => (
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
              onClick={closeBuyModal}
              className={`w-full bg-black px-4 py-2 text-white rounded-xl`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyForm;