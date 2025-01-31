import { Routes, Route, Outlet, Link } from "react-router-dom";
import NameHeader from "./Nameheader";
import MyProperties from "./Pages/MyProperties";
import Links from "./Concinks";
import RelationshipManager from "./Pages/RelationshipManager";
import PropertyMangement from "./Pages/PropertyManagement";
import Legalsupport from "./Pages/LegalSupport";
import FinanceAssitance from "./Pages/FinanceAssistance";

export default function Conci() {
  return (
    <>
      <div className="flex flex-col lg:gap-3   lg:rounded-xl text-black   ">
        {/* <div className=""> */}
          <NameHeader name={"Concierge"} pageName={"My Properties"} />
          {/* <div className="py-3 flex items-center justify-between pr-5">
            <Links />

            <Link to="/addproperty">
              <button className="text-black bg-white/90 border-secondary hover:border-simple shadow-2xl flex border-[1.5px] border-white/20 px-5 text-xs py-3 rounded-md  gap-2">
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
          </div> */}
        {/* </div> */}
        {/* <div className="mt-5 w-full"> */}
        <div className="w-full pt-3 bg-white lg:rounded-xl">
          {/* Nested Routes */}
          <Routes>
            <Route path="/concierge" element={<MyProperties />} />
            {/* <Route
              path="/concierge/relations"
              element={<RelationshipManager />}
            />
            <Route path="/concierge/property" element={<PropertyMangement />} />
            <Route path="/concierge/legal" element={<Legalsupport />} />
            <Route path="/concierge/finance" element={<FinanceAssitance />} /> */}
          </Routes>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}
