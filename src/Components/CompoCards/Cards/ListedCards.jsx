import React, { useState } from "react";
import { Plus, X, Edit } from "lucide-react";

const ListedPropertyCard = ({
  propertyType,
  unitNo,
  size,
  price,
  washrooms,
  media,
  listingType,
  details,
  listingId,
  onDelete,
  parkings,
  floors,
  location = "N/A",
  emi = "N/A",
  beds = "N/A",
  baths = "N/A",
  balcony = "N/A",
  furnished = "N/A",
  developer = "N/A",
  project = "N/A",
  transactionType = "N/A",
  status = "N/A",
  facing = "N/A",
  ageOfConstruction = "N/A",
  pricePerSqft = "N/A",
  onUpdate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    unitNumber: details?.unitNumber || "",
    size: details?.size || "",
    type: details?.type || "",
    numberOfWashrooms: details?.numberOfWashrooms || "",
    numberOfFloors: details?.numberOfFloors || "",
    numberOfParkings: details?.numberOfParkings || "",
    media: details?.media || [],
    ...(listingType === "rent"
      ? {
          expectedRent: details?.expectedRent || "",
          securityDeposit: details?.securityDeposit || "",
          furnishedStatus: details?.furnishedStatus || "",
          availableFrom: details?.availableFrom || "",
        }
      : {
          expectedPrice: details?.expectedPrice || "",
        }),
  });

  const handleInputChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitUpdate = () => {
    const updatedDetails =
      listingType === "rent"
        ? { rentDetails: updateFormData }
        : { sellDetails: updateFormData };

    onUpdate(listingId, updatedDetails);
    setShowUpdateModal(false);
  };

  return (
    <div className="bg-white  rounded-lg overflow-hidden shadow-md border-[1px] border-gray-400 ">
      {/* Header Section */}
      <div className="px-4 py-2 border-b">
        <div className="flex justify-between items-start">
          <div>
            <div className="mt-2">
              <h2 className="text-2xl font-medium">
                 For {listingType} in {propertyType}
              </h2>
              <p className="text-gray-600">{location}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center p-4">
        {/* Image Gallery */}
        <div className="relative flex-1 ">
          <div className="relative ">
            {media?.length > 0 ? (
              <div className="grid grid-cols-2 gap-0.5 ">
                {media.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className={`relative  ${index === 0 ? "row-span-2" : ""}`}
                  >
                    <img
                      // src={item.url}
                      src="./images/image.jpg"
                      alt={item.name}
                      className="w-full h-full object-cover "
                    />
                  </div>
                ))}
                {media.length > 3 && (
                  <div
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-10 right-4 bg-black/70 px-3 py-1.5 rounded-md cursor-pointer"
                  >
                    <span className="text-white text-sm font-medium">
                      +{media.length - 3} Photos
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
          </div>
        </div>
        {/* Property Details */}
        <div className="p-4 mt-10 flex-1">
          <div className="  bg-black bg-opacity-85 w-full  rounded-lg ">
            <div className="grid grid-cols-4 gap-4 py-2  border-b text-white text-sm">
              <div className="text-center">
                <p className="text-xs text-gray-500">Beds</p>
                <p className="font-medium">{beds}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Baths</p>
                <p className="font-medium">{baths}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Balcony</p>
                <p className="font-medium">{balcony}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Furnished</p>
                <p className="font-medium">{furnished}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4">
            <div>
              <p className="text-sm text-gray-500">Super Built-Up Area</p>
              <p className="font-medium">
                {size}{" "}
                <span className="text-gray-500 text-sm">
                  ₹{pricePerSqft}/sqft
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Developer</p>
              <p className="font-medium">{developer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-medium">{project}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Floor</p>
              <p className="font-medium">{floors}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Transaction Type</p>
              <p className="font-medium">{transactionType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Facing</p>
              <p className="font-medium">{facing}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age Of Construction</p>
              <p className="font-medium">{ageOfConstruction}</p>
            </div>
          </div>

          <div className="w-full flex gap-4">
            <button
              onClick={() => onDelete(listingId)}
              className="w-full mt-4 py-2 px-4 bg-black text-white rounded hover:bg-black/80 transition-colors"
            >
              Delete Listing
            </button>
            <button
              onClick={() => setShowUpdateModal(true)}
              className="w-full mt-4 py-2 px-4 bg- text-black rounded bg-white border-[1px] border-black/40 transition-colors"
            >
              Update Listing
            </button>
          </div>
        </div>

        {/* Media Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">All Photos</h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={item.url || "./images/image.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Update Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Update Listing</h3>
                <button onClick={() => setShowUpdateModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={updateFormData.unitNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Add similar input fields for other properties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={updateFormData.size}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {listingType === "rent"
                      ? "Expected Rent"
                      : "Expected Price"}
                  </label>
                  <input
                    type="number"
                    name={
                      listingType === "rent" ? "expectedRent" : "expectedPrice"
                    }
                    value={
                      listingType === "rent"
                        ? updateFormData.expectedRent
                        : updateFormData.expectedPrice
                    }
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Add other fields based on listingType */}
                {listingType === "rent" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Security Deposit
                      </label>
                      <input
                        type="number"
                        name="securityDeposit"
                        value={updateFormData.securityDeposit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {/* Add other rent-specific fields */}
                  </>
                )}

                <div className="col-span-2 mt-4">
                  <button
                    onClick={handleSubmitUpdate}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListedPropertyCard;
