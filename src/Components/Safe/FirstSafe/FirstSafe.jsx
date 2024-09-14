import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Con";
export default function FirstSafe() {
  return (
    <>
      <div className=" w-full ">
        <Header />
        <div className="my-4">
          <Main_Con />
        </div>
      </div>
    </>
  );
}
