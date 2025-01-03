import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Cont";
import { useState } from "react";

export default function Dealing() {
  const [activeDocument, setActiveDocument] = useState(null);

  return (
    <>
      <div className="w-full">
        <Header activeDocument={activeDocument} />
        <Main_Con onDocumentSelect={setActiveDocument} />
      </div>
    </>
  );
}
