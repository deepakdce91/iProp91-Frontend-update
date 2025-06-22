'use client'

import { useState } from 'react'

const Calculator = () => {
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
    <div className="h-fit flex flex-col justify-center items-center bg-white p-3 my-6 mr-2 md:p-4 border shadow-md border-black/50 rounded-lg">
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
        <div className="bg-gray-50 rounded-xl p-4 shadow-md border-b-2 border border-b-gold border-gold">
          {/* Tabs */}
          <div className="flex rounded-full bg-gray-100 p-1 mb-4">
            <button
              onClick={() => setActiveTab('emi')} 
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-colors
                ${activeTab === 'emi' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'}`}
            >
              CALCULATE EMI AMOUNT
            </button>
            <button
              onClick={() => setActiveTab('loan')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium transition-colors
                ${activeTab === 'loan' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500'}`}
            >
              CALCULATE HOME LOAN AMOUNT
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Loan/EMI Amount Input */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">
                  {activeTab === 'emi' ? 'I Need Home Loan Of Amount' : 'I Can Pay EMI Of'}
                </label>
                <span className="text-xs">
                  ₹ {activeTab === 'emi' ? loanAmount.toLocaleString() : emiAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={activeTab === 'emi' ? 100000 : 1000}
                  max={activeTab === 'emi' ? 12000000 : 320000}
                  value={activeTab === 'emi' ? loanAmount : emiAmount}
                  onChange={(e) => activeTab === 'emi' 
                    ? setLoanAmount(Number(e.target.value))
                    : setEmiAmount(Number(e.target.value))
                  }
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <input
                  type="number"
                  value={activeTab === 'emi' ? loanAmount : emiAmount}
                  onChange={(e) => activeTab === 'emi' 
                    ? setLoanAmount(Number(e.target.value))
                    : setEmiAmount(Number(e.target.value))
                  }
                  min={activeTab === 'emi' ? 100000 : 1000}
                  max={activeTab === 'emi' ? 12000000 : 320000}
                  className="w-24 border rounded p-1.5 text-right text-xs"
                />
              </div>
              <div className="flex justify-between mt-0.5 text-xs text-gray-500">
                <span>{activeTab === 'emi' ? '1L' : '1K'}</span>
                <span>{activeTab === 'emi' ? '1.2Cr' : '3.2L'}</span>
              </div>
            </div>

            {/* Loan Period Input */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">For A Period Of (1 To 30 Years)</label>
                <span className="text-xs">Year {loanPeriod}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <input
                  type="number"
                  value={loanPeriod}
                  onChange={(e) => setLoanPeriod(Number(e.target.value))}
                  min={1}
                  max={30}
                  step={0.5}
                  className="w-24 border rounded p-1.5 text-right text-xs"
                />
              </div>
              <div className="flex justify-between mt-0.5 text-xs text-gray-500">
                <span>1y</span>
                <span>30y</span>
              </div>
            </div>

            {/* Interest Rate Input */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Rate Of Interest (7 To 11%)</label>
                <span className="text-xs">{interestRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={7}
                  max={11}
                  step={0.2}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  min={7}
                  max={11}
                  step={0.2}
                  className="w-24 border rounded p-1.5 text-right text-xs"
                />
              </div>
              <div className="flex justify-between mt-0.5 text-xs text-gray-500">
                <span>7%</span>
                <span>11%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-col justify-center items-center">
            <h2 className="text-lg text-gray-500 mb-1">Monthly EMI</h2>
            <p className="text-3xl font-bold">
              {formatCurrency(getMonthlyEMI())}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 shadow-md border-b-2 border border-b-gold border-gold">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h3 className="text-xs text-gray-500 mb-1">Total Amount Payable</h3>
                <p className="text-lg font-semibold">{formatCurrency(getTotalAmount())}</p>
              </div>
              <div>
                <h3 className="text-xs text-gray-500 mb-1">Total Interest Payable</h3>
                <p className="text-lg font-semibold">{formatCurrency(getInterestAmount())}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator;