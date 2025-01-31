import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import PhoneInput from '../CompoCards/PhoneInput';
import StateCityCompo from '../GeneralUi/StateCityCompo';
import SimpleInput from "../CompoCards/InputTag/simpleinput";
import {
  Authenticate,
  initOTPless,
  verifyOTP,
} from "../../config/initOTPless";

function InvitationPage() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  
  const [stage, setStage] = useState('property-details');
  const [formData, setFormData] = useState({
    selectedState: '',
    selectedCity: '',
    selectBuilder: '',
    selectProject: '',
    selectHouseNumber: '',
    selectFloorNumber: '',
    selectedTower: '',
    selectedUnit: '',
    selectedSize: '',
  });
  
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [showtimer, setShowtimer] = useState(false);
  const [timer, setTimer] = useState(30);

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
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      checkCommunityMembership(decoded.userId, communityId);
    }
  }, [communityId]);

  const checkCommunityMembership = async (userId, communityId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/communities/checkMembership/${communityId}/${userId}`,
        {
          headers: {
            'auth-token': localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      if (data.isMember) {
        navigate(`/family`);
      }
    } catch (error) {
      console.error('Error checking membership:', error);
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
    
    // Validate that state and city are not empty
    if (!formData.selectedState || !formData.selectedCity) {
      toast.error("State and City are required.");
      return;
    }

    localStorage.setItem('invitationPropertyDetails', JSON.stringify(formData));
    setStage('phone-verification');
  };

  const HandleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Sending OTP to:", phone, "with country code:", selectedCountry);
      
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
        setStage('otp');
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

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isNaN(otp)) {
        toast.error("Invalid OTP");
        setLoading(false);
        return;
    }

    const verifyresponse = await verifyOTP({
        channel: "PHONE",
        otp: otp,
        phone: phone,
        countryCode: selectedCountry,
    });
    setOTP("");

    if (verifyresponse) {
        console.log("Verify Response:", verifyresponse);
        if (verifyresponse.response.verification === "FAILED") {
            toast.error(verifyresponse.response.errorMessage.split(":")[1]);
            setTimer(30);
            setLoading(false);
            return;
        } else {
            try {
                // Check if user exists using fetchuserbyphone
                let userexits = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuserbyphone/${phone}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                let userexitsjson = await userexits.json();
                if (userexitsjson.success === true) {
                    // User exists, proceed with login
                    try {
                        let loginres = await fetch(
                            `${process.env.REACT_APP_BACKEND_URL}/api/users/login/${phone}`,
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        if (loginres.status === 500) {
                            toast.error("Something went wrong");
                            setLoading(false);
                            return;
                        }
                        let loginresjson = await loginres.json();
                        if (loginresjson.success === true) {
                            const token = loginresjson.token;
                            localStorage.setItem("token", token);
                            const decoded = jwtDecode(token); // Decode the token to get userId
                            const userId = decoded.userId; // Assuming userId is in the token

                            // Add property for existing user
                            await addProperty(userId); // Pass userId to addProperty
                            
                            toast.success("Login Successful");
                            setTimeout(() => {
                                navigate("/family");
                            }, 2000);
                            return;
                        }
                    } catch (error) {
                        console.error(error.message);
                        toast.error("Something went wrong");
                        setLoading(false);
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
                            setLoading(false);
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
                        setLoading(false);
                    } catch (err) {
                        toast.error("Something went wrong");
                        setTimeout(() => {
                            navigate("/");
                        }, 2000);
                        setLoading(false);
                    }
                }
            } catch (err) {
                toast.error("Something went wrong");
                console.log(process.env.REACT_APP_BACKEND_URL);
                setTimeout(() => {
                    navigate("/");
                }, 2000);
                setLoading(false);
            }
        }
    } else {
        toast.error("Verification Failed");
        setLoading(false);
        return;
    }
};

const addProperty = async (userId) => {
    const propertyDetails = JSON.parse(localStorage.getItem('invitationPropertyDetails'));
    const { selectedState, selectedCity, selectBuilder, selectProject } = propertyDetails;

    // Validate that state and city are not empty
    if (!selectedState || !selectedCity) {
        toast.error("State and City are required.");
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/property/addpropertyForGuest?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'), // Include token if required
            },
            body: JSON.stringify({
                state: selectedState,
                city: selectedCity,
                builder: selectBuilder,
                project: selectProject,
            }),
        });

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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        {stage === 'property-details' && (
          <form onSubmit={handlePropertySubmit}>
            <h2 className="text-2xl font-bold mb-6">Enter Property Details</h2>
            
            <input
              type="text"
              name="selectedState"
              placeholder="State"
              value={formData.selectedState}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <input
              type="text"
              name="selectedCity"
              placeholder="City"
              value={formData.selectedCity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="space-y-4 mt-4">
              <input
                type="text"
                name="selectBuilder"
                placeholder="Builder Name"
                value={formData.selectBuilder}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              
              <input
                type="text"
                name="selectProject"
                placeholder="Project Name"
                value={formData.selectProject}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                name="selectedTower"
                placeholder="Tower"
                value={formData.selectedTower}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="text"
                name="selectedUnit"
                placeholder="Unit"
                value={formData.selectedUnit}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                name="selectFloorNumber"
                placeholder="Floor Number"
                value={formData.selectFloorNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                name="selectedSize"
                placeholder="Size"
                value={formData.selectedSize}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-6"
            >
              Next
            </button>
          </form>
        )}

        {stage === 'phone-verification' && (
          <form onSubmit={HandleOTPLogin}>
            <h2 className="text-2xl font-bold mb-6">Enter Phone Number</h2>
            
            <PhoneInput
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              phone={phone}
              setPhone={setPhone}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-6"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {stage === 'otp' && (
          <form onSubmit={handleOTPVerify}>
            <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
            
            <SimpleInput
              type={"text"}
              placeholder={"Enter OTP"}
              value={otp}
              setValue={setOTP}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg mt-6"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {!showtimer ? (
              <div className="mt-4 text-center">
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
              <div className="mt-4 text-center">
                <p className="text-gray-500">
                  Resend OTP in {timer} seconds
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default InvitationPage; 