import { Link } from "react-router-dom";
import Profile from "../../User/Profile/profile";
export default function NameHeader (){
    return (
      <>
        <div className="hidden lg:!block ">
          <div className="lg:pt-5 mb-3 px-7 pt-3">
            <div className="flex justify-between">
              <div className="mb-auto">
                <p className="text-xl font-semibold mb-2 text-black">
                  Add <span className="text-primary">Property</span>
                </p>
                <hr className="bg-primary w-12 h-1 rounded-sm" />
              </div>
              <Profile />
            </div>
          </div>
          <div className="flex justify-between px-7 align-middle">
            <p className="text-secondary text-xs">
            Please fill the form below to receive a quote for workspace. Please add all the details required.
            </p>
          </div>
        </div>
  
        <div className="mt-5 px-8 lg:!hidden">
          <p className="text-xl font-semibold mb-2">
            Add <span className="text-primary">Property</span>
          </p>
          <hr className="bg-primary w-12 h-1 rounded-sm" />
        </div>
      </>
    );
  };