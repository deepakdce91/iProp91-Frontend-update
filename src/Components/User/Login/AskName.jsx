import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Goldbutton from '../../CompoCards/GoldButton/Goldbutton';
import Input from '../../CompoCards/InputTag/simpleinput';

function AskName() {
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

            <ToastContainer position="top-right" autoClose={2000} />
        </>
    )
}


export default AskName;