'use client'

import { useEffect, useState } from 'react'
import { MoreVertical, Download, ArrowRight, Link } from 'lucide-react'
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../Landing/Breadcrumb';

// Dummy property data
const propertiesData = [
  {
    id: '1',
    price: '₹2.95 Cr',
    emi: '₹1.33L',
    title: '2 BHK Builder Floor For Sale in Purva Atmosphere, Hegde Nagar, City',
    imgs: ['/images/image.jpg', '/images/image.jpg', '/images/image.jpg', '/images/image.jpg', '/images/image.jpg'],
    beds: 2,
    baths: 2,
    balcony: 1,
    furnishing: 'Unfurnished',
    amenities: ['Club House', 'Park', 'Garden View'],
    hotspots: ['Thanisandra & Hennur', 'Whitefield', 'Devanhalli', 'Sarjapur & HSR', 'JP Nagar', 'Electronic City', 'Kanakpura & Bannerghat'],
    similarProperties: [
      { images: 55, type: '3 BHK Flat', price: '3.15 Cr', size: '1680 sqft', project: 'Purva Atmosphere', possession: 'Mar \'25' },
      { images: 21, type: '3 BHK Flat', price: '2.44 Cr', size: '2188 sqft', project: 'Nikoo Homes V Phase 1', possession: 'Aug \'29' },
      { images: 55, type: '3 BHK Flat', price: '3.40 Cr', size: '2005 sqft', project: 'Purva Atmosphere', possession: 'Mar \'25' }
    ],
    about: {
      project: 'Purva Atmosphere',
      description: 'by Puravankara Ltd.',
      priceOnwards: '₹1.42 Cr Onwards',
      configuration: '2, 3, 4 BHK Flats',
      towers: '3 Towers, 939 Units'
    },
    recentTransactions: [
      { project: 'Purva Atmosphere', date: '3 Oct\'22', area: '1855 sqft' },
      { project: 'Purva Atmosphere', date: '3 Dec\'22', area: '-' },
      { project: 'Purva Atmosphere', date: '3 Dec\'22', area: '-' }
    ],
    moreDetails: {
      priceBreakup: '₹2.95 Cr',
      bookingAmount: '₹10.0 Lac',
      address: 'Survey No 861, 864, 951, 952, 953, Thanisandra, Near, Manyata Tech Park Rd, Bengaluru, Karnataka 560077, Hegde Nagar, Bangalore - North, Karnataka',
      flooring: 'Marble',
      ownership: 'Freehold',
      size: '1200 sqft',
      pricePerSqft: '₹2,458',
      developer: 'Puravankara Ltd.',
      floors: '3rd Floor',
      transactionType: 'Sale',
      status: 'Available',
      facing: 'North',
      ageOfConstruction: '2 Years'
    },
    contact: {
      owner: 'Beegru',
      phone: '+91-74XXXXXXXX'
    }
  },
  {
    id: '2',
    price: '₹1.20 Cr',
    emi: '₹55K',
    title: '3 BHK Apartment in Whitefield',
    images: ['/images/image.jpg', '/images/image.jpg', '/images/image.jpg', '/images/image.jpg', '/images/image.jpg'],
    beds: 3,
    baths: 2,
    balcony: 1,
    furnishing: 'Semi-Furnished',
    amenities: ['Gym', 'Swimming Pool', 'Club House'],
    hotspots: ['Whitefield', 'ITPL', 'Brookefield'],
    similarProperties: [],
    about: {
      project: 'Whitefield Heights',
      description: 'by XYZ Developers',
      priceOnwards: '₹1.20 Cr Onwards',
      configuration: '3 BHK Flats',
      towers: '2 Towers, 200 Units'
    },
    recentTransactions: [],
    moreDetails: {
      priceBreakup: '₹1.20 Cr',
      bookingAmount: '₹5.0 Lac',
      address: 'Whitefield, Bangalore',
      flooring: 'Vitrified Tiles',
      ownership: 'Freehold',
      size: '1500 sqft',
      pricePerSqft: '₹8,000',
      developer: 'XYZ Developers',
      floors: '1st Floor',
      transactionType: 'Sale',
      status: 'Available',
      facing: 'East',
      ageOfConstruction: '1 Year'
    },
    contact: {
      owner: 'John Doe',
      phone: '+91-74XXXXXXXX'
    }
  },
  // Add more properties as needed...
];

