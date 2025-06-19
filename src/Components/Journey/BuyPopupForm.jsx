import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  name,
}) => {
  return (
    <div className="mb-4">
      {label && <label className="text-white">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const BuyPopupForm = ({ isOpen, onClose, formType = "buy" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formdata, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    city: "",
    officeLocation: "",
    kidsSchoolLocation: "",
    medicalAssistanceRequired: "no",
    budget: "",
    type: "",
    constructionStatus: "",
  });

  const propertyTypes = [
    { label: "1 BHK", value: "1" },
    { label: "2 BHK", value: "2" },
    { label: "3 BHK", value: "3" },
    { label: "4 BHK", value: "4" },
    { label: "5 BHK", value: "5" },
    { label: "5+ BHK", value: "5+" },
    { label: "Office Studio", value: "office_studio" },
    { label: "Plot", value: "plot" },
  ];

  const constructionStatuses = [
    { label: "Completed", value: "completed" },
    { label: "Under Construction", value: "under_construction" },
  ];

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation for required fields
    if (!formdata.name || !formdata.phoneNumber) {
      toast.error("Please fill in your name and phone number.");
      return;
    }

    // Email validation if provided
    if (formdata.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formdata.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = formType === "buy" ? "/api/queries/addBuyQuery" : "/api/queries/addRentQuery";
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your auth token here if needed
          // "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(formdata),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Query submitted successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Reset form after successful submission
        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
          city: "",
          officeLocation: "",
          kidsSchoolLocation: "",
          medicalAssistanceRequired: "no",
          budget: "",
          type: "",
          constructionStatus: "",
        });
        
        onClose();
      } else {
        // Handle validation errors from server
        if (result.errors) {
          const errorMessages = result.errors.map(error => error.msg).join(", ");
          toast.error(`Validation errors: ${errorMessages}`, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(result.error || "Failed to submit query. Please try again.", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query. Please check your connection and try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-black border border-gray-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Form Content */}
        <div className="p-8">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 pr-8">
              Add Query Details
            </h2>

            {/* Form Fields */}
            <div className="flex flex-col w-full">
              {/* Contact Information Section */}
              <div className="mb-6">
                <h3 className="text-lg text-white font-semibold mb-4 border-b border-gray-600 pb-2">
                  Contact Information
                </h3>
                
                {/* Name */}
                <div className="mb-4">
                  <label className="text-white">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formdata.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="text-white">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formdata.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="text-white">Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>

              {/* Property Preferences Section */}
              <div className="mb-6">
                <h3 className="text-lg text-white font-semibold mb-4 border-b border-gray-600 pb-2">
                  Property Preferences
                </h3>
                
                {/* City */}
                <div className="mb-4">
                  <label className="text-white">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formdata.city}
                    onChange={handleChange}
                    placeholder="Enter preferred city"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Office Location */}
                <div className="mb-4">
                  <label className="text-white">Office Location</label>
                  <input
                    type="text"
                    name="officeLocation"
                    value={formdata.officeLocation}
                    onChange={handleChange}
                    placeholder="Enter office location"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Kids School Location */}
                <div className="mb-4">
                  <label className="text-white">Kids School Location</label>
                  <input
                    type="text"
                    name="kidsSchoolLocation"
                    value={formdata.kidsSchoolLocation}
                    onChange={handleChange}
                    placeholder="Enter kids' school location"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Medical Assistance Required */}
                <div className="mb-4">
                  <label className="text-white">Medical Assistance Required</label>
                  <select
                    name="medicalAssistanceRequired"
                    value={formdata.medicalAssistanceRequired}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="mb-4">
                  <label className="text-white">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formdata.budget}
                    onChange={handleChange}
                    placeholder="Enter your budget range"
                    className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <label className="text-white">Property Type</label>
                  <CustomDropdown
                    options={propertyTypes}
                    value={formdata.type}
                    onChange={handleChange}
                    placeholder="Select property type"
                    name="type"
                  />
                </div>

                {/* Construction Status */}
                <div className="mb-4">
                  <label className="text-white">Construction Status</label>
                  <CustomDropdown
                    options={constructionStatuses}
                    value={formdata.constructionStatus}
                    onChange={handleChange}
                    placeholder="Select construction status"
                    name="constructionStatus"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center mt-8 gap-3">
              <button
                onClick={onClose}
                className="bg-gray-600 w-full md:w-[48%] hover:bg-gray-500 text-white transition-all py-3 px-6 text-center rounded-xl flex items-center justify-center"
              >
                {/* <IoIosArrowRoundBack className="h-7 w-7 mr-1" /> */}
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-gray-100 w-full md:w-[48%] hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : `Submit Query`}
                {/* {!isSubmitting && (
                  <IoIosArrowRoundForward className="h-7 w-7 ml-1" />
                )} */}
              </button>
            </div>

            {/* Required Fields Note */}
            <p className="text-gray-400 text-sm mt-4 text-center">
              <span className="text-red-400">*</span> Required fields
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPopupForm;