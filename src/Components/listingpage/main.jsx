import React, { useState } from 'react'
import { Search, MapPin, Mic } from 'lucide-react'


const MainListingPage = () => {
    const [activeTab, setActiveTab] = useState('Buy')

  
  const categories = [
    {
      title: "Residential Land",
      count: "5,800+ Properties",
      image: "/images/propcat.jpg"
    },
    {
      title: "Independent House/Villa",
      count: "1,800+ Properties",
      image: "/images/propcat.jpg"
    },
    {
      title: "Farm House",
      count: "360+ Properties", 
      image: "/images/propcat.jpg"
    },
    {
      title: "Apartment",
      count: "2,500+ Properties",
      image: "/images/propcat.jpg"
    }
  ]

  const featuredProjects = [
    {
      title: "Vatika The Seven Lamps",
      location: "Sector 82, Gurgaon",
      price: "₹1.95 - 3.64 Cr",
      type: "1, 2, 3, 4, 5 BHK Apartment",
      image: "/images/propfea.jpg",
      tag: "Ready To Move"
    },
    {
      title: "Tulip White",
      location: "Sector 69, Gurgaon",
      price: "₹12 L - 3.75 Cr",
      type: "2, 3 BHK Apartment | 1 RK Studio",
      image: "/images/propfea.jpg",
      tag: "Ready To Move"
    },
    {
      title: "Emaar MGF Palm Hills",
      location: "Sector 77, Gurgaon",
      price: "₹11 L - 2.7 Cr",
      type: "1, 3, 4 BHK Apartment",
      image: "/images/propfea.jpg",
      tag: "Ready To Move"
    }
  ]

  return (
    <main className="min-h-screen">
    {/* Hero Section */}
    <div className="relative h-[500px]">
      <img
        src="/images/lishero.jpg"
        alt="Property Hero"
        fill
        className="object-cover brightness-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-8">
          Find Your Dream Property
        </h1>
        
        {/* Search Section */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="flex border-b">
            {['Buy', 'Rent', 'New Launch', 'PG/Co-living', 'Commercial', 'Plots/Land', 'Projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Search Bar */}
          <div className="p-4 flex gap-2">
            <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search 'Flats for rent in sector 77 Noida'"
                className="flex-1 outline-none text-sm"
              />
              <Mic className="w-5 h-5 text-gray-400" />
            </div>
            <button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Categories Section */}
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Apartments, Villas and more</h2>
      <p className="text-gray-600 mb-6">in Gurgaon</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative h-48 rounded-lg overflow-hidden mb-3">
              <img
                src={category.image}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium text-lg">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.count}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Featured Projects Section */}
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Handpicked Projects</h2>
      <p className="text-gray-600 mb-6">Featured Projects in Gurgaon</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => (
          <div key={index} className="border rounded-lg overflow-hidden group cursor-pointer">
            <div className="relative h-48">
              <img
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 z-10 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded text-sm">
                {project.tag}
              </span>
            </div>
            <div className="p-4 z-20">
              <h3 className="font-medium text-lg mb-1">{project.title}</h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4" />

                <span>{project.location}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{project.type}</p>
              <p className="font-bold text-lg">{project.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>
  )
}

export default MainListingPage