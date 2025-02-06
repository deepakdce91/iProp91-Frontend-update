import { Edit } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Goldbutton from "../GoldButton/Goldbutton"
import { useState } from "react";
import {jwtDecode} from "jwt-decode"; 
import { toast } from "react-hot-toast"; 

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../../config/s3client";

function removeSpaces(str) {
  return str.replace(/\s+/g, "");
}


  // Upload the file to Supabase S3
  const uploadFileToCloud = async (myFile, userNumber) => {
    const myFileName = removeSpaces(myFile.name); // removing blank space from name
    const myPath = `propertyDocs/${userNumber}/${myFileName}`;
    try {
      const uploadParams = {
        Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
        Key: myPath,
        Body: myFile, // The file content
        ContentType: myFile.type, // The MIME type of the file
      };
      const command = new PutObjectCommand(uploadParams);
      await client.send(command);
      return myPath; //  return the file path
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
 
export default function PropCard ({
  props,
  onClickEdit,
  onClickBuy,
  onClickSell,
  userPhone,
  reFetchProperties,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [termsncond, setTermsnCond] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [editFormData, setEditFormData] = useState({
    tower: props?.tower || '',
    unit: props?.unit || '',
    size: props?.size || '', 
    houseNumber: props?.houseNumber || '',
    floorNumber: props?.floorNumber || '',
    nature: props?.nature || 'residential',
    status: props?.status || 'under-construction'
  });

  const documentTypes = [
    { id: 1, name: "Identity Proof" },
    { id: 2, name: "Address Proof" },
    { id: 3, name: "Property Documents" },
    { id: 4, name: "Other" },
  ];

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // New function to handle file upload
  const handleFileAdding = (e) => {
    if (e.target.files.length > 0) {
      setUploadFiles([...uploadFiles, ...e.target.files]);
    } else {
      console.error("Please select a file to upload.");
    }
  };

  // const handleFileUpload = async (files) => {
  //   if (files.length === 0) {
  //     return console.error("Please select a file to upload.");
  //   }

  //   try {
  //     for (const item of files) {
  //       await uploadFileToCloud(item, userPhone); 
  //     }
  //     console.log("Files Uploaded!");
  //   } catch (error) {
  //     console.error("Some error occurred while uploading.");
  //   }
  // };

  

  const handleCardClick = () => {
    console.log("Property ID:", props._id);
    if (props.applicationStatus.applicationStatus === "approved") {
      // Redirect to the defined state
      // window.location.href = `/safe/Dealing/${}/Documents`;
      console.log("approved property ");
      
    } else if (props.applicationStatus === "more-info-required") {
      console.log("clicked a ", props.applicationStatus);
      // Open modal for more-info-required status
      setModalMessage(
        `Property status: ${props.applicationStatus}. Please upload the required documents.`
      );
      setModalIsOpen(true);
    } else if (props.applicationStatus === "under-review") {
      // Show a simple message modal for under-review status
      setModalMessage(`Property status: ${props.applicationStatus}. Your application is currently under review.`);
      setModalIsOpen(true);
    }
  };

  // Add new function for classification tag
  const renderClassificationTag = () => {
    const classification = props?.classification.toLowerCase();
    switch (classification) {
      case "rent":
        return (
          <div className="absolute  left-0 -top-0.5 bg-primary text-white px-3 py-1 rounded-b-lg shadow-md z-10">
            Listed for Rent
          </div>
        );
      case "sell":
        return (
          <div className="absolute  left-0 -top-0.5 bg-primary text-white px-3 py-1 rounded-b-lg shadow-md z-10">
            Listed for Sale
          </div>
        );
      case "rent and sell":
        return (
          <div className="absolute  left-0 -top-0.5 bg-primary text-white px-3 py-1 rounded-b-lg shadow-md z-10">
            Listed for Rent & Sale
          </div>
        );
      default:
        return null;
    }
  };

  const location = useLocation();

  const handleDocumentSubmit = async () => {
    if (!selectedDocType || uploadFiles.length === 0) {
      return toast.error("Please select document type and upload files");
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      
      // First upload files to cloud
      const uploadedPaths = [];
      for (const file of uploadFiles) { 
        const cloudPath = await uploadFileToCloud(file, userPhone);
        uploadedPaths.push(cloudPath);
      }

      // Update property with new documents and change status
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${props._id}?userId=${decoded.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            documents: {
              type: selectedDocType,
              files: uploadedPaths,
            },
            applicationStatus: "under-review", // Change status to under-review after upload
          }),
        }
      ); 

      if (response.ok) {
        toast.success("Documents uploaded successfully");
        reFetchProperties(); // Refetch properties after successful upload
        closeModal();

        // Optionally refresh the component or update local state
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error uploading documents");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error uploading documents");
    }
  };

    return (
      <>
      {modalIsOpen && props.applicationStatus === "more-info-required" ? (
        <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300">
          <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white border-[2px] border-black/20 shadow-lg">
            <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Upload Required Documents
            </div>
            <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              {modalMessage}
              
              <div className="flex flex-col lg:flex-row w-full items-end mt-5">
                <div className="w-full my-2 xl:m-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <select
                    id="doctype"
                    name="selectedDocType"
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl  shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
                  >
                    <option value="">Select Document Type</option>
                    {documentTypes?.map((doctype) => (
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
              </div>
              {/* <label className="inline-flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={termsncond}
                  onChange={(e) => setTermsnCond(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-yellow-600"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the terms and conditions.
                </span>
              </label> */}
            </div>
            <div className="flex gap-3 items-center pt-2 justify-end">
              <Goldbutton
                onclick={handleDocumentSubmit}
                btnname={"Submit Documents"}
                properties={" bg-white text-black lg:w-[50%]  hover:bg-slate-100"}
                
              />
              <Goldbutton
                onclick={closeModal}
                btnname={"Cancel"}
                properties={" bg-white text-black lg:w-[20%]  hover:bg-slate-100"}
                
              />
              
            </div>
          </div>
        </div>
      ) : null}

      {modalIsOpen && props.applicationStatus === "under-review" ? (
        <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300">
          <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white border-[2px] border-black/20 shadow-lg">
            <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
              Application Under Review
            </div>
            <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              {modalMessage}
            </div>
            <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button
                onClick={closeModal}
                className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white drop-shadow-2xl border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl w-full  md:w-64 overflow-hidden">
      {renderClassificationTag()}
        <img
          src="https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&amp;w=1770&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="home"
          className="rounded-xl object-cover"
        />
        <div className="flex justify-between mt-3 mb-1">
          <h1 className="text-xl text-black">{props?.project}</h1>
          <p className="text-xs text-black mt-auto mb-auto">Tower: {props?.tower}</p>
        </div>
        <div className="flex justify-between">
          <h1 className="text-xs text-black">{props?.builder}</h1>
          <p className="text-xs text-black">Unit: {props?.unit}</p>
        </div>
        <div className="flex flex-row justify-between mt-4 gap-2">
          {location.pathname === "/safe" ? (
            <div className="w-full flex justify-between items-center">
              <Link to={`/safe/Dealing/${props._id}/Documents`}>
                <Goldbutton 
                  btnname={props?.applicationStatus === "approved" ? "View Details" : props?.applicationStatus}
                  properties="w-full text-black bg-slate-100 py-2 px-4 rounded-lg"
                />
              </Link>
              {/* <div className="relative group">
                <button onClick={onClickEdit} className="w-full text-sm px-2 bg-slate-100 py-2 text-center rounded-lg">
                  <Edit />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Edit
                </span>
              </div> */}
            </div>
          ) : location.pathname === "/concierge" ? (
            <>
              {props?.applicationStatus === "approved" ? (
                <>
                  {props?.classification === "rent" ? (
                    <Goldbutton properties="w-full text-black bg-slate-100 py-2 px-4 rounded-lg" btnname="Sell" onclick={onClickSell} />
                  ) : props.classification === "sell" ? (
                    <Goldbutton properties="w-full text-black bg-slate-100 py-2 px-4 rounded-lg" btnname="Rent" onclick={onClickBuy} />
                  ) : props.classification === "rent and sell" ? (
                    null
                  ) : (
                    <>
                      <Goldbutton properties="w-full text-black bg-slate-100 py-2 px-4 rounded-lg" btnname="Sell" onclick={onClickSell} />
                      <Goldbutton properties="w-full text-black bg-slate-100 py-2 px-4 rounded-lg" btnname="Rent" onclick={onClickBuy} />
                    </>
                  )}
                  <div className="relative group justify-end">
                    <button onClick={onClickEdit} className="w-full text-sm px-2 bg-slate-100 py-2 text-center rounded-lg">
                      <Edit />
                    </button>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Edit
                    </span>
                  </div>
                </>
              ) : (<>
                <Goldbutton onclick={handleCardClick} btnname={props?.applicationStatus} properties="w-[80%] text-black bg-slate-100 py-2 px-4 rounded-lg" />
                <div className="relative group">
                <button onClick={onClickEdit} className="w-full text-sm px-2 bg-slate-100 py-2 text-center rounded-lg">
                  <Edit />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Edit
                </span>
              </div>
              </>
              )}
            </>
          ) : null}
        </div>
      </div>
      </>
    );
  };