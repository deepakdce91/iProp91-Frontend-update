import Que from '../NRI/questoin/question'
import Call from '../NRI/corousal/corsoual'
import Starter from '../CompoCards/Starter/Starter'
export default function NRI(){
    return (
        <>
        <Starter
         backgroundImage="./images/2.jpg"
         middle={"Get Advice from our trusted brands"}/>
         <div className="min-h-72"></div>
        <Que/>
        <Call/>
        </>
    );
};