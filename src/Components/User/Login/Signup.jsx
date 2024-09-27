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

import Input from "../CompoCards/InputTag/simpleinput";
import Goldbutton from "../CompoCards/GoldButton/Goldbutton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";


function EnterName({ phone }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
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
                        <div className="w-72">
                            <Input
                                type={"password"}
                                placeholder={"Enter Name"}
                                value={name}
                                setValue={setName}
                            />
                        </div>
                        <div className="w-72">
                            <Goldbutton
                                btnname={"Submit"}
                                bgcolor={" ml-2"}
                                onclick={() => {
                                    toast.success("User Created Successfully");
                                    navigate("/concierge");
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="w-3/6 max-h-96">
                        <img
                            src="images/image2.jpg" // Replace this with the actual image URL
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
    const [namelogin, setnamelogin] = useState(false);

    const HandleVerifyOTP = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("OTP should be of 6 digits");
            return;
        }
        else {
            toast.success("OTP Verified");
            setnamelogin(true);
        }
    }

    return (
        <>
            {!namelogin ? <div className="min-h-screen flex items-center justify-center ">
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
                : (<EnterName phone={phone} />)
            }
        </>
    );
}



export default function Signup() {
    const [phone, setPhone] = useState("");
    const [verify, setVerify] = useState(false);

  
    const HandleSignup = (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            toast.error("Phone number should be of 10 digits");
            return;
        }
        else {
            toast.success("OTP sent to your number");
            setVerify(true);
        }
    };
    return (
        <>
            {!verify ?
                <div className="min-h-screen flex items-center justify-center ">
                    <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden justify-center">
                        {/* Left Side - Form */}
                        <div className=" p-8 max-lg:m-auto ">
                            <div
                                className="flex items-center mb-4 "
                            ><Link to="/" >
                                    <i
                                        className="bx bxs-chevron-left cursor-pointer"
                                        style={{ fontSize: "20px" }}
                                    ></i>
                                </Link>
                                <span className="ml-2 text-gray-600">Sign Up</span>
                            </div>
                            <h2 className="text-3xl font-semibold mb-4">
                                Enter your mobile Number
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Enter your mobile number to get and OTP and continue..
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
                                    onclick={HandleSignup}
                                />
                            </div>
                            <div className="w-72 flex flex-row  my-8 items-center ml-2">
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                                <span className="text-gray-500 text-center px-4">
                                    or
                                </span>
                                <div className="h-1 w-full bg-gray-500 rounded-xl"></div>
                            </div>
                            <Link to="/login">
                                <div className="w-72">
                                    <Goldbutton
                                        btnname={"Log in"}
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
                : <Verify onclick={() => setVerify(false)} phone={phone} />
            }

            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}