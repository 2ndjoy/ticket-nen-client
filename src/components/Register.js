import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import card1 from "../images/4.png";
import card2 from "../images/5.png";
import card3 from "../images/6.png";
import card4 from "../images/7.png";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

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
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!/^[a-zA-Z\s]{3,50}$/.test(fullName.trim())) {
      newErrors.fullName = "Full name must be 3-50 letters only.";
    }

    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }

    if (
  !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password)
) {
  newErrors.password =
    "Password must be at least 6 characters and include a letter, number, and special character.";
}


    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateInputs()) {
      toast.error("Please fix the errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      toast.success("Check your email to verify your account and log in.");

      navigate("/login");

// we will  correctly implement this later, this include sending user data to mongodb

      // const idToken = await user.getIdToken();

      // const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${idToken}`,
      //   },
      //   body: JSON.stringify({
      //     uid: user.uid,
      //     fullName,
      //     email,
      //     phoneNumber,
      //     imageUrl: "", // No image for now
      //   }),
      // });

      // if (!res.ok) throw new Error("Failed to save user");
      // toast.success("User saved to MongoDB!");
      
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] flex items-center justify-center px-4 overflow-hidden">
      {[card1, card2, card3, card4].map((src, i) => (
        <motion.div
          key={i}
          {...floatAnim}
          className={`absolute w-24 h-32 overflow-hidden ${
            i === 0
              ? "top-16 left-10"
              : i === 1
              ? "top-10 right-12"
              : i === 2
              ? "bottom-28 left-16"
              : "bottom-10 right-16"
          }`}
        >
          <img src={src} alt="Card" className="w-full h-full object-cover" />
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="Your phone number"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
            />
            {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-white/80">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showConfirmPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full bg-white text-[#1e293b] font-semibold py-2 rounded-xl shadow-md overflow-hidden transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <span className="relative z-10">{isSubmitting ? "Creating account..." : "Register"}</span>
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
          <button
            onClick={() => toast("Google signup coming soon!")}
            className="w-full flex items-center justify-center gap-3 bg-white text-[#1e293b] font-medium py-2 rounded-xl shadow hover:bg-gray-100 transition"
          >
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
