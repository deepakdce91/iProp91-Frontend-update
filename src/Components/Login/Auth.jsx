import Input from "../CompoCards/InputTag/simpleinput"
import Goldbutton from "../CompoCards/GoldButton/Goldbutton"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import PhoneInput from "../CompoCards/PhoneInput"
import { Authenticate, initOTPless, verifyOTP } from '../../config/initOTPless'


function AskName({phone}) {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        if (name === "") {
            toast.error("Name is required");
            return;
        }
        try {
            let response = await fetch("http://localhost:3300/api/users/adduser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                }),
            });
            let data = await response.json();
            // console.log(data);
            localStorage.setItem("user", JSON.stringify(data));
            toast.success("User Created Successfully");
            navigate("/dash/concierge");
        } catch (err) {
            toast.error("Something went wrong");
            navigate("/");
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center ">
                <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center">
                    {/* Left Side - Form */}
                    <div className=" p-8">
                        <h2 className="text-3xl font-semibold mb-4"> Enter Your Name</h2>
                        <p className="text-gray-500 mb-8">
                            Welcome to Iprop 91,
                            Please enter your name to continue..
                        </p>
                        <div className="w-72 max-lg:m-auto">
                            <Input
                                type={"text"}
                                placeholder={"Enter Name"}
                                value={name}
                                setValue={setName}
                            />
                        </div>
                        <div className="w-72 max-lg:m-auto">
                            <Goldbutton
                                btnname={"Sign Up"}
                                bgcolor={"bg-gold ml-2"}
                                onclick={handleSignup}
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
        </>
    )
}

function Verify({ onclick, phone }) {
    const [otp, setOTP] = useState("");
    const [resend, setResend] = useState(false);
    const [timer, setTimer] = useState(5);
    const [showtimer, setShowtimer] = useState(false);
    const [askforname, setAskforname] = useState(false);
    const navigate = useNavigate();

    const HandleResendOTP = async (e) => {
        e.preventDefault();
        await Authenticate({ channel: "PHONE", phone: phone });
        setResend(false);
        setTimer(5);
        setShowtimer(false);
        toast.success("OTP Sent");
    }

    const HandleVerifyOTP = async (e) => {
        e.preventDefault();
        setShowtimer(true);
        setResend(false);
    
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

    
        setTimeout(() => {
            clearInterval(interval);
            setResend(true);
            setTimer(5);
        },5000);


        if (isNaN(otp)) {
            toast.error("Invalid OTP");
            return;
        } else {
            const res = await verifyOTP({ channel: "PHONE", otp: otp, phone: phone });
            if (res) {
                console.log('Response:', res);
                if (res.response && res.response.verification === "FAILED") {
                    toast.error(res.response.errorMessage.split(":")[1]);
                    setResend(true);
                    setTimer(5);
                    return;
                }else{
                    try{
                        let response = await fetch (`http://localhost:3300/api/users/fetchuserbyphone/${phone}`,
                        {   method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        if(response.status===404){
                            setAskforname(true);
                            return;
                        }
                        else{
                            let data = await response.json();
                            // console.log(data);
                            localStorage.setItem("user",JSON.stringify(data));
                            navigate("/dash/concierge");
                        }  
                    }catch(err){
                        console.log(err);
                    }
                    // navigate("/dash/concierge");
                }
            } else {
                toast.error("Verification Failed");
                return;
            }
        }
    }

    return (
        <>
           { askforname ? <AskName phone={phone} /> :
           ( <div className="min-h-screen flex items-center justify-center ">
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
                            <Input
                                type={"text"}
                                placeholder={"Enter OTP"}
                                value={otp}
                                setValue={setOTP}
                            />
                        </div>
                        <div className="w-72 max-lg:m-auto" >
                            <Goldbutton
                                btnname={"Verify OTP"}
                                bgcolor={"bg-gold ml-2"}
                                onclick={HandleVerifyOTP}
                            />
                        </div>

                        {resend ? <div className="w-72 max-lg:m-auto mt-2">
                            <p className="text-gray-500 text-center">
                                Didn't receive the code?{" "}
                                <span className="cursor-pointer text-green-500"  onClick={HandleResendOTP} >
                                    Resend
                                </span>
                            </p>
                        </div> : showtimer ? <div className="w-72 max-lg:m-auto mt-2">   
                            <p className="text-gray-500 text-center">
                                Resend OTP in {timer} seconds
                            </p>
                        </div> : null
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
            </div>)
           }
        </>
    );
}


export default function Login() {
    const [selectedCountry, setSelectedCountry] = useState('+91');
    const [phone, setPhone] = useState('');
    const [passwordlogin, setpasswordlogin] = useState(true);
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState(false);

    useEffect(() => initOTPless(callback), []);

    const callback = (otplessUser) => {
      console.log(otplessUser);
    };
    

    const HandleOTPLogin=(e)=>{
        e.preventDefault();
        // phone should be numberic
        if(isNaN(phone)){
            toast.error("Invalid Phone number");
            return;
        }
        if(phone.length!==10){
            toast.error("Inavlid Phone number");
            return;
        }
        else{
            Authenticate({ channel: "PHONE", phone: phone });
            toast.success("OTP Sent");
            setVerify(true);setpasswordlogin(false) ;
        }
    }
    return (
        <>
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
                                    bgcolor={"bg-gold ml-2"}
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
                </div>) : verify ? <Verify onclick={() =>{ setVerify(false);setpasswordlogin(true)}} phone={phone} /> :
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
                                <Input
                                    type={"password"}
                                    placeholder={"Password"}
                                    value={password}
                                    setValue={setPassword}
                                />
                            </div>
                            <div className="w-72 max-lg:m-auto">
                                <Goldbutton
                                    btnname={"Submit"}
                                    bgcolor={"bg-gold ml-2"}
                                // onclick={HandleLogin}
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