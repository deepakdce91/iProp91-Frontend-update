import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyDetail from "../Components/property-detail/PropertyDetail";

function PropertyDetailPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="property-detail-page">
      <PropertyDetail onBack={handleBack} />
    </div>
  );
}

export default PropertyDetailPage; 