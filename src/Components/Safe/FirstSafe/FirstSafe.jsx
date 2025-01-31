import NameHeader from "../../Concierge/Nameheader";
import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Con";
export default function FirstSafe() {
  return (
    <>
      <div className=" w-full h-full flex flex-col lg:gap-2 ">
        <NameHeader description={"Upload all your real estate documents, applicable at different stages of ownership in an encrypted safe, accessible at all times"} name={"Safe"}  />
          <Main_Con />
      </div>
    </>
  );
}
