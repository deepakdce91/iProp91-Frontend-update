import React from "react";
import { Link } from "react-router-dom";
import { useRef,useState } from "react";
import { useLocation } from "react-router-dom";
import { Routes ,Route} from "react-router-dom";
import Table from "../../../CompoCards/Tables/Table"

const Data = {
  "Pre-RERA Approval": {
    title: "Pre-RERA Approval",
    data :[
        {
          name: "Layout Plan",
          category: "layoutPlan",
        },
        {
          name: "Demarcation cum zoning plan",
          category: "demarcationCumZoningPlan",
        },
        {
          name: "Site Plan",
          category: "sitePlan",
        },
        {
          name: "Building Plan",
          category: "buildingPlan",
        },
        {
          name: "Floor Plan",
          category: "floorPlan",
        },  
    ]
  },
  "RERA Application": {
    title:"RERA Application",
    data:[
        {
          name: "RERA Application",
          category: "reraApplication",
        }     
      ]
    },
  "RERA Approval": {
    title:"RERA Approval",
    data:[
        {
          name: "RERA Approval",
          category: "reraApproval",
        }
    ]
  },
  "Post RERA Approval": {
    title: "Post RERA Approval",
    data:[
        {
          name: "Project Brochure",
          category: "projectBrochure",
        },
        {
          name: "Advertisement or Marketting Material",
          category: "advertisementMaterialByBulder",
        },
        {
          name: "Allotment Letter",
          category: "allotmentLetter",
        },
        { 
          name: "Agreement for Sale",
          category: "agreementToSale",

        },
        {
          name: "Builder Buyer Agreement",
          category: "builderBuyerAgreement",
        },
        {
          name: "Demand Letter",
          category: "demandLetter",
        },
        {
          name: "Payment Reciept",
          category: "paymentPlan",
        },
        {
          name: "Specifications, Amenities and Facilities",
          category: "specificationsAmenitiesAndFacilities",
        }
    ]
 
  }
}

const NameHeader = ({Header}) => {
  return (
    <>
      <div className="text-2xl px-10   my-2">{Header}</div>
    </>
  );
};

