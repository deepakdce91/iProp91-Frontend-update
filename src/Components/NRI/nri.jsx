import Que from './questoin/question'
import Call from '../CompoCards/Call'
import Starter from '../CompoCards/Starter/Starter'
import Cards from './Cards';
import ContactUs from '../CompoCards/contactus/ContactUs';
import { useEffect, useState } from 'react';
import Profile from '../User/Profile/profile';


export default function NRI(){

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
        <>
        {/* Profile Header */}
      {hasToken && (
        <div className="fixed z-50 top-4 right-4 bg-white p-2 rounded shadow">
          <Profile/>
        </div>
      )}
         <Cards/>
        <Que/>
        <Call/>
        </>
    );
};