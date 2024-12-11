import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const GetStartedForm = ({ close, openAuth }) => {
  const [formdata, setFormData] = useState({
    selectedState: "",
    selectedCity: "",
    selectBuilder: "",
    selectProject: "",
    selectHouseNumber: "",
    selectFloorNumber: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formdata.selectedState || !formdata.selectedCity || 
        !formdata.selectBuilder || !formdata.selectProject || 
        !formdata.selectHouseNumber || !formdata.selectFloorNumber) {
      return toast.error("Please fill all the fields.");
    }

    try {
      // Save form data to localStorage with 5 min expiry
      const formDataWithTimestamp = {
        data: formdata,
        expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
      };
      localStorage.setItem('tempPropertyData', JSON.stringify(formDataWithTimestamp));
      
      toast.success("Please login to continue!");
      close();
      openAuth();

    } catch (error) {
      console.error(error.message);
      toast.error("Some error occurred.");
    }
  };

  return (
    <section className="z-[100] h-screen fixed flex items-center justify-center">
      <div className="backdrop-blur-md bg-[#212121] p-8 min-w-[350px] md:min-w-[700px] rounded-xl">
        <button className="absolute right-2 top-2 text-2xl text-white" onClick={close}>
          <X />
        </button>
        <div className="flex flex-col justify-center items-center">
          <p className="md:text-5xl text-3xl text-white font-bold mb-5">Property Details</p>
          
          {/* Form Fields */}
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="selectedState"
                value={formdata.selectedState}
                onChange={handleChange}
                placeholder="Enter state"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="selectedCity"
                value={formdata.selectedCity}
                onChange={handleChange}
                placeholder="Enter city"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>
          </div>

          {/* Builder and Project */}
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">Builder</label>
              <input
                type="text"
                name="selectBuilder"
                value={formdata.selectBuilder}
                onChange={handleChange}
                placeholder="Enter builder name"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <input
                type="text"
                name="selectProject"
                value={formdata.selectProject}
                onChange={handleChange}
                placeholder="Enter project name"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>
          </div>

          {/* House and Floor Number */}
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">House Number</label>
              <input
                type="text"
                name="selectHouseNumber"
                value={formdata.selectHouseNumber}
                onChange={handleChange}
                placeholder="Enter house number"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">Floor Number</label>
              <input
                type="number"
                name="selectFloorNumber"
                value={formdata.selectFloorNumber}
                onChange={handleChange}
                placeholder="Enter floor number"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full flex items-end justify-end mt-5 md:px-2">
            <button 
              onClick={handleSubmit} 
              className="bg-black md:w-[40%] hover:bg-white/90 text-white hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedForm;
