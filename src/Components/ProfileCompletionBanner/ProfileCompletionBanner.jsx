"use client";

import React, { useState, useEffect } from "react";
import { Camera, User, Mail, X, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export function ProfileCompletionBanner() {
  const [profileItems, setProfileItems] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      let token = localStorage.getItem("token");
      if (!token) {
        return;
      }
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
        console.log(data);
  
        setUser(data);
  
        // Check if the name starts with "IPU" followed by numeric values or is "Iprop91 User"
        const isNameEmpty = 
          data.data?.name && 
          (data.data.name.startsWith("IPU") && 
          !isNaN(data.data.name.replace("IPU", ""))) || 
          data.data?.name === "Iprop91 User";
  
        setProfileItems([
          {
            name: "Profile Picture",
            completed: data.data?.profilePicture !== "",
            icon: <Camera className="w-4 h-4" />,
          },
          {
            name: "Full Name",
            completed: !isNameEmpty && data.data?.name !== "",
            icon: <User className="w-4 h-4" />,
          },
          {
            name: "Email Address",
            completed: data.data?.email !== "",
            icon: <Mail className="w-4 h-4" />,
          },
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  }, []);

  const completedCount = profileItems.filter((item) => item.completed).length;
  const completionPercentage = Math.round(
    (completedCount / profileItems.length) * 100
  );

  // Calculate the circle's circumference and offset
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionPercentage / 100) * circumference;

  // Hide the banner when the close button is clicked
  const handleClose = () => {
    setIsVisible(false);
  };

  // If the banner is not visible, return null to hide it
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 relative">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-0 right-0 p-1 text-amber-600 hover:text-amber-800"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex  items-center justify-between gap-4">
        <div className="flex  items-center gap-4">
          {/* Circular Progress */}
          <div className="relative  md:w-14 md:h-14  flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-amber-200"
              />
              {/* Progress circle */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                className="text-amber-500"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <span className="absolute text-sm font-medium text-amber-700">
              {completionPercentage}%
            </span>
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold text-amber-800">
              Complete Your Profile
            </h3>
            <span className="flex   gap-1">
              <p className="text-sm text-amber-700">
                Add the remaining details to maximise your account's potential.
              </p>
              <Link to={"/profile"} className="text-blue-500 text-xs">
                (Complete Profile)
              </Link>
            </span>
            
          </div>
          <span className="flex flex-col md:hidden  gap-1">
              <p className="text-xs text-amber-700 font-semibold ">
              Complete Your Profile
              </p>
              <Link to={"/profile"} className="text-blue-500 text-xs flex items-center ">
              <Edit className="w-3 h-3"/>
                (Edit)
              </Link>
            </span>
        </div>

        {/* Profile Items */}
        <div className="hidden lg:flex items-center gap-6">
          {profileItems.map((item, index) => (
            <div
              key={item.name}
              className={`flex items-center gap-2 ${
                index !== profileItems.length - 1
                  ? "border-r pr-6 border-amber-200"
                  : ""
              }`}
            >
              <div
                className={`p-1.5 rounded-full ${
                  item.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {item.name}
                </p>
                <p className="text-xs text-amber-600">
                  {item.completed ? "Completed" : "Incomplete"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Items Counter */}
        <div className="lg:hidden text-sm text-amber-700">
          <span className="font-medium">{completedCount}</span>
          <span className="text-amber-500">/</span>
          <span>{profileItems.length}</span>
          <span className="ml-1">Completed</span>
        </div>
      </div>
    </div>
  );
}
