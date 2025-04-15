import Sidebar from "../Sidebar/Sidebar";
import OwnerClub from "../Ownerclub/ownerclub";
import RealInsight from "../RealInsight/realinsight";
import BuySell from "../BuySell/BuyPage.jsx";
import AddProperty from "../AddProperty/Addproperty.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Conci from "../Concierge/ConciPage.jsx";
import Safe from "../Safe/Safe.jsx";
import Real from "../RealInsight/real.jsx";
import UpdateUser from "../User/Update/UpdateUser.jsx";
import NRI from "../NRI/nri.jsx";
import Adivce from "../advice/advice.jsx";
import Lend from "../Lend/Lend.jsx";
import JourneyPage from "../getstartedForm/getStartedForm.jsx";
import MainListingPage from "../listingpage/page.jsx";
import PropertyDetail from "../listingpage/id/page.jsx";
import Footer from "../Landing/Footer.jsx";
import SiteFaqs from "../site-faqs/page.jsx";
import CategoryPage from "../listingpage/CategoryPage.jsx";
import PropertyJouneyPage from "../PropertyJourneyPage/page.js";
import RewardsRedeem from "../redeemRewards/Index.jsx";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import FeaturesSafe from "../features-page/safe.jsx";
import FeaturesListing from "../features-page/listing.jsx";
import FeatureOwnerClub from "../features-page/ownersClub.jsx";
import FeatureConcierge from "../features-page/Concierge.jsx";

export default function AllPage() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define the paths where you do NOT want to render the Footer
  const noFooterPaths = [
    "/family",
    "/concierge",
    "/safe",
    "/safe/*",
    "/property-for-sale",
  ]; // Add paths as needed

  // Check if the current path is in the noFooterPaths array
  const shouldRenderFooter = !noFooterPaths.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [location.pathname]);
  return (
    <>
      <div className="flex flex-col w-screen bg-black h-screen lg:!flex-row  overflow-y-scroll no-scrollbar">
        <Sidebar />
        <div className="w-full  lg:p-1 ">
          <Routes>
            <Route path="/*" element={<Conci />} />
            <Route path="/safe/*" element={<Safe />} />
            <Route path="/family" element={<OwnerClub />} />
            <Route path="/realinsight" element={<Real />} />
            <Route path="/buysell/*" element={<BuySell />} />
            <Route path="/nri" element={<NRI />} />
            <Route path="/advice" element={<Adivce />} />
            <Route path="/lend" element={<Lend />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/addproperty" element={<AddProperty />} />
            <Route path="/profile" element={<UpdateUser />} />
            <Route path="/site-faqs" element={<SiteFaqs />} />
            <Route path="/property-journey" element={<PropertyJouneyPage />} />

            <Route path="/property-for-sale" element={<MainListingPage />} />
            <Route path="/property-for-sale/:id" element={<PropertyDetail />} />
            <Route path="/category/:categoryType" element={<CategoryPage />} />

            <Route path="/rewards" element={<RewardsRedeem />} />

            <Route path="/services/safe" element={<FeaturesSafe />} />
            <Route path="/services/listing" element={<FeaturesListing />} />
            <Route
              path="/services/owner's-club"
              element={<FeatureOwnerClub />}
            />
            <Route path="/services/concierge" element={<FeatureConcierge />} />
          </Routes>
          {shouldRenderFooter && isLoggedIn === false && <Footer />}
        </div>
      </div>
    </>
  );
}
