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
    const angleStep = 180 / (totalSlides - 1)
    const angle = (index - currentIndex + totalSlides) % totalSlides
    const adjustedAngle = (angle <= totalSlides / 2 ? angle : angle - totalSlides) * angleStep

    const radius = 380
    const x = Math.sin((adjustedAngle * Math.PI) / 180) * radius
    const y = -Math.cos((adjustedAngle * Math.PI) / 180) * radius * 0.3 + radius * 0.3

    let scale = 1 - Math.abs(adjustedAngle) / 180 * 0.2
    let zIndex = 100 - Math.abs(adjustedAngle)

    if (index === currentIndex) {
      scale = 1.3 // Make the center image larger
      zIndex = 1000 // Ensure the center image is on top
    } else if (Math.abs(index - currentIndex) === 1 || Math.abs(index - currentIndex) === slides.length - 1) {
      scale = 1.1 // Make adjacent images slightly larger
      zIndex = 500 // Put adjacent images between center and others
    }

    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      zIndex,
      opacity: 1, // Keep all images fully opaque
      transition: "all 0.5s ease-out",
    }
  }

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden ">
      <div className="absolute top-0 left-0 right-0 h-[500px]"> {/* Increased height to accommodate larger images */}
        <div className="relative h-full w-full mt-5">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute w-[200px] h-[400px] rounded-[20px] overflow-hidden shadow-2xl" // Increased image size
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
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          className="rounded-full bg-gray-100 hover:shadow-lg hover:shadow-gold border-b-[5px] border-b-gold backdrop-blur-sm hover:scale-110 transition-all  p-2  duration-200"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-10 w-10 text-black" />
        </button>
        <button
          className="rounded-full bg-gray-100 hover:shadow-lg hover:shadow-gold border-b-[5px] border-b-gold backdrop-blur-sm hover:scale-110 transition-all  p-2  duration-200"
          onClick={handleNext}
        >
          <ChevronRight className="h-10 w-10 text-black" />
        </button>
      </div>
    </div>
  )
}