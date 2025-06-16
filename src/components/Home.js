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
        {/* Background blobs */}
        <motion.div
          className="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          animate={{ x: [0, 30, -30, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ top: "-6rem", left: "-6rem", zIndex: 0 }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          animate={{ x: [0, -20, 20, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          style={{ bottom: "-6rem", right: "-6rem", zIndex: 0 }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          animate={{ x: [0, 15, -15, 0], y: [0, 25, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 4 }}
          style={{ top: "20%", right: "20%", zIndex: 0 }}
        />
        {/* Carousel itself */}
        <div className="relative z-10">
          <Carousel />
        </div>
      </section>
<div className="mt-11">

  <h2 className="text-3xl font-bold text-center mb-2 animate-pulse">Suggested Events</h2>

<SuggestedVideos/>

</div>





      {/* Categories */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10 animate-pulse">Popular Categories</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Tilt
              key={cat.title}
              className="rounded-xl shadow-lg"
              tiltEnable={true}
              gyroscope={!isMobile} // enable gyroscope only if not mobile
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
                <img src={"https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9"} alt={cat.title} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="relative z-20 p-4">
                  <h3 className="text-xl font-semibold text-white">{cat.title}</h3>
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
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-10 animate-pulse">Featured Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i, index) => (
            <Tilt
              key={i}
              className="rounded-xl"
              tiltEnable={true}
              gyroscope={!isMobile} // only desktop
              gyroscopeMaxAngleX={15}
              gyroscopeMaxAngleY={15}
              perspective={1000}
              scale={1.03}
              transitionSpeed={300}
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                 src={"https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?ixlib=rb-1.2.1&w=1000&q=80"}
                 
 alt="event"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Event Title #{i}</h3>
                <p className="text-gray-600 text-sm mb-3">Location • Date</p>
                <Link to="/events">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Book Ticket
                  </button>
                </Link>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-16 bg-[#128f8b] text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
        <p className="mb-6 text-lg">Be the first to know about trending events and special discounts.</p>
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
    </div>
  );
}
