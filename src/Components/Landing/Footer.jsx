"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check } from 'lucide-react'
import "react-toastify/dist/ReactToastify.css"
import { useTypewriter } from "./typeWriter"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState('idle')
  const [isAnimating, setIsAnimating] = useState(true)
  const [isUserActive, setIsUserActive] = useState(false)
  const dummyEmail = "example@iprop91.com"
  const { displayText, startTyping } = useTypewriter(dummyEmail, 100, 1000)

  useEffect(() => {
    if (!isAnimating || isUserActive) return

    const animate = async () => {
      setStatus('typing')
      startTyping()

      await new Promise(resolve => setTimeout(resolve, dummyEmail.length * 100 + 1500))

      setStatus('idle')
      setEmail('')
      
      setTimeout(() => {
        animate()
      }, 1000)
    }

    animate()
  }, [isAnimating, isUserActive])

  const handleInputFocus = () => {
    setIsAnimating(false)
    setIsUserActive(true)
    setStatus('idle')
  }

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    setIsUserActive(true)
    setIsAnimating(false)
  }

  const handleSubscribe = async () => {
    if (!email) return

    setIsAnimating(true)
    setStatus('sending')
    setIsUserActive(false)

    if (validateEmail(email)) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('done')
      toast.success("Subscribed successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStatus('idle')
      setEmail("")
      
      setIsAnimating(false)
    } else {
      setStatus('idle')
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleInputBlur = () => {
    setIsUserActive(false)
  }

  return (
    <footer className="text-white p-10 border-t-[1px] border-t-white/20 w-full mx-auto bg-black shadow-lg">
      {/* First section remains the same */}
      <div className="flex flex-col lg:flex-row justify-between mb-4 w-full px-4 mx-auto">
        <div className="flex justify-center my-1">
          <h1 className="font-semibold text-primary text-2xl">iProp91</h1>
        </div>
        <div className="flex justify-center space-x-4 my-1">
          <Link to="#" aria-label="LinkedIn">
            <i className="fab fa-linkedin text-2xl text-black hover:text-primary"></i>
          </Link>
          <Link to="#" aria-label="Facebook">
            <i className="fab fa-facebook text-2xl text-black hover:text-primary"></i>
          </Link>
          <Link to="#" aria-label="Instagram">
            <i className="fab fa-instagram text-2xl text-black hover:text-primary"></i>
          </Link>
          <Link to="#" aria-label="Twitter">
            <i className="fab fa-twitter text-2xl text-black hover:text-primary"></i>
          </Link>
          <Link to="#" aria-label="YouTube">
            <i className="fab fa-youtube text-2xl text-black hover:text-primary"></i>
          </Link>
        </div>
      </div>

      <div className="mx-auto flex flex-col lg:flex-row">
        {/* Left Section with animated subscription */}
        <div className="w-full lg:w-2/5 my-2 lg:px-4">
          <h2 className="text-3xl font-semibold mb-4">
            Exclusive Opportunities, Exclusive Access, Exclusive You!
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Subscribe to our newsletter
          </p>
          <div className="relative flex items-center text-xs rounded-full overflow-hidden w-full bg-white lg:w-72">
            <input
              type="email"
              placeholder={status === 'idle' ? "Email address" : ""}
              value={status === 'typing' ? displayText : email}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="text-black px-3 py-2 w-full outline-none placeholder-gray-800"
              disabled={status === 'sending' || status === 'done'}
            />
            
            <AnimatePresence mode="wait">
              {status === 'sending' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 text-black"
                >
                  <div className="flex items-start gap-2">
                    Sending...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </motion.div>
              )}

              {status === 'done' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 text-black"
                >
                  <div className="flex items-center gap-2">
                    Thanks for subscribing!
                    <Check className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="bg-gold text-black px-3 py-2 font-[400] rounded-full disabled:opacity-50"
              onClick={handleSubscribe}
              disabled={status === 'sending' || status === 'done' || !email}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Middle Section */}
        <div className="w-full lg:w-1/5 my-2">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">
            Quick Links
          </h3>
          <ul className="text-xs">
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
            <li className="my-2">
              <Link to="/sitefaqs" className="hover:text-primary">
                Site FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="w-full lg:w-1/5 my-2">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">
            Our Services
          </h3>
          <ul className="text-xs">
            <li className="my-2">
              <Link to="/safe" className="hover:text-primary">
                iProp91 Safe
              </Link>
            </li>
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                iProp91 Owner&apos;s Club
              </Link>
            </li>
            <li className="my-2">
              <Link to="/" className="hover:text-primary">
                iProp91 Real Insight
              </Link>
            </li>
            <li className="my-2">
              <Link to="/nri" className="hover:text-primary">
                iProp91 NRI
              </Link>
            </li>
            <li className="my-2">
              <Link to="/lend" className="hover:text-primary">
                iProp91 Lend
              </Link>
            </li>
            <li className="my-2">
              <Link to="/advice" className="hover:text-primary">
                iProp91 Advice
              </Link>
            </li>
          </ul>
        </div>

        {/* Knowledge Center Section */}
        <div className="w-full lg:w-1/5 my-2">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">
            Knowledge Center
          </h3>
          <ul className="text-xs">
            <li className="my-2">
              <Link to="/faqs" className="hover:text-primary">
                FAQs
              </Link>
            </li>
            <li className="my-2">
              <Link to="/case-laws" className="hover:text-primary">
                Case-Laws
              </Link>
            </li>
            <li className="my-2">
              <Link to="/library" className="hover:text-primary">
                Library
              </Link>
            </li>
            <li className="my-2">
              <Link to="/laws" className="hover:text-primary">
                Laws
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer

