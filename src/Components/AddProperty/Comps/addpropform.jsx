import React, { useEffect } from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { jwtDecode } from 'jwt-decode';
import { client } from '../../../config/s3client'
import Goldbutton from '../../CompoCards/GoldButton/Goldbutton'

import { useNavigate } from "react-router-dom";

const uploadFileToCloud = async (myFile, userNumber) => {
  // remove spaces from file name
  let filename = myFile.name.replace(/\s/g, '');

  const myPath = `propertyDocs/${userNumber}/${filename}`;
  try {
    const uploadParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
      Key: myPath,
      Body: myFile, // The file content
      ContentType: myFile.type, // The MIME type of the file
    };
    // console.log("Uploading file:", myFile.name);
    const command = new PutObjectCommand(uploadParams);
    const sent = await client.send(command);
    if(sent){
      return myPath; //  return the file path
    }else{
      console.error("Error uploading file");
    }
    
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};


// state,city,builder,project,houserNumber,floorNumber,tower,unit,size,nature,status,name,documents,applicationStatus,addedBy,isDeleted
function Addpropform() {

  const navigate = useNavigate();

  // change name of the Page
  useEffect(() => {
    document.title = "iProp91 | Add My Property";
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  // Get user from backend
  const [user, setUser] = useState({});
  // get from backend
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [doctypes, setDocTypes] = useState([]);


  const [termsncond, setTermsnCond] = useState(false);

  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);

  const handleTermsnCond = (e) => {
    setTermsnCond(e.target.checked);
  };

  const [formdata, setFormData] = useState({
    selectedState: "",
    selectedCity: "",
    selectBuilder: "",
    selectProject: "",
    selectHouseNumber: "",
    selectFloorNumber: "",
    selectedTower: "",
    selectedUnit: "",
    selectedSize: "",
    selectedNature: "residential",
    selectedStatus: "under-construction",
    selectDoclist: {
      selectedDocType: "",
      selectedDoc: [],
    },
    enable: "no",
  });
  const handleChange = (e) => {

    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value, // update the respective radio button value
    }));
  };


  // Fetch User Details
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    const fetchUser = async () => { 
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuser/${tokenid.userId}?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          }
        });
        if (response.ok) {
          const user = await response.json();
          setUser(user);
          console.log("User:", user);
          return;
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, []);

  // Fetch all states
  const fetchStates = async () => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/state/fetchallstates?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":token,
          },
        }
      );
      const states = await response.json();
      setStates(states);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch cities based on selected state
  const fetchCities = async (state) => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/city/fetchcitiesbystate/${state}?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":token,
          },
        }
      );
      const cities = await response.json();
      setCities(cities);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch builders based on selected city
  const fetchBuilders = async (city) => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/builders/fetchbuildersbycity/${city}?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":token,
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
  const fetchProjects = async (builder) => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/fetchprojectbybuilder/${builder}?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":token,
          },
        }
      );
      const projects = await response.json();
      setProjects(projects);
    } catch (error) {
      console.error(error.message);
    }
  };


  // Fetch document types
  const fetchDocTypes = async () => {
    const token = localStorage.getItem("token");
    const tokenid = jwtDecode(token);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/documentType/fetchallDocumentTypes?userId=${tokenid.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token":token,
          },}
      );
      const doctypes = await response.json();
      setDocTypes(doctypes);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch states when the component mounts
  useEffect(() => {
    fetchStates();
  }, []);

  // Fetch cities when the selectedState changes
  useEffect(() => {
    if (formdata.selectedState) {
      fetchCities(formdata.selectedState);
    }
  }, [formdata.selectedState]);

  // Fetch builders when the selectedCity changes
  useEffect(() => {
    if (formdata.selectedCity) {
      fetchBuilders(formdata.selectedCity);
    }
  }, [formdata.selectedCity]);


  // Fetch projects when the selectBuilder changes
  useEffect(() => {
    if (formdata.selectBuilder) {
      fetchProjects(formdata.selectBuilder);
    }
  }, [formdata.selectBuilder]);

  // Fetch document types when the component mounts
  useEffect(() => {
    fetchDocTypes();
  }, []);



  // handle doctype
  const handleDocTypeChange = (e) => {
    e.preventDefault();

    const newDocType = e.target.value;

    // Update the selectedDocType within selectDoclist
    setFormData((prevFormData) => ({
      ...prevFormData, // keep other properties
      selectDoclist: {
        ...prevFormData.selectDoclist, // keep previous selectDoclist values
        selectedDocType: newDocType,   // update selectedDocType
      },
    }));
  };

  // handles file upload
  const handleFileAdding = (e) => {
    // append files to the state
    if (e.target.files.length > 0) {
      setUploadFiles([...uploadFiles, ...e.target.files]);
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    if (uploadFiles.length === 0) {
      return toast.error("Please select a file to upload.");
    }

    try {
      toast("Uploading files!");
      uploadFiles.length > 0 &&
        uploadFiles.map( async(item) => {
          let cloudFilePath =  await uploadFileToCloud(item,user.phone);
          setFormData({
            ...formdata,
            selectDoclist: {
              ...formdata.selectDoclist,
              selectedDoc: [...formdata.selectDoclist.selectedDoc, cloudFilePath],
            },
          });
        });
      setTimeout(() => {
        toast.success("Files Uploaded!");
        setUploadStatus(true);
        setUploadFiles([]);
      }, 3000);
    } catch (error) {
      toast.error("Some error occured while uploading.");
      console.log(error.message);
    }
    setUploadFiles([]);
    
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let token = localStorage.getItem("token");
    let tokenid = jwtDecode(token);

    const reqBody = {
      customerName: user.name,
      customerNumber: user.phone,
      state: formdata.selectedState,
      city: formdata.selectedCity,
      builder: formdata.selectBuilder,
      project: formdata.selectProject,
      houseNumber: formdata.selectHouseNumber,
      floorNumber: formdata.selectFloorNumber,
      tower: formdata.selectedTower,
      unit: formdata.selectedUnit,
      size: formdata.selectedSize,
      nature: formdata.selectedNature,
      status: formdata.selectedStatus,
      documents: {
        type: formdata.selectDoclist.selectedDocType,
        files: formdata.selectDoclist.selectedDoc,
      },
      addedBy:  tokenid.userId,
      applicationStatus: "under-review",
    }


    if (!termsncond) {
      return toast.error("Please agree to the terms and conditions.");
    }
    // check from validity
    if (!formdata.selectedState || !formdata.selectedCity || !formdata.selectBuilder || !formdata.selectProject || !formdata.selectHouseNumber || !formdata.selectFloorNumber || !formdata.selectedTower || !formdata.selectedUnit || !formdata.selectedSize || !formdata.selectedNature || !formdata.selectedStatus || !formdata.selectDoclist.selectedDocType || !formdata.selectDoclist.selectedDoc) {
      return toast.error("Please fill all the fields.");
    }
    
    try {
      // if selected state is not in the list of states
      if (!states.find(state => state.name === formdata.selectedState)) {
        const token = localStorage.getItem("token");
        const tokenid = jwtDecode(token);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/state/addstate?userId=${tokenid.userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
          "auth-token":token,
           },
          body: JSON.stringify({ name: formdata.selectedState, addedBy : tokenid.userId }),
        });
      }
      // if selected city is not in the list of cities
      if (!cities.find(city => city.name === formdata.selectedCity)) {
        const token = localStorage.getItem("token");
        const tokenid = jwtDecode(token);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/city/addcity?userId=${tokenid.userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
          "auth-token":token,
           },
          body: JSON.stringify({ name: formdata.selectedCity, state: formdata.selectedState, addedBy : tokenid.userId }),
        });
      }

      // if selected builder is not in the list of builders
      if (!builders.find(builder => builder.name === formdata.selectBuilder)) {
        const token = localStorage.getItem("token");
        const tokenid = jwtDecode(token);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/builders/addbuilder?userId=${tokenid.userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
          "auth-token":token,
           },
          body: JSON.stringify({ name: formdata.selectBuilder, city: formdata.selectedCity, state: formdata.selectedState, addedBy : tokenid.userId}),
        });
      }

      // if selected project is not in the list of projects
      if (!projects.find(project => project.name === formdata.selectProject)) {
        const token = localStorage.getItem("token");
        const tokenid = jwtDecode(token);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects/addproject?userId=${tokenid.userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
          "auth-token":token,
           },
          body: JSON.stringify({ name: formdata.selectProject, builder: formdata.selectBuilder, city: formdata.selectedCity, state: formdata.selectedState, addedBy : tokenid.userId }),
        });
      }


    } catch (error) {
      console.error(error.message);
      toast.error("Some ERROR occurred.");
    }
    try {

      if (uploadStatus === false) {
        return toast.error("Please upload the documents.");
      }

      setIsUploading(true);
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/property/addproperty?userId=${tokenid.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
        "auth-token":token,
         },
        body: JSON.stringify(reqBody),
      });

      if (response.status !== 200) {
        setIsUploading(false);
        return toast.error("Please fill all the fields.");
      }
      const data = await response.json();
      if (data._id) {
        setIsUploading(false);
        toast.success("Property added successfully!");

        setTimeout(() => {
        navigate("/concierge");
      }, 2000);
      }
    } catch (error) {
      setIsUploading(false);
      console.error(error.message);
      toast.error("Some ERROR occurred.");
    }
  }

  return (
    <>
      <div className="flex justify-center my-6 max-w-[1400px] m-auto p-4">
        <div className="bg-gray-50 rounded-3xl p-4 md:p-10 w-full ">
          <form>
            {/* State */}
            <div className="flex flex-col w-full">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                  <datalist id="states-list">
                    {states.map((state) => (
                      <option key={state._id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </datalist>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                  <datalist id="cities-list">
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </datalist>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                  <datalist id="builders-list">
                    {builders.map((builder) => (
                      <option key={builder._id} value={builder.name}>
                        {builder.name}
                      </option>
                    ))}
                  </datalist>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                  <datalist id="projects-list">
                    {projects.map((project) => (
                      <option key={project._id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </datalist>
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-col xl:flex-row w-full">

                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Tower
                  </label>
                  <input
                    type="text"
                    id="tower"
                    name="selectedTower"
                    value={formdata.selectedTower}
                    onChange={handleChange}
                    placeholder="Enter Tower"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                </div>

                {/* Unit */}
                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Unit
                  </label>
                  <input
                    type="text"
                    id="unit"
                    name="selectedUnit"
                    value={formdata.selectedUnit}
                    onChange={handleChange}
                    placeholder="Enter Unit"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                </div>

                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Size
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="selectedSize"
                    value={formdata.selectedSize}
                    onChange={handleChange}
                    placeholder="Enter Size"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                </div>

                {/* Size Unit */}

              </div>

              {/* Nature of Property */}
              <div className="w-full my-2 xl:m-2 ">
        <label className="block text-sm font-medium text-gray-700">
          Select Nature of Property
        </label>
        <div className="flex items-center w-full mt-1 gap-2">
          <div className="flex w-full flex-row border items-center rounded-3xl px-3 py-2 border-gray-300 bg-white">
            <input
              id="residential"
              name="selectedNature"
              value="residential"
              type="radio"
              onChange={handleChange}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
              checked={formdata.selectedNature === "residential"}
            />
            <label htmlFor="residential" className="ml-1 block w-full text-sm font-medium text-gray-700">
              Residential
            </label>
          </div>
          <div className="flex w-full flex-row border items-center rounded-3xl px-3 py-2 border-gray-300 bg-white">
            <input
              id="commercial"
              name="selectedNature"
              value="commercial"
              type="radio"
              onChange={handleChange}
              checked={formdata.selectedNature === "commercial"}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
            />
            <label htmlFor="commercial" className="ml-1 block w-full text-sm font-medium text-gray-700">
              Commercial
            </label>
          </div>
        </div>
      </div>

      {/* Select Status */}
      <div className="w-full my-2 xl:m-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Status
        </label>
        <div className="flex items-center w-full mt-1 gap-2">
          <div className="flex w-full flex-row border items-center rounded-3xl px-3 py-2 border-gray-300 bg-white">
            <input
              id="under-construction"
              name="selectedStatus"
              value="under-construction"
              type="radio"
              onChange={handleChange}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
              checked={formdata.selectedStatus === "under-construction"}
            />
            <label htmlFor="under-construction" className="ml-1 w-full block text-sm font-medium text-gray-700 text-nowrap">
              Under Construction
            </label>
          </div>
          <div className="flex w-full flex-row border items-center rounded-3xl px-3 py-2 border-gray-300 bg-white">
            <input
              id="completed"
              name="selectedStatus"
              value="completed"
              type="radio"
              checked={formdata.selectedStatus === "completed"}
              onChange={handleChange}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
            />
            <label htmlFor="completed" className="ml-1 block w-full text-sm font-medium text-gray-700">
              Completed
            </label>
          </div>
        </div>
      </div>

              <div className="flex flex-col lg:flex-row w-full items-end">

                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <select
                    id="doctype"
                    name="selectedDocType"
                    value={formdata.selectDoclist.selectedDocType}
                    onChange={handleDocTypeChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  >
                    <option value="">Select Document Type</option>
                    {doctypes?.map((doctype) => (
                      <option key={doctype._id} value={doctype.name}>
                        {doctype.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="w-full  my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload File
                  </label>
                  <input
                    type="file"
                    id="file"
                    name="selectDoc"
                    onChange={handleFileAdding}
                    multiple
                    className="mt-1 block w-full text-gray-500  border-2 rounded-3xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  />
                </div>

                {/* Upload Button */}
                <div className="w-96  my-2 xl:m-2 ">
                  <Goldbutton
                    btnname={"Upload"}
                    onclick={handleFileUpload}
                  ></Goldbutton>
                </div>
              </div>

              {/* Checkbox */}
              <div className="my-2 xl:m-2">
                <label className="inline-flex items-center mt-3">
                  <input
                    type="checkbox"
                    name="enable"
                    checked={termsncond}
                    onChange={handleTermsnCond}
                    className="form-checkbox h-5 w-5 text-yellow-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I am the owner/I have the authority to post this property. I
                    agree not to provide incorrect property information or state
                    a discriminatory preference. In case, the information does
                    not comply with iProp91 terms, iProp91.com has the right to
                    edit/remove the property from their site.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="my-2 w-48 xl:m-2">
                <Goldbutton
                isDisabled = {isUploading}
                  btnname={"Submit"}
                  onclick={handleSubmit}
                ></Goldbutton>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default Addpropform;
