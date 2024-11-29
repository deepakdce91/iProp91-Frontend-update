import { Button } from "@material-tailwind/react";

export default function ButtonDefault({ btnname, onclick, properties , isDisabled}) {
  return (
    <>
      <Button disabled={isDisabled} className={` w-full    border ${properties}  border-b-4  border-b-gold `} onClick={onclick}>{btnname}</Button>
    </>
  );
}
