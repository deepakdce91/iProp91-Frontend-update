import Que from './questoin/question'
import Call from './corousal/corsoual'
import Starter from '../CompoCards/Starter/Starter'
export default function NRI(){
    return (
        <>
        <Starter
         backgroundImage="./images/2.jpg"
         title="Welcome to Our Website"
         subtitle="We take great pride in ensuring the satisfaction of our customers, which is why we guarantee that the products we sell will bring happiness to each and every customer. Our genuine care for customer satisfaction is what sets us apart."
         middle={"NRI"}/>
         <div className="min-h-72"></div>
        <Que/>
        <Call/>
        </>
    );
};