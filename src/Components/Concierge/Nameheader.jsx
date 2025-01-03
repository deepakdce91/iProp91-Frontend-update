import { Link } from "react-router-dom";
import Profile from "../User/Profile/profile";
export default function NameHeader (){
    return (
      <>
        <div className="hidden lg:!block ">
          <div className="lg:pt-5 mb-3 px-7 pt-3">
            <div className="flex justify-between">
              <div className="mb-auto flex gap-1.5">
                <div>
                <p className="text-2xl cursor-pointer text-primary font-semibold mb-2">
                  iProp91 Concierge
                </p>
                {/* <hr className="bg-primary w-12 h-1 rounded-sm" /> */}
                </div>
                <div className="flex gap-1.5">
                    <span className="text-gray-400 text-xl font-bold">&gt;</span>
                    <span className="text-black font-semibold text-2xl">My Properties </span>
                </div>
              </div>
              <Profile />
            </div>
          </div>
          {/* <div className="flex justify-between px-7 align-middle">
            <p className="text-secondary text-xs">
              Upload all your real estate documents, applicable at different
              stages of ownership in an encrypted safe, accessible at all times
            </p> */}
            {/* <Link to="/addproperty">
              <button className="text-black bg-white border-secondary hover:border-simple shadow-2xl flex border-[1.5px] px-5 text-xs py-3 rounded-md mt-4 gap-2">
                Add property
                <img
                  alt="plus"
                  loading="lazy"
                  width="12"
                  height="12"
                  decoding="async"
                  data-nimg="1"
                  className="mt-auto mb-auto"
                  style={{ color: "transparent" }}
                  src="/svgs/plus.aef96496.svg"
                />
              </button>
            </Link> */}
          {/* </div> */}
        </div>
  
        <div className="mt-5 px-8 lg:!hidden">
          <p className="text-xl font-semibold mb-2">
            iProp91 <span className="text-primary">Concierge</span>
          </p>
          <hr className="bg-primary w-12 h-1 rounded-sm" />
        </div>
      </>
    );
  };