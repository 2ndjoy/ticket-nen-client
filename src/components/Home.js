import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Carousel from "./Carousel";
import SuggestedVideos from "./SuggestedVideos";

export default function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch events
  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events", { signal: controller.signal });
        const data = await res.json();
        setSuggestedEvents(data.slice(0, 3)); // first 3 events
        setFeaturedEvents(data.slice(0, 3));  // first 3 featured events (can customize)
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
    return () => controller.abort();
  }, []);

  const categories = [
    { title: "Concerts", img: "https://source.unsplash.com/400x300/?concert" },
    { title: "Sports", img: "https://source.unsplash.com/400x300/?sports" },
    { title: "Theater", img: "https://source.unsplash.com/400x300/?theater" },
  ];

  return (

    
    <div className="bg-white text-gray-800 relative overflow-hidden font-light font-serif">
      {/* Carousel Section */}
      <section className="relative py-16 px-6 md:px-20 bg-gray-100 overflow-hidden">
        <div className="relative z-10">
          <Carousel />
        </div>
      </section>

      {/* Suggested Events */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-sm text-gray-600 mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Curated Events
          </div>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Discover What's 
            <span className="font-medium bg-[#0b7253] bg-clip-text text-transparent block">
              Happening Next
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {suggestedEvents.map((event) => (
            <Tilt key={event._id || event.id} className="group" tiltEnable={!isMobile}>
              <motion.div 
                className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs text-white font-medium">Featured</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{event.subtitle}</p>
                  <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {event.location} • {event.date}
                  </p>
                  
                  <Link to={`/events/${event._id || event.id}`}>
                    <button className="w-full bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 group/btn">
                      <span>View Details</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <section className="max-w-6xl mx-auto px-8 py-20 mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-100 px-4 py-2 rounded-full text-sm text-gray-700 mb-6">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            </div>
            Popular Categories
          </div>
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Explore by 
            <span className="font-medium bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent block">
              Your Interests
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover events tailored to your passions and connect with communities that share your interests
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Tilt
              key={cat.title}
              className="group"
              tiltEnable={!isMobile}
              gyroscope={!isMobile}
              gyroscopeMaxAngleX={10}
              gyroscopeMaxAngleY={10}
              perspective={1000}
              scale={1.02}
              transitionSpeed={300}
            >
              <motion.div
                className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 cursor-pointer h-72"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="absolute top-4 right-4  bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 text-black">
                    <span className=" text-xs font-medium">Trending</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between h-24">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Discover amazing {cat.title.toLowerCase()} experiences near you
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300 mt-2">
                    <span className="text-xs font-medium">Explore</span>
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                     style={{background: 'linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.1), transparent)'}}>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Featured Events */}
<section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
  {/* Header */}
  <div className="text-center mb-20">
    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-green-100 px-5 py-2 rounded-full text-sm font-semibold text-gray-700 mb-6">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
      </div>
      Featured Events
    </div>

    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
      Discover the{' '}
      <span className="font-medium bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
        Hottest Events
      </span>
    </h2>

    <p className="text-gray-500 text-lg md:text-xl max-w-3xl mx-auto">
      Explore the top events happening near you. Book your tickets effortlessly and experience the best moments.
    </p>
  </div>

  {/* Event Grid */}
  <div className="grid md:grid-cols-3 gap-10 justify-items-center">
    {featuredEvents.slice(0, 3).map((event, index) => (
      <Tilt
        key={event._id || event.id}
        className="group w-full max-w-sm"
        tiltEnable={!isMobile}
        gyroscope={!isMobile}
        gyroscopeMaxAngleX={10}
        gyroscopeMaxAngleY={10}
        perspective={1000}
        scale={1.04}
        transitionSpeed={400}
      >
        <motion.div
          className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/20 transition-all duration-500 cursor-pointer h-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Image */}
          <div className="relative h-52 md:h-60 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

            <span className="absolute top-4 left-4  bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {event.category}
            </span>

            <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
              {event.price}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-between min-h-[180px]">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                {event.title}
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed line-clamp-2">{event.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                className="text-xs md:text-sm font-medium bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-full transition shadow-sm"
                onClick={() => navigate(`/events/${event._id || event.id}`)}
              >
                See Details
              </button>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-amber-500 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          {/* Gradient overlay on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, transparent, rgba(251, 191, 36, 0.08), transparent)' }}
          ></div>
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
        <Link to="/login">
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