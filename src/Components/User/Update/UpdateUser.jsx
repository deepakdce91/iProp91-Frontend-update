import LabelInput from "../../CompoCards/InputTag/labelinput";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import GoldButton from "../../CompoCards/GoldButton/Goldbutton";
import { useNavigate } from "react-router-dom";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../../../config/s3client";
import { PiHandCoinsFill } from "react-icons/pi";
import { supabase } from "../../../config/supabase";

export function validateEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email against the regex
  return emailRegex.test(email);
} 

const getPublicUrlFromSupabase = async (path) => {
  const { data, error } = supabase.storage
    .from(process.env.REACT_APP_PROFILE_PIC_BUCKET)
    .getPublicUrl(path);
  if (error) {
    console.error("Error fetching public URL:", error);
    return null;
  }
  return data.publicUrl;
};

const uploadFileToCloud = async (file) => {
  try {
    // Get the file name and strip spaces
    const fileName = file.name.replace(/\s+/g, "");
    const myPath = `profile/${fileName}`;
    
    const uploadParams = {
      Bucket: process.env.REACT_APP_PROFILE_PIC_BUCKET,
      Key: myPath,
      Body: file, // The actual file content
      ContentType: file.type, // The MIME type of the file
    };
    
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    console.log("File uploaded successfully:", myPath);
    return myPath; // return the file path

    
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

function NameHeader() {
  return (
    <>
      <div className="hidden lg:!block pb-5 bg-white rounded-xl">
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
}

function EditUser() {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(""); // URL/path of the current profile picture
  const [profileFile, setProfileFile] = useState(null); // Actual file object for upload
  const [profilePreview, setProfilePreview] = useState(""); // Preview URL for uploaded file
  const [isUploading, setIsUploading] = useState(false); // Track upload state
  
  const [avatar, setAvatar] = useState(""); // Currently selected avatar path
  
  const [name, setName] = useState("iProp91 User");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rewardCount, setRewardCount] = useState(0);

  const defaultAvatars = [
    "/avtar/polo.jpeg",
    "/avtar/golf.jpeg",
    "/avtar/football.jpeg",
    "/avtar/cricket.jpeg",
    "/avtar/pilates.jpeg",
    "/avtar/whisky-tasting.jpeg",
    "/avtar/badminton-tennis.jpeg",
    "/avtar/runners.jpeg",
    "/avtar/pickle-ball.jpeg",
    "/avtar/motor-sports.jpeg"
  ];

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user data from the server
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserdetails?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data = await response.json();
        
        setName(data.data.name);
        setPhone(data.data.phone);
        setEmail(data.data.email);
        setProfilePicture(data.data.profilePicture || "");
        setAvatar(data.data.avatar || "");

        const response2 = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/fetchrewardpoints?userId=${tokenid.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        const data2 = await response2.json();
        setRewardCount(data2.rewardPoints);

      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.includes("image")) {
      toast.error("Please select an image file");
      return;
    }
    
    // Store the file for upload
    setProfileFile(file);
    
    // Create a preview URL for the file
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (selectedAvatar) => {
    // Set the avatar value and clear any custom profile picture selection
    setAvatar(selectedAvatar);
    // Optionally clear profile picture when selecting an avatar
    // setProfileFile(null);
    // if (profilePreview) {
    //   URL.revokeObjectURL(profilePreview);
    //   setProfilePreview("");
    // }
  };

  const HandleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (name === "") {
      toast.error("Name field can't be empty.");
      return;
    }
    
    if (email.length > 0 && !validateEmail(email)) {
      toast.error("Please provide valid email.");
      return;
    }
    
    // Initialize upload path variables
    let uploadedProfilePicture = profilePicture;
    
    try {
      // If there's a new profile file, upload it
      if (profileFile) {
        setIsUploading(true);
        toast.info("Uploading profile picture...");
        
        try {
          uploadedProfilePicture = await uploadFileToCloud(profileFile);
          uploadedProfilePicture = await getPublicUrlFromSupabase(uploadedProfilePicture);
          toast.success("Profile picture uploaded successfully");
        } catch (error) {
          toast.error("Failed to upload profile picture");
          console.error("Upload error:", error);
          setIsUploading(false);
          return;
        }
      }
      
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/updateuserdetails?userId=${tokenid.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            profilePicture: uploadedProfilePicture,
            avatar: avatar,
          }),
        }
      );
      
      if (!response.ok) {
        toast.error("Failed to update user details");
        setIsUploading(false);
        return;
      }
      
      let data = await response.json();
      toast.success("User details updated successfully");
      
      // Update state with the updated values
      setProfilePicture(uploadedProfilePicture);
      
      // Clear file and preview after successful upload
      if (profileFile) {
        URL.revokeObjectURL(profilePreview);
        setProfilePreview("");
        setProfileFile(null);
      }
      
      setIsUploading(false);
      
    } catch (error) {
      toast.error("Failed to update user details");
      console.log(error);
      setIsUploading(false);
    }
  };

  const HandleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Skip if both fields are empty
    if (newPassword === "" && confirmPassword === "") {
      return;
    }
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      let token = localStorage.getItem("token");
      let tokenid = jwtDecode(token);
      
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/changepassword?userId=${tokenid.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            newPassword: newPassword,
          }),
        }
      );
      
      if (!response.ok) {
        toast.error("Failed to update password");
        return;
      }
      
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      toast.error("Failed to update password");
      console.log(error);
    }
  };

  // Function to get display image URL for profile pictures
  const getProfileImageUrl = (path) => {
    // If it's a full URL, use it as is
    if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
      return path;
    }
    
    // If it's a path from S3, prepend the CDN or bucket URL
    if (path && path !== "") {
      return `${process.env.REACT_APP_ASSET_URL}/${path}`;
    }
    
    // Default placeholder
    return "/images/default-profile.png";
  };

  return (
    <>
      <div className="flex justify-center w-full min-h-[84vh] rounded-xl bg-gray-50 flex-col">
        <div className="p-4 md:p-10 w-full justify-center flex items-center">
          {/* Main Profile Card - Combines Avatar, Profile Picture and Personal Info */}
          <div className="w-full max-w-6xl">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Profile Settings</h3>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Avatar and Profile Picture */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                  {/* Avatar Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium mb-3">Avatar Selection</h4>
                    
                    {/* Current Avatar Display */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-600">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt="Current Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No Avatar</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Avatar Selection */}
                    <div className="w-full">
                      <label className="text-gray-700 font-medium block mb-2 text-sm text-center">
                        Choose an Avatar
                      </label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {defaultAvatars.map((avatarPath, index) => (
                          <button
                            key={index}
                            onClick={() => handleAvatarChange(avatarPath)}
                            className={`w-12 h-12 rounded-full ${
                              avatar === avatarPath ? 'ring-2 ring-yellow-600 ring-offset-1' : 'border border-gray-300'
                            } overflow-hidden transition-all focus:outline-none hover:border-yellow-600`}
                          >
                            <img
                              src={avatarPath}
                              alt={`Avatar ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Profile Picture */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium mb-3">Custom Profile Picture</h4>
                    
                    {/* Current Profile Picture Display */}
                    <div className="flex justify-center mb-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600">
                        {profilePreview ? (
                          <img 
                            src={profilePreview} 
                            alt="Profile Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : profilePicture ? (
                          <img 
                            src={getProfileImageUrl(profilePicture)} 
                            alt="Current Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">No Image</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Profile Picture Upload */}
                    <div className="w-full">
                      <label className="text-gray-700 font-medium block mb-2 text-sm text-center">
                        Upload Custom Picture
                      </label>
                      <input
                        type="file"
                        id="profilePhoto"
                        accept="image/*"
                        placeholder="Choose profile photo"
                        className="mt-1 block cursor-pointer w-full text-gray-500 border rounded-lg text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleProfilePictureChange}
                        disabled={isUploading}
                      />
                      {profileFile && (
                        <p className="text-xs text-gray-600 mt-2 truncate">
                          Selected: {profileFile.name}
                        </p>
                      )}
                      {/* {profilePicture && !profileFile && (
                        <p className="text-xs text-gray-600 mt-2 truncate">
                          Current: {profilePicture}
                        </p>
                      )} */}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Personal Information */}
                <div className="w-full md:w-2/3">
                  <div className="bg-gray-50 p-4 rounded-lg h-full">
                    <h4 className="text-md font-medium mb-4">Personal Information</h4>
                    
                    <div className="flex flex-col w-full space-y-4">
                      <div className="w-full">
                        <LabelInput
                          label={"Name"}
                          type={"text"}
                          placeholder={"Enter full name"}
                          value={name}
                          setValue={setName}
                        />
                      </div>
                      <div className="w-full">
                        <div className={`w-full font-sm`}>
                          <label className="text-gray-900 font-[500] block mb-1 dark:text-white">
                            Phone
                          </label>
                          <input
                            type="text"
                            name="Phone"
                            placeholder={phone}
                            className="bg-gray-100 border border-yellow-600 text-gray-900 text-sm focus:ring-blue-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-blue-500 rounded-xl font-sm"
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

                      {/* Reward Points Display */}
                      <div className="flex items-center justify-start gap-2 text-gray-600 font-medium mt-2 border-t pt-4">
                        <span>Current Reward Points:</span> 
                        <span className="font-bold text-yellow-700">{rewardCount}</span>
                        <PiHandCoinsFill className="text-yellow-600 text-lg"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Common Update Button */}
              <div className="mt-6 flex justify-center w-full">
                <div className="w-full max-w-md">
                  <GoldButton
                    btnname={isUploading ? "Uploading..." : "Update Profile"}
                    properties={`bg-white/80 text-black ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onclick={isUploading ? null : HandleUpdateProfile}
                  />
                </div>
              </div>
            </div>
            
            {/* Password Update Section - Separate */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Change Password</h3>
              
              <div className="flex flex-col md:flex-row gap-4 px-2 w-full">
                <div className="w-full md:w-1/2">
                  <LabelInput
                    label={"New Password"}
                    type={"password"}
                    placeholder={"Enter new password"}
                    value={newPassword}
                    setValue={setNewPassword}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <LabelInput
                    label={"Confirm Password"}
                    type={"password"}
                    placeholder={"Enter password again"}
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                  />
                </div>
              </div>
              
              <div className="flex justify-center w-full mt-6">
                <div className="w-full max-w-md">
                  <GoldButton
                    btnname={"Update Password"}
                    properties={"bg-white/80 text-black"}
                    onclick={HandleUpdatePassword}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UpdateUser() {
  return (
    <>
      <div className="w-full space-y-1 min-h-screen">
        <NameHeader />
        <EditUser />
      </div>
    </>
  );
}