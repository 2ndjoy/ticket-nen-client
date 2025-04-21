import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import card1 from "../images/4.png";
import card2 from "../images/6.png";
import card3 from "../images/6.png";
import card4 from "../images/4.png";


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

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Logged in!");
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4 overflow-hidden my-1">
  {/* Floating Images */}
<motion.div
  {...floatAnim}
  className="absolute top-16 left-8 w-32 h-40 flex items-center justify-center overflow-hidden"
>
  <img src={card1} alt="Card 1" className="w-full h-full object-cover rounded-2xl" />
</motion.div>

<motion.div
  {...floatAnim}
  className="absolute top-24 right-8 w-32 h-40 flex items-center justify-center overflow-hidden"
>
  <img src={card2} alt="Card 2" className="w-full h-full object-cover rounded-2xl" />
</motion.div>

<motion.div
  {...floatAnim}
  className="absolute bottom-20 left-14 w-32 h-40 flex items-center justify-center overflow-hidden"
>
  <img src={card3} alt="Card 3" className="w-full h-full object-cover rounded-2xl" />
</motion.div>

<motion.div
  {...floatAnim}
  className="absolute bottom-14 right-16 w-32 h-40 flex items-center justify-center overflow-hidden"
>
  <img src={card4} alt="Card 4" className="w-full h-full object-cover rounded-2xl" />
</motion.div>

      {/* Login Card */}
      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Welcome Back 👋
        </motion.h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-xl border-none bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-between text-sm text-white/70">
            <label>
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          {/* Login Button with Progress */}
          <button
            type="submit"
            disabled={isLoading}
            className={`relative w-full bg-white text-[#0f172a] font-semibold py-2 rounded-xl shadow-md overflow-hidden transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            <span className="relative z-10">
              {isLoading ? "Logging in..." : "Login"}
            </span>

            {/* Progress bar animation */}
            {isLoading && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
                className="absolute bottom-0 left-0 h-1 bg-green-400"
              />
            )}
          </button>
        </form>

        {/* Sign in with Google */}
        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-[#0f172a] font-medium py-2 rounded-xl shadow hover:bg-gray-100 transition">
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-white/80">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
