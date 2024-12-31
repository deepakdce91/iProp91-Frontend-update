"use client"

import { useState, useEffect } from 'react'

export function useTypewriter(text, speed = 100, delay = 0) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout
    let currentIndex = 0

    if (!isTyping) return

    const type = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex))
        currentIndex++
        timeout = setTimeout(type, speed)
      } else {
        setIsTyping(false)
      }
    }

    timeout = setTimeout(() => {
      type()
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay, isTyping])

  return { displayText, isTyping, startTyping: () => setIsTyping(true) }
}