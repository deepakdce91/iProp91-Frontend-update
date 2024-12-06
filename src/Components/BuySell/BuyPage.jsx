"use client"

import { useState } from "react"

const  BusySellPage = ()=> {
  const [propertyFor, setPropertyFor] = useState("sale")
  const [userType, setUserType] = useState("owner")
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
    whatsappUpdates: false
  })

  // Additional fields based on property type
  const [saleSpecificData, setSaleSpecificData] = useState({
    expectedPrice: "",
    propertyAge: "",
    possessionStatus: ""
  })

  const [rentSpecificData, setRentSpecificData] = useState({
    monthlyRent: "",
    securityDeposit: "",
    availableFrom: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      ...formData,
      ...(propertyFor === "sale" ? saleSpecificData : rentSpecificData)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          {/* Main Form */}
          <div className="space-y-6 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Sell or Rent your Property</h1>
              
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
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
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
                <div className="space-y-2">
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
                        <span className="capitalize">{type === "pg/hostel" ? "PG/Hostel" : type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Property Type</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
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
                      <label className="text-sm text-gray-600">Expected Price</label>
                      <input
                        type="text"
                        placeholder="Enter Expected Price"
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                        value={saleSpecificData.expectedPrice}
                        onChange={(e) =>
                          setSaleSpecificData({ ...saleSpecificData, expectedPrice: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Property Age</label>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                        value={saleSpecificData.propertyAge}
                        onChange={(e) =>
                          setSaleSpecificData({ ...saleSpecificData, propertyAge: e.target.value })
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
                          setRentSpecificData({ ...rentSpecificData, monthlyRent: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Security Deposit</label>
                      <input
                        type="text"
                        placeholder="Enter Security Deposit"
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                        value={rentSpecificData.securityDeposit}
                        onChange={(e) =>
                          setRentSpecificData({ ...rentSpecificData, securityDeposit: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Property Location</h2>
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Locality</label>
                  <input
                    type="text"
                    placeholder="Enter Locality"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gold focus:outline-none"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, exclusivePosting: e.target.checked })}
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
                    onChange={(e) => setFormData({ ...formData, whatsappUpdates: e.target.checked })}
                  />
                  <span className="text-sm text-gray-600">I want to receive responses on WhatsApp</span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-gold"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
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

          {/* Sidebar */}
          <div className="bg-[#d2cccc] content-center h-[500px] p-6 shadow-sm">
            {/* <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                How to find the right <span className="text-emerald-600">Buyer</span>?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-emerald-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-600">Respond to Buyer Enquiries</h3>
                    <p className="text-sm text-gray-600">
                      Connect with Buyers when they contact on your property.
                    </p>
                    <p className="text-sm font-medium">View upto 2 contact details for FREE!</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-emerald-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-600">Connect with Matching Buyers</h3>
                    <p className="text-sm text-gray-600">
                      Actively check for matching Buyers & connect.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="text-emerald-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-600">Download the App</h3>
                    <p className="text-sm text-gray-600">
                      Get notified on all new Buyer enquiries and connect instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            <p>Advertisement or sidebar section</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusySellPage;
