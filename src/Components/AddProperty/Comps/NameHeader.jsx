import { Link } from "react-router-dom";

export default function NameHeader (){
    return (
      <>
        <div className="hidden lg:!block">
          <div className="lg:pt-5 mb-3 px-7 pt-3">
            <div className="flex justify-between">
              <div className="mb-auto">
                <p className="text-xl font-semibold mb-2">
                  Add <span className="text-primary">Property</span>
                </p>
                <hr className="bg-primary w-12 h-1 rounded-sm" />
              </div>
              <button className="px-1 py-1 flex mt-auto mb-auto bg-white rounded-full border-black border-[1px]">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mt-auto mb-auto mr-1">
                  <img
                    className="aspect-square h-full w-full"
                    alt="profilePic"
                    src="https://images.unsplash.com/photo-1523560220134-8f26a720703c?q=80&amp;w=1854&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                </span>
                <p className="mt-auto mb-auto text-xs mx-1">Deepak</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down mt-auto mb-auto h-4"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
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