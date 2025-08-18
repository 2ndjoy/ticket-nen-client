import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    message: '',
    captcha: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Form submitted successfully!');
  };

  return (
    <div className=" bg-white">
      {/* Header Section */}
      
      <div className="bg-white text-white py-16">
<motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Side - Get In Touch */}
            <div className="bg-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-8 text-center bg-[#128f8b] py-3 rounded-lg">
                Get In Touch With Us Now!
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="text-center p-6 bg-white text-gray-800 rounded-lg">
                  <Phone className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                  <h3 className="font-semibold mb-2">Phone Number</h3>
                  <p className="text-sm">+880 1731047260</p>
                </div>

                {/* Email */}
                <div className="text-center p-6 bg-white text-gray-800 rounded-lg">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-xs">support@ticketnenbd.com</p>
                  <p className="text-xs">info@ticketnenbd.com</p>
                </div>

                {/* Location */}
                <div className="text-center p-6 bg-white text-gray-800 rounded-lg">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-xs">Tilagor Point, Sylhet,</p>
                  <p className="text-xs">SYL 3000, BD</p>
                </div>

                {/* Working Hours */}
                <div className="text-center p-6 bg-white text-gray-800 rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                  <h3 className="font-semibold mb-2">Working Hours</h3>
                  <p className="text-xs">Monday To Saturday</p>
                  <p className="text-xs">09:00 AM To 06:00 PM</p>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-8 text-center bg-[#128f8b] text-white py-3 rounded-lg">
                Contact Us
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile No *"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email ID *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-none"
                  ></textarea>
                </div>

                

                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#253131] hover:bg-[#128f8b] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
                  >
                    Submit
                    <Send className="w-4 h-4" />
                  </button>
                </div>

         
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}