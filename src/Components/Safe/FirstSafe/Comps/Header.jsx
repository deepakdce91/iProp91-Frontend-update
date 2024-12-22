import { Link } from "react-router-dom";
import Profile from "../../../User/Profile/profile";
export default function NameHeader() {
  return (
    <>
      <div className="hidden lg:!block pb-5 border-b-[1px] border-b-black/20 ">
        <div className="lg:pt-5 px-7 pt-3">
          <div className="flex justify-between">
            <div className="mb-auto">
              <p className="text-xl font-semibold mb-2 text-primary">
                iProp91 <span className="text-black">Safe</span>
              </p>
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

      <div className="mt-5 px-8 lg:!hidden flex flex-row justify-between">
        <p className="text-xl font-semibold mb-2">
          iProp91 <span className="text-black">Safe</span>
        </p>
        <Link to="/addproperty">
          <button className="mt-auto mb-auto inactive text-black hover:text-white border-black flex ml-auto border-2 sm:px-20 px-4 py-4 rounded-xl gap-2">
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
            />{" "}
          </button>
        </Link>
      </div>
    </>
  );
}
