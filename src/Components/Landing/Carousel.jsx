import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from "axios"
import { useNavigate } from "react-router-dom";

function extractImageUrls(dataArray) {
  return dataArray.map(item => item.image?.url).filter(Boolean);
}

export default function Component({data}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const controls = useAnimation()
  const [slides, setSlides] = useState([]);
  let navigate = useNavigate();

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
    let timer;
    
    if (!isPaused) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + direction + slides.length) % slides.length)
      }, 3000);
    }

    return () => clearInterval(timer);
  }, [direction, slides.length, isPaused]);

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }

  const getSlideStyles = (index) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024
    const isMobile = screenWidth < 768 // md breakpoint

    if (isMobile) {
      // For mobile, we'll only show 3 slides
      const totalVisibleSlides = 3
      const centerIndex = currentIndex
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length
      const nextIndex = (currentIndex + 1) % slides.length

      // Default styles for non-visible slides
      let scale = 0
      let x = 0
      let zIndex = 0
      let opacity = 0

      // Adjusted scales and positions for mobile
      if (index === centerIndex) {
        scale = 1.6  // Increased center scale
        x = 0
        zIndex = 1000
        opacity = 1
      } else if (index === prevIndex) {
        scale = 1.1 // Smaller side scales
        x = -80    // Reduced gap
        zIndex = 500
        opacity = 0.8
      } else if (index === nextIndex) {
        scale = 1.1  // Smaller side scales
        x = 80      // Reduced gap
        zIndex = 500
        opacity = 0.8
      }

      return {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${x}px, 0px) scale(${scale})`,
        zIndex,
        opacity,
        transition: "all 0.5s ease-out",
      }
    } else {
      // Original desktop layout logic
      const totalSlides = slides.length
      const angleStep = 180 / (totalSlides - 1)
      const angle = (index - currentIndex + totalSlides) % totalSlides
      const adjustedAngle = (angle <= totalSlides / 2 ? angle : angle - totalSlides) * angleStep

      const radius = {
        sm: 150,
        md: 250,
        lg: 380
      }

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
  }

  const handleDrag = (event, info) => {
    const dragOffset = info.offset.x;
    const cardWidth = 150;
    const draggedIndexes = Math.round(dragOffset / cardWidth);
  
    if (draggedIndexes !== 0) {
      const newIndex = (currentIndex - draggedIndexes + slides.length) % slides.length;
      setCurrentIndex(newIndex);
    }
  };

  return (
    <section 
      className="relative min-h-[50vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[110vh] w-full mb-32 md:mb-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-[100%] sm:h-[400px] md:h-[450px] lg:h-[600px]">
        <div className="relative h-full w-full mt-5">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute w-[120px] h-[260px] sm:w-[160px] sm:h-[320px] md:w-[150px] md:h-[300px] lg:w-[200px] lg:h-[400px] rounded-[20px] shadow-2xl"
              style={getSlideStyles(index)}
              animate={controls}
              onClick={() => setCurrentIndex(index)}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDrag}
            >
              <a className="cursor-pointer" href={slide.redirectionLink} target="_blank" rel="noopener noreferrer">
                <img
                  src={slide.image.url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 duration-300"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute -bottom-32 md:-bottom-0 left-1/2 transform -translate-x-1/2 flex gap-4">
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