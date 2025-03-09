import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContactUsForm = ({onClose}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email is optional, but validate format if provided
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle mobile number input
  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobile: numericValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contactUs/addContactUs`, formData);
      
      if (response.data) {
        toast.success('Submitted Successfully');
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = error.response.data.errors;
        toast.error(serverErrors[0]?.msg || 'Please check your input');
      } else {
        toast.error('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="min-h-[60vh] max-w-[80vh] rounded-lg min-w-[60vw] bg-[#111] text-white p-8">
      {/* Close Button */}
      <button onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-12 items-center">
        {/* Form Section */}
        <div className="space-y-8 flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name *"
                className={`w-full bg-transparent border-b ${
                  errors.name ? 'border-red-500' : 'border-white/20'
                } py-2 focus:outline-none focus:border-white/40 transition-colors`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Your Email (Optional)"
                className={`w-full bg-transparent border-b ${
                  errors.email ? 'border-red-500' : 'border-white/20'
                } py-2 focus:outline-none focus:border-white/40 transition-colors`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Your Mobile Number * (10 digits)"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength="10"
                className={`w-full bg-transparent border-b ${
                  errors.mobile ? 'border-red-500' : 'border-white/20'
                } py-2 focus:outline-none focus:border-white/40 transition-colors`}
                value={formData.mobile}
                onChange={handleMobileChange}
                onKeyPress={(e) => {
                  // Prevent non-numeric key presses
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Share your Query *"
                rows={4}
                className={`w-full bg-transparent border-b ${
                  errors.message ? 'border-red-500' : 'border-white/20'
                } py-2 focus:outline-none focus:border-white/40 transition-colors resize-none`}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative px-8 py-3 bg-transparent border border-white/20 text-sm uppercase tracking-wider
                       hover:border-white/40 transition-colors duration-300 overflow-hidden group
                       ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10">
                {isSubmitting ? 'Sending...' : 'Submit'}
              </span>
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
  );
};

export default ContactUsForm;