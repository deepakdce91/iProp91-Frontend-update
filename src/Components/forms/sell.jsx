import { X } from "lucide-react";
import React, { useState } from "react";
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
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
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
        expiresIn: 3600,
      }); // URL valid for 1 hour

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
        ContentType: myFile.type
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
      const mediaPaths = await Promise.all(
        mediaFiles.map((file) => uploadFileToCloud(file, userId))
      );

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
          media: mediaPaths, // Use the uploaded media URLs
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

  return (
    <div className="h-screen z-20 fixed w-[90%] overflow-y-auto custom-scrollbar ">
      <div className="backdrop-blur-sm flex flex-col items-center rounded-lg relative overflow-y-auto max-h-[80vh] w-full ">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 relative bg-white px-4 md:px-14 py-10 rounded-lg shadow-md border-[1px] border-black"
        >
          <span
            onClick={closeSellModal}
            className="cursor-pointer absolute right-3"
          >
            <X />
          </span>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Sell Form</h2>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <div>
              <label className="text-sm text-gray-800">numberOfFloors</label>
              <input
                type="text"
                placeholder="Enter numberOfFloors"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.numberOfFloors}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfFloors: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">numberOfParkings</label>
              <input
                type="number"
                placeholder="Enter No of numberOfParkings"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.numberOfParkings}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfParkings: e.target.value })
                }
              />
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

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full bg-white border-b-[5px] border-b-gray-300 border-[2px] border-gray-500 hover:border-gold hover:border-b-gold px-4 py-2 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellForm;
