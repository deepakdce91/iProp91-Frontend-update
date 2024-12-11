// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now
// not needed file for now

import Input from "../../CompoCards/InputTag/simpleinput"
import Goldbutton from "../../CompoCards/GoldButton/Goldbutton"
import { Link } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"

function Verify({ onclick, phone }) {
    const [otp, setOTP] = useState("");
  

    const HandleVerifyOTP = (e) => {
        e.preventDefault();
        if(otp.length!==6){
            toast.error("OTP should be of 6 digits");
            return;
        }
        else{
            toast.success("OTP Verified");
        }
    }

    return (
        <>
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

                            <span className="ml-2 text-gray-600">Back</span>
                        </div>
                        <h2 className="text-3xl font-semibold mb-4">Verify Code</h2>
                        <p className="text-gray-500 mb-8">
                            An authentication code has been sent to your Phone Number
                        </p>
                        <div className="w-72">
                            <Input
                                type={"text"}
                                placeholder={"Enter OTP"}
                                value={otp}
                                setValue={setOTP}
                            />
                        </div>
                        <div className="w-72">
                            <Goldbutton
                                btnname={"Verify OTP"}
                                bgcolor={" ml-2"}
                                onclick={HandleVerifyOTP}
                            />
                        </div>
                    </div>

                    <div className="w-3/6 max-h-96">
                        <img
                            src="images/image2.jpg" 
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
    const [phone, setPhone] = useState("");
    const [passwordlogin, setpasswordlogin] = useState(true);
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState(false);

    const HandleOTPLogin=(e)=>{
        e.preventDefault();
        if(phone.length!==10){
            toast.error("Phone number should be of 10 digits");
            return;
        }
        else{
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
                                onClick={onclick}
                            >  <Link to="/" >
                                    <i
                                        className="bx bxs-chevron-left "
                                        style={{ fontSize: "20px" }}
                                    ></i>
                                </Link>
                                <span className="ml-2 text-gray-600">Log in</span>
                            </div>
                           

                            <h2 className="text-3xl font-semibold mb-4">
                                Enter Phone Number
                            </h2>
                            <p className="text-gray-500 mb-8" onClick={onclick} >
                                Enter your mobile number to login and get an OTP to your number
                            </p>
                            <div className="w-72">
                                <Input
                                    type={"text"}
                                    placeholder={"Phone Number"}
                                    value={phone}
                                    setValue={setPhone}
                                />
                            </div>
                            <div className="w-72">
                                <Goldbutton
                                    btnname={"Send OTP"}
                                    bgcolor={" ml-2"}
                                    onclick={HandleOTPLogin}
                                />
                            </div> 
                            <div
                                className="flex items-center mt-2 cursor-pointer"
                                onClick={()=>{setpasswordlogin(false); setVerify(false)}}
                            >
                                <p className="ml-2 ">Login with <span className="text-green-500 underline" >Password</span> </p>
                            </div>

                            <div className="w-72 flex flex-row  my-8 items-center ml-2">
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                                <span className="text-gray-500 text-center px-4">
                                    or
                                </span>
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                            </div>
                            <Link to="/signup">
                                <div className="w-72">
                                    <Goldbutton
                                        btnname={"Sign Up"}
                                        bgcolor={" ml-2"}
                                       
                                    />
                                </div>
                            </Link>

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
                </div>) : verify ? <Verify onclick={() => setVerify(false)} phone={phone} /> :
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center" >
                        {/* Left Side - Form */}
                        <div className=" p-8">
                            <Link to="/signup" >
                                <div
                                    className="flex items-center mb-4 cursor-pointer"
                                    onClick={onclick}
                                >
                                    <i
                                        className="bx bxs-chevron-left "
                                        style={{ fontSize: "20px" }}
                                    ></i>

                                    <span className="ml-2 text-gray-600">Log in</span>
                                </div>
                            </Link>

                            <h2 className="text-3xl font-semibold mb-4">
                                Enter Phone Number
                            </h2>
                            <p className="text-gray-500 mb-8" onClick={onclick} >
                                Enter your mobile number and password to continue with login ...
                            </p>
                            <div className="w-72">
                                <Input
                                    type={"text"}
                                    placeholder={"Phone Number"}
                                    value={phone}
                                    setValue={setPhone}
                                />
                            </div>
                            <div className="w-72">
                                <Input
                                    type={"password"}
                                    placeholder={"Password"}
                                    value={password}
                                    setValue={setPassword}
                                />
                            </div>
                            <div className="w-72">
                                <Goldbutton
                                    btnname={"Submit"}
                                    bgcolor={" ml-2"}
                                // onclick={HandleLogin}
                                />
                            </div> 
                            <div
                                className="flex items-center mt-2 cursor-pointer"
                                onClick={()=>{setpasswordlogin(true); setVerify(false) }}
                            >
                                <p className="ml-2 ">Login with <span className="text-green-500 underline" >OTP</span> </p>
                            </div>
                            <div className="w-72 flex flex-row  my-8 items-center ml-2">
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                                <span className="text-gray-500 text-center px-4">
                                    or
                                </span>
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                            </div>
                            <Link to="/signup">
                                <div className="w-72">
                                    <Goldbutton
                                        btnname={"Sign Up"}
                                        bgcolor={" ml-2"}
                                       
                                    />
                                </div>
                            </Link>
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

        </>
    )
}