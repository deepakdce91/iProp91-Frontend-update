'use client'

import { useEffect, useState } from 'react'
import { Search, MapPin, Mic, TrendingUp, Calculator, LineChart, FileText } from 'lucide-react'
import { Carousel } from './components/carousel.jsx'
import { PropertyCard } from './components/property-card'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { toast } from 'react-toastify'

// Enhanced dummy data


const categories = [
  {
    title: "Owner Properties",
    description: "Verified listings from property owners",
    image: "/images/propcat.jpg",
    link: "/owner-properties",
    count: "15,800+ Properties"
  },
  {
    title: "New Projects",
    description: "Upcoming and ongoing projects",
    image: "/images/propcat.jpg",
    link: "/new-projects",
    count: "1,200+ Properties"
  },
  {
    title: "Ready to Move",
    description: "Immediate possession properties",
    image: "/images/propcat.jpg",
    link: "/ready-to-move",
    count: "8,500+ Properties"
  },
  {
    title: "Budget Homes",
    description: "Affordable housing options",
    image: "/images/propcat.jpg",
    link: "/budget-homes",
    count: "3,200+ Properties"
  }
]

const tools = [
  {
    title: "Rates & Trends",
    description: "Know all about Property Rates & Trends in your city",
    icon: TrendingUp,
    link: "/rates-trends"
  },
  {
    title: "EMI Calculator",
    description: "Know how much you'll have to pay every month on your loan",
    icon: Calculator,
    link: "/emi-calculator"
  },
  {
    title: "Investment Hotspot",
    description: "Discover the top localities in your city for investment",
    icon: LineChart,
    link: "/investment-hotspot"
  },
  {
    title: "Research Insights",
    description: "Get experts insights and research reports on real estate",
    icon: FileText,
    link: "/research"
  }
]

export default function MainListingPage() {
  const [activeTab, setActiveTab] = useState('Buy')
  const [searchCity, setSearchCity] = useState('')
  const [allFetchedProjects, setAllFetchedProjects] = useState()
  const [filteredProperties, setFilteredProperties] = useState(allFetchedProjects)

  // Add search handler
  const handleCitySearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    setSearchCity(searchTerm)
    
    if (searchTerm === '') {
      setFilteredProperties(allFetchedProjects)
    } else {
      const filtered = allFetchedProjects.filter(property => 
        property.location.toLowerCase().includes(searchTerm)
      )
      setFilteredProperties(filtered)
    }
  }
  useEffect(()=>{
    // fetch projects from the server
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const fetchProjects = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/projectsDataMaster/fetchAllProjects?userId=${decoded.userId}`,{
        
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });
      if(response){
        const allProjects = await response.data;
        setAllFetchedProjects(allProjects);
        // toast.success("projects fetched successfully")
        console.log(allProjects);
        return;
      }
      toast.error("Error fetching projects");
    }
    fetchProjects();
  },[])

  return (
    <main className="min-h-screen bg-gray-50 rounded-xl overflow-hidden">
      {/* Hero Section with Enhanced Search */}
      <div className="relative h-[600px]">
        <img
          src="/images/lishero.jpg"
          alt="Property Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-6xl text-white font-bold mb-8 text-center">
            Find a home you'll <span className="text-primary">love</span>
          </h1>
          
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <div className="flex flex-wrap border-b">
              {['Buy', 'Rent', 'New Launch', 'PG/Co-living', 'Commercial', 'Plots/Land', 'Projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium transition-colors
                    ${activeTab === tab ? 'text-gold border-b-2 border-gold' : 'text-gray-600 hover:text-gold'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter City, Locality, Project"
                    className="flex-1 outline-none text-sm"
                    value={searchCity}
                    onChange={handleCitySearch}
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by property type, budget etc"
                    className="flex-1 outline-none text-sm"
                  />
                  <Mic className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
                <button className="bg-gold text-white px-8 py-3 rounded-lg font-medium hover:bg-gold/70 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advice & Tools Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Advice & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Link href={tool.link} key={index}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <tool.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">We've got properties for everyone</h2>
          <Link href="/all-categories" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link href={category.link} key={index}>
              <div className="relative h-64 rounded-lg overflow-hidden group">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{category.description}</p>
                  <span className="text-white/90 text-sm font-medium">{category.count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <section className="py-12 px-4 max-w-7xl mx-auto bg-white ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Featured Properties</h2>
            <p className="text-gray-600">Handpicked properties for you</p>
          </div>
          <Link href="/featured-properties" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <Carousel
          items={allFetchedProjects}
          renderItem={(allFetchedProjects) => <PropertyCard property={allFetchedProjects} />}
          className="pb-4"
        />
      </section>

      {/* New Projects Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">New Project Gallery</h2>
            <p className="text-gray-600">Latest projects in Bangalore</p>
          </div>
          <Link href="/new-projects" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <Carousel
          items={allFetchedProjects}
          renderItem={(allFetchedProjects) => <PropertyCard property={allFetchedProjects} />}
          className="pb-4"
        />
      </section>

      {/* Popular Owner Properties */}
      <section className="py-12 px-4 max-w-7xl mx-auto bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Popular Owner Properties</h2>
            <p className="text-gray-600">Verified properties from owners</p>
          </div>
          <Link href="/owner-properties" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <Carousel
          items={allFetchedProjects}
          renderItem={(allFetchedProjects) => <PropertyCard property={allFetchedProjects} />}
          className="pb-4"
        />
      </section>
    </main>
  )
}

