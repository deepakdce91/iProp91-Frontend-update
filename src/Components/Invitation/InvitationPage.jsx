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
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);

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

  const handlePropertySubmit = (e) => {
    e.preventDefault();

    if (!formData.selectedState || !formData.selectedCity) {
      toast.error("State and City are required.");
      return;
    }

    console.log("Form data being stored:", formData);
    localStorage.setItem("invitationPropertyDetails", JSON.stringify(formData));
    setShowPhoneSection(true);
    setIsFormDisabled(true);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Move to next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto verify when all inputs are filled
    if (index === 5 && value !== '') {
      const fullOtp = newOtpInputs.join('');
      handleOTPVerify(fullOtp);
    }
  };

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
        setShowOTPSection(true);
        setStage("otp");
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
                  toast.success("Property already exists in your account");
                  setTimeout(() => {
                    navigate("/family");
                  }, 2000);
                } else {
                  // Add new property for existing user
                  await addProperty(userId);
                  toast.success("New property added to your account");
                  setTimeout(() => {
                    navigate("/family");
                  }, 2000);
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
              setTimeout(() => {
                navigate("/concierge");
              }, 1000);
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
      return properties.some(property => {
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
    const { selectedState, selectedCity, selectBuilder, selectProject, selectFloorNumber, selectedUnit, selectedTower, selectedSize } = propertyDetails;

    // Log the property details before sending the request
    console.log("Property details being sent:", {
      selectedState, selectedCity, selectBuilder, selectProject, selectFloorNumber, selectedUnit, selectedTower, selectedSize
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

  return (
    <div className="h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="w-full md:w-2/3 mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8 overflow-y-scroll">
        {/* Property Details Form */}
        <form onSubmit={handlePropertySubmit} className="space-y-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Property Details
          </h2>
          
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="mb-4">
              <label htmlFor="selectedState" className="block text-sm font-medium mb-2">
                State
              </label>
              <input
                id="selectedState"
                type="text"
                name="selectedState"
                value={formData.selectedState}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
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
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
              />
            </div>
          </div>

          {!showPhoneSection && (
            <button
              type="submit"
              className="w-full bg-[#282828] text-white py-3 rounded-lg mt-6 hover:bg-black transition duration-300"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          )}
        </form>

        {/* Phone Verification Section */}
        {showPhoneSection && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Enter Phone Number</h2>
            <form onSubmit={HandleOTPLogin} className="space-y-4">
                <div className="lg:w-2/4 w-full">
              <PhoneInput
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                phone={phone}
                setPhone={setPhone}
                />
                </div>
              <button
                type="submit"
                className="lg:w-2/4 w-full bg-[#282828] text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Section */}
        {showOTPSection && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
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
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      if (prevInput) prevInput.focus();
                    }
                  }}
                />
              ))}
            </div>

            {otpLoading ? (
              <div className="">
                <p className="text-gray-500">Verifying OTP...</p>
              </div>
            ) : !showtimer ? (
              <div className="">
                <p className="text-gray-500">
                  Didn't receive the code?{" "}
                  <span
                    className="cursor-pointer text-blue-500"
                    onClick={HandleResendOTP}
                  >
                    Resend
                  </span>
                </p>
              </div>
            ) : (
              <div className="">
                <p className="text-gray-500">Resend OTP in {timer} seconds</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationPage;
