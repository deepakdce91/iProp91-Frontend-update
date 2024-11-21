import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Cont";
export default function FirstSafe() {
  return (
    <>
      <div className="w-full bg-black ">
        <div className="py-2">
          <Header />
        </div>
        <div className=" z-0">
          <Main_Con />
        </div>
      </div>
    </>
  );
}
