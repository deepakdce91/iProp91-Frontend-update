import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Con";
export default function FirstSafe() {
  return (
    <>
      <div className=" w-full border-b-[1px] border-b-black/20 pb-4 ">
        <Header />
          <Main_Con />
      </div>
    </>
  );
}
