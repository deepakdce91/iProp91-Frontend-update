import { X } from 'lucide-react';
import React, { useState } from 'react'

const SellForm = ({closeSellModal}) => {
    const [propertyFor, setPropertyFor] = useState("rent");
    const [userType, setUserType] = useState("owner");
    const [formData, setFormData] = useState({
      unitNo: "",
      size: "",
      expectedPrice: "",
      propertyType: "",
      noOfWashrooms: "",
      floor: "",
      parkings: "",
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    };
  return (
    <div className="h-screen z-20 fixed w-[90%] overflow-y-auto custom-scrollbar ">
      <div className="backdrop-blur-sm flex flex-col items-center rounded-lg relative overflow-y-auto max-h-[80vh] w-full ">
        <form onSubmit={handleSubmit} className="space-y-6 relative bg-white px-4 md:px-14 py-10 rounded-lg shadow-md border-[1px] border-black">
        <span onClick={closeSellModal} className="cursor-pointer absolute right-3">
        <X/>
        </span>
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Sell Form
            </h2>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Unit No</label>
              <input
                type="text"
                placeholder="Enter Unit No"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.unitNo}
                onChange={(e) =>
                  setFormData({ ...formData, unitNo: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Size</label>
              <input
                type="text"
                placeholder="Enter Size"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Expected Price</label>
              <input
                type="text"
                placeholder="Enter Expected Price"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.expectedPrice}
                onChange={(e) =>
                  setFormData({ ...formData, expectedPrice: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Type</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
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
              <label className="text-sm text-gray-600">No of Washrooms</label>
              <input
                type="number"
                placeholder="Enter No of Washrooms"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.noOfWashrooms}
                onChange={(e) =>
                  setFormData({ ...formData, noOfWashrooms: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Floor</label>
              <input
                type="text"
                placeholder="Enter Floor"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Parkings</label>
              <input
                type="number"
                placeholder="Enter No of Parkings"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.parkings}
                onChange={(e) =>
                  setFormData({ ...formData, parkings: e.target.value })
                }
              />
            </div>
          </div>

          

          {/* Terms and Conditions */}
          {/* <div className="space-y-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-gold"
                checked={formData.exclusivePosting}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exclusivePosting: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-gray-600">
                I am posting this property 'exclusively' on Magicbricks
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-gold"
                checked={formData.whatsappUpdates}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappUpdates: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-gray-600">
                I want to receive responses on WhatsApp
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-gold"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
              />
              <span className="text-sm text-gray-600">
                I agree to Magicbricks T&C, Privacy Policy, & Cookie Policy
              </span>
            </label>
          </div> */}

          <button
            type="submit"
            className="w-full  bg-white border-b-[5px] border-b-gray-300 border-[2px] border-gray-300 hover:border-gold hover:border-b-gold  px-4 py-2 text-black rounded-xl  focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
             Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default SellForm