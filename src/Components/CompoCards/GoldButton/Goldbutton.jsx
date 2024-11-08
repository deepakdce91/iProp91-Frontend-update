import { Button } from "@material-tailwind/react";

export default function ButtonDefault({ btnname, onclick, bgcolor , isDisabled}) {
  return (
    <>
      <Button disabled={isDisabled} className={`rounded-full w-full normal-case font-thin shadow-md border ${bgcolor} bg-white border-b-4  border-gold text-nowrap`} onClick={onclick}>{btnname}</Button>
    </>
  );
}
