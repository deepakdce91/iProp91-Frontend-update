import React from "react";
import Goldbutton from "../CompoCards/GoldButton/Goldbutton";
import { useState } from "react";
import Input from "../CompoCards/InputTag/simpleinput";
import toast, { Toaster } from "react-hot-toast";

function Verify({ onclick, phone }) {
  const [otp, setOTP] = useState("");

  const HandleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          name: "Jatin M",
        }), // vafeafe
      });

      if (response.status === 400) {
        toast.error("Phone number already exist");
        return;
      }
      if (response.status === 500) {
        toast.error("Internal Server Error");
        return;
      }
      const json = response.json();
      console.log(json);
      toast.success("User Created Successfully");
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden">
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

              <span className="ml-2 text-gray-600">Login</span>
            </div>
            <h2 className="text-3xl font-semibold mb-4">Verify Code</h2>
            <p className="text-gray-500 mb-8">
              An authentication code has been sent to your Phone Number
            </p>
            <div className="w-72">
              <Input
                type={"password"}
                placeholder={"Enter OTP"}
                value={otp}
                setValue={setOTP}
              />
            </div>
            <div className="w-72">
              <Goldbutton
                btnname={"Submit"}
                bgcolor={"bg-gold"}
                onclick={HandleSignup}
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
  );
}

function Login({ onclick }) {
  const [phone, setPhone] = useState("");
  const [verify, setVerify] = useState(true);

  const HandleLogin = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      toast.success("OTP has been sent to your phone number");
      setVerify(false);
      return;
    }
    toast.error("Enter a valid phone number");
    return;
  };
  return (
    <>
      {verify ? (
        <div className="min-h-screen flex items-center justify-center ">
          <div className="flex bg-white rounded-lg  max-w-7xl overflow-hidden">
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

                <span className="ml-2 text-gray-600">Login</span>
              </div>
              <h2 className="text-3xl font-semibold mb-4">
                Enter your mobile Number
              </h2>
              <p className="text-gray-500 mb-8">
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
                  btnname={"Submit"}
                  bgcolor={"bg-gold"}
                  onclick={HandleLogin}
                />
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="w-3/6 ">
              <img
                src="images/image.jpg" // Replace this with the actual image URL
                alt="Building"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      ) : (
        <Verify onclick={onclick} phone={phone} />
      )}
    </>
  );
}

function LOGINASK() {
  // const [login, setlogin] = useState(true);
  const [start, setStart] = useState(true);

  return (
    <>
      <Toaster></Toaster>
      {start ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Iprop 91</h1>
          <p className="text-gray-500 mb-8">
            Your all in one Prop tech platform
          </p>
          <div className="w-72">
            <Goldbutton
              btnname={"Sign Up"}
              bgcolor={"bg-gray-300"}
              onclick={() => setStart(false)}
            />
          </div><br />
          <div className="w-72">
            <Goldbutton btnname={"Sign in"} bgcolor={"bg-gold"} />
          </div>
        </div>
      ) : (
        <Login onclick={() => setStart(true)} />
      )}
    </>
  );
}

export default LOGINASK;
