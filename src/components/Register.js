import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import card1 from "../images/4.png";
import card2 from "../images/5.png";
import card3 from "../images/6.png";
import card4 from "../images/7.png";

const floatAnim = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Registered Successfully!");
    }, 2500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] flex items-center justify-center px-4 overflow-hidden">
      {/* Floating Cards */}
      <motion.div {...floatAnim} className="absolute top-16 left-10 w-24 h-32  overflow-hidden">
        <img src={card1} alt="Card" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div {...floatAnim} className="absolute top-10 right-12 w-24 h-32  overflow-hidden">
        <img src={card2} alt="Card" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div {...floatAnim} className="absolute bottom-28 left-16 w-24 h-32  overflow-hidden">
        <img src={card3} alt="Card" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div {...floatAnim} className="absolute bottom-10 right-16 w-24 h-32  overflow-hidden">
        <img src={card4} alt="Card" className="w-full h-full object-cover" />
      </motion.div>

      {/* Register Card with Light Beam Border */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
        {/* Light beam border animation */}
        {/* Top beam */}
<motion.div
  className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
  initial={{ x: "-100%" }}
  animate={{ x: "100%" }}
  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
/>

{/* Right beam */}
<motion.div
  className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
  initial={{ y: "-100%" }}
  animate={{ y: "100%" }}
  transition={{ delay: 1, duration: 4, repeat: Infinity, ease: "linear" }}
/>

{/* Bottom beam */}
<motion.div
  className="absolute bottom-0 right-0 h-1 w-full bg-gradient-to-l from-transparent via-cyan-400 to-transparent"
  initial={{ x: "100%" }}
  animate={{ x: "-100%" }}
  transition={{ delay: 2, duration: 4, repeat: Infinity, ease: "linear" }}
/>

{/* Left beam */}
<motion.div
  className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-cyan-400 to-transparent"
  initial={{ y: "100%" }}
  animate={{ y: "-100%" }}
  transition={{ delay: 3, duration: 4, repeat: Infinity, ease: "linear" }}
/>


        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Click. Book. Enjoy!
        </motion.h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-white/80">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showConfirmPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full bg-white text-[#1e293b] font-semibold py-2 rounded-xl shadow-md overflow-hidden transition-all ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <span className="relative z-10">
              {isSubmitting ? "Creating account..." : "Register"}
            </span>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-green-400/20"
              />
            )}
          </button>
        </form>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-[#1e293b] font-medium py-2 rounded-xl shadow hover:bg-gray-100 transition">
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-white/80">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
