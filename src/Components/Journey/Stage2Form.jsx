import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import Auth from "../User/Login/Auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const STORAGE_KEY = 'journey_progress';

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

const Stage2Form = ({ setIsLoggedIn }) => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formType, setFormType] = useState();
  const navigate = useNavigate();

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
    entryPoint: "",
  });

  const propertyTypes = [
    { label: "1 BHK", value: "1 BHK" },
    { label: "2 BHK", value: "2 BHK" },
    { label: "3 BHK", value: "3 BHK" },
    { label: "4 BHK", value: "4 BHK" },
    { label: "5 BHK", value: "5 BHK" },
    { label: "5+ BHK", value: "5+ BHK" },
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

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing progress:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation - checking required fields based on schema
    if (
      !formdata.name ||
      !formdata.phoneNumber ||
      !formdata.city ||
      !formdata.officeLocation ||
      !formdata.kidsSchoolLocation ||
      !formdata.budget ||
      !formdata.type ||
      !formdata.constructionStatus
    ) {
      return toast.error("Please fill all the required fields.");
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formdata.phoneNumber)) {
      return toast.error("Please enter a valid phone number.");
    }

    // Email validation (if provided)
    if (formdata.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formdata.email)) {
        return toast.error("Please enter a valid email address.");
      }
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/queries/add${
          formType === "buy" ? "Buy" : "Rent"
        }Query`,
        {
          name: formdata.name,
          phoneNumber: formdata.phoneNumber,
          email: formdata.email,
          queryType: formType, // This will be "buy" or "rent"
          city: formdata.city,
          officeLocation: formdata.officeLocation,
          kidsSchoolLocation: formdata.kidsSchoolLocation,
          medicalAssistanceRequired: formdata.medicalAssistanceRequired,
          budget: formdata.budget,
          type: formdata.type,
          constructionStatus: formdata.constructionStatus,
        }
      );

      if (response.data) {
        toast.success("Query submitted successfully!");
        const cityVar = formdata.city;
        const availableForVar = formType === "rent" ? "rent" : "sale";
        clearProgress();
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
          entryPoint: formdata.entryPoint,
        });

        setTimeout(() => {
          navigate(`/property-listing?city=${cityVar}&availableFor=${availableForVar}`) 
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const errorMessage = error.response.data.errors
          .map((err) => err.msg)
          .join(", ");
        toast.error(errorMessage);
      } else {
        toast.error("Failed to submit query. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      const entryPointParam = searchParams.get("entryPoint");
      if (entryPointParam) {
        setFormData((prevData) => ({
          ...prevData,
          entryPoint: entryPointParam,
        }));
      }
    } catch (error) {
      console.error("Error parsing entry point data:", error);
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  useEffect(() => {
    const type = searchParams.get("type");

    if (type) {
      setFormType(type);
    }
  }, []);

  return (
    <section className="flex items-center justify-center">
      <div className="bg-black min-h-screen h-[100vh] p-8 w-full px-6 sm:px-32 lg:px-[25vw] xl:px-[30vw] pt-[17vh] overflow-y-auto">
        <div className="flex flex-col justify-center items-center py-12 px-10 mt-10 border border-1 border-gray-200 rounded-2xl">
          <p className="md:text-3xl text-2xl text-white font-bold mb-5">
            Add {formType === "buy" ? "Buy" : "Rent"} Query Details
          </p>

          {/* Form Fields */}
          <div className="flex flex-col w-full">
            {/* Name - Required */}
            <div className="mb-4">
              <label className="text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Phone Number - Required */}
            <div className="mb-4">
              <label className="text-white">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formdata.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Email - Optional */}
            <div className="mb-4">
              <label className="text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter your email (optional)"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
              />
            </div>

            {/* City - Required */}
            <div className="mb-4">
              <label className="text-white">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formdata.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Office Location - Required */}
            <div className="mb-4">
              <label className="text-white">
                Office Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="officeLocation"
                value={formdata.officeLocation}
                onChange={handleChange}
                placeholder="Enter office location"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Kids School Location - Required */}
            <div className="mb-4">
              <label className="text-white">
                Kids School Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="kidsSchoolLocation"
                value={formdata.kidsSchoolLocation}
                onChange={handleChange}
                placeholder="Enter kids' school location"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Medical Assistance Required */}
            <div className="mb-4">
              <label className="text-white">Medical Assistance Required</label>
              <select
                name="medicalAssistanceRequired"
                value={formdata.medicalAssistanceRequired}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* Budget - Required */}
            <div className="mb-4">
              <label className="text-white">
                Budget <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="budget"
                value={formdata.budget}
                onChange={handleChange}
                placeholder="Enter budget"
                className="w-full p-2 mt-1 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Property Type - Required */}
            <div className="mb-4">
              <label className="text-white">
                Property Type <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={propertyTypes}
                value={formdata.type}
                onChange={handleChange}
                placeholder="Select property type"
                name="type"
              />
            </div>

            {/* Construction Status - Required */}
            <div className="mb-4">
              <label className="text-white">
                Construction Status <span className="text-red-500">*</span>
              </label>
              <CustomDropdown
                options={constructionStatuses}
                value={formdata.constructionStatus}
                onChange={handleChange}
                placeholder="Select construction status"
                name="constructionStatus"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex-col-reverse flex md:flex-row items-center justify-center mt-10 md:px-2">
            <button
              onClick={handleGoBack}
              className="bg-gray-100 w-full md:w-[48%] mt-2 md:mt-0 md:mr-3 hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center"
            >
              <IoIosArrowRoundBack className="h-7 w-7 mr-1" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`bg-gray-100 w-full md:w-[48%] hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Continue"}{" "}
              {!isSubmitting && (
                <IoIosArrowRoundForward className="h-7 w-7 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stage2Form;