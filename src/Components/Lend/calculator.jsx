'use client'

import { useState } from 'react'

const  Calculator = () =>{
  const [activeTab, setActiveTab] = useState('emi')
  const [loanAmount, setLoanAmount] = useState(3838710)
  const [emiAmount, setEmiAmount] = useState(245576)
  const [loanPeriod, setLoanPeriod] = useState(15)
  const [interestRate, setInterestRate] = useState(7)

  const calculateEMI = (principal, years, ratePercent) => {
    const rate = ratePercent / 12 / 100
    const numberOfPayments = years * 12
    const emi = (principal * rate * Math.pow(1 + rate, numberOfPayments)) / (Math.pow(1 + rate, numberOfPayments) - 1)
    return Math.round(emi)
  }

  const calculateLoanAmount = (emi, years, ratePercent) => {
    const rate = ratePercent / 12 / 100
    const numberOfPayments = years * 12
    const principal = (emi * (Math.pow(1 + rate, numberOfPayments) - 1)) / (rate * Math.pow(1 + rate, numberOfPayments))
    return Math.round(principal)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getTotalAmount = () => {
    const monthlyPayment = activeTab === 'emi' 
      ? calculateEMI(loanAmount, loanPeriod, interestRate)
      : emiAmount
    return monthlyPayment * loanPeriod * 12
  }

  const getInterestAmount = () => {
    const principal = activeTab === 'emi' ? loanAmount : calculateLoanAmount(emiAmount, loanPeriod, interestRate)
    return getTotalAmount() - principal
  }

  const getMonthlyEMI = () => {
    if (activeTab === 'emi') {
      return calculateEMI(loanAmount, loanPeriod, interestRate)
    }
    return emiAmount
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-4 md:p-8">
      <p className='text-4xl text-black font-bold mb-10'>Tell us about your requirements</p>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-b-[4px] border-[1px] border-b-gold border-gold ">
          {/* Tabs */}
          <div className="flex rounded-full bg-gray-100 dark:bg-gray-700 p-1 mb-8">
            <button
              onClick={() => setActiveTab('emi')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors
                ${activeTab === 'emi' 
                  ? 'bg-white dark:bg-gray-800 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400'}`}
            >
              CALCULATE EMI AMOUNT
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors
                ${activeTab === 'loan' 
                  ? 'bg-white dark:bg-gray-800 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400'}`}
            >
              CALCULATE HOME LOAN AMOUNT
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-8">
            {/* Loan/EMI Amount Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lg font-medium">
                  {activeTab === 'emi' ? 'I Need Home Loan Of Amount' : 'I Can Pay EMI Of'}
                </label>
                <span className="text-sm">
                  ₹ {activeTab === 'emi' ? loanAmount.toLocaleString() : emiAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={activeTab === 'emi' ? 100000 : 1000}
                max={activeTab === 'emi' ? 12000000 : 320000}
                value={activeTab === 'emi' ? loanAmount : emiAmount}
                onChange={(e) => activeTab === 'emi' 
                  ? setLoanAmount(Number(e.target.value))
                  : setEmiAmount(Number(e.target.value))
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{activeTab === 'emi' ? '1L' : '1K'}</span>
                <span>{activeTab === 'emi' ? '1.2Cr' : '3.2L'}</span>
              </div>
            </div>

            {/* Loan Period Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lg font-medium">For A Period Of (1 To 30 Years)</label>
                <span className="text-sm">Year {loanPeriod}</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>1y</span>
                <span>30y</span>
              </div>
            </div>

            {/* Interest Rate Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-lg font-medium">Rate Of Interest (7 To 11%)</label>
                <span className="text-sm">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={7}
                max={11}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>7%</span>
                <span>11%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-center  ">
          <div className="mb-8 flex flex-col justify-center items-center">
            <h2 className="text-2xl text-gray-500 dark:text-gray-400 mb-2">Monthly EMI</h2>
            <p className="text-5xl font-bold">
              {formatCurrency(getMonthlyEMI())}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-b-[4px] border-[1px] border-b-gold border-gold">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount Payable</h3>
                <p className="text-xl font-semibold">{formatCurrency(getTotalAmount())}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Interest Payable</h3>
                <p className="text-xl font-semibold">{formatCurrency(getInterestAmount())}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator;
