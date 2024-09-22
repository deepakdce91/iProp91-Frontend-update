
import { Routes, Route } from "react-router-dom";
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
      <div className="flex flex-col lg:h-screen ">
        <NameHeader />

        <div className=" mt-5 w-full">
          <div className="w-full">
            <Links />
          </div>
          <div className="w-full mt-10">
            <Routes>
              <Route path="/*" element={<MyProperties />} />
              <Route path="/relations" element={<RelationshipManager />} />
              <Route path="/property" element={<PropertyMangement />} />
              <Route path="/legal" element={<Legalsupport />} />
              <Route path="/finance" element={<FinanceAssitance />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