function PropertyDetail() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const { id } = useParams(); // Get the property ID from URL params
  const property = propertiesData.find(prop => prop.id === id); // Fetch property data based on ID

  if (!property) return <div>Loading...</div>; // Handle loading state

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6 w-full">
          <div className="col-span-2 space-y-6 w-full">
            <PropertyHeader property={property} />
            <Amenities amenities={property.amenities} />
            <Hotspots locations={property.hotspots} />
            <SimilarProperties properties={property.similarProperties} />
            <AboutProject about={property.about} />
            <RecentTransactions transactions={property.recentTransactions} />
            <MoreDetails details={property.moreDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}

const currentUrl = window.location.href;
const parts = currentUrl.split('/'); // Split the URL into an array
const secondLastPart = parts[parts.length - 2]; // Access the second-to-last element
const baseUrl = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
const breadcrumbItems = [
  { label: "Concierge", link: "/concierge" },
  { label: secondLastPart, link: "/property-for-sale" },
  { label: baseUrl },
];

// Header Component with Gallery
function PropertyHeader({ property }) {
  return (
    <div className="space-y-4 w-full">
      <Breadcrumb items={breadcrumbItems} className={"flex text-sm items-center space-x-1 text-black"} />
      <div className='p-6 bg-white rounded-lg shadow-sm'>
        {/* Title Section */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">{property.price}</h1>
              <span className="text-gray-600">EMI - {property.emi}</span>
              <a href="#" className="text-gray-600 underline">Need Home Loan? Check Eligibility</a>
            </div>
          </div>
          <button className="p-2">
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h2 className="text-lg">{property.title}</h2>

        {/* img Gallery */}
        <div className="grid grid-cols-4 gap-2">
          {property.imgs && property.imgs.length > 0 ? (
            property.imgs.map((img, index) => (
              <div key={index} className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img 
                  src={img} 
                  alt={`Property img ${index + 1}`}
                  className={`object-cover ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-tr-lg' : ''} ${index === 4 ? 'rounded-br-lg' : ''}`}
                />
              </div>
            ))
          ) : (
            <div>No images available</div>
          )}
        </div>

        {/* Property Quick Info */}
        <div className="flex items-center justify-center gap-14 py-4 border-t border-b">
          <div className="flex items-center gap-2">
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.balcony} Balcony</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.furnishing}</span>
          </div>
        </div>

        <ListedCards 
          size={property.moreDetails.size}
          pricePerSqft={property.moreDetails.pricePerSqft}
          developer={property.moreDetails.developer}
          project={property.about.project}
          floors={property.moreDetails.floors}
          transactionType={property.moreDetails.transactionType}
          status={property.moreDetails.status}
          facing={property.moreDetails.facing}
          ageOfConstruction={property.moreDetails.ageOfConstruction}
        />
      </div>
    </div>
  );
}

// Amenities Section
function Amenities({ amenities }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm ">
      <h2 className="text-2xl font-semibold mb-8">Amenities</h2>
      <div className="grid grid-cols-3 gap-8 ">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center ">
            <div className="w-20">
              <img 
                src="/images/propcat.jpg" 
                alt={amenity}
                width={60}
                height={60}
              />
            </div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
      <button className="flex items-center gap-2 mt-6 text-gray-600">
        <Download className="w-4 h-4" />
        <span>Download Brochure</span>
      </button>
    </div>
  )
}

// Hotspots Section
function Hotspots({ locations }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Hotspots in City</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {locations.map((location, index) => (
          <div className='flex flex-col gap-3'>
          <div className="w-52 h-36 relative flex-shrink-0">
          <img
            src="/images/image.jpg"
            alt={"/images/propcat.jpg"}
            fill
            className="object-cover rounded"
          />
        </div>
          <button
            key={index}
            className={`px-4 py-2 whitespace-nowrap ${
              index === 0 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-600 hover:text-gray-900'
            }`}
            >
            {location}
          </button>
            </div>
        ))}
      </div>
    </div>
  )
}

