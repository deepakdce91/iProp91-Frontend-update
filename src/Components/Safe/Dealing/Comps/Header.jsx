import { useLocation, Link } from "react-router-dom";
import Profile from "../../../User/Profile/profile";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";


export default function NameHeader({ activeDocument }) {
  const location = useLocation();
  const [properyname, setPropertyName] = useState("");
  
  useEffect(() => {
    const fetchPropertyName = async () => {
      const propertyId = window.location.pathname.split("/")[3];
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);
      // ${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/IPP00002?userId=IPU0008
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/property/fetchproperty/${propertyId}?userId=${user.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPropertyName(data.project);
          console.log("Fetched", data);
        }
      } catch (err) {
        toast.error("Error fetching data");
        console.log(err);
      }
    };
    fetchPropertyName();
  }
  , []);
  return (
    <>
      <div className="hidden lg:!block bg-white rounded-xl pb-4">
        <div className="lg:pt-5 px-7 ">
          <div className="flex justify-between">
            <div className="mb-">
              <div className="flex items-center gap-2 text-2xl font-semibold mb-2">
                <Link to="/safe" className="text-primary hover:text-gray-700">
                  iProp91 Safe
                </Link>
                <span className="text-gray-400">&gt;</span>
                <span className="text-black">{properyname}</span>
                {activeDocument && (
                  <>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-black">{activeDocument}</span>
                  </>
                )}
              </div>
            </div>
            <Profile />
          </div>
        </div>
        <div className="flex justify-between px-7 align-middle">
          <p className="text-secondary text-base">
            Upload all your real estate documents, applicable at different stages of ownership in an encrypted safe, accessible at all times
          </p>
        </div>
      </div>

      <div className="mt-5 px-8 lg:!hidden">
        <div className="flex items-center gap-2 text-xl font-semibold mb-2">
          <Link to="/safe" className="text-black">
            iProp91 Safe
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-primary">{properyname}</span>
          {activeDocument && (
            <>
              <span className="text-gray-400">&gt;</span>
              <span className="text-primary">{activeDocument}</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
