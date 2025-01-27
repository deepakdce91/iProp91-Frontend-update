import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Con";
export default function FirstSafe() {
  return (
    <>
      <div className=" w-full h-full flex flex-col gap-2 ">
        <Header />
          <Main_Con />
      </div>
    </>
  );
}
