import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoIosArrowRoundForward } from "react-icons/io";
import Auth from "../User/Login/Auth";


const Stage1Form = ({setIsLoggedIn}) => {

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for auth modal
  const [formdata, setFormData] = useState({
    selectedState: "",
    selectedCity: "", 
    selectBuilder: "",
    selectProject: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formdata.selectedState || !formdata.selectedCity || 
        !formdata.selectBuilder || !formdata.selectProject) {
      return toast.error("Please fill all the fields.");
    } 

    try {
      toast("Please login to continue!");
      openAuthModal();

    } catch (error) {
      console.error(error.message);
      toast.error("Some error occurred.");
    }
  };

  return (
    <section className="  flex items-center justify-center ">
      <div className=" bg-[#212121] h-screen p-8 w-full px-12 md:px-32 pt-[17vh]">
        <div className="flex flex-col justify-center items-center py-24">
          <p className="md:text-3xl text-3xl text-white font-bold mb-5">Add Property Details</p>
          
          {/* Form Fields */}
          <div className="flex flex-col  w-full md:w-[60vw] lg:w-[40vw]">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-300">State</label>
              <input
                type="text"
                name="selectedState"
                value={formdata.selectedState}
                onChange={handleChange}
                placeholder="Enter state"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-300">City</label>
              <input
                type="text"
                name="selectedCity"
                value={formdata.selectedCity}
                onChange={handleChange}
                placeholder="Enter city"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-300">Builder</label>
              <input
                type="text"
                name="selectBuilder"
                value={formdata.selectBuilder}
                onChange={handleChange}
                placeholder="Enter builder name"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-300">Project</label>
              <input
                type="text"
                name="selectProject"
                value={formdata.selectProject}
                onChange={handleChange}
                placeholder="Enter project name"
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>
          </div>

        
          {/* Submit Button */}
          <div className="w-full md:w-1/2 flex items-end justify-center mt-5 md:px-2">
            <button 
              onClick={handleSubmit} 
              className="bg-black  hover:bg-white/90 text-white hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center"
            >
              Continue <IoIosArrowRoundForward className="h-7 w-7 ml-1" />
            </button>
          </div>
        </div>
      </div>
            {/* Auth Modal */}
            {isAuthModalOpen && <Auth onClose={closeAuthModal} setIsLoggedIn={setIsLoggedIn} properties={"absolute top-[20%] sm:top-[7%] right-[2%] z-50"}
                stage1FormData={formdata}/>}
    </section>
  );
};

export default Stage1Form;
