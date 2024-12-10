'use client'

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react"

const carouselData = [
  {
    id: 1,
    title: "EXECUTION",
    heading: "We have found luxury properties for our clients",
    features: [
      "Review of documents to be executed with the developer/seller",
      "Power of attorney",
      "On-ground assistance in relation to the registration process",
      "Guidance on foreign exchange and tax-related compliance",
      "Documentation support for purchase, sale, or lease of property"
    ]
  },
  {
    id: 2,
    title: "Management",
    heading: "We Connect To The World NRI",
    features: [
      "Free access to iProp91 Safe to manage all the documents in relation to your property",
      "Access to iProp91 Owners' Club, a confidential platform of verified owners of the same real estate project with common interests to help enhance the overall experience of the occupants of such project",
      "Assistance in the sale or lease of the property",
      "Documentation support",
      "Tenant identification, KYC, and management of leased property",
      "Periodic updates of the project status"
    ]
  },
  {
    id: 3,
    title: "DRAFT AGREEMENTS",
    heading: "Global Real Estate Solutions",
    features: [
      "Access to best property options from the best developers",
      "Market analysis and reports",
      "Access to genuine reviews and ratings",
      "Regular status updates"
    ]
  }
]

const draftAgreements = Array(8).fill({
  title: "DRAFT AGREEMENTS",
  subtitle: "iProp 91- Residential lease agreement"
})

export default function AdviceCards() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [showAgreements, setShowAgreements] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselData.length) % carouselData.length)
  }

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50 || info.offset.y < -50) {
      nextSlide()
    } else if (info.offset.x > 50 || info.offset.y > 50) {
      prevSlide()
    }
  }

  return (
    <div className="w-full min-h-screen bg-transparent text-white p-4 md:p-8 overflow-hidden">
      <div className="mx-auto min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!showAgreements ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col md:flex-row items-center md:gap-8 justify-center"
            >
              {/* Text content */}
              <div className="w-full md:w-1/3 mb-8 md:mb-0 md:ml-24">
                <p className="md:text-3xl text-black font-semibold">Understand the law, legal positions and the key terms of your documents. Happy ownership!</p>
              </div>

              {/* Carousel */}
              <div className="w-full md:w-2/3 relative">
                <div className="hidden md:flex flex-col items-center justify-center h-[100vh]">
                  {[-1, 0, 1].map((offset) => {
                    const slideIndex = (currentIndex + offset + carouselData.length) % carouselData.length
                    const item = carouselData[slideIndex]
                    return (
                      <motion.div
                        key={item.id}
                        className={`absolute w-full max-w-2xl h-80 py-4 backdrop-blur-lg border border-gray-800 rounded-lg p-6 ${
                          offset === 0 ? 'z-20' : 'z-10'
                        } overflow-hidden`}
                        initial={{ 
                          scale: offset === 0 ? 0.9 : 0.7, 
                          y: `${offset * 60}%`,
                          opacity: offset === 0 ? 0.9 : 0.5 
                        }}
                        animate={{ 
                          scale: offset === 0 ? 1 : 0.8, 
                          y: `${offset * 50}%`,
                          opacity: offset === 0 ? 1 : 0.6 
                        }}
                        transition={{ duration: 0.5 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={handleDragEnd}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('/images/2.jpg')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <h3 className="text-3xl font-bold mb-4 text-white overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</h3>
                        <ul className="space-y-3">
                          {item.features.map((feature, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <span className="text-base text-gray-300">•</span>
                              <span className="text-base text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  })}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <button
                onClick={() => setShowAgreements(false)}
                className="absolute right-0 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-4xl font-bold mb-8 text-center">Download Draft Agreements</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {draftAgreements.map((agreement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: idx * 0.1 }
                    }}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center text-center hover:bg-white/20 transition-colors group"
                  >
                    <h3 className="text-sm font-semibold mb-2">{agreement.title}</h3>
                    <p className="text-xs text-white mb-4">{agreement.subtitle}</p>
                    <button className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}