import React, { useState } from "react";
import {
  Plus,
  X,
  Home,
  DollarSign,
  Maximize,
  Bath,
  Car,
  Building,
} from "lucide-react";

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
}) => {
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  //   console.log(media)

  return (
    <div
      className={` rounded-lg overflow-hidden shadow-lg transition-colors duration-200 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="relative">
        <div className="relative aspect-video">
          {media?.length > 0 ? (
            <div
              className={`grid gap-1 h-full ${
                media.length === 1
                  ? "grid-cols-1"
                  : media.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 grid-rows-2"
              }`}
            >
              {media
                .slice(0, media.length > 4 ? 4 : media.length)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${
                      media.length === 3 && index === 2 ? "col-span-2" : ""
                    }`}
                  >
                    <img // using static img for testing 
                    src={"./images/image.jpg"} 
                    //   src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              {media.length > 4 && (
                <div
                  onClick={() => setShowModal(true)}
                  className="cursor-pointer absolute bottom-0 right-0 bg-black bg-opacity-50 p-2 m-2 rounded-full"
                >
                  <div className="text-white text-center flex items-center">
                    <Plus size={20} className="mr-1" />
                    <span className="text-sm">+{media.length - 3}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No image available
              </span>
            </div>
          )}
        </div>
        {/* <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            darkMode ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {darkMode ? "Light" : "Dark"}
        </button> */}
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <Home
            className={`mr-2 ${
              listingType === "sell" ? "text-gold" : "text-gold"
            }`}
          />
          <h3
            className={`text-xl font-bold ${
              listingType === "sell" ? "text-gold" : "text-gold"
            }`}
          >
            {propertyType} - For {listingType}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <DollarSign className="mr-2" />
            <span className="font-semibold">{price}</span>
          </div>
          <div className="flex items-center">
            <Maximize className="mr-2" />
            <span>{size}</span>
          </div>
          <div className="flex items-center">
            <Bath className="mr-2" />
            <span>{washrooms} Washrooms</span>
          </div>
          <div className="flex items-center">
            <Car className="mr-2" />
            <span>{parkings} Parkings</span>
          </div>
          <div className="flex items-center">
            <Building className="mr-2" />
            <span>{floors} Floors</span>
          </div>
          <div className="flex items-center">
            <Home className="mr-2" />
            <span>Unit: {unitNo}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(listingId)}
          className={`w-full py-2 px-4 rounded transition-colors duration-200 ${
            darkMode
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Delete Listing
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-black" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                All Media
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X
                  className={`w-6 h-6 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((item, index) => (
                <div key={index} className="relative aspect-video">
                  <img // using static img for testing 
                    src={"./images/image.jpg"} 
                    //   src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListedPropertyCard;
