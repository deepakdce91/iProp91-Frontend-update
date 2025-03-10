"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, MapPin, FileText, ImageIcon, Monitor, Smartphone, Users } from 'lucide-react'
import { jwtDecode } from "jwt-decode"

export default function PropertyJouneyPage() {
  const [userType, setUserType] = useState("Owner")
  const [purpose, setPurpose] = useState("Sell")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

   
  // Check if user is authenticated on component mount
  useEffect(() => {
    
    const checkAuth = () => {
      try {
        // Try to get and decode token from localStorage
        const token = localStorage.getItem('token')
        if (token) {
          // Simple check - in a real app you would properly decode the JWT
          const decoded = jwtDecode(token);
          // Set authenticated if userId exists in the decoded token
          setIsAuthenticated(decoded && decoded.userId)
          return
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
      
      // Default to not authenticated if any issues
      setIsAuthenticated(false)
    }
    
    checkAuth()
  }, [])

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left scrollable section */}
      <div className={`w-full lg:w-2/3 p-6 lg:p-12 overflow-y-auto ${isAuthenticated ? 'mt-0' : 'mt-20'}`}>
      <section className="mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">How it works</h1>
          
          <div className="space-y-12">
            <StepItem 
              number="1"
              title="Post your Property Ad"
              description="Enter all details like locality name, amenities etc. along with uploading Photos"
              image="/placeholder.svg?height=150&width=200"
            />
            
            <StepItem 
              number="2"
              title="Check Responses on Dashboard"
              description="Get access to Buyer/Tenant contact details & connect easily"
              image="/placeholder.svg?height=150&width=200"
            />
            
            <StepItem 
              number="3"
              title="Sell/Rent faster with instant Connect"
              description="Negotiate with your prospective Buyer/Tenant & mutually close the deal (site-visit)"
              image="/placeholder.svg?height=150&width=200"
            />
          </div>
        </section>

        <section className="mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Tips on Selling a Property Online</h1>
          
          <div className="space-y-8">
            <TipItem 
              icon={<ImageIcon className="w-5 h-5 text-gray-800" />}
              title="Post your Property Ad"
              description="Enter all details like locality name, amenities etc. along with uploading Photos"
            />
            
            <TipItem 
              icon={<ImageIcon className="w-5 h-5 text-gray-800" />}
              title="Add Quality Photos"
              description="Do not forget to add high-quality photos as it's key for any property to stand out. You can always request a photoshoot of your property through Magicbricks 'Photoshoot Service'."
            />
            
            <TipItem 
              icon={<MapPin className="w-5 h-5 text-gray-800" />}
              title="Choose Correct Locality/Address"
              description="Make sure to accurately map your locality while filling in the details of your property. Adding a correct locality is essential to receive genuine queries for your property."
            />
            
            <TipItem 
              icon={<FileText className="w-5 h-5 text-gray-800" />}
              title="Write a Great Description"
              description="Provide a short description for your property highlighting the key USPs and all the relevant details to help buyers make a decision. On Magicbricks, you can always request a stellar description by 'Content Experts'."
            />
          </div>
        </section>

        <section className="mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Benefits of Selling Your Property Online</h1>
          <p className="text-gray-600 mb-8">
            With a plethora of real estate websites to choose from, posting property online is now easy, convenient and hassle-free. Here are some benefits of buying and selling your property online:
          </p>

          <div className="space-y-8">
            <BenefitItem 
              icon={<CheckCircle className="w-5 h-5 text-gray-800" />}
              title="Time-Efficient"
              description="Selling your property online with portals such as Magicbricks can help you save time, manage your bookings at your convenience and receive quality leads quickly."
            />
            
            <BenefitItem 
              icon={<CheckCircle className="w-5 h-5 text-gray-800" />}
              title="Get Better Exposure To Potential Buyers"
              description="A large number of prospective buyers search online, a far easier way than visiting individuals properties. This helps your property get wider exposure to lakhs of buyers present online."
            />
            
            <BenefitItem 
              icon={<CheckCircle className="w-5 h-5 text-gray-800" />}
              title="Cost-Effective"
              description="By opting to sell online, you can expect a significant reduction in agent fees and overall cost associated with selling a home traditionally."
            />
            
            <BenefitItem 
              icon={<CheckCircle className="w-5 h-5 text-gray-800" />}
              title="More Services"
              description="Not only Magicbricks offers a multitude of property services such as rent agreements, home cleaning, renovation, tenant verification, and more for your convenience."
            />
          </div>
        </section>

        

        
      </div>

      {/* Right sticky form section */}
      <motion.div 
        className={`w-full lg:w-1/3 bg-white p-6 lg:p-8   ${isAuthenticated ? 'mt-0' : 'mt-20'}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto"
        }}
      >
        <div className="max-w-md mx-auto border border-gray-300 p-4 rounded-xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-8">Let's get you started</h2>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">You are:</p>
            <div className="flex space-x-4">
              <UserTypeButton 
                type="Owner" 
                selected={userType === "Owner"} 
                onClick={() => setUserType("Owner")} 
              />
              <UserTypeButton 
                type="Agent" 
                selected={userType === "Agent"} 
                onClick={() => setUserType("Agent")} 
              />
              <UserTypeButton 
                type="Builder" 
                selected={userType === "Builder"} 
                onClick={() => setUserType("Builder")} 
              />
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">You are here to:</p>
            <div className="flex space-x-4">
              <PurposeButton 
                purpose="Sell" 
                selected={purpose === "Sell"} 
                onClick={() => setPurpose("Sell")} 
              />
              <PurposeButton 
                purpose="Rent/lease" 
                selected={purpose === "Rent/lease"} 
                onClick={() => setPurpose("Rent/lease")} 
              />
              <PurposeButton 
                purpose="List as PG" 
                selected={purpose === "List as PG"} 
                onClick={() => setPurpose("List as PG")} 
              />
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">Your contact number</p>
            <div className="flex items-center mb-4">
              <div className="relative w-24">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <option>IND +91</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <span className="mx-4 text-gray-600">
                <input className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500" type="text" placeholder="WhatsApp Number" />
              </span>
            </div>
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
              Start Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Component for benefit items
function BenefitItem({ icon, title, description }) {
  return (
    <motion.div 
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="mt-1 text-teal-500">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

// Component for tip items
function TipItem({ icon, title, description }) {
  return (
    <motion.div 
      className="flex items-start space-x-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

// Component for step items
function StepItem({ number, title, description, image }) {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0">
        <img 
          src={image || "/placeholder.svg"} 
          alt={`Step ${number}`} 
          width={200} 
          height={150} 
          className="rounded-md"
        />
      </div>
      <div>
        <div className="text-gray-500 mb-1">Step {number}:</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

// Component for user type buttons
function UserTypeButton({ type, selected, onClick }) {
  return (
    <motion.button
      className={`px-4 py-2 rounded-full border ${selected ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} text-gray-800`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {type}
    </motion.button>
  )
}

// Component for purpose buttons
function PurposeButton({ purpose, selected, onClick }) {
  return (
    <motion.button
      className={`px-4 py-2 rounded-full border ${selected ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} text-gray-800`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {purpose}
    </motion.button>
  )
}
