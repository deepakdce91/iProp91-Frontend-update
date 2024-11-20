
import { useState } from 'react'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const subjects = ['General Inquiry', 'Buy Property', 'Services Concern', 'Others']

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-white   ">
      <div className="flex w-full  gap-8 items-center justify-center border-[1px] border-gray-200 rounded-xl shadow-md bg-white ">
          {/* Left side - Building Image (hidden on mobile) */}
          <div className="hidden lg:block lg:w-[40%] h-[100vh]">
            <img
              src="/images/contactbg.png"
              alt="Modern building facade"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Contact Form */}
          <div className=" lg:w-[60%] flex flex-col justify-center items-center px-2 md:px-0">
            <h2 className="text-3xl lg:text-5xl font-medium text-black mb-8 ">Contact Us</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-black">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-black">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-black">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-black">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2"
                  />
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-4">
                <label className="text-sm text-black">Select Subject?</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {subjects.map((subject, index) => (
                    <label key={subject} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value={subject}
                        checked={formData.subject === subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-4 h-4 text-[#F5B544] border-gray-300 focus:ring-gold"
                      />
                      <span className="text-sm text-black">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="text-sm text-black">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message.."
                  className="w-full border-b border-gray-300 focus:border-gold outline-none pb-2 min-h-[100px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white hover:text-black hover:bg-white hover:border hover:border-black border-white border font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    
  )
}