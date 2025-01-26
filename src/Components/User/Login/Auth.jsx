import SimpleInput from "../../CompoCards/InputTag/simpleinput";
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton";
import LableInput from "../../CompoCards/InputTag/labelinput";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PhoneInput from "../../CompoCards/PhoneInput";
import {
  Authenticate,
  initOTPless,
  verifyOTP,
} from "../../../config/initOTPless";
import { jwtDecode } from "jwt-decode";
import React from "react";
import {
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { Spinner } from "@material-tailwind/react";
import SimpleInputPass from "../../CompoCards/InputTag/simpleinputpass";
import { Cross, CrossIcon } from "lucide-react";
import { GrClose } from "react-icons/gr";
import { ChevronLeft } from "lucide-react";

import { useSearchParams } from "react-router-dom";

async function AddGuestProperty(userId, userToken, data, myCallback) {
  // Handle property submission
  try {
    const propertyResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/property/addpropertyForGuest?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
        body: JSON.stringify({
          state: data.selectedState,
          city: data.selectedCity,
          builder: data.selectBuilder,
          project: data.selectProject,
        }),
      }
    );

    if (propertyResponse.ok) {
      toast.success("Property details saved successfully!");
      myCallback();
    } else {
      const errorData = await propertyResponse.json();
      console.error("Property submission error:", errorData);
      toast.error("Failed to save property details");
    }
  } catch (error) {
    console.error("Error saving property:", error);
    toast.error("Failed to save property details");
  }
}

