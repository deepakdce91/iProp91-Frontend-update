import React, { useEffect } from 'react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { jwtDecode } from 'jwt-decode';
import { client } from '../../../config/s3client'
import { select } from '@material-tailwind/react';

const uploadFileToCloud = async (myFile) => {
  // remove spaces from file name
  myFile = myFile.name.replace(/\s/g, '');

  const userNumber = "5566556656";
  const myPath = `propertyDocs/${userNumber}/${myFile.name}`;
  try {
    const uploadParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
      Key: myPath,
      Body: myFile, // The file content
      ContentType: myFile.type, // The MIME type of the file
    };
    // console.log("Uploading file:", myFile.name);
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return myPath; //  return the file path
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

//get signed url---will be used sooon
const getSignedUrlForPrivateFile = async (path) => {
  try {
    const getParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET ,
      Key: path,
    };

    const command = new GetObjectCommand(getParams);
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 }); // URL valid for 1 hour

    console.log("Signed URL:", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
};


// form required fields
// state,city,builder,project,houserNumber,floorNumber,tower,unit,size,nature,status,name,documents,applicationStatus,addedBy,isDeleted
function Addpropform() {

  // change name of the Page
  useEffect(() => {
    document.title = "iProp91 | Add My Property";
  }, []);

  // get from backend
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [doctypes, setDocTypes] = useState([]);

  // Get from form
  const [selectedDoc, setSelectedDoc] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");
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
    selectedNature: "",
    selectedStatus: "",
    selectDoclist: {
      selectedDocType: selectedDocType,
      selectedDoc: selectedDoc,
    },
    enable: "no",
    addedBy: "Unknown",
  });

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
    console.log(formdata);
    };

  // Fetch all states
  const fetchStates = async () => {
    try {
      const response = await fetch(
        "http://localhost:3300/api/state/fetchallstates"
      );
      const states = await response.json();
      setStates(states);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch cities based on selected state
  const fetchCities = async (state) => {
    try {
      const response = await fetch(
        `http://localhost:3300/api/city/fetchcitiesbystate/${state}`
      );
      const cities = await response.json();
      setCities(cities);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch builders based on selected city
  const fetchBuilders = async (city) => {
    try {
      const response = await fetch(
        `http://localhost:3300/api/builders/fetchbuildersbycity/${city}`
      );
      const builders = await response.json();
      setBuilders(builders);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch projects based on selected builder
  const fetchProjects = async (builder) => {
    try {
      const response = await fetch(
        `http://localhost:3300/api/projects/fetchprojectbybuilder/${builder}`
      );
      const projects = await response.json();
      setProjects(projects);
    } catch (error) {
      console.error(error.message);
    }
  };


  // Fetch document types
  const fetchDocTypes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3300/api/documentType/fetchallDocumentTypes"
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
  const handleDocType = (e) => {
    setSelectedDocType(e.target.value);
    setFormData({ ...formdata, selectDoclist: { selectedDocType: e.target.value, selectedDoc: selectedDoc } });
    // console.log(selectedDocType);
  };

 // handles file upload
  const handleFileAdding = (e) => {
      const files = e.target.files;

      if (files) {
        // Convert the FileList object into an array and update the state
        setUploadFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      }
      // console.log(uploadFiles);
    };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
      return toast.error("Please select a file to upload.");
    }
    try {
      toast("Uploading files!");
      uploadFiles.length > 0 &&
        uploadFiles.map(async (item) => {
          let cloudFilePath = await uploadFileToCloud(item);
          setFormData({
            ...formdata,
            selectDoclist: {
              selectedDocType: selectedDocType,
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
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formdata);


    if (!termsncond) {
      return toast.error("Please agree to the terms and conditions.");
    }
    // check from validity
    if ( !formdata.selectedState || !formdata.selectedCity || !formdata.selectBuilder || !formdata.selectProject || !formdata.selectHouseNumber || !formdata.selectFloorNumber || !formdata.selectedTower || !formdata.selectedUnit || !formdata.selectedSize || !formdata.selectedNature || !formdata.selectedStatus || !formdata.selectedName || !formdata.selectDoclist.selectedDocType || !formdata.selectDoclist.selectedDoc) {
      return toast.error("Please fill all the fields.");
    }
    // check if filed are numeric
    if(isNaN(formdata.selectHouseNumber) || isNaN(formdata.selectFloorNumber) || isNaN(formdata.selectedSize)){
      return toast.error("Please enter numeric values in house number, floor number and size.");
    }
    try{
      // if selected state is not in the list of states
      if(!states.find(state => state.name === formdata.selectedState)){
        const response = await fetch("http://localhost:3300/api/state/addstate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formdata.selectedState }),
        });
      }
      // if selected city is not in the list of cities
      if(!cities.find(city => city.name === formdata.selectedCity)){
        const response = await fetch("http://localhost:3300/api/city/addcity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formdata.selectedCity, state: formdata.selectedState }),
        });
      }

      // if selected builder is not in the list of builders
      if(!builders.find(builder => builder.name === formdata.selectBuilder)){
        const response = await fetch("http://localhost:3300/api/builders/addbuilder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formdata.selectBuilder, city: formdata.selectedCity, state: formdata.selectedState }),
        });
      }

      // if selected project is not in the list of projects
      if(!projects.find(project => project.name === formdata.selectProject)){
        const response = await fetch("http://localhost:3300/api/projects/addproject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formdata.selectProject, builder: formdata.selectBuilder, city: formdata.selectedCity, state: formdata.selectedState }),
        });
      }


    }catch(error){
      console.error(error.message);
      toast.error("Some ERROR occurred.");
    }
    try {

      if(uploadStatus === false){
        return toast.error("Please upload the documents.");
      }
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      const response = await fetch("http://localhost:3300/api/property/addproperty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: tokenid.userId,
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
          enable: formdata.enable,
          addedBy: formdata.addedBy,
          applicationStatus: "under-review",
        }),
      });

      if(response.status !== 200) {
        return toast.error("Please fill all the fields.");
      }
      const data = await response.json();
      console.log(data);
      if (data._id) {
        toast.success("Property added successfully!");
        setFormData({
          selectedState: "",
          selectedCity: "",
          selectBuilder: "",
          selectProject: "",
          selectHouseNumber: "",
          selectFloorNumber: "",
          selectedTower: "",
          selectedUnit: "",
          selectedSize: "",
          selectedNature: "",
          selectedStatus: "",
          selectedName: "",
          selectDoclist: {
            selectedDocType: "",
            selectedDoc: [],
          },
          enable: "no",
          addedBy: "Unknown",
        });
      }
    } catch (error) {
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
                    type="number"
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
              <div className="flex flex-col xl:flex-row w-full">
                <div className="w-full my-2 xl:m-2 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Nature of Property
                  </label>
                  {/* <select
                    id="nature"
                    name="selectedNature"
                    value={formdata.selectedNature}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  >
                    <option>Select Nature of Property</option>
                    <option value="Residential">Residential</option>
                    <option value="Commerical Office">Commercial Office</option>
                    <option vlaue="Commerical Shop">Commercial Shop</option>

                  </select> */}
                  {/* radiobutton */}
                  <div className="flex items-center w-full mt-1 gap-2">
                    <div className="flex flex-row border rounded-3xl px-3 py-2 border-gray-300 bg-white">
                      <input
                        id="residential"
                        name="selectedNature"
                        value="Residential"
                        type="radio"
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <label
                        htmlFor="residential"
                        className="ml-1 block text-sm font-medium text-gray-700"
                      >
                        Residential
                      </label>
                    </div>
                    <div className="flex flex-row border rounded-3xl px-3 py-2 border-gray-300 bg-white">
                      <input
                        id="commercial"
                        name="selectedNature"
                        value="Commercial"
                        type="radio"
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <label
                        htmlFor="commercial"
                        className="ml-1 block text-sm font-medium text-gray-700"
                      >
                        Commercial
                      </label>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Status
                  </label>
                  {/* <select 
                    id="status"
                    name="selectedStatus"
                    value={formdata.selectedStatus}
                    onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white">
                    <option>Select Status</option>
                    <option value="Under Construction">
                      Under Construction
                    </option>
                    <option value="Completed">Completed</option>
                    {/* Add options here 
                  </select> */}
                  {/* radiobutton */}
                  <div className="flex items-center w-full mt-1  gap-2">
                    <div className="flex flex-row border rounded-3xl px-3 py-2 border-gray-300 bg-white">
                      <input
                        id="underconstruction"
                        name="selectedStatus"
                        value="Under Construction"
                        type="radio"
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <label
                        htmlFor="underconstruction"
                        className="ml-1 block text-sm font-medium text-gray-700 text-nowrap"
                      >
                        Under Construction
                      </label>
                    </div>
                    <div className="flex flex-row border rounded-3xl px-3 py-2 border-gray-300 bg-white">
                      <input
                        id="completed"
                        name="selectedStatus"
                        value="Completed"
                        type="radio"
                        onChange={handleChange}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                      <label
                        htmlFor="completed"
                        className="ml-1 block text-sm font-medium text-gray-700"
                      >
                        Completed
                      </label>
                    </div>
                  </div>
                </div>

                {/* Property Name */}
                <div className="my-2 xl:m-2 w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Property Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="selectedName"
                    value={formdata.selectedName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  />
                </div>

                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <select
                    id="doctype"
                    name="selectedDocType"
                    value={selectedDocType}
                    onChange={handleDocType}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  >
                    <option value="">Select Document Type</option>
                    {doctypes.map((doctype) => (
                      <option key={doctype._id} value={doctype.name}>
                        {doctype.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row w-full items-end">
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
                <div className="w-48  my-2 xl:m-2 ">
                  <button
                    type="submit"
                    onClick={handleFileUpload}
                    className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-gold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Upload
                  </button>
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
              <div className="my-2 xl:m-2">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-gold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Submit
                </button>
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
