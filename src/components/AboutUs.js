import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Award, Users, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data and payments are protected with enterprise-grade security"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Book your tickets in under 60 seconds with our streamlined process"
    },
    {
      icon: Star,
      title: "Premium Events",
      description: "Handpicked events from top venues and exclusive experiences"
    },
    {
      icon: Award,
      title: "Trusted Platform",
      description: "Join millions of satisfied customers who trust our platform"
    }
  ];

  const stats = [
    { number: "100k+", label: "Happy Customers" },
    { number: "100+", label: "Events Booked" },
    { number: "20+", label: "Partner Venues" },
    { number: "4.5/5", label: "Customer Rating" }
  ];

  return (
    <div className=" min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                About Our Platform
              </span>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Connecting You to
                <span className="text-[#128f8b] block">Unforgettable Experiences</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                We're passionate about making live events accessible to everyone. From concerts
                to sports, theater to festivals - we make ticket booking simple, secure, and enjoyable.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#128f8b] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-red-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Founded in 2020 by a team of event enthusiasts and tech innovators,
                    we recognized a gap in the market for a truly user-friendly ticketing platform.
                  </p>

                  <p>
                    Our journey began with a simple question: "Why should buying tickets
                    be stressful?" We set out to create a platform that puts the customer
                    first, making every interaction smooth and enjoyable.
                  </p>

                  <p>
                    Today, we're proud to serve millions of customers worldwide, connecting
                    them to the experiences they love most. Every ticket sold is a step
                    towards creating lasting memories.
                  </p>
                </div>


              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built our platform around the features that matter most to our customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl p-8 h-full hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#128f8b] transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-[#128f8b] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-[#128f8b] to-[#000000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Our Mission
            </h2>

            <p className="text-xl text-blue-100 leading-relaxed mb-12 max-w-3xl mx-auto">
              To democratize access to live experiences by creating the world's most
              trusted and user-friendly ticketing platform. Every event should be
              accessible, every purchase should be secure, and every experience should be memorable.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Heart className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-white">Made with passion</span>
              </div>
              <p className="text-blue-100">
                for connecting people to the moments that matter most
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Find Your Next Experience?
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Join millions of happy customers and discover amazing events near you
            </p>

            <Link
              to="/events"
              className="inline-block bg-[#000000] hover:bg-[#128f8b] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
            >
              Browse Events
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
