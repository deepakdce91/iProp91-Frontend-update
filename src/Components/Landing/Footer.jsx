import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check } from 'lucide-react'
import "react-toastify/dist/ReactToastify.css"
import { useTypewriter } from "./typeWriter"
import { useInView } from "react-intersection-observer"

import ContactUsForm from "../forms/ContactUs";


const Footer = () => {

  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState('idle')
  const [hasAnimated, setHasAnimated] = useState(false)
  const [currentEmail, setCurrentEmail] = useState("example@iprop91.com")
  const { displayText, startTyping } = useTypewriter(currentEmail, 100, 1000)
  
  const [inViewRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  useEffect(() => {
      if (isContactModalOpen ) {
        // Disable scrolling when modal is open
        document.body.style.overflow = "hidden";
      } else {
        // Re-enable scrolling when modal is closed
        document.body.style.overflow = "unset";
      }
  
      // Cleanup function to re-enable scrolling when component unmounts
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isContactModalOpen ]);

  useEffect(() => {
    if (inView && !hasAnimated) {
      const runInitialAnimation = async () => {
        setStatus('typing')
        startTyping()
        
        await new Promise(resolve => setTimeout(resolve, currentEmail.length * 100 + 1500))
        
        setStatus('idle')
        setEmail('')
        setHasAnimated(true)
      }

      runInitialAnimation()
    }
  }, [inView, hasAnimated, startTyping, currentEmail.length])

  const handleInputChange = (e) => {
    setEmail(e.target.value)
  }

  const handleContactModalClose = () => {
    setContactModalOpen(false);
  };

  const handleSubscribe = async () => {
    if (!email) return

    setStatus('sending')

    if (validateEmail(email)) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStatus('done')
      toast.success("Subscribed successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
      
      const submittedEmail = email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentEmail(submittedEmail)
      setStatus('typing')
      setEmail("")
      
      await new Promise(resolve => setTimeout(resolve, submittedEmail.length * 100 + 1500))
      setStatus('idle')
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

  // Helper function to determine what to display in the input
  const getInputDisplay = () => {
    if (status === 'typing') return displayText
    if (status === 'sending' || status === 'done') return ''
    return email
  }

  return (
    <footer className="text-white p-10 border-t-[1px] border-t-white/20 w-full mx-auto bg-black shadow-lg" ref={inViewRef}>
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
        <div className="w-full lg:w-2/5 my-2 lg:px-4">
          <h2 className="text-3xl font-semibold mb-4">
            Exclusive Opportunities, Exclusive Access, Exclusive You!
          </h2>
          <p className="text-gray-100 text-sm mb-4">
            Subscribe to our newsletter
          </p>
          <div className="relative flex items-center text-xs  overflow-hidden w-full border-[1px] border-white bg-black lg:w-72 p-2">
            
            <input
              type="email"
              placeholder={status === 'idle' ? "Email address" : ""}
              value={getInputDisplay()}
              onChange={handleInputChange}
              className="text-white bg-black px-3 py-2 w-full outline-none placeholder-gray-800"
              disabled={status === 'sending' || status === 'done'}
            />
            
            <AnimatePresence mode="wait">
              {status === 'sending' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-[30%] -translate-x-1/2 text-white"
                >
                  <div className="flex items-start gap-2 text-gold">
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
                  className="absolute left-[30%] -translate-x-1/2 text-white"
                >
                  <div className="flex items-center gap-2 text-gold">
                    Thanks for subscribing!
                    <Check className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="  px-3 py-2 font-[400]  disabled:opacity-50 bg-white text-black"
              onClick={handleSubscribe}
              disabled={status === 'sending' || status === 'done' || !email}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Rest of the footer sections */}
        <div className="w-full lg:w-1/5 my-2">
          <h3 className="font-semibold mb-2 text-gray-600 text-sm">
            Quick Links
          </h3>
          <ul className="text-xs">
            <li className="my-2">
              <Link to="/aboutUs" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li className="my-2">
              <p onClick={()=>{setContactModalOpen(true)}} className="hover:text-primary">
                Contact Us
              </p>
            </li>
            <li className="my-2">
              <Link to="/privacyPolicy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li className="my-2">
              <Link to="/termsAndConditions" className="hover:text-primary">
                Terms & Conditions
              </Link>
            </li>
            <li className="my-2">
              <Link to="/site-faqs" className="hover:text-primary">
                Site FAQs
              </Link>
            </li>
            <li className="my-2">
              <Link to="/property-journey" className="hover:text-primary">
                Property Journey Page
              </Link>
            </li>
          </ul>
        </div>

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
            <li className="my-2">
              <Link to="/rewards" className="hover:text-primary">
                Rewards FAQs
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleContactModalClose}
          />
          <div className="relative bg-black rounded-lg shadow-xl  mx-4">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={handleContactModalClose}
            >
              {/* Close Button SVG */}
            </button>
            <ContactUsForm onClose={handleContactModalClose} />
          </div>
        </div>
      )}
      
    </footer>
  )
}

export default Footer 