import { X } from "lucide-react";
import React, { useState } from "react";
import Auth from "../User/Login/Auth"
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";


const GetStartedForm = ({ close, openAuth }) => {
  

  // Get user from backend
  const [user, setUser] = useState({});
  // get from backend
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [doctypes, setDocTypes] = useState([]);



  const [formdata, setFormData] = useState({
    selectedState: "",
    selectedCity: "",
    selectBuilder: "",
    selectProject: "",
    selectHouseNumber: "",
    selectFloorNumber: "",
    selectedNature: "residential",
    selectedStatus: "under-construction",
   
    enable: "no",
  });

  const handleChange = (e) => {

    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value, // update the respective radio button value
    }));
  };

  const saveFormDataToLocal = (formData) => {
    const dataWithTimestamp = {
      data: formData,
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    };
    localStorage.setItem('formData', JSON.stringify(dataWithTimestamp));
  };

  // Function to clear form data from local storage
const clearFormDataFromLocal = () => {
  localStorage.removeItem('formData');
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const reqBody = {
      customerName: user.name,
      customerNumber: user.phone,
      state: formdata.selectedState,
      city: formdata.selectedCity,
      builder: formdata.selectBuilder,
      project: formdata.selectProject,
      houseNumber: formdata.selectHouseNumber,
      floorNumber: formdata.selectFloorNumber,
      applicationStatus: "under-review",
      status:"more-info-required"
    }
    
    try {
       saveFormDataToLocal(reqBody);
      close()
      openAuth();
      console.log(reqBody);
      toast.success("Form saved successfully. Please login!")

    }
    
     catch (error) {
      console.error(error.message);
      toast.error("Some ERROR occurred.");
    }
  }
   
  return (
    <section className="z-[100] h-screen fixed flex items-center justify-center">
      <div className="backdrop-blur-md bg-[#212121] p-8 min-w-[350px] md:min-w-[700px] rounded-xl">
        <button
          className="absolute right-2 top-2 text-2xl text-white"
          onClick={close}
        >
          <X />
        </button>
        <div className="flex flex-col justify-center items-center ">
          <p className="md:text-5xl text-3xl text-white font-bold mb-5">Form</p>
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                Select State
              </label>
              <input
                list="states-list"
                id="state"
                name="selectedState"
                value={formdata.selectedState}
                onChange={handleChange}
                placeholder="Select or type a state..."
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm "
              />
              {/* <datalist id="states-list">
                    {states.map((state) => (
                      <option key={state._id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </datalist> */}
            </div>

            {/* City */}
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                Select City
              </label>
              <input
                list="cities-list"
                id="city"
                name="selectedCity"
                value={formdata.selectedCity}
                onChange={handleChange}
                placeholder="Select or type a city..."
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
              {/* <datalist id="cities-list">
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </datalist> */}
            </div>
          </div>
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Builder
              </label>
              <input
                list="builders-list"
                id="builder"
                name="selectBuilder"
                value={formdata.selectBuilder}
                onChange={handleChange}
                placeholder="Select or type a builder..."
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
              {/* <datalist id="builders-list">
                    {builders.map((builder) => (
                      <option key={builder._id} value={builder.name}>
                        {builder.name}
                      </option>
                    ))}
                  </datalist> */}
            </div>

            {/* Project */}
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Project
              </label>
              <input
                list="projects-list"
                id="project"
                name="selectProject"
                value={formdata.selectProject}
                onChange={handleChange}
                placeholder="Select or type a project..."
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white"
              />
              {/* <datalist id="projects-list">
                    {projects.map((project) => (
                      <option key={project._id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </datalist> */}
            </div>
          </div>

          {/* Tower */}
          <div className="flex flex-col xl:flex-row w-full">
            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                House Number
              </label>
              <input
                type="text"
                id="housenumber"
                name="selectHouseNumber"
                value={formdata.selectHouseNumber}
                onChange={handleChange}
                placeholder="Enter House Number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-xl  shadow-sm focus:outline-none focus:ring-gray-500 focus:gray-yellow-500 sm:text-sm bg-white"
              />
            </div>

            <div className="w-full my-2 xl:m-2">
              <label className="block text-sm font-medium text-gray-700">
                Floor Number
              </label>
              <input
                type="number"
                id="floornumber"
                name="selectFloorNumber"
                value={formdata.selectFloorNumber}
                onChange={handleChange}
                placeholder="Enter Floor Number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-black shadow-sm focus:outline-none  focus:border-gray-500 sm:text-sm bg-white"
              />
            </div>
          </div>
          <div className="w-full flex items-end justify-end mt-5 md:px-2">
            <button onClick={handleSubmit} className="bg-black md:w-[40%] hover:bg-white/90 text-white hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl">Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </section>
  );
};

export default GetStartedForm;
