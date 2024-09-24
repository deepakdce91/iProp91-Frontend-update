import Input from "../../CompoCards/InputTag/simpleinput"
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton"
import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import PhoneInput from "../../CompoCards/PhoneInput"
import { Authenticate, initOTPless, verifyOTP } from '../../../config/initOTPless'
import { jwtDecode } from "jwt-decode";


function AskName({phone,countryCode}) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleSignup = async (e) => {
        e.preventDefault();
        if (name === "") {
            toast.error("Name is required");
            return;
        }
        try {
            let response = await fetch("http://localhost:3300/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    phone: countryCode+phone,
                }),
            });
            if (response.status === 500) {
                toast.error("Something went wrong");
                return;
            }
            if (response.success === false) {
                toast.error("Something went wrong");
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
                            <Input
                                type={"email"}
                                placeholder={"Enter Email"}
                                value={email}
                                setValue={setEmail}
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

function Verify({ onclick, phone, countryCode }) {
    const [otp, setOTP] = useState("");
    const [timer, setTimer] = useState(30);
    const [showtimer, setShowtimer] = useState(false);
    const [askforname, setAskforname] = useState(false);
    const navigate = useNavigate();

    const HandleResendOTP = async (e) => {
        e.preventDefault();
        await Authenticate({ channel: "PHONE", phone: phone, countryCode: countryCode });
        setTimer(5);
        setShowtimer(false);
        toast.success("OTP Sent");
    }

    const HandleVerifyOTP = async (e) => {
        e.preventDefault();
        setShowtimer(true);
    
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

    
        setTimeout(() => {
            clearInterval(interval);
            setTimer(30);
        },30000);


        if (isNaN(otp)) {
            toast.error("Invalid OTP");
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
                    return;
                }else{
                    try{
                        let loginres = await fetch(`http://localhost:3300/api/users/login/${countryCode+phone}`, {
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
                        if (loginresjson.success === false) { // user not found
                            setAskforname(true);
                            return;
                        }
                        if(loginresjson.success === true){
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
                            return;
                        }
                        console.log("Login Response: ", loginres);
                        // let decoded = jwtDecode(token);
                        // console.log(decoded);
                        
                    }catch(err){
                        toast.error("Something went wrong");
                        console.log("Error: "+err); 
                        navigate("/");
                    }
                }
            } else {
                toast.error("Verification Failed");
                return;
            }
        }
    }

    return (
        <>
           { askforname ? <AskName phone={phone} countryCode={countryCode} /> :
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

                        {!showtimer ? <div className="w-72 max-lg:m-auto mt-2">
                            <p className="text-gray-500 text-center">
                                Didn't receive the code?{" "}
                                <span className="cursor-pointer text-green-500"  onClick={HandleResendOTP} >
                                    Resend
                                </span>
                            </p>
                        </div> :  <div className="w-72 max-lg:m-auto mt-2">   
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
            </div>)
           }
        </>
    );
}


export default function Login() {
    const navigate = useNavigate();

    // useEffect(()=>{
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         navigate("/concierge");
    //     }
    // },[]);


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
        if(isNaN(phone)){
            toast.error("Invalid Phone number");
            return;
        }
        if(phone.length!==10){
            toast.error("Inavlid Phone number");
            return;
        }
        else{
            await Authenticate({ channel: "PHONE", phone: phone, countryCode: selectedCountry });
            toast.success("OTP Sent");
            setVerify(true);setpasswordlogin(false) ;
        }
    }

    const HandlePasswordLogin=(e)=>{
        e.preventDefault();
        if(isNaN(phone)){
            toast.error("Invalid Phone number");
            return;
        }
        if(phone.length!==10){
            toast.error("Inavlid Phone number");
            return;
        }
        if(password===""){
            toast.error("Password is required");
            return;
        }
        try{
            let loginres = fetch(`http://localhost:3300/api/users/login/${selectedCountry+phone}`, {
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
            let loginresjson = loginres.json();
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
            }
                , 2000);
            return;
            
        }catch(err){
            toast.error("Something went wrong");
            console.log("Error: "+err); 
            navigate("/");
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