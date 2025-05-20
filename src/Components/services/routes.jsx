import React from "react";
import { Routes, Route } from "react-router-dom";
import ServicesOwnerClub from "./ownersClub";
import ServicesSafe from "./safe";
import ServicesListing from "./listing";
import ServicesConcierge from "./Concierge";

const ServicesRoutes = () => {
  return (
    <Routes>
      <Route path="owner-club" element={<ServicesOwnerClub />} />
      <Route path="safe" element={<ServicesSafe />} />
      <Route path="listing" element={<ServicesListing />} />
      <Route path="concierge" element={<ServicesConcierge />} />
      <Route index element={<div>Services Home</div>} />
    </Routes>
  );
};

export default ServicesRoutes;
