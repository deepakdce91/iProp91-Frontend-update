import React, { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoldButton from "../../../CompoCards/GoldButton/Goldbutton";



function PropertyForm() {
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
    <div className="px-10 w-full 2xl:w-2/3">
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleEdit}
          className="px-4 py-2 rounded-md bg-white text-black border-[1px] border-black/50 hover:shadow-md hover:shadow-gold"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Details'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table table className="w-full text-left ">
          <tbody className="">
            {/* Developer Row */}
            <tr>
              <td className="font-medium">Developer:</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="builder"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.builder}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                  type="text"
                  name="builder"
                  className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                  value={form.builder}
                  disabled={true}
                />
                )}
              </td>
            </tr>

            {/* Project Name Row */}
            <tr>
              <td className="font-medium">Project Name:</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="project"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.project}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="project"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.project}
                    disabled={true}
                  />
                )}
              </td>
            </tr>

            {/* Tower Row */}
            <tr>
              <td className="font-medium">Tower:</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="tower"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.tower}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="tower"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.tower}
                    disabled={true}
                  />
                )}
              </td>
            </tr>

            {/* Unit Row */}
            <tr>
              <td className="font-medium">Unit:</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="unit"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.unit}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="unit"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.unit}
                    disabled={true}
                  />
                )}
              </td>
            </tr>

            {/* Area Row */}
            <tr>
              <td className="font-medium">Area:</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="size"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.size}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    name="size"
                    className="w-full bg-gray-100 p-2 rounded-lg focus:outline-none"
                    value={form.size}
                    disabled={true}
                  />
                )}
              </td>
            </tr>

            {/* Nature Row */}
            <tr className="">
              <td className="font-medium">Nature:</td>
              <td>
                <div className="flex gap-4 my-4">
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
              </td>
            </tr>

            {/* Status Row */}
            <tr>
              <td className="font-medium">Status:</td>
              <td>
                <div className="flex gap-4">
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
              </td>
            </tr>
          </tbody>
        </table>

        {isEditing && (
          <div className="flex justify-end mt-6 lg:w-[30%]">
            <GoldButton
              btnname="Save Changes"
              onclick={handleSubmit}
              properties="rounded-full bg-gray-100 text-black hover:shadow-md hover:shadow-gold"
            />
          </div>
        )}
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default PropertyForm;
