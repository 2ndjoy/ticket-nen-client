import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    message: '',
    captcha: ''
  });

  // Require login to submit
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setCheckingAuth(false);
      // Pre-fill email if logged in and empty
      if (u?.email && !formData.email) {
        setFormData((prev) => ({ ...prev, email: u.email }));
      }
    });
    return () => unsub();
  }, []); // eslint-disable-line

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block submission if not logged in
    if (!user) {
      alert("Please log in to send a message.");
      window.location.href = "/login";
      return;
    }

    // basic required check
    const required = ["firstName", "mobile", "email", "message"];
    const missing = required.filter((k) => !String(formData[k] ?? "").trim());
    if (missing.length) {
      alert("Please fill all required fields: " + missing.join(", "));
      return;
    }

    setSubmitting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const payload = {
        firstName: String(formData.firstName || "").trim(),
        lastName: String(formData.lastName || "").trim(),
        mobile: String(formData.mobile || "").trim(),
        email: String(formData.email || "").trim(),
        message: String(formData.message || "").trim(),
      };

      const res = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // optional if you verify token in backend
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit message.");
      }

      // success
      alert("✅ Your message was sent successfully!");
      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: user?.email || '',
        message: '',
        captcha: ''
      });
    } catch (err) {
      console.error(err);
      alert("❌ " + (err?.message || "Something went wrong submitting the form."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* === Decorative Background (cohesive with your other pages) === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />

        {/* Blobs */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-200 blur-3xl opacity-50" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-emerald-300 blur-3xl opacity-40" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[60rem] rounded-[50%] bg-emerald-100 blur-3xl opacity-40" />

        {/* Subtle grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="contact-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-grid)" />
        </svg>

        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      {/* Header Section / Hero */}
      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Top Callout */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69] text-white shadow-lg mb-8">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">We’d love to hear from you</h1>
                    <p className="mt-1 text-white/90">
                      Have a question about tickets, events, or partnerships? Reach out!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      Support • 6 Days a Week
                    </span>
                  </div>
                </div>
              </div>
              {/* Auth hint banner */}
              {!checkingAuth && !user && (
                <div className="bg-white/15 backdrop-blur-sm text-white px-6 py-3 text-sm">
                  You must be logged in to submit the contact form.{" "}
                  <a href="/login" className="underline font-semibold">Log in</a> or{" "}
                  <a href="/register" className="underline font-semibold">create an account</a>.
                </div>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Get In Touch */}
              <div className="rounded-2xl border bg-white/70 backdrop-blur-md shadow-sm p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-900">
                  Get In Touch With Us Now!
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div className="text-center p-6 bg-white text-gray-800 rounded-xl border hover:shadow-md transition">
                    <Phone className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                    <h3 className="font-semibold mb-2">Phone Number</h3>
                    <p className="text-sm">+880 1731047260</p>
                  </div>

                  {/* Email */}
                  <div className="text-center p-6 bg-white text-gray-800 rounded-xl border hover:shadow-md transition">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-xs">support@ticketnenbd.com</p>
                    <p className="text-xs">info@ticketnenbd.com</p>
                  </div>

                  {/* Location */}
                  <div className="text-center p-6 bg-white text-gray-800 rounded-xl border hover:shadow-md transition">
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-xs">Tilagor Point, Sylhet,</p>
                    <p className="text-xs">SYL 3000, BD</p>
                  </div>

                  {/* Working Hours */}
                  <div className="text-center p-6 bg-white text-gray-800 rounded-xl border hover:shadow-md transition">
                    <Clock className="w-8 h-8 mx-auto mb-3 text-[#128f8b]" />
                    <h3 className="font-semibold mb-2">Working Hours</h3>
                    <p className="text-xs">Monday To Saturday</p>
                    <p className="text-xs">09:00 AM To 06:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="rounded-2xl border bg-white/70 backdrop-blur-md shadow-sm p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-900">
                  Contact Us
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!user || submitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={!user || submitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile No *"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        disabled={!user || submitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={!user || submitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                      disabled={!user || submitting}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    ></textarea>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="submit"
                      disabled={!user || submitting}
                      className={`px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors duration-200 ${
                        user && !submitting
                          ? "bg-[#253131] hover:bg-[#128f8b] text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {submitting ? "Submitting..." : "Submit"}
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {!checkingAuth && !user && (
                    <p className="text-center text-sm text-gray-600">
                      Please <a href="/login" className="text-emerald-700 underline">log in</a> to send us a message.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
