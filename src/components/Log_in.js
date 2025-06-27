import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast.success("Logged in successfully!");
      console.log("User:", user);

      // Redirect to profile page or dashboard
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4 overflow-hidden py-[0.5px]">

      {/* Floating Images */}
      {[card1, card2, card3, card4].map((card, i) => (
        <motion.div
          key={i}
          {...floatAnim}
          className={`absolute w-32 h-40 flex items-center justify-center overflow-hidden ${
            i === 0
              ? "top-16 left-8"
              : i === 1
              ? "top-24 right-8"
              : i === 2
              ? "bottom-20 left-14"
              : "bottom-14 right-16"
          }`}
        >
          <img src={card} alt={`Card ${i}`} className="w-full h-full object-cover rounded-2xl" />
        </motion.div>
      ))}

      {/* Login Card */}
      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Skip the Line, Book Online!
        </motion.h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-between text-sm text-white/70">
            <label>
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="underline text-white font-medium">
    Forgot password?
  </Link>
              </div>

          {/* Login Button */}
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
