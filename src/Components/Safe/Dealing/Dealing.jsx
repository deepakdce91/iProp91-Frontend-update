import NameHeader from "../../Concierge/Nameheader";
import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Cont";
import { useState } from "react";

export default function Dealing() {
  const [activeDocument, setActiveDocument] = useState(null);

  return (
    <>
      <div className="w-full flex flex-col lg:gap-1 mt-20 md:mt-[68px]  lg:mt-0">
      <NameHeader description={"Upload all your real estate documents, applicable at different stages of ownership in an encrypted safe, accessible at all times"} name={"Safe"}  />
        <Main_Con onDocumentSelect={setActiveDocument} />
      </div>
    </>
  );
}
