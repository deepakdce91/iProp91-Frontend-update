'use client'

import { useState } from 'react'

export function Calculator() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [loanTenure, setLoanTenure] = useState(10)
  const [loanType, setLoanType] = useState('HOME LOAN')

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="p-8 space-y-6">
              <h2 className="text-3xl font-bold">Tell us about your requirements</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    className={`px-4 py-2 rounded-full ${
                      loanType === 'HOME LOAN' ? 'bg-gold text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setLoanType('HOME LOAN')}
                  >
                    HOME LOAN
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full ${
                      loanType === 'LOAN AGAINST PROPERTY' ? 'bg-gold text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setLoanType('LOAN AGAINST PROPERTY')}
                  >
                    LOAN AGAINST PROPERTY
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Loan Amount</span>
                    <span className="font-bold">₹ {loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Loan Tenure Required</span>
                    <span className="font-bold">{loanTenure} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-medium">Gender</label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Others</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </div>
                </div>

                <button className="w-full bg-gold text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  NEXT →
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Home Loan"
                width={800}
                height={600}
                className="object-cover h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-3xl font-bold mb-4">Check your Eligibility through digitised credit policies of 90+ Banks</h3>
                  <p className="text-lg">
                    Get started in Seconds
                  </p>
                  <p className="mt-4 text-sm">
                    We take care of all the legwork so that you can focus on finding the right lender. Just by filling in simple form fields, we can show you your eligibility with just a click of a button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

