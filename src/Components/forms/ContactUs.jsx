import React, { useState } from 'react'

const ContactUsForm = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        thoughts: ''
      })
    
      const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log('Form submitted:', formData)
      }
  return (
    <div className=" min-h-[60vh] max-w-[80vh] rounded-lg min-w-[60vw]  bg-[#111] text-white p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Form Section */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-white/40 transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-white/40 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <textarea
                placeholder="Share your Querry"
                rows={4}
                className="w-full bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-white/40 transition-colors resize-none"
                value={formData.thoughts}
                onChange={(e) => setFormData({ ...formData, thoughts: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="relative px-8 py-3 bg-transparent border border-white/20 text-sm uppercase tracking-wider
                       hover:border-white/40 transition-colors duration-300 overflow-hidden group"
            >
              <span className="relative z-10">Share your feedback</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-orange-500/20 blur-xl" />
              </div>
            </button>
          </form>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="relative">
            <h1 className="text-5xl font-bold mb-2">
              <span className="relative inline-block">
                Contact
                <span className="absolute -inset-1 text-gray-400 translate-x-[1px] translate-y-[1px] opacity-50">
                  Contact
                </span>
              </span>{' '}
              <span className="relative inline-block">
                Us
                <span className="absolute -inset-1 text-gray-400 translate-x-[1px] translate-y-[1px] opacity-50">
                  Us
                </span>
              </span>
            </h1>
          </div>
          <p className="text-white/70 max-w-md mx-auto md:mx-0">
            It is very important for us to keep in touch with you, so we are always ready to answer any question that interests you. Shoot!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactUsForm