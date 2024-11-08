import LabelInput from '../../CompoCards/InputTag/labelinput'
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import GoldButton from "../../CompoCards/GoldButton/Goldbutton";
import { useNavigate } from 'react-router-dom';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from '../../../config/s3client'

export function validateEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email against the regex
  return emailRegex.test(email);
}

const uploadFileToCloud = async (myFile) => {
  // remove spaces from file name
  myFile = myFile.replace(/\s+/g, "");
  const myPath = `profile/${myFile}`;
  try {
    const uploadParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
      Key: myPath,
      Body: myFile, // The file content
      ContentType: myFile.type, // The MIME type of the file
    };
    // console.log("Uploading file:", myFile.name);
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return myPath; //  return the file path
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};


function NameHeader (){
    return (
      <>
        <div className="hidden lg:!block">
          <div className="lg:pt-5 mb-3 px-7 pt-3">
            <div className="flex justify-between">
              <div className="mb-auto">
                <p className="text-xl font-semibold mb-2">
                  Edit <span className="text-primary">Profile</span>
                </p>
                <hr className="bg-primary w-12 h-1 rounded-sm" />
              </div>
            </div>
          </div>
          <div className="flex justify-between px-7 align-middle">
            <p className="text-secondary text-xs">
            Please fill the form below to update your profile
            </p>
          </div>
        </div>
  
        <div className="mt-5 px-8 lg:!hidden">
          <p className="text-xl font-semibold mb-2">
            Edit <span className="text-primary">Profile</span>
          </p>
          <hr className="bg-primary w-12 h-1 rounded-sm" />
        </div>
      </>
    );
  };


