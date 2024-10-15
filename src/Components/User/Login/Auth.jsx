import SimpleInput from "../../CompoCards/InputTag/simpleinput"
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton"
import LableInput from "../../CompoCards/InputTag/labelinput"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import PhoneInput from "../../CompoCards/PhoneInput"
import { Authenticate, initOTPless, verifyOTP } from '../../../config/initOTPless'
import { jwtDecode } from "jwt-decode";
import React from "react"
import {
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { Spinner } from "@material-tailwind/react";



function Verify({ onclick, phone, countryCode }) {
    const [otp, setOTP] = useState("");
    const [timer, setTimer] = useState(30);
    const [showtimer, setShowtimer] = useState(false);
    const [askforname, setAskforname] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
   
    const HandleResendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        await Authenticate({ channel: "PHONE", phone: phone, countryCode: countryCode });
        setTimer(5);
        setLoading(false);
        setShowtimer(false);
        toast.success("OTP Sent");
    }

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
        },30000);


        if (isNaN(otp)) {
            toast.error("Invalid OTP");
            setLoading(false);
            return;
        } else {
            const verifyresponse = await verifyOTP({ channel: "PHONE", otp: otp, phone: phone, countryCode: countryCode });
            // clear the otp field
            setOTP("");
            if (verifyresponse) {
                console.log('Response:', verifyresponse);
                if (verifyresponse.response.verification === "FAILED") {
                    toast.error(verifyresponse.response.errorMessage.split(":")[1]);
                    setTimer(30);
                    setLoading(false);
                    return;
                }else{
                    try{

                        let userexits = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/fetchuserbyphone/${phone}`, 
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        let userexitsjson = await userexits.json();
                        if (userexitsjson.success === true) { // user exists
                            try {
                                let loginres = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login/${phone}`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                });
                                if (loginres.status === 500) {
                                    toast.error("Something went wrong");
                                    console.log("Something went wrong");
                                    return;
                                }
                                let loginresjson = await loginres.json();
                                if (loginresjson.success === false) {
                                    toast.error("Invalid Credentials");
                                    return;
                                }
                                let token = loginresjson.token;
                                // console.log("Token = " + token);
                                let decoded = jwtDecode(token);
                                console.log(decoded);
                                localStorage.setItem("token", token);
                                setTimeout(() => {
                                    localStorage.removeItem("token");
                                }, 3600000); // 1 hour in milliseconds
                                toast.success("Login Successfull");

                                setTimeout(() => {
                                    navigate("/concierge");
                                }, 2000);
                                setLoading(false);
                                return;
                            }
                            catch (err) {
                                toast.error("Something went wrong");
                                setLoading(false);
                                console.log("Error: " + err);
                                setTimeout(() => {
                                    navigate("/");
                                }
                                , 2000);
                            }
                        }
                        setAskforname(true); // user doesnot exist
                        setLoading(false);
                        
                    }catch(err){
                        toast.error("Something went wrong");
                        console.log(process.env.REACT_APP_BACKEND_URL);
                        setTimeout(() => {
                            navigate("/");
                        }
                        , 2000);
                        setLoading(false);
                    }
                }
            } else {
                toast.error("Verification Failed");
                setLoading(false);
                return;
            }
        }
    }

    // for askname
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        setLoading(true);
        try {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name || "iProp91 User",
                    phone: phone,
                    password: password,
                    email: email
                }),
            });
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
    
            setTimeout(() => {
                navigate("/concierge");
            }, 2000);
            setLoading(false);
        } catch (err) {
            toast.error("Something went wrong");
            setTimeout(() => {
                navigate("/");
            }
            , 2000);
            setLoading(false);
        }
    }

    const handleOpen = () => {
        setAskforname(!askforname);
        handleSignup();
    }
    
 
    return (
        <>
            {loading ? <div className="h-screen w-full backdrop-blur-sm absolute flex justify-center items-center">
                <Spinner color="amber" className="h-16 w-16" />
            </div> : null}
            <Dialog size="sm" open={askforname} handler={handleOpen} className="p-4">
                <DialogHeader className="relative m-0 block">
                    <Typography variant="h4" color="blue-gray">
                        Enter Your Details
                    </Typography>
                    <Typography className="mt-1 font-normal text-gray-600">
                        Please enter your details to continue...
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
                                type={"text"}
                                setValue={setPassword}
                                value={password}
                            />
                        </div>
                    </div>
                   
                </DialogBody>
                <DialogFooter>
                    <Goldbutton
                        btnname={"Sign Up"}
                        bgcolor={""}
                        onclick={handleOpen}
                    />
                </DialogFooter>
            </Dialog>
            <div className="min-h-screen flex items-center justify-center ">
                <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center">
                    {/* Left Side - Form */}
                    <div className=" p-8">
                        <div
                            className="flex items-center mb-4 cursor-pointer"
                            onClick={onclick}
                        >
                            <i
                                className="bx bxs-chevron-left "
                                style={{ fontSize: "20px" }}
                            ></i>

                            <span className="ml-2 text-gray-600">back</span>
                        </div>
                        <h2 className="text-3xl font-semibold mb-4">Verify Code</h2>
                        <p className="text-gray-500 mb-8">
                            An authentication code has been sent to your Phone Number
                        </p>
                        <div className="w-72 max-lg:m-auto">
                            <SimpleInput
                                type={"text"}
                                placeholder={"Enter OTP"}
                                value={otp}
                                setValue={setOTP}
                            />
                        </div>
                        <div className="w-72 max-lg:m-auto" >
                            <Goldbutton
                                btnname={"Verify OTP"}
                                bgcolor={" ml-2"}
                                onclick={HandleVerifyOTP}
                            />
                        </div>

                        {!showtimer ? <div className="w-72 max-lg:m-auto mt-2">
                            <p className="text-gray-500 text-center">
                                Didn't receive the code?{" "}
                                <span className="cursor-pointer text-green-500" onClick={HandleResendOTP} >
                                    Resend
                                </span>
                            </p>
                        </div> : <div className="w-72 max-lg:m-auto mt-2">
                            <p className="text-gray-500 text-center">
                                Resend OTP in {timer} seconds
                            </p>
                        </div>
                        }

                    </div>

                    <div className="w-3/6 hidden lg:block">
                        <img
                            src="images/image.jpg"
                            alt="Building"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                </div>
            </div>

        </>
    );
}


