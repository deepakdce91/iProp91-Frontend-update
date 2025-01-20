'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef } from "react"


export function Carousel({ items, renderItem, className  }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  if (!items || items.length === 0) {
    return <div>No items to display</div>;
  }

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group ">
      <div 
        ref={carouselRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-6 ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-none snap-start">
            {renderItem(item)}
          </div>
        ))}
      </div>
      
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-full shadow-lg"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded-full shadow-lg"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

