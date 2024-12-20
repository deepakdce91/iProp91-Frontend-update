import { X } from 'lucide-react';
import React, { useState } from 'react'

const SellForm = ({closeSellModal}) => {
    const [propertyFor, setPropertyFor] = useState("rent");
    const [userType, setUserType] = useState("owner");
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      mobile: "",
      whatsapp: "",
      city: "",
      locality: "",
      propertyType: "",
      exclusivePosting: false,
      agreeToTerms: false,
      whatsappUpdates: false,
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
      console.log({
        ...formData,
        ...(propertyFor === "sale" ? saleSpecificData : rentSpecificData),
      });
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
              Personal Details
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">I am</p>
              <div className="flex gap-4">
                {["owner", "agent", "builder"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={userType === type}
                      onChange={(e) => setUserType(e.target.value)}
                      className="h-4 w-4 accent-gray-700"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Mobile</label>
                <div className="flex">
                  <select className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2">
                    <option>IND +91</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter Mobile Number"
                    className="w-full rounded-r-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Property Details
            </h2>
            {/* <div className="space-y-2">
              <p className="text-sm text-gray-600">For</p>
              <div className="flex gap-4">
                {["sale", "rent", "pg/hostel"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="propertyFor"
                      value={type}
                      checked={propertyFor === type}
                      onChange={(e) => setPropertyFor(e.target.value)}
                      className="h-4 w-4 accent-gray-700"
                    />
                    <span className="capitalize">
                      {type === "pg/hostel" ? "PG/Hostel" : type}
                    </span>
                  </label>
                ))}
              </div>
            </div> */}

            <div>
              <label className="text-sm text-gray-600">Property Type</label>
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

            {/* Dynamic Fields based on Property Type */}
            {propertyFor === "sale" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">
                    Expected Price
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Expected Price"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={saleSpecificData.expectedPrice}
                    onChange={(e) =>
                      setSaleSpecificData({
                        ...saleSpecificData,
                        expectedPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Property Age</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={saleSpecificData.propertyAge}
                    onChange={(e) =>
                      setSaleSpecificData({
                        ...saleSpecificData,
                        propertyAge: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Property Age</option>
                    <option value="new">New Construction</option>
                    <option value="1-5">1-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
              </div>
            )}

            {propertyFor === "rent" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Monthly Rent</label>
                  <input
                    type="text"
                    placeholder="Enter Monthly Rent"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={rentSpecificData.monthlyRent}
                    onChange={(e) =>
                      setRentSpecificData({
                        ...rentSpecificData,
                        monthlyRent: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Security Deposit
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Security Deposit"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={rentSpecificData.securityDeposit}
                    onChange={(e) =>
                      setRentSpecificData({
                        ...rentSpecificData,
                        securityDeposit: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Property Location
            </h2>
            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                type="text"
                placeholder="Enter City"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Locality</label>
              <input
                type="text"
                placeholder="Enter Locality"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                value={formData.locality}
                onChange={(e) =>
                  setFormData({ ...formData, locality: e.target.value })
                }
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            className="w-full  bg-white border-b-[5px] border-b-gray-300 border-[2px] border-gray-300 hover:border-gold hover:border-b-gold  px-4 py-2 text-black rounded-xl  focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
            Login & Post Property
          </button>
        </form>
      </div>
    </div>
  )
}

export default SellForm