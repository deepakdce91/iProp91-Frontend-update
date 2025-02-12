import React, { useState } from "react";
import { Plus, X, Edit, Trash, Pen } from "lucide-react";

const ListedPropertyCard = ({
  propertyType,
  availableFrom,
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
  beds = "N/A",
  balcony = "N/A",
  furnished = "N/A",
  developer = "N/A",
  project = "N/A",
  location,
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

  const [activeIndex, setActiveIndex] = useState(0);

  const propertyFields = [
    { label: "Area", value: size },
    { label: "Developer", value: developer },
    { label: "Beds", value: beds },
    { label: "Washrooms", value: washrooms },
    { label: "Furnished", value: furnished },
    { label: "Project", value: project },
    { label: "Floor", value: floors },
    { label: "Available From", value: availableFrom },
    { label: "Expected Rent", value: price },
    { label: "Parkings", value: parkings },
    { label: "Unit Number", value: unitNo },
    { label: "Security Deposit", value: details?.securityDeposit },
  ];

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

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
    <div className="bg-white overflow-hidden">
      {/* Header Section */}
      <div className="px-2 md:px-4 py-2 border-[2px] border-gray-400 rounded-lg bg-gradient-to-r from-gray-300 to-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <div className="mt-2">
              <h2 className="text-2xl font-medium capitalize">
                For {listingType} / {propertyType}
              </h2>
              <p className="text-gray-600">{location}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <button
                onClick={() => onDelete(listingId)}
                className="text-sm flex gap-2 text-black p-2 items-center border-b-[2px] border-b-black"
              >
                <Trash className="w-4 h-4" />
                Remove Listing
              </button>
            </div>
            <div>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="text-sm flex gap-2 text-black p-2 items-center border-b-[2px] border-b-black"
              >
                <Pen className="w-4 h-4"/>
                Edit Listing
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-5 p-4">
        {/* Image Gallery */}
        <div className="relative md:w-[30%] w-full rounded-xl overflow-hidden">
          <div className="relative">
            {media?.length > 0 ? (
              <div className="grid grid-cols-2 gap-0.5">
                {media.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${index === 0 ? "row-span-2" : ""}`}
                  >
                    <img
                      src={"/images/image.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onClick={() => setShowModal(true)}
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
              <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No images available</span>
              </div>
            )}
          </div>
        </div>
        {/* Property Details */}
        <div className="md:w-[70%] w-full">
          <div className="grid md:grid-cols-4 grid-cols-3 gap-x-8 gap-y-4 p-4">
            {propertyFields.map((field, index) => (
              <div key={index}>
                <p className="text-sm text-gray-500">{field.label}</p>
                <p className="font-medium text-xs">{field.value}</p>
              </div>
            ))}
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
              <div className="relative">
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={"/images/image.jpg"}
                  alt={media[activeIndex].name}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                {media.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      activeIndex === index ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
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