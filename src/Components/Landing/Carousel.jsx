import { useState, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const controls = useAnimation()
  
  const slides = [
    "/images/phn1.png",
    "/images/phn2.png",
    "/images/phn3.png",
    "/images/phn4.png",
    "/images/phn5.png",
    "/images/phn6.png",
    "/images/phn7.png",
    "/images/phn7.png",
    "/images/phn7.png",
  ]

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
    const angleStep = 180 / (totalSlides - 1)  // Increased from 150 to 180 for wider spread
    const angle = (index - currentIndex + totalSlides) % totalSlides
    const adjustedAngle = (angle <= totalSlides / 2 ? angle : angle - totalSlides) * angleStep

    const radius = 380  // Increased from 250 to 400 for larger horizontal diameter
    const x = Math.sin((adjustedAngle * Math.PI) / 180) * radius
    const y = -Math.cos((adjustedAngle * Math.PI) / 180) * radius * 0.3 + radius * 0.3  // Multiplied by 0.3 to shorten vertical height

    const scale = 1 - Math.abs(adjustedAngle) / 180 * 0.2
    const zIndex = 100 - Math.abs(adjustedAngle)

    return {
      position: "absolute",
      left: "50%",
      top: 0,
      transform: `translate(-50%, 0) translate(${x}px, ${y}px) scale(${scale})`,
      zIndex,
      opacity: scale,
      filter: `blur(${(1 - scale) * 1.5}px)`,
      transition: "all 0.5s ease-out",
    }
  }

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden"> {/* Changed from min-h-[80vh] to min-h-[50vh] */}
      <div className="absolute top-0 left-0 right-0 h-[400px]"> {/* Changed from h-[400px] to h-[250px] */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute w-[150px] h-[300px] rounded-[20px] overflow-hidden shadow-2xl" 
              style={getSlideStyles(index)}
              animate={controls}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2 flex gap-4"> {/* Adjusted position */}
        <button
          className="rounded-full bg-gold backdrop-blur-sm hover:bg-white/20 p-2" 
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-10 w-10" /> {/* Reduced size */}
        </button>
        <button
          className="rounded-full bg-gold backdrop-blur-sm hover:bg-white/20 p-2" 
          onClick={handleNext}
        >
          <ChevronRight className="h-10 w-10" /> {/* Reduced size */}
        </button>
      </div>
    </div>
  )
}