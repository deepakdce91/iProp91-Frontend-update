import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import AirbnbMapClone from "./pages/AirbnbMapClone";
import PropertyDetailPage from "./pages/PropertyDetailPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/search-properties/*" element={<AirbnbMapClone />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
