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
  const [showFirstLayer, setShowFirstLayer] = useState(false)
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    if (onDocumentSelect) {
      onDocumentSelect(`${activeSection} / ${document.name}`)
    }
    if (isMobile) setShowFirstLayer(false)
    
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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

  const handleFileChange = async (e) => {
    setLoading(true)
    // ... existing file handling logic ...
    // After uploading files
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[80vh]  text-black ">
      <h1 className="text-2xl font-bold   flex justify-between items-center">
        {isMobile && (activeSection || activeDocument) && (
          <button onClick={handleBack} className="text-black/20">
            <ChevronLeft size={24} />
          </button>
        )}
        {isMobile && !showFirstLayer && (
          <button onClick={() => setShowFirstLayer(true)} className="text-black/20">
            <Menu size={24} />
          </button>
        )}
      </h1>

      <div className="flex flex-grow overflow-hidden  p-4 border-[2px] border-black/70 rounded-xl shadow-md">
        {/* First Layer */}
        <div
          className={`w-full md:w-1/3 lg:w-[20%] bg-[#fdfbfb] mr-2 border-r-[2px] border-r-black px-1 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isMobile && !showFirstLayer ? '-translate-x-full z-0' : 'translate-x-0 z-0'
          } 
          ${isMobile ? 'absolute h-full z-0' : 'z-0 '}
          `}
        >
          {Object.keys(Data).map((section) => (
            <div
              key={section}
             className=" border-b-[1px] border-b-black/70"
              onClick={() => handleSectionClick(section)}
            >
              <div  className={`flex items-center justify-between px-4 py-[18px]  cursor-pointer  ${
                activeSection === section ? "border-b-[5px] bg-[#e9e6e6]   text-black z-0 " : " hover:bg-gray-100 transition-all "
              }`}>
              {section}
              <img src="/images/greater-than.png" className="w-7 scale-125" alt="img" />
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-[2px] border-black/70 rounded-xl shadow-md flex w-full">
        {/* Second Layer */}
        {(!isMobile || (isMobile && !showFirstLayer)) && activeSection && Data[activeSection].hasSecondLayer && (
          <div className="w-full md:w-1/3 lg:w-[28%] bg-[#fdfbfb]   overflow-y-auto border-r-[2px] border-r-black/70">
            <div className="">
              {Data[activeSection].content.map((doc) => (
                <div
                  key={doc.name}
                  className="py-1 border-b-[1px] border-b-black/70"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className={`px-4 py-[14px] no-scrollbar  cursor-pointer flex  items-center gap-3 text-sm ${
                    activeDocument?.name === doc.name
                      ? " bg-[#e5e2e2]  shadow-gold  text-black z-0 "
                      : "hover:bg-gray-100 transition-all"
                  }`}>
                  <Folder className="w-4 h-4 mr-2"/> 
                  <p>
                  {doc.name}
                  </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Third Layer */}
        {(!isMobile || (isMobile && !showFirstLayer)) && activeDocument && (
          <div className="flex-grow px-3 overflow-y-auto lg:w-[60%]">
            <Table
              category={activeDocument?.category}
              tablename={activeDocument?.name}
              tableopen={true}
              loading={loading}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
