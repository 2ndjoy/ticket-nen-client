import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-white text-gray-800 min-h-screen py-16 px-6 md:px-20">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-600 mb-10">
          We are passionate about connecting people to unforgettable live experiences.
          From electrifying concerts and thrilling sports games to captivating theater performances,
          we make ticket booking simple, fast, and secure.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <motion.div
          className="text-lg leading-relaxed"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="mb-4">
            Founded by event lovers and tech enthusiasts, our platform is built with you in mind.
            We believe buying tickets should be a joyful part of your event journey.
          </p>
          <p>
            Our mission is to empower users to discover, explore, and attend events that spark their passion.
            With a user-friendly interface, real-time updates, and personalized recommendations,
            we're committed to making every ticket purchase an exciting beginning.
          </p>
        </motion.div>

        <motion.img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
          alt="Team working"
          className="rounded-xl shadow-lg"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
      </div>

      <motion.div
        className="mt-20 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="text-left list-disc list-inside space-y-3 text-gray-700">
          <li>Reliable, secure, and seamless booking experience</li>
          <li>Handpicked featured events and top categories</li>
          <li>Friendly customer support team</li>
          <li>Access to exclusive deals and early bird tickets</li>
        </ul>
      </motion.div>
    </div>
  );
}
