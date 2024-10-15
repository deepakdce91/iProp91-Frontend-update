import React, { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoldButton from "../../../CompoCards/GoldButton/Goldbutton";



function PropertyForm() {
  const [property, setProperty] = useState({});
  const [form, setForm] = useState({
    builder: "",
    project: "",
    tower: "",
    unit: "",
    size: "",
    nature: "",
    status: "",
  });
  
  useEffect(() => {
    // fetch property details
    const token  = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    // take propertyid from the url
    const propertyId = window.location.pathname.split("/")[3];
    const fetchProperty = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}?userId=${decoded.userId}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });
      if(response.ok){
        const property = await response.json();
        setProperty(property);
        setForm({ 
          builder: property.builder,
          project: property.project,
          tower: property.tower,
          unit: property.unit,
          size: property.size,
          nature: property.nature,
          status: property.status,
         });
        return;
      }
      toast.error("Error fetching property");
    }
    fetchProperty();
  } ,[]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const propertyId = window.location.pathname.split("/")[3];

    try{
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${propertyId}?userId=${decoded.userId}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(form)
      });
      if(response.ok){
        toast.success("Property updated successfully");
        return;
      }
      toast.error("Error updating property");
    }
    catch(err){
      console.error(err.message);
      toast.error("Internal server error");
    }
  }


  return (
    <>
    <div className="px-10 w-full 2xl:w-2/3">
      <div className="flex flex-col w-full">
        <div className="flex flex-col xl:flex-row justify-between gap-6 my-2">
          
            <div className="bg-gray-100 p-2 rounded-lg !w-full ">
              <label className="block">{"Developer"}</label>
              <input
                type="text"
                name="builder"
                className="w-full  bg-gray-100 text-lg  focus:outline-none "
                value={form.builder}
                onChange={handleChange}
              />
            </div>
            
            <div className="bg-gray-100 p-2 rounded-lg !w-full ">
              <label className="block">{"Project Name"}</label>
              <input
                type="text"
                name="project"
                className="w-full  bg-gray-100 text-lg  focus:outline-none "
                value={form.project}
                onChange={handleChange}

              />
            </div>
            
         
        </div>
        <div className="flex flex-col xl:flex-row justify-between gap-6 my-2 ">
            <div className="bg-gray-100 p-2 rounded-lg !w-full ">
              <label className="block">{"Tower"}</label>
              <input
                type="text"
                name="tower"
                className="w-full  bg-gray-100 text-lg  focus:outline-none "
                value={form.tower}
                onChange={handleChange}

              />
            </div>

            <div className="bg-gray-100 p-2 rounded-lg !w-full ">
              <label className="block">{"Unit"}</label>
              <input
                type="text"
                name="unit"
                className="w-full  bg-gray-100 text-lg  focus:outline-none "
                value={form.unit}
                onChange={handleChange}

              />
            </div>
  
        </div>
        <div className="my-2">
        <div className="bg-gray-100 p-2 rounded-lg !w-full ">
              <label className="block">{"Area"}</label>
              <input
                type="text"
                name="size"
                className="w-full  bg-gray-100 text-lg  focus:outline-none "
                value={form.size}
                onChange={handleChange}

              />
            </div>
       
        </div>
        <div className="my-2 w-full">
          <label className="block mb-2">Nature of Property</label>
          <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex   ">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="nature-residential"
                  type="radio"
                  value="Residential"
                  name="nature"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300     focus:ring-2  "
                  checked={form.nature === "Residential"}
                  onChange={handleChange}
                />
                <label
                   htmlFor="nature-residential"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Residential{" "}
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="nature-commercial"
                  type="radio"
                  value="Commercial"
                  name="nature"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300     focus:ring-2  "
                  checked={form.nature === "Commercial"}
                  onChange={handleChange}
                />
                <label
                   htmlFor="nature-commercial"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Commercial
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className="my-2 w-full">
          <div className=" w-full">
            <label className="block w-full  mb-2">Status</label>
            <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex   ">
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="status-completed"
                  type="radio"
                  value="Completed"
                  name="status"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 "
                  checked={form.status === "Completed"}
                  onChange={handleChange}
                />
                <label
                   htmlFor="status-completed"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Completed{" "}
                </label>
              </div>
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
              <div className="flex items-center ps-3">
                <input
                  id="status-under-construction"
                  type="radio"
                  value="Under Construction"
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300  "
                  name="status"
                  checked={form.status === "Under Construction"}
                  onChange={handleChange}
                />
                <label
                   htmlFor="status-under-construction"
                  className="w-full py-3 ms-2 text-sm font-medium text-gray-900 "
                >
                  Under Construction
                </label>
              </div>
            </li>
          </ul>
          </div>
        </div>

        <div className="my-4 w-40">
          <GoldButton
            btnname="Submit"
            onclick={handleSubmit}
            bgcolor="bg-gold"
          />
        </div>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default PropertyForm;
