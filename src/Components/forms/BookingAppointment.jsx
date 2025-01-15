import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const BookingAppointment = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        enquiryFor: '',
        date: '',
        timeSlot: ''
      })
    const [error, setError] = useState(null)
    
      const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/appointments/addAppointment`, formData)
            if (response.data.success) {
                console.log('Appointment booked successfully')
                toast.success("Slot Booked Successfully.")
                onClose()
            } else {
                setError(response.data.message)
                toast.error(error)
            }
        } catch (err) {
            if (err.response && err.response.data.errors) {
                setError(err.response.data.errors.map(err => err.msg).join(', '))
            } else {
                setError('An error occurred. Please try again.')
            }
        }
      }
    

    
      const timeSlots = [
        "11:00 AM - 12:00 PM",
        "12:00 PM - 1:00 PM",
        "2:00 PM - 3:00 PM",
        "3:00 PM - 4:00 PM",
        "4:00 PM - 5:00 PM"
      ]
    
      const enquiryFors = ["Buy", "Sell", "Rent", "Other"]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
        {/* Close Button */}
        <button onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-[#111] rounded-t-lg px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Schedule an Appointment</h2>
          <p className="text-gray-100 text-sm mt-1">Fill in the details below to book your slot</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Enquiry Type */}
          <div>
            <label htmlFor="enquiryFor" className="block text-sm font-medium text-gray-700 mb-1">
              Enquiry Related To
            </label>
            <select
              id="enquiryFor"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.enquiryFor}
              onChange={(e) => setFormData({ ...formData, enquiryFor: e.target.value })}
            >
              <option value="">Select Type</option>
              {enquiryFors.map((type) => (
                <option className='' key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              id="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Time Slot */}
          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time Slot
            </label>
            <select
              id="timeSlot"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#111] text-white py-2 px-4 rounded-md hover:bg-gray-800 
                     transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                     focus:ring-gray-500 focus:ring-offset-2 mt-6"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingAppointment