import Sidebar from "../Sidebar/Sidebar";
import OwnerClub from "../Ownerclub/ownerclub";
import RealInsight from "../RealInsight/realinsight";
import BuySell from "../BuySell/BuyPage.jsx";
import AddProperty from "../AddProperty/Addproperty.jsx";
import { Routes, Route } from "react-router-dom";
import Conci from '../Concierge/ConciPage.jsx';
import Safe from '../Safe/Safe.jsx';
import Real from '../RealInsight/real.jsx';
import UpdateUser from '../User/Update/UpdateUser.jsx';
import NRI from "../NRI/nri.jsx";
import Adivce from "../advice/advice.jsx";
import Lend from "../Lend/Lend.jsx";
import JourneyPage from "../getstartedForm/getStartedForm.jsx";
import MainListingPage from "../listingpage/page.jsx";
import PropertyDetail from "../listingpage/id/page.jsx";

export default function AllPage() {
    return (
        <>
            <div className="flex flex-col w-full lg:h-screen lg:!flex-row h-sv lg:overflow-y-scroll no-scrollbar">
                <Sidebar/>
                <div className="w-full">
                    <Routes>
                        <Route path="/*" element={<Conci />} />
                        <Route path="/safe/*" element={<Safe />} />
                        <Route path="/family" element={<OwnerClub />} />
                        <Route path="/realinsight" element={<Real />} />
                        <Route path="/buysell/*" element={<BuySell />} />
                        <Route path="/nri" element={<NRI/>} />
                        <Route path="/advice" element={<Adivce/>} />
                        <Route path="/lend" element={<Lend/>} />
                        <Route path="/journey" element={<JourneyPage/>} />
                        <Route path="/addproperty" element={<AddProperty />} />
                        <Route path="/profile" element={<UpdateUser />} />
                        
                        <Route path="/property-for-sale" element={<MainListingPage />} />
                        <Route path="/property-for-sale/:id" element={<PropertyDetail />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}
