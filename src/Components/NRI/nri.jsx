import Que from "./questoin/question";
import Call from "../CompoCards/Call";
import Starter from "../CompoCards/Starter/Starter";
import Cards from "./Cards";
import ContactUs from "../CompoCards/contactus/ContactUs";
import { useEffect, useState } from "react";
import Profile from "../User/Profile/profile";

export default function NRI() {
  const [hasToken, setHasToken] = useState(false); // State for token presence
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token")); // Check for token in localStorage
    };

    checkToken();
  }, []);

  return (
    <section className="bg-white md:rounded-t-xl md:overflow-hidden">
      
      <Cards />
      <Que />
      <Call />
    </section>
  );
}
