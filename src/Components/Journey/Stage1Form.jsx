import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import Auth from "../User/Login/Auth";
import StateCityCompo from "../GeneralUi/StateCityCompo";
import CustomDropdown from "../GeneralUi/CustomDropdown";
import axios from "axios";
import { PiHandCoinsFill } from "react-icons/pi";

const STORAGE_KEY = 'journey_progress';

const Stage1Form = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [firstPropRewards, setFirstPropRewards] = useState(0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedState: newState,
    }));
  };

  const handleCityChange = (newCity) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCity: newCity,
    }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
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

    if (
      !formdata.selectedState ||
      !formdata.selectedCity ||
      !formdata.selectBuilder ||
      !formdata.selectProject
    ) {
      return toast.error("Please fill all the fields.");
    }

    try {
      toast("Please login to continue!");
      clearProgress();
      openAuthModal();
    } catch (error) {
      console.error(error.message);
      toast.error("Some error occurred.");
    }
  };

  const GetRewardPoints = async () => {
    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/rewards/fetchRewardByNameForGuest/first_property`;
  
      const response = await axios.get(
        endpoint
      );
  
      if (response) {

        setFirstPropRewards(response.data.amount);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }

  useEffect(() => {
    fetchBuilders();
    fetchProjects();
    GetRewardPoints();

  }, []);

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
 
  return (
    <section className="flex items-center justify-center bg-black pb-10">
      {!isAuthModalOpen && (
        <div className="bg-black h-screen p-8 w-full px-6 sm:px-32  lg:px-[25vw] xl:px-[30vw] pt-[17vh]">
          
          <div className="flex flex-col justify-center items-center py-12 px-10 mt-10 border border-1 border-gray-200 rounded-2xl">
            <p className="md:text-3xl text-2xl text-white font-bold mb-5">
              Add Property Details  
            </p>
            {firstPropRewards != 0 && <p className=" flex items-center text-lg text-white font-bold mb-5"><PiHandCoinsFill className="mr-2 text-yellow-600"/>{`Get`} <span className="text-yellow-600 mx-2">{`${firstPropRewards}`}</span>  {` reward points on adding your first property`}</p>}


            <div className="flex flex-col w-full">
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

            <div className="w-full flex-col-reverse flex md:flex-row items-center  justify-center mt-10 md:px-2">
            <button
                onClick={handleGoBack}
                className="bg-gray-100 w-full md:w-[48%] mt-2 md:mt-0  md:mr-3 hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center"
              >
                <IoIosArrowRoundBack className="h-7 w-7 mr-1" />
                Back
              </button>

              <button
                onClick={handleSubmit}
                className="bg-gray-100 w-full  md:w-[48%]  hover:bg-white text-gray-900 hover:text-black transition-all py-3 px-6 text-center border border-black/20 hover:border-white/20 rounded-xl flex items-center justify-center"
              >
                Continue <IoIosArrowRoundForward className="h-7 w-7 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
      
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