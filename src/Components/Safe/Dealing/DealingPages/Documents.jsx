'use client'

import React, { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Menu, DockIcon, File, FileBadge, FileIcon, Folder } from "lucide-react"
import Table from "../../../CompoCards/Tables/Table"
import { GrDocument } from "react-icons/gr"

// Mock data structure
const Data = {
  "RERA": {
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

export default function DocumentManager({ PropName = "Sample Property", onDocumentSelect }) {
  const [activeSection, setActiveSection] = useState(Object.keys(Data)[0])
  const [activeDocument, setActiveDocument] = useState(Data[Object.keys(Data)[0]].content[0])
  const [isMobile, setIsMobile] = useState(false)
  const [currentLayer, setCurrentLayer] = useState(1)
  const [loading, setLoading] = useState(false)
  const [previousLayer, setPreviousLayer] = useState(1)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSectionClick = (section) => {
    setActiveSection(section)
    setPreviousLayer(currentLayer)
    
    if (Data[section].hasSecondLayer) {
      // Automatically select the first item in the second layer
      setActiveDocument(Data[section].content[0])
      if (isMobile) {
        setCurrentLayer(2)
      }
    } else {
      // Direct jump to third layer for sections without second layer
      setActiveDocument({ name: section, category: Data[section].category })
      setCurrentLayer(3)
    }
  }

  const handleDocumentClick = (document) => {
    setActiveDocument(document)
    setPreviousLayer(currentLayer)
    if (isMobile) {
      setCurrentLayer(3)
    }
    if (onDocumentSelect) {
      onDocumentSelect(`${activeSection} / ${document.name}`)
    }
  }

  const handleBack = () => {
    if (currentLayer === 3) {
      if (!Data[activeSection].hasSecondLayer) {
        // If coming from a section without second layer, go back to first layer
        setCurrentLayer(1)
        setActiveDocument(null)
      } else {
        // Normal case - go back to second layer
        setCurrentLayer(2)
        setActiveDocument(Data[activeSection].content[0])
      }
    } else if (currentLayer === 2) {
      setCurrentLayer(1)
      setActiveSection(null)
      setActiveDocument(null)
    }
  }

  return (
    <div className="flex flex-col md:h-[85vh] h-screen text-black">
      {isMobile && currentLayer > 1 && (
        <div className="flex items-center p-4 border-b border-gray-200">
          <button onClick={handleBack} className="flex items-center text-gray-600">
            <ChevronLeft className="w-6 h-6 mr-2" />
            {currentLayer === 2 ? 'Back to Categories' : 'Back to Documents'}
          </button>
        </div>
      )}

      <div className="flex flex-grow overflow-hidden p-4 lg:rounded-xl shadow-md">
        {/* First Layer */}
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isMobile
              ? currentLayer === 1
                ? 'block'
                : 'hidden'
              : 'w-full lg:w-[20%]'
          }`}
        >
          <div className="bg-[#fdfbfb] h-full overflow-y-auto">
            {Object.keys(Data).map((section) => (
              <div
                key={section}
                className="border-b-[1px] border-b-black/70 border-r-[2px] border-r-black/70"
                onClick={() => handleSectionClick(section)}
              >
                <div className={`flex items-center justify-between px-4 py-[18px] cursor-pointer ${
                  activeSection === section ? "border-b-[5px] bg-[#e9e6e6] text-black" : "hover:bg-gray-100"
                }`}>
                  {section}
                  <img src="/images/greater-than.png" className="w-7 scale-125" alt="img" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second Layer */}
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isMobile
              ? currentLayer === 2
                ? 'block'
                : 'hidden'
              : activeSection && Data[activeSection].hasSecondLayer
              ? 'w-3/3 lg:w-[28%]'
              : 'hidden'
          }`}
        >
          {activeSection && Data[activeSection].hasSecondLayer && (
            <div className="bg-[#fdfbfb] h-full overflow-y-auto">
              {Data[activeSection].content.map((doc) => (
                <div
                  key={doc.name}
                  className="py-1 border-b-[1px] border-b-black/70 border-r-[2px] border-r-black/70"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className={`px-4 py-[14px] cursor-pointer flex items-center gap-3 text-sm ${
                    activeDocument?.name === doc.name
                      ? "bg-[#e5e2e2] text-black"
                      : "hover:bg-gray-100"
                  }`}>
                    <Folder className="w-4 h-4 mr-2" />
                    <p>{doc.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Third Layer */}
        <div
          className={`w-full transition-all duration-300 ease-in-out ${
            isMobile
              ? currentLayer === 3
                ? 'block'
                : 'hidden'
              : activeDocument
              ? 'flex-grow lg:w-[60%]'
              : 'hidden'
          }`}
        >
          {activeDocument && (
            <div className="px-3 h-full ">
              <Table
                category={activeDocument?.category}
                tablename={activeDocument?.name}
                tableopen={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}