// Similar Properties Section
function SimilarProperties({ properties }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Other Properties in this Project and Nearby</h2>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative aspect-[4/3] mb-4">
              <img
                src="/images/prophero.jpg"
                alt={property.project}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {property.imgs} Photos
              </div>
            </div>
            <h3 className="font-medium">{property.type}</h3>
            <div className="flex gap-2 text-lg font-semibold">
              <span>{property.price}</span>
              <span className="text-gray-600">|</span>
              <span>{property.size}</span>
            </div>
            <p className="text-gray-600">{property.project}</p>
            <p className="text-gray-600">{property.possession}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Project Section
function AboutProject({ about }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold">About Project</h2>
        <a href="#" className="text-red-600 flex items-center gap-1">
          Explore Project
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="flex gap-6 items-start">
        <div className="w-52 h-36 relative flex-shrink-0">
          <img
            src="/images/image.jpg"
            alt={about.project}
            fill
            className="object-cover rounded"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-xl font-semibold">{about.project}</h3>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold">5</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">16 Reviews</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{about.description}</p>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-medium">{about.priceOnwards}</p>
            </div>
            <div>
              <p className="text-gray-600">Configuration</p>
              <p className="font-medium">{about.configuration}</p>
            </div>
            <div>
              <p className="text-gray-600">Tower & Unit</p>
              <p className="font-medium">{about.towers}</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Download Brochure
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Follow Project
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Compare Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Recent Transactions Section
function RecentTransactions({ transactions }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm w-full">
      <h2 className="text-2xl font-semibold mb-6">Most Recent Property Transactions in City</h2>
      <div className="grid w-full grid-cols-3 gap-6">
        {transactions.map((transaction, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">{transaction.project}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">
                  Registered on: <span className="font-medium">{transaction.date}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm">
                  Area: <span className="font-medium">{transaction.area}</span>
                </span>
              </div>
              <button className="text-red-600 text-sm">
                View Agreement Price
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}

// More Details Section
function MoreDetails({ details }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">More Details</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-gray-600">Price Breakup</p>
            <p className="font-medium">{details.priceBreakup}</p>
          </div>
          <div>
            <p className="text-gray-600">Booking Amount</p>
            <p className="font-medium">{details.bookingAmount}</p>
          </div>
          <div>
            <p className="text-gray-600">Address</p>
            <p className="font-medium">{details.address}</p>
          </div>
          <div>
            <p className="text-gray-600">Furnishing</p>
            <p className="font-medium">{details.furnishing}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-yellow-400 rounded text-sm font-medium">Offer</span>
              <span className="text-red-600 text-sm">Save upto 40% on your Dream Home Interiors from Top Brands</span>
              <ArrowRight className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div>
            <p className="text-gray-600">Flooring</p>
            <p className="font-medium">{details.flooring}</p>
          </div>
          <div>
            <p className="text-gray-600">Type of Ownership</p>
            <p className="font-medium">{details.ownership}</p>
          </div>
        </div>
      </div>
    </div>
  )
}



// ListedCards Component
function ListedCards({ size, pricePerSqft, developer, project, floors, transactionType, status, facing, ageOfConstruction }) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-4 py-4">
      <div>
        <p className="text-sm text-gray-500">Super Built-Up Area</p>
        <p className="font-medium">
          {size}{" "}
          <span className="text-gray-500 text-sm">
            ₹{pricePerSqft}/sqft
          </span>
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Developer</p>
        <p className="font-medium">{developer}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Project</p>
        <p className="font-medium">{project}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Floor</p>
        <p className="font-medium">{floors}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Transaction Type</p>
        <p className="font-medium">{transactionType}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Status</p>
        <p className="font-medium">{status}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Facing</p>
        <p className="font-medium">{facing}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Age Of Construction</p>
        <p className="font-medium">{ageOfConstruction}</p>
      </div>
    </div>
  );
}

export default PropertyDetail;
