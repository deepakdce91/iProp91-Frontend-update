import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoIosArrowRoundForward } from "react-icons/io";
import Auth from "../User/Login/Auth";
import StateCityCompo from "../GeneralUi/StateCityCompo";
import { useSearchParams } from "react-router-dom";
import CustomDropdown from "../GeneralUi/CustomDropdown";

const Stage1Form = ({ setIsLoggedIn }) => {
  const [searchParams] = useSearchParams();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for auth modal
  const [formdata, setFormData] = useState({
    selectedState: "",
    selectedCity: "",
    selectBuilder: "",
    selectProject: "",
    entryPoint: "asasas",
    moreInfoReason: "Upload your property's documents to get it approved.",
  });

  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStateChange = (newState) => {
    // Accept the new state
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        selectedState: newState,
      };
      return updatedFormData;
    });
  };

  const handleCityChange = (newCity) => {
    // Accept the new city as a parameter
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        selectedCity: newCity,
      };
      return updatedFormData;
    });
  };

  // Fetch builders based on selected city
  const fetchBuilders = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/builders/fetchAllBuildersForGuestForm`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const builders = await response.json();
      setBuilders(builders);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch projects based on selected builder
  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/fetchAllProjectsForGuestForm`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const projects = await response.json();
      setProjects(projects);
    } catch (error) {
      console.error(error.message);
    }
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
    if (
      !formdata.selectedState ||
      !formdata.selectedCity ||
      !formdata.selectBuilder ||
      !formdata.selectProject
    ) {
      return toast.error("Please fill all the fields.");
    }
// console.log(formdata);
    try {
      toast("Please login to continue!");
      openAuthModal();
    } catch (error) {
      console.error(error.message);
      toast.error("Some error occurred.");
    }
  };

  // Fetch and projects projects
  useEffect(() => {
    fetchBuilders();
    fetchProjects();
  }, []);

  useEffect(() => {
    try {
      // Get the entryPoint parameter from URL
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

  return (
    <section className="  flex items-center justify-center  ">
      {!isAuthModalOpen && (
        <div className=" bg-black  h-screen p-8 w-full px-6 md:px-16  lg:px-[25vw] xl:px-[30vw] pt-[17vh] ">
          <div className="flex flex-col justify-center items-center py-12 px-10 mt-10 border border-1 border-gray-200 rounded-2xl">
            <p className="md:text-3xl text-3xl text-white font-bold mb-5">
              Add Property Details
            </p>

            {/* Form Fields */}
            <div className="flex flex-col  w-full">
              <StateCityCompo
                initialCity={formdata.selectedCity}
                initialState={formdata.selectedState}
                fromGuestForm={true}
                setMainCity={handleCityChange}
                setMainState={handleStateChange}
              />

              <CustomDropdown
                label="Select Builder"
                options={builders.filter(
                  (item, index, self) =>
                    index === self.findIndex((obj) => obj.name === item.name)
                )}
                value={formdata.selectBuilder}
                onChange={handleChange}
                placeholder="Select or type a builder..."
                name="selectBuilder" 
              />

              {/* Project Dropdown */}
              <CustomDropdown
                label="Select Project"
                options={projects.filter(
                  (item, index, self) =>
                    index === self.findIndex((obj) => obj.name === item.name)
                )}
                value={formdata.selectProject}
                onChange={handleChange}
                placeholder="Select or type a project..."
                name="selectProject"
              />
            </div>

            {/* Submit Button */}
            <div className="w-full md:w-1/2 flex items-end justify-center mt-10 md:px-2">
              <button
                onClick={handleSubmit}
                className="bg-gray-100  hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center"
              >
                Continue <IoIosArrowRoundForward className="h-7 w-7 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Auth Modal */}
      {isAuthModalOpen && (
        <Auth
          goBackToStage1={() => {
            setIsAuthModalOpen(false);
          }}
          onClose={closeAuthModal}
          setIsLoggedIn={setIsLoggedIn}
          properties={" "}
          stage1FormData={formdata}
        />
      )}
    </section>
  );
};

export default Stage1Form;
