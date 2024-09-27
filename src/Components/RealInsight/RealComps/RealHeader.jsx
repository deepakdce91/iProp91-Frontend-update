import { Link } from "react-router-dom";
import Profile from "../../User/Profile/profile";
export default function RealHeader (){
    return (
      <>
        <div className="hidden lg:!block">
          <div className="lg:pt-5 mb-3 px-7 pt-3">
            <div className="flex justify-between">
              <div className="mb-auto">
                <p className="text-xl font-semibold mb-2">
                  Real <span className="text-primary">Insight</span>
                </p>
                <hr className="bg-primary w-12 h-1 rounded-sm" />
              </div>
              <Profile />
            </div>
          </div>
          <div className="flex justify-between px-7 align-middle">
            <p className="text-secondary text-xs">
              No biased reviews & ratings, that's it!
            </p>
            <Link to="/addproperty">
              <button className="text-black border-secondary hover:border-simple shadow-2xl flex border-[1.5px] px-5 text-xs py-3 rounded-md mt-4 gap-2">
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
            </Link>
          </div>
        </div>

        <div className="mt-5 px-8 lg:!hidden flex flex-row w-full justify-between">
          <div className="">
            <p className="text-xl font-semibold mb-2">
              Real <span className="text-primary">Insight</span>
            </p>
            <hr className="bg-primary w-12 h-1 rounded-sm" />
          </div>
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
  };