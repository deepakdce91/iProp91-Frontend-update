import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from "axios"

function extractImageUrls(dataArray) {
  return dataArray.map(item => item.image?.url).filter(Boolean);
}

export default function Component({data}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const controls = useAnimation()
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/mobileTiles/fetchAllEnabledMobileTiles`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setSlides(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);
  
  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + direction + slides.length) % slides.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [direction, slides.length])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const getSlideStyles = (index) => {
    const totalSlides = slides.length
    const angleStep = 180 / (totalSlides - 1)
    const angle = (index - currentIndex + totalSlides) % totalSlides
    const adjustedAngle = (angle <= totalSlides / 2 ? angle : angle - totalSlides) * angleStep

    // Responsive radius
    const radius = {
      sm: 150,
      md: 250,
      lg: 380
    }

    // Use window.innerWidth to determine the current screen size
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
    let currentRadius = radius.lg

    if (screenWidth < 640) {
      currentRadius = radius.sm
    } else if (screenWidth < 1024) {
      currentRadius = radius.md
    }

    const x = Math.sin((adjustedAngle * Math.PI) / 180) * currentRadius
    const y = -Math.cos((adjustedAngle * Math.PI) / 180) * currentRadius * 0.3 + currentRadius * 0.3

    let scale = 1 - Math.abs(adjustedAngle) / 180 * 0.2
    let zIndex = 100 - Math.abs(adjustedAngle)

    if (index === currentIndex) {
      scale = 1.3
      zIndex = 1000
    } else if (Math.abs(index - currentIndex) === 1 || Math.abs(index - currentIndex) === slides.length - 1) {
      scale = 1.1
      zIndex = 500
    }

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      zIndex,
      opacity: 1,
      transition: "all 0.5s ease-out",
    }
  }

  return (
    <section to className="relative min-h-[50vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[100vh] w-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
        <div className="relative h-full w-full mt-5">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute w-[100px] h-[200px] sm:w-[120px] sm:h-[240px] md:w-[150px] md:h-[300px] lg:w-[200px] lg:h-[400px] rounded-[20px] overflow-hidden shadow-2xl"
              style={getSlideStyles(index)}
              animate={controls}
              // drag='x'
              // dragConstraints={{ left: -100, right: 100 }} // Set drag constraints


            >
              <img
                src={slide.image.url}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-28 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          className="rounded-full bg-gray-100 hover:shadow-lg hover:shadow-gold border-b-[3px] sm:border-b-[4px] md:border-b-[5px] border-b-gold backdrop-blur-sm hover:scale-110 transition-all p-1 sm:p-2 duration-200"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-black" />
        </button>
        <button
          className="rounded-full bg-gray-100 hover:shadow-lg hover:shadow-gold border-b-[3px] sm:border-b-[4px] md:border-b-[5px] border-b-gold backdrop-blur-sm hover:scale-110 transition-all p-1 sm:p-2 duration-200"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-black" />
        </button>
      </div>
    </section>
  )
}