export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/concierge");
        }
    }, [navigate]);
    
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('+91');
    const [phone, setPhone] = useState('');
    const [passwordlogin, setpasswordlogin] = useState(true);
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState(false);

    useEffect(() => initOTPless(callback), []);

    const callback = (otplessUser) => {
      console.log(otplessUser);
    };
    

    const HandleOTPLogin= async (e)=>{
        e.preventDefault();
        // phone should be numberic
        setLoading(true);
        if(isNaN(phone)){
            toast.error("Invalid Phone number");
            setLoading(false);
            return;
        }
        if(phone.length!==10){
            toast.error("Inavlid Phone number");
            setLoading(false);
            return;
        }
        else{
            await Authenticate({ channel: "PHONE", phone: phone, countryCode: selectedCountry });
            setLoading(false);
            toast.success("OTP Sent");
            console.log("OTP Sent");
            setVerify(true);setpasswordlogin(false) ;
        }
        setLoading(false);
    }

    const HandlePasswordLogin=async (e)=>{
        e.preventDefault(); 
        setLoading(true);
        if(isNaN(phone)){
            toast.error("Invalid Phone number");
            setLoading(false);
            return;
        }
        if(phone.length!==10){
            toast.error("Inavlid Phone number");
            setLoading(false);
            return;
        }
        if(password===""){
            toast.error("Password is required");
            setLoading(false);
            return;
        }
        try{
            let loginres = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/loginwithpassword?phone=${phone}&password=${password}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (loginres.status === 500) {
                toast.error("Something went wrong");
                console.log("Something went wrong");
                setLoading(false);
                return;
            }
            let loginresjson = await loginres.json();
            if (loginresjson.success === false) {
                toast.error("Invalid Credentials");
                setLoading(false);
                return;
            }
            let token = loginresjson.token;
            // console.log("Token = " + token);
            let decoded = jwtDecode(token);
            console.log(decoded);
            localStorage.setItem("token", token);
            setTimeout(() => {
                localStorage.removeItem("token");
            }, 3600000); // 1 hour in milliseconds
            toast.success("Login Successfull");

            setTimeout(() => {
                navigate("/concierge");
            }
                , 2000);
            setLoading(false);
            return;
            
        }catch(err){
            toast.error("Something went wrong");
            
            setTimeout(() => {
                navigate("/");
            }
            , 2000);
            setLoading(false);
        }
        setLoading(false);

    }
    return (
        <>
            {loading ? <div className="h-screen w-full backdrop-blur-sm absolute flex justify-center items-center">
                <Spinner color="amber" className="h-16 w-16" />
            </div>:null}
            {passwordlogin ? (
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center" >
                        {/* Left Side - Form */}
                        <div className=" p-8">
                           
                            <div
                                className="flex items-center mb-4 cursor-pointer"
                               
                            >      
                                <span className="ml-2 text-gray-600">Sign in / Sign up</span>
                            </div>
                        
                            <h2 className="text-3xl font-semibold mb-4">
                                Enter Phone Number
                            </h2>
                            <p className="text-gray-500 mb-8" onClick={onclick} >
                                Enter your mobile number to  get an OTP to your number
                            </p>
                         
                            <div className="w-72 max-lg:m-auto">
                              <PhoneInput
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                phone={phone}
                                setPhone={setPhone}
                               />

                            </div>
                            <div className="w-72 max-lg:m-auto">
                                <Goldbutton
                                    btnname={"Send OTP"}
                                    bgcolor={" ml-2"}
                                    onclick={HandleOTPLogin}
                                />
                            </div> 
                            <div
                                className="flex items-center mt-2 cursor-pointer "
                                onClick={()=>{setpasswordlogin(false); setVerify(false)}}
                            >
                                <p className="ml-2  ">Login with <span className="text-green-500 underline " >Password</span> </p>
                            </div>

                           

                        </div>

                        {/* Right Side - Image */}
                        <div className="w-3/6 hidden lg:block">
                            <img
                                src="images/image.jpg" // Replace this with the actual image URL
                                alt="Building"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>) : verify ? <Verify onclick={() =>{ setVerify(false);setpasswordlogin(true)}} phone={phone} countryCode={selectedCountry} /> :
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center" >
                        {/* Left Side - Form */}
                        <div className=" p-8">
                           
                                <div
                                    className="flex items-center mb-4 cursor-pointer"
                                    onClick={()=> setpasswordlogin(true)}
                                >
                                    <i
                                        className="bx bxs-chevron-left "
                                        style={{ fontSize: "20px" }}
                                    ></i>

                                    <span className="ml-2 text-gray-600">back</span>
                                </div>
                          
                            <h2 className="text-3xl font-semibold mb-4">
                                Enter Credentials
                            </h2>
                            <p className="text-gray-500 mb-8" onClick={onclick} >
                                Enter your mobile number and password to continue with login ...
                            </p>
                                <div className="w-72 max-lg:m-auto">
                                    <PhoneInput
                                        selectedCountry={selectedCountry}
                                        setSelectedCountry={setSelectedCountry}
                                        phone={phone}
                                        setPhone={setPhone}
                                    />

                                </div>
                            <div className="w-72 max-lg:m-auto">
                                <SimpleInput
                                    type={"password"}
                                    placeholder={"Password"}
                                    value={password}
                                    setValue={setPassword}
                                />
                            </div>
                            <div className="w-72 max-lg:m-auto">
                                <Goldbutton
                                    btnname={"Submit"}
                                    bgcolor={" ml-2"}
                                    onclick={HandlePasswordLogin}
                                />
                            </div> 
                        
                           
                        </div>

                        {/* Right Side - Image */}
                        <div className="w-3/6 hidden lg:block">
                            <img
                                src="images/image.jpg" // Replace this with the actual image URL
                                alt="Building"
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            }

            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}