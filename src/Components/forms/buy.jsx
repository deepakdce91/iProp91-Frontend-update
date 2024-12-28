import { X } from "lucide-react";
import React, { useState } from "react";

const BuyForm = ({closeBuyModal}) => {
  const [propertyFor, setPropertyFor] = useState("sale");
  const [userType, setUserType] = useState("owner");
  const [formData, setFormData] = useState({
    unitNo: "",
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

  // Additional fields based on property type
  const [saleSpecificData, setSaleSpecificData] = useState({
    expectedPrice: "",
    propertyAge: "",
    possessionStatus: "",
  });

  const [rentSpecificData, setRentSpecificData] = useState({
    monthlyRent: "",
    securityDeposit: "",
    availableFrom: "",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(formData, mediaFiles);
    setIsUploading(false);
  };

  return (
    <div className="h-screen z-20 fixed w-[90%] overflow-y-auto custom-scrollbar ">
      <div className="backdrop-blur-sm flex flex-col items-center rounded-lg relative overflow-y-auto max-h-[80vh] w-full border-[1px] ">
      
        <form onSubmit={handleSubmit} className="relative space-y-6 bg-white px-4 md:px-14 py-10 rounded-lg shadow-md border-[1px] border-black">
        <span onClick={closeBuyModal} className="cursor-pointer absolute right-3">
        <X/>
        </span>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Rent Form
            </h2>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            
            <div>
              <label className="text-sm text-gray-800">Unit No</label>
              <input
                type="text"
                placeholder="Enter Unit Number"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.unitNo}
                onChange={(e) => setFormData({ ...formData, unitNo: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Size</label>
              <input
                type="text"
                placeholder="Enter Size"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Expected Rent</label>
              <input
                type="text"
                placeholder="Enter Expected Rent"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.expectedRent}
                onChange={(e) => setFormData({ ...formData, expectedRent: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Available From</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Type</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
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
                placeholder="Enter Number of Washrooms"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.noOfWashrooms}
                onChange={(e) => setFormData({ ...formData, noOfWashrooms: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Floor</label>
              <input
                type="text"
                placeholder="Enter Floor Number"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Parking</label>
              <input
                type="text"
                placeholder="Enter Parking Details"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.parking}
                onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-800">Security Deposit (in Rs)</label>
              <input
                type="text"
                placeholder="Enter Security Deposit"
                className="mt-1 w-full rounded-md border border-gray-500 p-2 focus:border-gold focus:outline-none"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
              />
            </div>

            {/* Furnished or Non-Furnished */}
            <div className="space-y-2">
              <label className="text-sm text-gray-800">Furnished Status</label>
              <div className="flex gap-4">
                {["furnished", "non-furnished"].map((status) => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="furnished"
                      value={status}
                      checked={formData.furnished === status}
                      onChange={(e) => setFormData({ ...formData, furnished: e.target.value })}
                      className="h-4 w-4 accent-gray-700"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
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

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full bg-white border-b-[5px] border-b-gray-300 border-[2px] border-gray-500 hover:border-gold hover:border-b-gold px-4 py-2 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyForm;
