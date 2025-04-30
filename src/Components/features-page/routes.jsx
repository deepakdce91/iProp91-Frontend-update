import React from "react";
import { Route } from "react-router-dom";
import FeatureOwnerClub from "./ownersClub";
import FeaturesSafe from "./safe";
import FeaturesListing from "./listing";
import FeatureConcierge from "./Concierge";

const FeaturesRoutes = () => {
  return (
    <>
      <Route path='"/owner-club' element={<FeatureOwnerClub />} />
      <Route path="/safe" element={<FeaturesSafe />} />
      <Route path="/listing" element={<FeaturesListing />} />
      <Route path="/concierge" element={<FeatureConcierge />} />
    </>
  );
};

export default FeaturesRoutes;