function Verify({
  onclick,
  phone,
  countryCode,
  setIsLoggedIn,
  handleOtpChange,
  stage1FormData,
  onBack,
  authPage,
  onJourneyPage,
  redirectionUrl,
}) {
  const [otp, setOTP] = useState("");
  const [currentView, setCurrentView] = useState("mobileNumber"); // Example state
  const [timer, setTimer] = useState(30);
  const [showtimer, setShowtimer] = useState(false);
  const [askforname, setAskforname] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const HandleResendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    await Authenticate({
      channel: "PHONE",
      phone: phone,
      countryCode: countryCode,
    });
    setTimer(5);
    setLoading(false);
    setShowtimer(false);
    toast.success("OTP Sent");
  };

  const HandleVerifyOTP = async (e) => {
    e.preventDefault();
    setShowtimer(true);
    setLoading(true);

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setTimer(30);
    }, 30000);

    if (isNaN(otp)) {
      toast.error("Invalid OTP");
      setLoading(false);
      return;
    } else {
      const verifyresponse = await verifyOTP({
        channel: "PHONE",
        otp: otp,
        phone: phone,
        countryCode: countryCode,
      });
      setOTP("");

      if (verifyresponse) {
        console.log("Response:", verifyresponse);
        if (verifyresponse.response.verification === "FAILED") {
          toast.error(verifyresponse.response.errorMessage.split(":")[1]);
          setTimer(30);
          setLoading(false);
          return;
        } else {
          try {
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
              // user exists
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
                  localStorage.setItem("token", loginresjson.token);

                  // save redirectionUrl if provided from journey
                  if (redirectionUrl) {
                    localStorage.setItem("redirectToPage", redirectionUrl);
                  }
 
                  // Get user details after login
                  const decoded = jwtDecode(loginresjson.token);
                  const userId = decoded.userId; // This should be the correct user ID
                  setIsLoggedIn(true);
                  toast.success("Login Successful");
                  if (stage1FormData && !onJourneyPage) {
                    localStorage.setItem("addPropDetails", "true");
                    const SendToConciPage = () => {
                      setTimeout(() => {
                        navigate("/concierge");
                      }, 2000);
                    };
                    AddGuestProperty(
                      userId,
                      loginresjson.token,
                      stage1FormData,
                      SendToConciPage
                    );
                  }

                  return;
                } else {
                  setTimeout(() => {
                    navigate("/concierge");
                  }, 2000);
                  return;
                }
              } catch (error) {
                console.error(error.message);
                toast.error("Something went wrong");
                setLoading(false);
                return;
              }
            }
            setAskforname(true); // user doesnot exist
            setLoading(false);
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
    }
  };

  const handleBackClick = () => {
    setCurrentView("mobileNumber"); // Update the state to show the mobile number input
  };

  useEffect(() => {
    if (otp.length === 6) {
      HandleVerifyOTP({ preventDefault: () => {} });
    }
  }, [otp]);

  // for askname
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || "iProp91 User",
            phone: phone,
            password: password,
            email: email,
          }),
        }
      );
      if (response.status === 500) {
        toast.error("Something went wrong");
        setLoading(false);
        return;
      }
      if (response.success === false) {
        toast.error("Something went wrong");
        setLoading(false);
        return;
      }
      let data = await response.json();
      let token = data.token;
      // console.log("Token = "+token);
      localStorage.setItem("token", token);
      setTimeout(() => {
        localStorage.removeItem("token");
      }, 3600000); // 1 hour in milliseconds

      toast.success("Signup Successfull");

      // save redirectionUrl if provided from journey
      if (redirectionUrl) {
        localStorage.setItem("redirectToPage", redirectionUrl);
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      if (stage1FormData && !onJourneyPage) {
        localStorage.setItem("addPropDetails", "true");
        const SendToConciPage = () => {
          setTimeout(() => {
            navigate("/concierge");
          }, 2000);
        };
        AddGuestProperty(userId, token, stage1FormData, SendToConciPage);
      } else {
        setTimeout(() => {
          navigate("/concierge");
        }, 1000);
        // set is login === true
        setIsLoggedIn(true);
        setLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setAskforname(!askforname);
    handleSignup();
  };

  return (
    <section className="relative">
      {loading ? (
        <div className="h-screen w-full right-0 absolute flex justify-center items-center">
          <Spinner color="amber" className="h-12 w-16" />
        </div>
      ) : null}
      <Dialog size="sm" open={askforname} handler={handleOpen} className="p-4">
        <p
          onClick={handleOpen}
          className="absolute right-4 top-3 cursor-pointer text-xs hover:underline text-black/70 hover:text-black z-20"
        >
          Skip for now
        </p>
        <DialogHeader className="relative m-0 block">
          {/* <Typography variant="h4" color="blue-gray">
            Enter Your Details
          </Typography> */}
          <Typography className="mt-1 font-bold text-lg text-gray-800">
            Helping you manage your real estate assets brick by brick
          </Typography>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <div className="w-full">
              <LableInput
                label={"Name"}
                placeholder={"iProp91-User"}
                type={"text"}
                setValue={setName}
                value={name}
              />
            </div>
          </div>
          <div>
            <div className="w-full">
              <LableInput
                label={"Email"}
                placeholder={"xyz@gmail.com"}
                type={"text"}
                setValue={setEmail}
                value={email}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <LableInput
                label={"Password"}
                placeholder={"Set Password"}
                type={"password"}
                setValue={setPassword}
                value={password}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Goldbutton
            btnname={"Sign Up"}
            properties={
              "bg-white/20 text-black hover:shadow-gold hover:shadow-md rounded-xl  ml-2"
            }
            onclick={handleOpen}
          />
        </DialogFooter>
      </Dialog>
      <div
        className={`${
          stage1FormData || authPage ? "h-fit" : "min-h-screen"
        } flex items-center justify-center `}
      >
        <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center">
          {/* Left Side - Form */}

          <div className=" p-8">
            <div
              className="flex items-center mb-4 cursor-pointer"
              onClick={onBack}
            >
              <i
                className="bx bxs-chevron-left "
                style={{ fontSize: "20px" }}
              ></i>

              <span className="ml-2 text-gray-600">Back</span>
            </div>
            <h2 className="text-3xl font-semibold mb-4 text-black">
              Verify Code
            </h2>
            <p className="text-gray-500 mb-8">
              An authentication code has been sent to your Phone Number
            </p>

            <div className="w-72 mb-4 max-lg:m-auto">
              <SimpleInput
                type={"text"}
                placeholder={"Enter OTP"}
                value={otp}
                setValue={setOTP}
                onChange={handleOtpChange}
              />
            </div>

            {/* <div className="w-72 max-lg:m-auto">
              {otp.length === 6 ? null : (
                <Goldbutton
                  btnname={"Verify OTP"}
                  properties={"bg-white/20 ml-2 text-black hover:shadow-gold hover:shadow-md rounded-xl"}
                  onclick={HandleVerifyOTP}
                />
              )}
            </div> */}

            {!showtimer ? (
              <div className="w-72 max-lg:m-auto mt-2">
                <p className="text-gray-500 text-center">
                  Didn't receive the code?{" "}
                  <span
                    className="cursor-pointer text-gold"
                    onClick={HandleResendOTP}
                  >
                    Resend
                  </span>
                </p>
              </div>
            ) : (
              <div className="w-72 max-lg:m-auto mt-2">
                <p className="text-gray-500 text-center">
                  Resend OTP in {timer} seconds
                </p>
              </div>
            )}
          </div>

          {/* <div className="w-3/6 hidden lg:block">
            <img
              src="images/login.png"
              alt="Building"
              className="w-full h-full object-cover rounded-xl"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default function Login({
  setIsLoggedIn,
  onClose,
  properties,
  stage1FormData,
  goBackToStage1,
  authPage,
  onJourneyPage,
  redirectionUrl,
}) {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const modalRef = useRef(null); // Create a ref for the modal

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("+91");
  const [phone, setPhone] = useState("");
  const [passwordlogin, setPasswordLogin] = useState(true);
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpScreen, setIsOtpScreen] = useState(false);

  const [mySearchParam, setMySearchParam] = useState();

  useEffect(() => initOTPless(callback), []);

  const callback = (otplessUser) => {
    console.log(otplessUser);
  };

  const HandleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isNaN(phone)) {
      toast.error("Invalid Phone number");
      setLoading(false);
      return;
    }
    if (phone.length !== 10) {
      toast.error("Invalid Phone number");
      setLoading(false);
      return;
    } else {
      await Authenticate({
        channel: "PHONE",
        phone: phone,
        countryCode: selectedCountry,
      });
      setLoading(false);
      toast.success("OTP Sent");
      console.log("OTP Sent");
      setVerify(true);
      setPasswordLogin(false);
    }
    setLoading(false);
  };

  const HandlePasswordLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/loginwithpassword?phone=${phone}&password=${password}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const loginresjson = await response.json();
      if (loginresjson.success === false){
        toast.error(loginresjson.message);
        return;
      }
      if (loginresjson.success === true) {
        console.log(loginresjson);
        // First store the token
        localStorage.setItem("token", loginresjson.token);
        const decoded = jwtDecode(loginresjson.token);

        // save redirectionUrl if provided from journey
        if (redirectionUrl) {
          localStorage.setItem("redirectToPage", redirectionUrl);
        }

        // Set login state first
        setIsLoggedIn(true);
        toast.success("Login Successful");

        const userId = decoded.userId;

        if (stage1FormData && !onJourneyPage) {
          localStorage.setItem("addPropDetails", "true"); 
          const SendToConciPage = () => {
            setTimeout(() => {
              navigate("/concierge");
            }, 2000);
          };
          AddGuestProperty(
            userId,
            loginresjson.token,
            stage1FormData,
            SendToConciPage
          );
        } else {
          setTimeout(() => {
            navigate("/concierge");
          }, 1000);
          // set is login === true
          setIsLoggedIn(true);
          setLoading(false);
        }
      } else {
        toast.error(loginresjson.error);
        return;
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
      return;
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);

    if (value.length === 6) {
      verifyOtp(value);
    }
  };

  const verifyOtp = async (otpValue) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, otp: otpValue }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("OTP Verified Successfully");
        setIsLoggedIn(true);
        navigate("/concierge");
      } else {
        toast.error(data.error || "OTP Verification Failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      HandleOTPLogin(e);
    }
  };

  const handleBack = () => {
    setVerify(false);
    setPasswordLogin(true);
    setOtp("");
  };

  const handleBackClick = () => {
    setPasswordLogin(true);
    setVerify(false);
  };

  // Function to handle clicks outside the modal
  const handleClickOutside = (event) => {
    if ( 
      modalRef.current && 
      !modalRef.current.contains(event.target) && 
      verify === false  // Add this condition to prevent closing when Verify is active
    ) {
      // onClose(); // Close the modal only if Verify is not open
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const toPage = searchParams.get("toPage");
    if (toPage) {
      localStorage.setItem("redirectToPage", `/${toPage}`);
    }
  }, []);

  return (
    <section
      className={`${
        stage1FormData || authPage ? "" : "absolute"
      } h-screen w-screen`}
    >
      <div className="relative w-full h-full sm:h-full" ref={modalRef}>
        {/* {loading ? (
          <div className="h-screen   absolute flex justify-center items-center">
          <Spinner color="amber" className="h-16 w-16" />
        </div>
      ) : null} */}
        <div
          className={`shadow-md ${
            stage1FormData || authPage
              ? `${authPage ? "bg-white" : "bg-black"} items-center  flex-col ${
                  authPage ? "" : "pt-5 md:pt-20"
                }  h-full`
              : `rounded-xl bg-gray-100 absolute items-start h-fit ${properties}`
          }     flex justify-center  `}
        >
          <div className="flex bg-white relative  rounded-lg max-w-7xl overflow-hidden justify-center">
            {!(stage1FormData || authPage) && (
              <button
                onClick={onClose}
                className="absolute text-black right-4 top-5 "
              >
                <GrClose />
              </button>
            )}

            {/* Left Side - Form */}
            <form
              onKeyDown={handleKeyPress}
              className={`md:p-16  p-8 lg:p-12 flex flex-col justify-center shadow-md rounded-xl bg-white/80 lg:w-[400px] w-full md:w-[450px]  ${
                stage1FormData || authPage ? "h-fit" : "h-[500px] lg:h-[600px]"
              }`}
            >
              {verify ? (
                <Verify
                  phone={phone}
                  countryCode={selectedCountry}
                  setIsLoggedIn={setIsLoggedIn}
                  handleOtpChange={handleOtpChange}
                  stage1FormData={stage1FormData}
                  onBack={handleBack}
                />
              ) : passwordlogin ? (
                <>
                  <div className="flex items-center mb-2 cursor-pointer">
                    <span className=" text-gray-600">Sign in / Sign up</span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-black ">
                    Enter Phone Number
                  </h2>
                  <p className="text-gray-500 text-sm mb-3" onClick={onclick}>
                    Enter your mobile number to get an OTP
                  </p>
                  <div className="w-72">
                    <PhoneInput
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      phone={phone}
                      setPhone={setPhone}
                    />
                  </div>
                  <div className="w-72  mt-1">
                    <Goldbutton
                      btnname={"Send OTP"}
                      properties={
                        " bg-white/20 text-black hover:shadow-gold hover:shadow-md rounded-xl  ml-2"
                      }
                      onclick={HandleOTPLogin}
                    />
                  </div>
                  <div
                    className="flex items-center mt-4 cursor-pointer"
                    onClick={() => {
                      setPasswordLogin(false);
                      setVerify(false);
                    }}
                  >
                    <p className="text-black">
                      Login with{" "}
                      <span className="text-gold underline ml-1">Password</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setPasswordLogin(true)}
                  >
                    <i
                      className="bx bxs-chevron-left"
                      style={{ fontSize: "20px" }}
                    ></i>
                    <span className=" text-gray-600">Back</span>
                  </div>
                  <h2 className="text-3xl text-black font-semibold mb-4">
                    Enter Credentials
                  </h2>
                  <p className="text-gray-500 mb-3" onClick={onclick}>
                    Enter your mobile number and password to continue with login
                    and password.
                  </p>
                  <div className="w-72 ">
                    <PhoneInput
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      phone={phone}
                      setPhone={setPhone}
                    />
                  </div>
                  <div className="w-72">
                    <SimpleInputPass
                      type={"password"}
                      placeholder={"Password"}
                      value={password}
                      setValue={setPassword}
                    />
                  </div>
                  <div className="w-72 ">
                    <Goldbutton
                      btnname={"Submit"}
                      properties={
                        "bg-white/20 ml-2 text-black hover:shadow-gold hover:shadow-md rounded-xl"
                      }
                      onclick={HandlePasswordLogin}
                    />
                  </div>
                  <div
                    className="flex items-center mt-2 cursor-pointer"
                    onClick={() => {
                      setPasswordLogin(true);
                      setVerify(false);
                    }}
                  >
                    <p className="text-black">
                      Login with{" "}
                      <span className="text-gold underline ml-1">OTP</span>
                    </p>
                  </div>
                </>
              )}
              {stage1FormData && (
           <div className="w-full ">
             <button
              onClick={goBackToStage1}
              className="flex mt-6 items-center px-3 py-2 rounded-lg text-gray-800 hover:text-black border border-1 border-white hover:border-black bg-gray-200 hover:bg-white  -left-12 top-2 z-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
           </div>
          )}
            </form>

            {/* Right Side - Image */}
            {/* <div className="w-4/6 hidden ">
            <img
              src="images/login.png" // Replace this with the actual image URL
              alt="Building"
              className="w-full h-[90%] rounded-xl object-cover"
            />
          </div> */}
          </div>

          
        </div>
      </div>
    </section>
  );
}