const Links = ({PropId}) => {
  // Reference to the navigation container
  const navRef = useRef(null);
  const location = useLocation();

  // Scroll left by a certain amount
  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: -150, // Adjust this value to control scroll distance
        behavior: "smooth",
      });
    }
  };

  // Scroll right by a certain amount
  const scrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: 150, // Adjust this value to control scroll distance
        behavior: "smooth",
      });
    }
  };

  const links = [
    {
      title: "Pre-RERA Approval",
      to: "/",
    },
    {
      title: "Occupation Certificate",
      to: "/occupation-certificate",
    },
    {
      title: "Sale Deed",
      to: "/sale-deed",
    },
    {
      title: "Maintenance Agreement",
      to: "/maintenance-agreement",
    },
    {
      title: "Electrical Appliances",
      to: "/electrical-appliances",
    },
    {
      title: "Electricity/Maintenance Bills",
      to: "/electricity-maintenance-bills",
    },
    {
      title: "Society Club",
      to: "/society-club",
    },
    {
      title: "RWA Rules & Regulations",
      to: "/rwa-rules-regulations",
    },
    {
      title: "Others",
      to: "/others",
    },
  ];

  return (
    <div className=" flex w-full items-center py-2 bg-gray-100 overflow-x-scroll justify-start px-10  no-scrollbar">
      {/* Left Arrow */}
      <button onClick={scrollLeft} className="text-gray-400 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Navigation Links */}
      <div
        ref={navRef}
        className="flex flex-row gap-4 whitespace-nowrap w-[700px] xl:w-[900px] 2xl:w-[1000px] 3xl:[1400px] overflow-x-scroll no-scrollbar" 
      >
        {links.map((link, index) => (
          <Link
            key={index}
            to={`/safe/Dealing/${PropId}/Documents`+link.to}
            className={`text-gray-400 hover:text-black ${location.pathname === `/safe/Dealing/${PropId}/Documents`+link.to ? 'text-primary ' : ''}`}
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button onClick={scrollRight} className="text-gray-400 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
   
  );
};

const DocumentCard = ({PropName, title, uploadDate, onClick }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 cursor-pointer max-lg:w-full" onClick={onClick}>
      <div className="flex flex-row justify-between gap-8">
        <div className="">
          <h2 className="text-xl font-[400] lg:text-nowrap">{title}</h2>
          <p className="text-sm">{PropName}</p>
        </div>
        <div className="">
          <p className="text-xs">Uploaded: </p>
          <p className="text-xs">{ new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <button className="mt-4 w-full bg-gray-100 text-black font-[400] py-2 px-4 rounded-xl tex-sm">View Document</button>
    </div>
  );
};


const Sidebar = ({ setActiveSection, activeSection }) => {
  return (
    <aside className="min-w-56 h-fit p-0 lg:p-4 bg-gray-100 rounded-xl flex flex-row lg:flex-col overflow-x-scroll lg:no-scrollbar">
      {/* render first level of data */}
      {Object.keys(Data).map((section) => (
        <button
          key={section}
          className={`block text-left text-lg font-[400] text-black hover:text-yellow-700 text-nowrap px-2  my-4 ${
            activeSection === Data[section].title ? 'text-primary' : ''
          }`}
          onClick={() => setActiveSection(Data[section].title)}
        >
          {Data[section].title}
        </button>
      ))}

    </aside>
  );
};

const Content = ({ PropName, activeSection, activeDocument, setActiveDocument }) => {
  const sectionData = Data[activeSection]?.data || [];
  return (
    <main className="p-4 w-full">
      {/* If a document is selected, show its table */}
      {activeDocument ? (
        <div className="w-full">
          <Table category={activeDocument.data} tablename={activeDocument.title} tableopen={true} />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {/* Otherwise, show the document cards */}
          {sectionData.map((document, index) => (
            <DocumentCard
              key={index}
              title={document.name}
              PropName={PropName}
              uploadDate={document.date}
              onClick={() => setActiveDocument({ title: document.name, data: document.category })}
            />
          ))}
        </div>
      )}
    </main>
  );
};

const PreReRa = ({PropName}) => {
  const [activeSection, setActiveSection] = useState("Pre-RERA Approval");
  const [activeDocument, setActiveDocument] = useState(null); // Track selected document

  // When a new section is clicked, reset the active document to null
  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActiveDocument(null); // Reset the active document
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <Sidebar setActiveSection={handleSectionClick} activeSection={activeSection} />
        <Content
          activeSection={activeSection}
          activeDocument={activeDocument}
          setActiveDocument={setActiveDocument}
          PropName={PropName}
        />
      </div>
    </div>
  );
};

const OccupationCertificate = ()=>{
  return (
    <>
    <div className="w-full">
      <Table tablename="Occupation Certificate" category={"occupationCertificate"} tableopen={true} />
    </div>
    </>
  )
}

const SaleDeed = ()=>{
  return (
    <>
    <div className="w-full">
      <Table tablename="Sale Deed" category={"saleDeed"} tableopen={true} />
    </div>
    </>
  )
}

const MaintenanceAgreement = ()=>{
  return (
    <>
    <div className="w-full">
          <Table tablename="Maintenance Agreement" category={"maintenenceAgreement"}  />
          <Table tablename="Payment Reciepts" category={"maintenencePaymentReceipts"} />
          <Table tablename="Invoices" category={"maintenenceInvoice"} />
    </div>
    </>
  )
}

const ElectricalAppliances = ()=>{
  return (
    <>
    <div className="w-full">
        <Table tablename="Bills" category={"bill"} />
        <Table tablename="Warranty" category={"warrantyDocuments"} />
        <Table tablename="AMCs" category={"amcs"} />                   
    </div>
    </>
  )
}

const ElectricityMaintenanceBills = ()=>{
  return (
    <>
    <div className="w-full">
      <Table tablename="Electricity Bills" category={"electricityOrMaintenenceBills"} tableopen={true} />
    </div>
    </>
  )
}

const SocietyClub = ()=>{
  const clubrules = [
    {
      id: 1,
      name: "Club Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Club Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Club Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Club Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Club Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  const reciepts= [
    {
      id: 1,
      name: "Recipts",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Recipts",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Recipts",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Recipts",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Recipts",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  return (
    <>
    <div className="w-full">
      <Table tablename="Club Rules" tableData={clubrules} />
      <Table tablename="Reciepts" tableData={reciepts} />
    </div>
    </>
  )
}

const RwaRulesRegulations = ()=>{
  return (
    <>
    <div className="w-full">
      <Table tablename="RWA Rules" category={"rwaRulesAndRegulations"} tableopen={true} />
    </div>
    </>
  )
}

const Others = ()=>{
  return (
    <>
    <div className="w-full">
      <Table tablename="Others" category={"other"} tableopen={true} />
    </div>
    </>
  )
}

const DocumentSection = ({PropName}) => {
  return (
    <>
      <div className="flex w-full justify-between px-10 py-10">
        <Routes>
            <Route path="/" element={<PreReRa PropName={PropName} />} />
            <Route path="/occupation-certificate" element={<OccupationCertificate/>} />
            <Route path="/sale-deed" element={<SaleDeed/>} />
            <Route path="/maintenance-agreement" element={<MaintenanceAgreement/>} />
            <Route path="/electrical-appliances" element={<ElectricalAppliances/>} />
            <Route path="/electricity-maintenance-bills" element={<ElectricityMaintenanceBills/>} />
            <Route path="/society-club" element={<SocietyClub/>} />
            <Route path="/rwa-rules-regulations" element={<RwaRulesRegulations/>} />
            <Route path="/others" element={<Others/>} />
        </Routes>
      </div>
    </>
  );
};

export default function Documents({PropId,PropName}) {
  return (
    <>
      <div className="w-full">
        <NameHeader Header={PropName} />
        <Links PropId={PropId} />
        <DocumentSection PropName={PropName} />
      </div>
    </>
  );
}
