import Header from "./Comps/Header";
import Main_Con from "./Comps/Main_Cont";
export default function FirstSafe() {
  return (
    <>
      <div className="w-full">
        <div className="my-2">
          <Header />
        </div>
        <div className="my-2 z-50">
          <Main_Con />
        </div>
      </div>
    </>
  );
}
