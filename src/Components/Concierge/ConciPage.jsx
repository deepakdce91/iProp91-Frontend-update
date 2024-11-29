import { Routes, Route, Outlet } from "react-router-dom";
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
      <div className="flex flex-col lg:min-h-screen bg-white text-black  mb-3 ">
        <NameHeader />
          <Links />
        {/* <div className="mt-5 w-full"> */}
          <div className="w-full ">
            {/* Nested Routes */}
            <Routes>
              <Route path="/concierge" element={<MyProperties />} />
              <Route path="/concierge/relations" element={<RelationshipManager />} />
              <Route path="/concierge/property" element={<PropertyMangement />} />
              <Route path="/concierge/legal" element={<Legalsupport />} />
              <Route path="/concierge/finance" element={<FinanceAssitance />} />
            </Routes>
          </div>
        {/* </div> */}
      </div>
    </>
  );
}
