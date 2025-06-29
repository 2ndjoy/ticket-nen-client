import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen py-20 px-6 md:px-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Your message..."
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="bg-green-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-500 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p className="text-gray-600">support@ticketnenbd.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Phone</h3>
              <p className="text-gray-600">+880 1731047260</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Address</h3>
              <p className="text-gray-600">Tilagor Point , Sylhet, SYL 3000, BD</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
