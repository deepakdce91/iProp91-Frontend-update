'use client'

import React, { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"
import Table from "../../../CompoCards/Tables/Table"

// Mock data structure
const Data = {
  "Pre-RERA Approval": {
    hasSecondLayer: true,
    content: [
      { name: "Layout Plan", category: "layoutPlan" },
      { name: "Demarcation cum zoning plan", category: "demarcationCumZoningPlan" },
      { name: "Site Plan", category: "sitePlan" },
      { name: "Building Plan", category: "buildingPlan" },
      { name: "Floor Plan", category: "floorPlan" },
      { name: "RERA Application", category: "reraApplication" },
      { name: "RERA Approval", category: "reraApproval" },
      { name: "Quarterly/Annual Bilings", category: "quarterlyBilings" },
      { name: "Occupation Certificate", category: "occupationCertificate" },
    ],
  },
  "Developer": {
    hasSecondLayer: true,
    content: [
      { name: "Project Brochure", category: "projectBrochure" },
      { name: "Adjustment/Marketing Material", category: "adjustMaterial" },
      { name: "Allotment Letter", category: "allotmentLetter" },
      { name: "Agreement for Sale", category: "agreementForSale" },
      { name: "Builder Buyer Agreement", category: "builderBuyerAgreement" },
      { name: "Demand Letter", category: "demandletter" },
      { name: "Payment Reciept", category: "paymentReciept" },
      { name: "Specification, Amentities and facilities", category: "specificationFacilities" },
      { name: "Sale Deed", category: "saleDeed" },
    ],
  },
  "Loan": {
    hasSecondLayer: true,
    content: [
      { name: "Loan Agreement", category: "loadAgreement" },
      { name: "Payment Plan", category: "paymentPlan" },
    ],
  },
  "Rental": {
    hasSecondLayer: true,
    content: [
      { name: "Rental Agreement", category: "rental agreement" },
      { name: "Amendment Agreement", category: "amendmentAgreement" },
      { name: "Tenant KYC Documents", category: "tenantKycDocuments" },
      { name: "Rent Reciepts", category: "rentReciepts" },
    ],
  },
  "Handbook": {
    hasSecondLayer: true,
    content: [
      { name: "Sale Terms", category: "saleTerms" },
      { name: "Loadn Terms", category: "loanTerms" },
      { name: "Rent Terms", category: "loadnTerms" },
    ],
  },
  "Maintenance": {
    hasSecondLayer: true,
    content: [
      { name: "Maintenance Agreement", category: "maintenanceAgreement" },
      { name: "Payment Receipts", category: "paymentReceipts" },
      { name: "Invoices", category: "invoices" },
      { name: "Electricity Bills", category: "electricityBills" },
    ],
  },
  "Appliances": {
    hasSecondLayer: true,
    content: [
      { name: "Bills", category: "bills" },
      { name: "Warranty cards", category: "warrantyCards" },
      { name: "AMC's", category: "amcs" },
    ],
  },
  Others: { hasSecondLayer: false, category: "other" },
}

export default function DocumentManager({ PropName = "Sample Property" }) {
  const [activeSection, setActiveSection] = useState(null)
  const [activeDocument, setActiveDocument] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showFirstLayer, setShowFirstLayer] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSectionClick = (section) => {
    setActiveSection(section)
    setActiveDocument(null)
    if (!Data[section].hasSecondLayer) {
      setActiveDocument({ name: section, category: Data[section].category })
    }
    if (isMobile) setShowFirstLayer(false)
  }

  const handleDocumentClick = (document) => {
    setActiveDocument(document)
    if (isMobile) setShowFirstLayer(false)
  }

  const handleBack = () => {
    if (activeDocument) {
      setActiveDocument(null)
    } else if (activeSection) {
      setActiveSection(null)
    }
    if (isMobile && !activeDocument && !activeSection) {
      setShowFirstLayer(true)
    }
  }

  return (
    <div className="flex flex-col h-screen text-white">
      <h1 className="text-2xl font-bold p-4   flex justify-between items-center">
        {PropName}
        {isMobile && (activeSection || activeDocument) && (
          <button onClick={handleBack} className="text-white/20">
            <ChevronLeft size={24} />
          </button>
        )}
        {isMobile && !showFirstLayer && (
          <button onClick={() => setShowFirstLayer(true)} className="text-white/20">
            <Menu size={24} />
          </button>
        )}
      </h1>

      <div className="flex flex-grow overflow-hidden">
        {/* First Layer */}
        <div
          className={`w-full md:w-1/3 lg:w-1/4 bg-white/20 border-r-[1px] border-r-black p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMobile && !showFirstLayer ? '-translate-x-full z-0' : 'translate-x-0 z-0'
          } 
          ${isMobile ? 'absolute h-full z-0' : 'z-0 '}
          `}
        >
          <h2 className="font-bold mb-4">Documents</h2>
          {Object.keys(Data).map((section) => (
            <div
              key={section}
              className={`flex items-center py-2 px-4 mb-2 cursor-pointer rounded-xl ${
                activeSection === section ? "bg-black text-white border-[1px] border-gold z-0 " : " hover:border-[2px] hover:border-gold z-0 transition-all"
              }`}
              onClick={() => handleSectionClick(section)}
            >
              {section}
              <ChevronRight className="ml-auto" size={16} />
            </div>
          ))}
        </div>

        {/* Second Layer */}
        {(!isMobile || (isMobile && !showFirstLayer)) && activeSection && Data[activeSection].hasSecondLayer && (
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white/20 border-r-[1px] border-r-black p-4 overflow-y-auto">
            <div className="mt-10">
              {Data[activeSection].content.map((doc) => (
                <div
                  key={doc.name}
                  className={`py-2 px-4 mb-2  cursor-pointer rounded-xl ${
                    activeDocument?.name === doc.name
                      ? "bg-black text-white border-[1px] border-gold "
                      : "hover:border-[2px] hover:border-gold  transition-all"
                  }`}
                  onClick={() => handleDocumentClick(doc)}
                >
                  {doc.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Third Layer */}
        {(!isMobile || (isMobile && !showFirstLayer)) && activeDocument && (
          <div className="flex-grow p-4 overflow-y-auto border-t-[1px] border-t-white/20">
            <Table
              category={activeDocument.category}
              tablename={activeDocument.name}
              tableopen={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}