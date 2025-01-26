import PropCard from "../../CompoCards/Cards/PropCard";
import PropCard2 from "../../CompoCards/Cards/PropCard2";
import React, { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../../../css/embla.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { CrossIcon } from "lucide-react";
import ApprovedListedProperties from "../ApprovedListedProperties";
import PropertyForm from "../../Safe/Dealing/DealingPages/PropDetails";
import BuyForm from "../../forms/rent";
import SellForm from "../../forms/sell";
import { useNavigate } from "react-router-dom";
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../../config/s3client";

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

const usePrevNextButtons = (emblaApi, onButtonClick) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (onButtonClick) onButtonClick(emblaApi);
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

const PrevButton = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--prev border-2 border-black"
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg " viewBox="0 0 532 532">
        <path
          fill="currenColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
      {children}
    </button>
  );
};

const NextButton = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--next border-2 border-gold "
      type="button"
      {...restProps}
    >
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="gold"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
      {children}
    </button>
  );
};

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const OPTIONS = { loop: true };
// SLIDES should be PropCard2 list

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number");
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1.3 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0, 1.3).toString();
        const tweenNode = tweenNodes.current[slideIndex];
        tweenNode.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);
  }, [emblaApi, tweenScale]);

  return (
    <div className="embla ">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((card, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{card}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </div>
  );
};

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

  const handleChangeMade = ()=>{
    setChangeMade(!changeMade);
  }

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
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${tokenid.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const data = await response.json();
        setUserPhone(data.data.phone);
      }
      catch (error) {
        console.log(error);
      }
    }

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

  

  // Function to handle card click

  return (
    <>
      <div className="flex flex-col z-10">
        <div className="hidden lg:!flex flex-wrap gap-4 mx-2">
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
          <div className="fixed inset-0 z-50 grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300">
            <div className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white border-[2px] border-black/20 shadow-lg">
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

        <div className="lg:!hidden pb-5 mt-10 z-10 ">
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
      </div>

      <div className="mt-5 ">
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
        <div className="fixed inset-0  z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeBuyModal}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full ">
            <BuyForm
              closeBuyModal={closeBuyModal}
              propertyId={selectedPropertyId}
            />
          </div>
        </div>
      )}

      {isSellModalOpen && selectedPropertyId && (
        <div className=" z-50 flex items-center justify-center ">
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
