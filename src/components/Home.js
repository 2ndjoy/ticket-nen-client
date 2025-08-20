import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Carousel from "./Carousel";
import SuggestedVideos from "./SuggestedVideos";

export default function Home() {
  // Detect if device is mobile based on window width (<=768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = [
    { title: "Concerts", img: "https://source.unsplash.com/400x300/?concert" },
    { title: "Sports", img: "https://source.unsplash.com/400x300/?sports" },
    { title: "Theater", img: "https://source.unsplash.com/400x300/?theater" },
  ];

  return (
    <div className="bg-white text-gray-800 relative overflow-hidden font-light font-serif">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"
        animate={{ x: [0, 20, -20, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ top: "-5rem", left: "-5rem", zIndex: 0 }}
      />

      {/* Carousel Section */}
      <section className="relative py-16 px-6 md:px-20 bg-gray-100 overflow-hidden">
        <div className="relative z-10">
          <Carousel />
        </div>
      </section>

      {/* Suggested Events */}
      <div className="mx-20 py-16 mb-16 bg-white border border-gray-200 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4 animate-pulse">
          Suggested Events
        </h2>
        <SuggestedVideos />
      </div>

      {/* Popular Categories */}
      <section className="mx-20 py-16 px-6 md:px-20 bg-white border border-gray-200 rounded-xl shadow-md mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 animate-pulse">
          Popular Categories
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Tilt
              key={cat.title}
              className="rounded-xl shadow-lg"
              tiltEnable={true}
              gyroscope={!isMobile}
              gyroscopeMaxAngleX={15}
              gyroscopeMaxAngleY={15}
              perspective={1000}
              scale={1.05}
              transitionSpeed={250}
            >
              <motion.div
                className="relative rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="relative z-20 p-4">
                  <h3 className="text-xl font-semibold text-white">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-200">
                    Find upcoming {cat.title} events near you.
                  </p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="mx-20 py-16 px-6 md:px-20 mb-16 bg-white border border-gray-200 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-10 animate-pulse">
          Featured Events
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i, index) => (
            <Tilt
              key={i}
              className="rounded-xl"
              tiltEnable={true}
              gyroscope={!isMobile}
              gyroscopeMaxAngleX={15}
              gyroscopeMaxAngleY={15}
              perspective={1000}
              scale={1.03}
              transitionSpeed={250}
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?ixlib=rb-1.2.1&w=1000&q=80"
                  alt="event"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Event Title #{i}
                </h3>
                <p className="text-gray-600 text-sm mb-3">Location • Date</p>
                <div className="text-right">
                  <Link to="/events">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Book Ticket
                    </button>
                  </Link>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Don't Miss Out Section */}
      <motion.section
        className="mx-20 py-16 px-6 md:px-20 mb-16 bg-white border border-gray-200 rounded-xl shadow-md text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="mb-6 text-lg">
          Be the first to know about trending events and special discounts.
        </p>
        <Link to="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Sign Up Now
          </motion.button>
        </Link>
      </motion.section>

      {/* Our Offerings Section */}
      <section className="mx-20 py-16 px-6 md:px-20 bg-white border border-gray-200 rounded-xl shadow-md mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 animate-pulse">
          Our Offerings
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/ticket.png"
              alt="Easy Ticket Purchase"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Easy Ticket Purchase</h3>
            <p className="text-gray-600 text-sm">
              Browse, and purchase tickets for a variety of events, from
              concerts to conferences, all from your device with ease and
              convenience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/email-delivery.png"
              alt="Instant Ticket Delivery"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Instant Ticket Delivery</h3>
            <p className="text-gray-600 text-sm">
              Receive your tickets immediately upon purchase via email. If
              preferred, users can also opt to receive their tickets on WhatsApp.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/payment-method.png"
              alt="Multiple Payment Methods"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Multiple Payment Methods</h3>
            <p className="text-gray-600 text-sm">
              Enjoy flexible payment options with bKash, Nagad, Upay, Visa,
              Mastercard, and more, ensuring secure and smooth transactions.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/tickipass.png"
              alt="Tickipass Feature"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Tickipass Feature</h3>
            <p className="text-gray-600 text-sm">
              Access purchased tickets instantly with Tickipass, displaying QR
              codes from your device, eliminating the need for printed e-ticket
              PDFs.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/dashboard.png"
              alt="Comprehensive Dashboard"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Comprehensive Dashboard</h3>
            <p className="text-gray-600 text-sm">
              Access real-time sales reports and attendance data through our
              user-friendly dashboard, providing valuable insights at your
              fingertips.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <img
              src="https://floral-mountain-2867.fly.storage.tigris.dev/static/frontend/img/icons/scan.png"
              alt="Smooth Scanning"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Smooth Scanning</h3>
            <p className="text-gray-600 text-sm">
              Streamline the entry process with our efficient ticket scanning
              system, ensuring a hassle-free experience for attendees and
              organizers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
