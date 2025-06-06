import Que from "./questoin/question";
import Call from "../CompoCards/Call";
import Starter from "../CompoCards/Starter/Starter";
import Cards from "./Cards";
import ContactUs from "../CompoCards/contactus/ContactUs";
import { useLayoutEffect, useState, useRef } from "react";
import Profile from "../User/Profile/profile";

export default function NRI() {
  const [hasToken, setHasToken] = useState(false);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    // Check token
    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };
    checkToken();

    // Scroll to Cards section
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="bg-white md:rounded-t-xl md:overflow-hidden">
      <div className="-z-10" ref={cardsRef}>
        <Cards />
      </div>
      <Que />
      <div className="bg-black">
          <Call />
          </div>
    </div>
  );
}