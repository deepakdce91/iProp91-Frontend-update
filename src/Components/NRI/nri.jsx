import Que from './questoin/question'
import Call from './corousal/corsoual'
import Starter from '../CompoCards/Starter/Starter'
import Cards from './Cards';
import ContactUs from '../CompoCards/contactus/ContactUs';
export default function NRI(){
    return (
        <>
        <Starter/>
         <Cards/>
        <Que/>
        <Call/>
        {/* <ContactUs/> */}
        </>
    );
};