import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import PhoneInput from "../CompoCards/PhoneInput";
import StateCityCompo from "../GeneralUi/StateCityCompo";
import SimpleInput from "../CompoCards/InputTag/simpleinput";
import { Authenticate, initOTPless, verifyOTP } from "../../config/initOTPless";
import axios from "axios";

function InvitationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);

  const [stage, setStage] = useState("property-details");
  const [formData, setFormData] = useState({
    selectedState: "",
    selectedCity: "",
    selectBuilder: "",
    selectProject: "",
    selectHouseNumber: "",
    selectFloorNumber: "",
    selectedTower: "",
    selectedUnit: "",
    selectedSize: "",
  });

  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("+91");
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [showtimer, setShowtimer] = useState(false);
  const [timer, setTimer] = useState(30);

  const [showPhoneSection, setShowPhoneSection] = useState(false);
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nextRoute, setNextRoute] = useState("");

  // Add stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token || token.length !== 64) {
          throw new Error("Invalid token format");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/testimonials/validate/${token}`
        );

        if (response.data.success) {
          setInviteData(response.data);
          setFormData((prev) => ({
            ...prev,
            selectedState: response.data.data.state,
            selectedCity: response.data.data.city,
            selectBuilder: response.data.data.builder,
            selectProject: response.data.data.name,
          }));
        } else {
          throw new Error(response.data.error || "Invalid invitation");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Invalid invitation link"
        );
        navigate("/");
      }
    };

    validateToken();
  }, [token, navigate]);

  useEffect(() => initOTPless(callback), []);
  const callback = (otplessUser) => {
    console.log(otplessUser);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (showtimer && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowtimer(false);
      setTimer(30);
    }
    return () => clearInterval(interval);
  }, [showtimer, timer]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      checkCommunityMembership(decoded.userId, inviteData?.communityId);
    }
  }, [inviteData?.communityId]);

  const checkCommunityMembership = async (userId, communityId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/communities/getAllCommunitiesForCustomers/${userId}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (data.isMember) {
        navigate(`/family`);
      }
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-center items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === currentStep
                    ? "bg-blue-500 text-white"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 ${
                    step < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span
            className={
              currentStep === 1
                ? "text-blue-500"
                : currentStep > 1
                ? "text-green-500"
                : ""
            }
          >
            Property Details
          </span>
          <span
            className={
              currentStep === 2
                ? "text-blue-500"
                : currentStep > 2
                ? "text-green-500"
                : ""
            }
          >
            Phone Number
          </span>
          <span className={currentStep === 3 ? "text-blue-500" : ""}>
            Verify OTP
          </span>
        </div>
      </div>
    );
  };

  // Function to render property details form
  const renderPropertyDetailsForm = () => (
    <form onSubmit={handlePropertySubmit} className="space-y-6 ">
      <h1 className="text-4xl text-white font-semibold">
        Enter Property Details
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-white">
        <div className="mb-4">
          <label
            htmlFor="selectedState"
            className="block text-sm font-medium mb-2"
          >
            State
          </label>
          <input
            id="selectedState"
            type="text"
            name="selectedState"
            value={formData.selectedState}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
            disabled={isFormDisabled}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="selectedCity"
            className="block text-sm font-medium mb-2"
          >
            City
          </label>
          <input
            id="selectedCity"
            type="text"
            name="selectedCity"
            placeholder="City"
            value={formData.selectedCity}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
            disabled
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="selectBuilder"
            className="block text-sm font-medium mb-2"
          >
            Builder Name
          </label>
          <input
            id="selectBuilder"
            type="text"
            name="selectBuilder"
            placeholder="Builder Name"
            value={formData.selectBuilder}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
            disabled
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="selectProject"
            className="block text-sm font-medium mb-2"
          >
            Project Name
          </label>
          <input
            id="selectProject"
            type="text"
            name="selectProject"
            placeholder="Project Name"
            value={formData.selectProject}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
            disabled
          />
        </div>

        <div>
          <label
            htmlFor="selectedTower"
            className="block text-sm font-medium mb-2"
          >
            Tower
          </label>
          <input
            id="selectedTower"
            type="text"
            name="selectedTower"
            placeholder="Tower"
            value={formData.selectedTower}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
          />
        </div>

        <div>
          <label
            htmlFor="selectedUnit"
            className="block text-sm font-medium mb-2"
          >
            Unit
          </label>
          <input
            id="selectedUnit"
            type="text"
            name="selectedUnit"
            placeholder="Unit"
            value={formData.selectedUnit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
          />
        </div>

        <div>
          <label
            htmlFor="selectFloorNumber"
            className="block text-sm font-medium mb-2"
          >
            Floor Number
          </label>
          <input
            id="selectFloorNumber"
            type="number"
            name="selectFloorNumber"
            placeholder="Floor Number"
            value={formData.selectFloorNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
          />
        </div>

        <div>
          <label
            htmlFor="selectedSize"
            className="block text-sm font-medium mb-2"
          >
            Size
          </label>
          <input
            id="selectedSize"
            type="number"
            name="selectedSize"
            placeholder="Size"
            value={formData.selectedSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-white text-black"
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div></div> {/* Empty div for spacing */}
        <button
          type="submit"
          className="bg-[#282828] text-white px-6 py-2 rounded-lg hover:bg-black transition duration-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Next"}
        </button>
      </div>
    </form>
  );

  // Function to render phone input form
  const renderPhoneForm = () => (
    <div className="mt-8 ">
      <h2 className="text-4xl font-semibold mb-6 text-white ">
        Enter Phone Number
      </h2>
      <form onSubmit={HandleOTPLogin} className="space-y-8">
        <div className="lg:w-full">
          <PhoneInput
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            phone={phone}
            setPhone={setPhone}
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-[#282828] text-white px-6 py-2 rounded-lg hover:bg-black transition duration-300"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </form>
    </div>
  );

  // Function to render OTP verification form
  const renderOTPForm = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Enter OTP</h2>
      <div className="flex  gap-2 mb-4">
        {otpInputs.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digit && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) prevInput.focus();
              }
            }}
          />
        ))}
      </div>

      {otpLoading ? (
        <div className="text-center">
          <p className="text-gray-500">Verifying OTP...</p>
        </div>
      ) : (
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Previous
          </button>
          {!showtimer ? (
            <button
              onClick={HandleResendOTP}
              className="text-blue-500 hover:text-blue-700"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">Resend OTP in {timer} seconds</p>
          )}
        </div>
      )}
    </div>
  );

  // Modify handlePropertySubmit
  const handlePropertySubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedState || !formData.selectedCity) {
      toast.error("State and City are required.");
      return;
    }

    console.log("Form data being stored:", formData);
    localStorage.setItem("invitationPropertyDetails", JSON.stringify(formData));
    setIsFormDisabled(true);
    setCurrentStep(2);
  };

  // Modify HandleOTPLogin
  const HandleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(
        "Sending OTP to:",
        phone,
        "with country code:",
        selectedCountry
      );

      if (isNaN(phone)) {
        toast.error("Invalid Phone number");
        setLoading(false);
        return;
      }

      if (phone.length !== 10) {
        toast.error("Invalid Phone number");
        setLoading(false);
        return;
      }

      const authResponse = await Authenticate({
        channel: "PHONE",
        phone: phone,
        countryCode: selectedCountry,
      });

      console.log("Auth Response:", authResponse);

      if (authResponse && authResponse.success) {
        toast.success("OTP Sent");
        setCurrentStep(3);
        setShowtimer(true);
      } else {
        toast.error(authResponse.errorMessage || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Move to next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto verify when all inputs are filled
    if (index === 5 && value !== "") {
      const fullOtp = newOtpInputs.join("");
      handleOTPVerify(fullOtp);
    }
  };

  const HandleResendOTP = async () => {
    setShowtimer(true);
    setTimer(30);
    setLoading(true);

    try {
      await Authenticate({
        channel: "PHONE",
        phone: phone,
        countryCode: selectedCountry,
      });
      toast.success("OTP Sent");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpValue) => {
    setOtpLoading(true);

    if (isNaN(otpValue)) {
      toast.error("Invalid OTP");
      setOtpLoading(false);
      return;
    }

    const verifyresponse = await verifyOTP({
      channel: "PHONE",
      otp: otpValue,
      phone: phone,
      countryCode: selectedCountry,
    });

    if (verifyresponse) {
      if (verifyresponse.response.verification === "FAILED") {
        toast.error(verifyresponse.response.errorMessage.split(":")[1]);
        setTimer(30);
        setOtpLoading(false);
        return;
      } else {
        try {
          // Check if user exists using fetchuserbyphone
          let userexits = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuserbyphone/${phone}`
          );
          let userexitsjson = await userexits.json();

          if (userexitsjson.success === true) {
            // User exists, proceed with login
            try {
              let loginres = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/users/login/${phone}`
              );
              if (loginres.status === 500) {
                toast.error("Something went wrong");
                setOtpLoading(false);
                return;
              }
              let loginresjson = await loginres.json();
              if (loginresjson.success === true) {
                const token = loginresjson.token;
                localStorage.setItem("token", token);
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                // Check existing properties
                const propertyMatch = await checkExistingProperties(userId);

                if (propertyMatch) {
                  // Handle applicationStatus
                  switch (propertyMatch.applicationStatus) {
                    case "more-info-required":
                    case "under-review":
                      storeModalInfo(
                        `Your property is ${propertyMatch.applicationStatus}. Please wait for further updates.`,
                        "/family"
                      );
                      window.location.href = "/family"; // Force a full page reload
                      break;
                    case "approved":
                      storeModalInfo(
                        "Your property is already approved.",
                        "/family"
                      );
                      window.location.href = "/family";
                      break;
                    case "rejected":
                      await addProperty(userId);
                      storeModalInfo(
                        "New property added to your account.",
                        "/concierge"
                      );
                      window.location.href = "/concierge";
                      break;
                    default:
                      break;
                  }
                } else {
                  // Add new property for existing user
                  await addProperty(userId);
                  storeModalInfo(
                    "New property added to your account.",
                    "/concierge"
                  );
                  window.location.href = "/concierge";
                }
                return;
              }
            } catch (error) {
              console.error(error.message);
              toast.error("Something went wrong");
              setOtpLoading(false);
              return;
            }
          } else {
            // User doesn't exist, proceed with signup
            try {
              let response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: "iProp91 User",
                    phone: phone,
                    password: "password",
                    email: "",
                  }),
                }
              );
              if (response.status === 500) {
                toast.error("Something went wrong");
                setOtpLoading(false);
                return;
              }
              let data = await response.json();
              let token = data.token;
              localStorage.setItem("token", token);
              const decoded = jwtDecode(token); // Decode the token to get userId
              const userId = decoded.userId; // Assuming userId is in the token

              // Add property for new user
              await addProperty(userId); // Pass userId to addProperty

              toast.success("Signup Successful");
              storeModalInfo(
                "Signup Successful. New property added to your account.",
                "/concierge"
              );
              window.location.href = "/concierge";
              setOtpLoading(false);
            } catch (err) {
              toast.error("Something went wrong");
              setTimeout(() => {
                navigate("/");
              }, 2000);
              setOtpLoading(false);
            }
          }
        } catch (err) {
          toast.error("Something went wrong");
          console.log(process.env.REACT_APP_BACKEND_URL);
          setTimeout(() => {
            navigate("/");
          }, 2000);
          setOtpLoading(false);
        }
      }
    } else {
      toast.error("Verification Failed");
      setOtpLoading(false);
      return;
    }

    setOtpLoading(false);
  };

  // New function to check existing properties
  const checkExistingProperties = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchallproperties?userId=${userId}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const properties = await response.json();

      const inviteDetails = JSON.parse(
        localStorage.getItem("invitationPropertyDetails")
      );

      // Compare each property with invitation details
      return properties.find((property) => {
        return (
          property.state === inviteDetails.selectedState &&
          property.city === inviteDetails.selectedCity &&
          property.builder === inviteDetails.selectBuilder &&
          property.project === inviteDetails.selectProject &&
          property.tower === inviteDetails.selectedTower &&
          property.unit === inviteDetails.selectedUnit &&
          property.floorNumber === inviteDetails.selectFloorNumber &&
          property.size === inviteDetails.selectedSize
        );
      });
    } catch (error) {
      console.error("Error checking existing properties:", error);
      return false;
    }
  };

  const addProperty = async (userId) => {
    const propertyDetails = JSON.parse(
      localStorage.getItem("invitationPropertyDetails")
    );
    const {
      selectedState,
      selectedCity,
      selectBuilder,
      selectProject,
      selectFloorNumber,
      selectedUnit,
      selectedTower,
      selectedSize,
    } = propertyDetails;

    // Log the property details before sending the request
    console.log("Property details being sent:", {
      selectedState,
      selectedCity,
      selectBuilder,
      selectProject,
      selectFloorNumber,
      selectedUnit,
      selectedTower,
      selectedSize,
    });

    // Validate that state and city are not empty
    if (!selectedState || !selectedCity) {
      toast.error("State and City are required.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/property/addpropertyForGuest?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"), // Include token if required
          },
          body: JSON.stringify({
            state: selectedState,
            city: selectedCity,
            builder: selectBuilder,
            project: selectProject,
            floorNumber: selectFloorNumber,
            unit: selectedUnit,
            size: selectedSize,
            tower: selectedTower,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Property added successfully");
      } else {
        toast.error(data.error || "Failed to add property");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Error adding property");
    }
  };

  // In handleOTPVerify function, modify how we store modalInfo
  const storeModalInfo = (message, route) => {
    const modalInfo = {
      message,
      route,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    };
    localStorage.setItem("modalInfo", JSON.stringify(modalInfo));
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">

      {currentStep === 1 && (
        <div className="w-full md:w-2/3 mx-auto border-white border-[2px] rounded-lg shadow-lg p-8 space-y-8">
          {renderPropertyDetailsForm()}
        </div>
      )}
      {(currentStep === 2 || currentStep === 3) && (
        <div className="w-full md:w-1/3 flex justify-center items-center mx-auto border-white border-[2px] rounded-lg shadow-lg px-2 py-10 md:px-8 md:py-20 space-y-8">
          {currentStep === 2 && renderPhoneForm()}
          {currentStep === 3 && renderOTPForm()}
        </div>
      )}

      {/* Modal for application status messages */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Property Status</h3>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate(nextRoute);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvitationPage;