function EditUser() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("iProp91 User");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {

    const fetchUser = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      let tokenid = jwtDecode(token);
      // console.log(tokenid);
      // console.log(token);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${tokenid.userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const data = await response.json();
        console.log(data);
        setName(data.data.name);
        setPhone(data.data.phone);
        setEmail(data.data.email);
        setImage(data.data.profilePicture);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    if(!file.type.includes("image")){
      toast.error("Please select an image file");
      setImage(null);
      return;
    }
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const HandleUpdateProfile = async (e) => {
    e.preventDefault();
    // to update name and email
    if(name === ""){
      toast.error("Name field can't be empty.");
      return;
    }
    if(email.length > 0 && !validateEmail(email)){
      toast.error("Please provide valid email.");
      return;
    }
    try {
      if(image){
        let imagePath = await uploadFileToCloud(image);
        setImage(imagePath);
      }
    } catch (error) {
      toast.error("Some error occured while uploading.");
      console.log(error.message);
    }
    try{
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/updateuserdetails?userId=${tokenid.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          profilePicture : image,
        }),
      });
      if(!response.ok){
        toast.error("Failed to update user details");
        console.log(response);
        return;
      }
      let data = await response.json();
      console.log(data);
      toast.success("User details updated successfully");
    
    }catch(error){
      toast.error("Failed to update user details");
      console.log(error);
    }
  }

  const HandleUpdatePassword = async (e) => {
    e.preventDefault();
    // to update password
    if(newPassword === "" && confirmPassword === ""){
      return;
    }
    // to update password
    if(newPassword !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    try{
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/changepassword?userId=${tokenid.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          newPassword: newPassword,
        }),
      });
      if(!response.ok){
        toast.error("Failed to update password");
        console.log(response);
        return;
      }
      let data = await response.json();
      console.log(data);
      toast.success("Password updated successfully");
    }
    catch(error){
      toast.error("Failed to update password");
      console.log(error);
    }
  }


  return (
    <>
      <div className="flex justify-center w-full my-6 max-w-[1400px] m-auto p-4">
        <div className="bg-gray-50 rounded-3xl p-4 md:p-10 w-full justify-center ">
          <div className="flex flex-row my-1 px-2 lg:gap-4 w-full">
             {/* image Input  */}
            <div className="w-full ">
              <div className="flex w-full flex-col lg:flex-row justify-center items-center">
                <div className="w-full lg:w-1/5 my-1 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={image ? image : "/avtar/polo.jpg"}
                    alt="profile"
                    className="relative inline-block h-[110px] w-[110px] !rounded-full  object-cover object-center border-2 border-yellow-600 p-1"
                  />
                </div>

                <div className="w-full lg:w-2/5 my-1">
                  <label className="text-gray-900 font-[500] my-2  dark:text-white" htmlFor="profilePhoto"  >Choose from avatars</label>
                  <div className="w-full flex flex-row">
                   <img src="/avtar/polo.jpg" alt="" 
                   className="relative inline-block h-[55px] w-[55px] cursor-pointer sm:h-[74px] sm:w-[74px] !rounded-full object-cover object-center border-2 border-gold m-1"
                   onClick={() => setImage("/avtar/polo.jpg")}
                   />
                   <img src="/avtar/ferrari.jpg" alt="" 
                   className="relative inline-block h-[55px] w-[55px] cursor-pointer sm:h-[74px] sm:w-[74px] !rounded-full object-cover object-center border-2 border-gold m-1"
                    onClick={() => setImage("/avtar/ferrari.jpg")}
                   />
                   <img src="/avtar/golf.jpg" alt="" 
                   className="relative inline-block h-[55px] w-[55px] cursor-pointer sm:h-[74px] sm:w-[74px] !rounded-full object-cover object-center border-2 border-gold m-1"
                    onClick={() => setImage("/avtar/golf.jpg")}
                   />
                   <img src="/avtar/pocker.jpg" alt="" 
                   className="relative inline-block h-[55px] w-[55px] cursor-pointer sm:h-[74px] sm:w-[74px] !rounded-full object-cover object-center border-2 border-gold m-1"
                    onClick={() => setImage("/avtar/pocker.jpg")}
                   />
                   <img src="/avtar/yatch.jpg" alt="" 
                   className="relative inline-block h-[55px] w-[55px] cursor-pointer sm:h-[74px] sm:w-[74px] !rounded-full object-cover object-center border-2 border-gold m-1"
                    onClick={() => setImage("/avtar/yatch.jpg")}
                   />
                  </div>
                </div>
                <div className="w-full lg:w-2/5 my-1">
                  <label className="text-gray-900 font-[500] my-2  dark:text-white" htmlFor="profilePhoto"  >Choose from device</label>
                  <input type="file" placeholder="choose profile photo" className="mt-1 block cursor-pointer w-full text-gray-500  border-2 rounded-3xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                    onChange={handleImageChange}
                  />

                </div>

              </div>
            </div>

          </div>
          <div className="flex flex-col lg:flex-row lg:gap-4 my-1 px-2 w-full">
            <div className="w-full ">
              <LabelInput
                label={"Name"}
                type={"text"}
                placeholder={"Enter full name"}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-full">
              <div className={`w-full my-2 font-sm`}>
                <label className="text-gray-900 font-[500] my-2  dark:text-white"
                >Phone</label>
                <input
                  type="text"
                  name="Phone"
                  placeholder={phone}
                  className="bg-gray-100 border border-yellow-600 text-gray-900 text-sm focus:ring-blue-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-blue-500 rounded-full font-sm"
                  disabled={true}
                  
                />
              </div>
            </div>
            <div className="w-full">
              <LabelInput
                label={"Email"}
                type={"email"}
                placeholder={"Enter email"}
                value={email}
                setValue={setEmail}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row my-1 px-2 justify-end lg:gap-4 w-full">
            <div className="w-full lg:w-72">
              <GoldButton 
                btnname={"Update Profile"}
                bgcolor={""}
                onclick={HandleUpdateProfile}
               />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row my-1 px-2 justify-center lg:gap-4 w-full items-end">
            <div className="w-full ">
              <LabelInput
                label={"New Password"}
                type={"password"}
                placeholder={"Enter new password"}
                value={newPassword}
                setValue={setNewPassword}
              />
            </div>
            <div className="w-full">
              <LabelInput
                label={"Confirm Password"}
                type={"password"}
                placeholder={"Enter password again"}
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            </div>
            <div className="w-full lg:w-72 flex my-2">
              <GoldButton 
                btnname={"Update Password"}
                bgcolor={""}
                onclick={HandleUpdatePassword}
               />
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default function UpdateUser() {
    return (
        <>
            <div className="w-full">
                <NameHeader />
                <EditUser />
                <ToastContainer position="top-right" autoClose={2000} />
            </div>
        </>
    )
}

