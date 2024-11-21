import { Button } from "@material-tailwind/react";

export default function ButtonDefault({ btnname, onclick, bgcolor , isDisabled}) {
  return (
    <>
      <Button disabled={isDisabled} className={`rounded-xl w-full  text-white normal-case font-thin shadow-md shadow-black/20 border ${bgcolor}  border-b-4  border-gold text-nowrap`} onClick={onclick}>{btnname}</Button>
    </>
  );
}
