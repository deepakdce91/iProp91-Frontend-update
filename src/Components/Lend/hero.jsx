'use client'
import { Play } from 'lucide-react'
import Goldbutton from "../CompoCards/GoldButton/Goldbutton"
import { useState } from 'react'
import DisclaimerModal from './DisclaimerModal'


export function Hero() {
const [showDisclaimer, setShowDisclaimer] = useState(false)


const showDisclaimerModal = ()=>{
  setShowDisclaimer(true);
}
const closeDisclaimerModal = ()=>{
  setShowDisclaimer(false);
}



  return (
    <section className="relative  text-black h-screen"  >
      <div className="container mx-auto px-4 py-20 ">
        <div className="grid lg:grid-cols-1 gap-12 items-center mt-16">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold w-full leading-tight">
              The Home Loan Process, <br /> Now Online
            </h1>
            <p className="text-xl text-gray-500">
              Grow Home with every BASIC step
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Apply with IProp91 Partners</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span>Find best loan offers while sitting at home</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span>Paperless Application</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Documentation support through dedicated agent</span>
              </li>
            </ul>
          </div>
          
        </div>
          <div className="text-center flex items-center  w-full mt-12">
            <Goldbutton properties="border-[1px] border-gold bg-gray-100 w-[20%]  text-black px-8 py-3 rounded-lg font-medium  transition-colors text-lg font-bold" btnname={"GET STARTED"} onclick={showDisclaimerModal} />
          </div>
      </div>

      {showDisclaimer && (
        <DisclaimerModal onClose={closeDisclaimerModal}/>
      )}
    </section>
  )
}

