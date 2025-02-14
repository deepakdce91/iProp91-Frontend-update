import PropCard from "../../CompoCards/Cards/PropCard";
import PropCard2 from "../../CompoCards/Cards/PropCard2";
import React, { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight, CrossIcon } from "lucide-react";
import ApprovedListedProperties from "../ApprovedListedProperties";
import PropertyForm from "../../Safe/Dealing/DealingPages/PropDetails";
import BuyForm from "../../forms/rent";
import SellForm from "../../forms/sell";
import { useNavigate } from "react-router-dom";
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../../config/s3client";
import { ProfileCompletionBanner } from "../../ProfileCompletionBanner/ProfileCompletionBanner";
import { motion, AnimatePresence } from "framer-motion";

function hasMoreInfoRequired(objectsArray) {
  // Check if the array is not empty
  if (objectsArray.length === 0) {
    return -1;
  }

  // Get the last object in the array
  const lastObject = objectsArray[objectsArray.length - 1];

  // Check if the applicationStatus is "more-info-required"
  if (lastObject.applicationStatus === "more-info-required") {
    return lastObject._id; // Return the _id of the last object
  }

  // Return -1 if the condition is not met
  return -1;
}

function removeSpaces(str) {
  return str.replace(/\s+/g, "");
}

export default function MyProperties() {
  const navigate = useNavigate();

  const documentTypes = [
    { id: 1, name: "Identity Proof" },
    { id: 2, name: "Address Proof" },
    { id: 3, name: "Property Documents" },
    { id: 4, name: "Other" },
  ];

  const [changeMade, setChangeMade] = useState(false);

  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [prop, setProp] = useState([]);
  const [SLIDES, setSlides] = useState([]);

  // Add new state for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const [selectedDocType, setSelectedDocType] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);

  const [moreInfoId, setMoreInfoId] = useState();

  const [userPhone, setUserPhone] = useState();

  const [isPaused, setIsPaused] = useState(false);

  const handleChangeMade = () => {
    setChangeMade(!changeMade);
  };

  // Add modal control functions
  const onClickEdit = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsEditModalOpen(true);
  };

  const onClickBuy = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsBuyModalOpen(true);
  };

  const onClickSell = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setIsSellModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPropertyId(null);
  };

  const closeBuyModal = () => {
    setIsBuyModalOpen(false);
    setSelectedPropertyId(null);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSelectedPropertyId(null);
  };

  useEffect(() => {
    // fetch properties from the server
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const fetchProperties = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallpropertiesForUser?userId=${decoded.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      if (response) {
        const properties = await response.json();
        setProp(properties);
        console.log(properties);

        const stillShowModal = localStorage.getItem("addPropDetails");
        localStorage.removeItem("addPropDetails"); // remove after extracting
        const needMoreInfo = hasMoreInfoRequired(properties);

        if (stillShowModal && needMoreInfo !== -1) {
          setMoreInfoId(needMoreInfo);
          setShowMoreInfoModal(true);
        }
        // Populate slides only for approved properties
        properties.forEach((property) => {
          if (property.applicationStatus === "approved") {
            setSlides((prev, index) => [
              ...prev,
              <Link to={"/safe/Dealing/" + property._id} key={index}>
                <PropCard2 props={property} />
              </Link>,
            ]);
          }
        });
        return;
      }
      toast.error("Error fetching properties");
    };

    const fetchUser = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      // console.log(tokenid);
      // console.log(token);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        setUserPhone(data.data.phone);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProperties();

    fetchUser();

    //
    const redirectToPage = localStorage.getItem("redirectToPage");
    if (redirectToPage) {
      localStorage.removeItem("redirectToPage");
      navigate(redirectToPage);
    }
  }, [changeMade]);

  const closeModal = () => {
    setShowMoreInfoModal(false);
  };

  // Upload the file to Supabase S3
  const uploadFileToCloud = async (myFile) => {
    const myFileName = removeSpaces(myFile.name); // removing blank space from name
    const myPath = `propertyDocs/guestDocuments/${myFileName}`;
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

  // New function to handle file upload
  const handleFileAdding = (e) => {
    if (e.target.files.length > 0) {
      setUploadFiles([...uploadFiles, ...e.target.files]);
    } else {
      console.error("Please select a file to upload.");
    }
  };

  const handleDocumentSubmit = async (myId) => {
    if (!selectedDocType || uploadFiles.length === 0) {
      return toast.error("Please select document type and upload files");
    }

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      // First upload files to cloud
      const uploadedPaths = [];
      for (const file of uploadFiles) {
        const cloudPath = await uploadFileToCloud(file);
        uploadedPaths.push(cloudPath);
      }

      // Update property with new documents and change status
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/updateproperty/${myId}?userId=${decoded.userId}`,
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

      if (response) {
        toast.success("Documents uploaded successfully");
        setChangeMade(!changeMade);
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0); // Added direction state

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging && !isPaused) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % prop.length);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [isDragging, prop.length, isPaused]);

  const handleDragEnd = (e, { offset, velocity }) => {
    setIsDragging(false);
    const swipe = offset.x;

    if (Math.abs(velocity.x) > 500 || Math.abs(swipe) > 100) {
      if (swipe < 0) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % prop.length);
      } else {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + prop.length) % prop.length);
      }
    }
  };
  

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % prop.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + prop.length) % prop.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  // Add handlers for mouse events and interactions
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleInteraction = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
  };

  return (
    <>
      <div className="flex flex-col  ">
        <div className="px-5">
          <ProfileCompletionBanner />
        </div>
        <div className="hidden md:flex flex-wrap gap-4 mx-2">
          {prop.map((property, index) => (
            <PropCard
              key={index}
              props={property}
              onClickEdit={() => onClickEdit(property._id)}
              onClickBuy={() => onClickBuy(property._id)}
              onClickSell={() => onClickSell(property._id)}
              userPhone={userPhone}
              reFetchProperties={handleChangeMade}
            />
          ))}

          <Link
            to="/addproperty"
            className="bg-white  drop-shadow-2xl z-0 border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl w-64"
          >
            <div className="flex flex-col items-center justify-between h-full gap-4">
              <img
                className="w-[80%]  "
                src={"/images/propertyicon.png"}
                alt="img"
              />
              {prop ? (
                <div className="bg-gray-200 p-2 rounded-xl w-full text-center ">
                  Add the property you want to manage{" "}
                </div>
              ) : (
                <div className="bg-gray-200 p-2 rounded-xl w-full ">
                  Haven&apos;t added property yet!!{" "}
                </div>
              )}
              {/* <Link className="w-full" to="/addproperty">
                  <button className="text-black w-full bg-white border-secondary hover:border-simple shadow-2xl flex border-[1.5px]  text-xs py-3 rounded-md  gap-2 items-center justify-center"> 
                    Add property
                    <img
                      alt="plus"
                      loading="lazy"
                      width="12"
                      height="12"
                      decoding="async"
                      data-nimg="1"
                      className="mt-auto mb-auto"
                      style={{ color: "transparent" }}
                      src="/svgs/plus.aef96496.svg"
                    />
                  </button>
                </Link> */}
            </div>
          </Link>
        </div>

        {showMoreInfoModal === true && (
          <div className="fixed inset-0 z-50 grid h-screen w-screen  place-items-center backdrop-blur-sm transition-opacity duration-300">
            <div className="relative m-4 p-4  w-[90%] sm:min-w-[40%] sm:max-w-[40%] rounded-lg bg-white border-[2px] border-black/20 shadow-lg">
              <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                Upload Required Documents
              </div>
              <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
                {`Property status: more-info-required. Please upload the required documents.`}

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
                  onclick={() => handleDocumentSubmit(moreInfoId)}
                  btnname={"Submit Documents"}
                  properties={
                    " bg-white text-black lg:w-[50%]  hover:bg-slate-100"
                  }
                />
                <Goldbutton
                  onclick={closeModal}
                  btnname={"Cancel"}
                  properties={
                    " bg-white text-black lg:w-[20%]  hover:bg-slate-100"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* for smaller screens */}
      <div className="relative w-full md:hidden bg-white">
        <div className="flex flex-col items-center w-full  px-5">
          <div 
            className="relative w-full h-[300px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    handleNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrev();
                  }
                }}
                className="absolute w-full h-full flex items-center justify-center "
              >
                <div className="w-full max-w-72 px-4 flex justify-center items-center ">
                  <PropCard
                    props={prop[currentIndex]}
                    onClickEdit={() => {
                      handleInteraction(currentIndex);
                      onClickEdit(prop[currentIndex]._id);
                    }}
                    onClickBuy={() => {
                      handleInteraction(currentIndex);
                      onClickBuy(prop[currentIndex]._id);
                    }}
                    onClickSell={() => {
                      handleInteraction(currentIndex);
                      onClickSell(prop[currentIndex]._id);
                    }}
                    userPhone={userPhone}
                    reFetchProperties={handleChangeMade}
                  />
                </div>
              </motion.div>
              
            </AnimatePresence>
            {/* Navigation Buttons */}
            <div className="absolute top-2/4 -left-2 -right-2 flex justify-between  -translate-y-1/2 pointer-events-none z-10 ">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white shadow-md pointer-events-auto hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white shadow-md pointer-events-auto hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              {/* Pagination Dots */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 ">
                {prop.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleInteraction(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index ? "bg-gold w-4" : "bg-[#282828]"
                    }`}
                  />
                ))}
              </div>
          </div>
          <div className="w-full  max-w-64 my-16 bg-white  drop-shadow-2xl  border-transparent border-b-4 border-[1px] hover:border-simple hover:border-b-4 hover:border-[1px] p-4 rounded-xl">
            <Link to="/addproperty" className="">
              <div className="flex flex-col items-center justify-between h-full gap-4">
                <img
                  className="w-[80%]  "
                  src={"/images/propertyicon.png"}
                  alt="img"
                />
                {prop ? (
                  <div className="bg-gray-200 p-2 rounded-xl w-full text-center ">
                    Add the property you want to manage{" "}
                  </div>
                ) : (
                  <div className="bg-gray-200 p-2 rounded-xl w-full ">
                    Haven&apos;t added property yet!!{" "}
                  </div>
                )}
                {/* <Link className="w-full" to="/addproperty">
                  <button className="text-black w-full bg-white border-secondary hover:border-simple shadow-2xl flex border-[1.5px]  text-xs py-3 rounded-md  gap-2 items-center justify-center"> 
                    Add property
                    <img
                      alt="plus"
                      loading="lazy"
                      width="12"
                      height="12"
                      decoding="async"
                      data-nimg="1"
                      className="mt-auto mb-auto"
                      style={{ color: "transparent" }}
                      src="/svgs/plus.aef96496.svg"
                    />
                  </button>
                </Link> */}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ApprovedListedProperties propertyData={prop} />
      </div>
      {/* Add modals */}

      {isEditModalOpen && selectedPropertyId && (
        <div className="fixed inset-0  z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeEditModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full ">
            <PropertyForm
              closeEditModal={closeEditModal}
              propertyId={selectedPropertyId}
            />
          </div>
        </div>
      )}

      {isBuyModalOpen && selectedPropertyId && (
        <div className="z-50 flex items-center justify-center w-full">
          
          {/* <div className="relative bg-white rounded-lg shadow-xl w-full "> */}
            <BuyForm
              closeBuyModal={closeBuyModal}
              propertyId={selectedPropertyId}
            />
          {/* </div> */}
        </div>
      )}

      {isSellModalOpen && selectedPropertyId && (
        <div className=" z-50 flex items-center justify-center w-full">
          {/* <div className="relative bg-white rounded-lg shadow-xl w-full "> */}
          <SellForm
            closeSellModal={closeSellModal}
            propertyId={selectedPropertyId}
          />
          {/* </div> */}
        </div>
      )}
    </>
  );
}
