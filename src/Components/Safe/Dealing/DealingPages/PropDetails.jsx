import React, { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoldButton from "../../../CompoCards/GoldButton/Goldbutton";
import { X } from "lucide-react";



function PropertyForm({closeEditModal, propertyId}) {
  const [isEditing, setIsEditing] = useState(false);
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
    // Use propertyId from props instead of URL
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
  } ,[propertyId]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

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
        console.log("updated");
        
        return;
      }
      toast.error("Error updating property");
      console.log("Error");
      
    }
    catch(err){
      console.error(err.message);
      toast.error("Internal server error");
    }
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <section className="h-full z-20 fixed w-[90%]">
    <section className="  backdrop-blur-sm    flex flex-col  items-center    ">
      <div className="px-10 py-5 h-full lg:min-w-[40%] bg-white rounded-lg relative shadow-md ">
        <span onClick={closeEditModal} className="cursor-pointer absolute right-3">
        <X/>
        </span>
        <div className="flex justify-between w-full my-3  ">
          <button 
            onClick={toggleEdit}
            className={`px-4 py-2 rounded-md text-xs bg-white text-black border-[1px] border-black/20 hover:shadow-md hover:shadow-gold`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
          {isEditing && (
          <div className="flex justify-end  ">
            <GoldButton
              btnname="Save "
              onClick={handleSubmit}
              properties="rounded-md bg-gray-100 py-2 text-black hover:shadow-md hover:shadow-gold "
            />
          </div>
        )}
        </div>

        <div className="flex flex-col gap-1">
          {/* Developer Input */}
          <label className="font-medium">Builder:</label>
          <input
            type="text"
            name="builder"
            className={`w-full text-gray-600 p-2 rounded-lg focus:outline-none ${!isEditing ? 'bg-gray-200 text-gray-500 text-sm' : 'bg-gray-100'}`}
            value={form.builder}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />

          {/* Project Name Input */}
          <label className="font-medium">Project Name:</label>
          <input
            type="text"
            name="project"
            className={`w-full p-2 text-gray-600 rounded-lg focus:outline-none ${!isEditing ? 'bg-gray-200 text-gray-500 text-sm' : 'bg-gray-100'}`}
            value={form.project}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />

          {/* Tower Input */}
          <label className="font-medium">Tower:</label>
          <input
            type="text"
            name="tower"
            className={`w-full p-2 text-gray-600 rounded-lg focus:outline-none ${!isEditing ? 'bg-gray-200 text-gray-500 text-sm' : 'bg-gray-100'}`}
            value={form.tower}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />

          {/* Unit Input */}
          <label className="font-medium">Unit:</label>
          <input
            type="text"
            name="unit"
            className={`w-full p-2 text-gray-600 rounded-lg focus:outline-none ${!isEditing ? 'bg-gray-200 text-gray-500 text-sm' : 'bg-gray-100'}`}
            value={form.unit}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />

          {/* Area Input */}
          <label className="font-medium">Area:</label>
          <input
            type="text"
            name="size"
            className={`w-full p-2 text-gray-600 rounded-lg focus:outline-none ${!isEditing ? 'bg-gray-200 text-gray-500 text-sm' : 'bg-gray-100'}`}
            value={form.size}
            onChange={isEditing ? handleChange : null}
            disabled={!isEditing}
          />

          {/* Nature Radio Buttons */}
          <label className="font-medium my-2">Nature:</label>
          <div className="flex gap-4 ">
            <label className="flex items-center">
              <input
                type="radio"
                name="nature"
                value="Residential"
                checked={form.nature === "Residential"}
                onChange={isEditing ? handleChange : null}
                disabled={!isEditing}
                className="mr-2"
              />
              Residential
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="nature"
                value="Commercial"
                checked={form.nature === "Commercial"}
                onChange={isEditing ? handleChange : null}
                disabled={!isEditing}
                className="mr-2"
              />
              Commercial
            </label>
          </div>

          {/* Status Radio Buttons */}
          <label className="font-medium my-2">Status:</label>
          <div className="flex gap-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Completed"
                checked={form.status === "Completed"}
                onChange={isEditing ? handleChange : null}
                disabled={!isEditing}
                className="mr-2"
              />
              Completed
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="Under Construction"
                checked={form.status === "Under Construction"}
                onChange={isEditing ? handleChange : null}
                disabled={!isEditing}
                className="mr-2"
              />
              Under Construction
            </label>
          </div>
        </div>

        
      </div>
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}
    </section>
    </section>
  );
}

export default PropertyForm;
