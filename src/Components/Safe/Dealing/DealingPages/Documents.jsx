import React from "react";
import { Link } from "react-router-dom";
import { useRef,useState } from "react";
import { useLocation } from "react-router-dom";
import { Routes ,Route} from "react-router-dom";
import Table from "../Comps/Tables/Table";


const Data = {
  "Pre-RERA Approval": {
    title: "Pre-RERA Approval",
    data :{
      "Layout Plan": [
        {
          name: "Layout Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Layout Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Layout Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Layout Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Layout Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Demarcation cum  zoning plan": [
        {
          name: "Demarcation cum zoning plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demarcation cum zoning plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demarcation cum zoning plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demarcation cum zoning plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demarcation cum zoning plan",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Site Plan": [
        {
          name: "Site Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Site Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Site Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Site Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Site Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Building Plan": [
        {
          name: "Building Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Building Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Building Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Building Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Building Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Floor Plan": [
        {
          name: "Floor Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Floor Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Floor Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Floor Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Floor Plan",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
    }
  },
  "RERA Application": {
    title:"RERA Application",
    data:{
      "RERA Application": [
        {
          name: "RERA Application",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Application",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Application",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Application",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Application",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
    }
    },
  "RERA Approval": {
    title:"RERA Approval",
    data:{
      "RERA Approval": [
        {
          name: "RERA Approval",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Approval",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Approval",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Approval",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "RERA Approval",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
    }
  },
  "Post RERA Approval": {
    title: "Post RERA Approval",
    data:{
      "Project Brochure": [
        {
          name: "Project Brochure",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Project Brochure",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Project Brochure",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Project Brochure",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Project Brochure",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Advertisement or Marketting Material": [
        {
          name: "Advertisement or Marketting Material",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Advertisement or Marketting Material",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Advertisement or Marketting Material",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Advertisement or Marketting Material",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Advertisement or Marketting Material",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Allotment Letter": [
        {
          name: "Allotment Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Allotment Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Allotment Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Allotment Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Allotment Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Agreement for Sale": [
        {
          name: "Agreement for Sale",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Agreement for Sale",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Agreement for Sale",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Agreement for Sale",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Agreement for Sale",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Builder Buyer Agreement": [
        {
          name: "Builder Buyer Agreement",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Builder Buyer Agreement",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Builder Buyer Agreement",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Builder Buyer Agreement",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Demand Letter": [
        {
          name: "Demand Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demand Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demand Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Demand Letter",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Payment Reciept": [
        {
          name: "Payment Reciept",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Payment Reciept",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Payment Reciept",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Payment Reciept",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ],
      "Specifications, Amenities and Facilities": [
        {
          name: "Specifications, Amenities and Facilities",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Specifications, Amenities and Facilities",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Specifications, Amenities and Facilities",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Specifications, Amenities and Facilities",
          size: "2.5 MB",
          date: "12/12/2021",
        },
        {
          name: "Specifications, Amenities and Facilities",
          size: "2.5 MB",
          date: "12/12/2021",
        }
      ]
    }
  }
}

const NameHeader = () => {
  return (
    <>
      <div className="text-2xl px-10   my-2">Mahira Homes 63A</div>
    </>
  );
};

const Links = () => {
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
      to: "/safe/Dealing/Documents",
    },
    {
      title: "Occupation Certificate",
      to: "/safe/Dealing/Documents/occupation-certificate",
    },
    {
      title: "Sale Deed",
      to: "/safe/Dealing/Documents/sale-deed",
    },
    {
      title: "Maintenance Agreement",
      to: "/safe/Dealing/Documents/maintenance-agreement",
    },
    {
      title: "Electrical Appliances",
      to: "/safe/Dealing/Documents/electrical-appliances",
    },
    {
      title: "Electricity/Maintenance Bills",
      to: "/safe/Dealing/Documents/electricity-maintenance-bills",
    },
    {
      title: "Society Club",
      to: "/safe/Dealing/Documents/society-club",
    },
    {
      title: "RWA Rules & Regulations",
      to: "/safe/Dealing/Documents/rwa-rules-regulations",
    },
    {
      title: "Others",
      to: "/safe/Dealing/Documents/others",
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
            to={link.to}
            className={`text-gray-400 hover:text-black ${location.pathname === link.to ? 'text-primary ' : ''}`}
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

const DocumentCard = ({ title, subtitle, uploadDate, onClick }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 cursor-pointer max-lg:w-full" onClick={onClick}>
      <div className="flex flex-row justify-between gap-8">
        <div className="">
          <h2 className="text-xl font-[400] lg:text-nowrap">{title}</h2>
          <p className="text-sm">{subtitle}</p>
        </div>
        <div className="">
          <p className="text-xs">Uploaded: </p>
          <p className="text-xs">{uploadDate}</p>
        </div>
      </div>
      <button className="mt-4 w-full bg-gray-100 text-black font-[400] py-2 px-4 rounded-xl tex-sm">View Document</button>
    </div>
  );
};


const Sidebar = ({ setActiveSection, activeSection }) => {

  return (
    <aside className="min-w-72 h-fit p-0 lg:p-4 bg-gray-100 rounded-xl flex flex-row lg:flex-col overflow-x-scroll">
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

const Content = ({ activeSection, activeDocument, setActiveDocument }) => {
  const sectionData = Data[activeSection]?.data || [];

  return (
    <main className="p-4 w-full">
      {/* If a document is selected, show its table */}
      {activeDocument ? (
        <div className="w-full">
          <Table tableData={activeDocument.data} tablename={activeDocument.title} tableopen={true} />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {/* Otherwise, show the document cards */}
          {Object.entries(sectionData).map(([sectionTitle, sectionData]) => (
            <DocumentCard
              key={sectionTitle}
              title={sectionTitle}
              subtitle={"Mahira Home 68"}
              uploadDate={"23 March 2023"}
              onClick={() => setActiveDocument({ title: sectionTitle, data: sectionData })} // Set document data on click
            />
          ))}
        </div>
      )}
    </main>
  );
};

const PreReRa = () => {
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
        />
      </div>
    </div>
  );
};

const OccupationCertificate = ()=>{
  const tableData = [
    {
      id: 1,
      name: "Occupation Certificate",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Occupation Certificate",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Occupation Certificate",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Occupation Certificate",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Occupation Certificate",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ];
  return (
    <>
    <div className="w-full">
      <Table tablename="Occupation Certificate" tableData={tableData} tableopen={true} />
    </div>
    </>
  )
}

const SaleDeed = ()=>{
  const tableData = [
    {
      id: 1,
      name: "Sale Deed",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Sale Deed",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Sale Deed",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Sale Deed",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Sale Deed",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ];
  return (
    <>
    <div className="w-full">
      <Table tablename="Sale Deed" tableData={tableData} tableopen={true} />
    </div>
    </>
  )
}

const MaintenanceAgreement = ()=>{
  const Agreements = [
    {
      id: 1,
      name: "Maintenance Agreement",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Maintenance Agreement",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Maintenance Agreement",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Maintenance Agreement",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Maintenance Agreement",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ];

  const PaymentReciepts = [
    {
      id: 1,
      name: "Payment Reciept",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Payment Reciept",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Payment Reciept",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Payment Reciept",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Payment Reciept",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ];

  const Invoices = [
    {
      id: 1,
      name: "Invoice",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Invoice",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Invoice",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Invoice",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Invoice",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ];

  return (
    <>
    <div className="w-full">
    
        
          <Table tablename="Maintenance Agreement" tableData={Agreements}  />

          <Table tablename="Payment Reciepts" tableData={PaymentReciepts} />
    
          <Table tablename="Invoices" tableData={Invoices} />
      
    
    </div>
    </>
  )
}

const ElectricalAppliances = ()=>{
  const bills = [
    {
      id: 1,
      name: "Electrical Appliances",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Electrical Appliances",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Electrical Appliances",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Electrical Appliances",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Electrical Appliances",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]

  const warranty = [
    {
      id: 1,
      name: "Warranty",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Warranty",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Warranty",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Warranty",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Warranty",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]

  const AMCs = [
    {
      id: 1,
      name: "AMC",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "AMC",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "AMC",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "AMC",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "AMC",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  return (
    <>
    <div className="w-full">
        <Table tablename="Bills" tableData={bills} />
        <Table tablename="Warranty" tableData={warranty} />
        <Table tablename="AMCs" tableData={AMCs} />                   
    </div>
    </>
  )
}

const ElectricityMaintenanceBills = ()=>{
  const electricityBills = [
    {
      id: 1,
      name: "Electricity Bills",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Electricity Bills",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Electricity Bills",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Electricity Bills",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Electricity Bills",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  return (
    <>
    <div className="w-full">
      <Table tablename="Electricity Bills" tableData={electricityBills} tableopen={true} />
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
  const rules = [
    {
      id: 1,
      name: "RWA Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "RWA Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "RWA Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "RWA Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "RWA Rules",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  return (
    <>
    <div className="w-full">
      <Table tablename="RWA Rules" tableData={rules} tableopen={true} />
    </div>
    </>
  )
}

const Others = ()=>{
  const others = [
    {
      id: 1,
      name: "Others",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 2,
      name: "Others",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 3,
      name: "Others",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 4,
      name: "Others",
      size: "2.5 MB",
      date: "12/12/2021",
    },
    {
      id: 5,
      name: "Others",
      size: "2.5 MB",
      date: "12/12/2021",
    },
  ]
  return (
    <>
    <div className="w-full">
      <Table tablename="Others" tableData={others} tableopen={true} />
    </div>
    </>
  )
}

const DocumentSection = () => {
  return (
    <>
      <div className="flex w-full justify-between px-10 py-10">
        <Routes>
            <Route path="/" element={<PreReRa/>} />
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

export default function Documents() {
  return (
    <>
      <div className="w-full">
        <NameHeader />
        <Links />
        <DocumentSection />
      </div>
    </>
  );
}
