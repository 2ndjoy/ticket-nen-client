import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import card1 from "../images/7.png";
import card2 from "../images/7.png";
import card3 from "../images/7.png";
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

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New states for verification flow
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const newErrors = {};
    const { fullName, email, phoneNumber, password, confirmPassword } = form;

    if (!/^[a-zA-Z\s]{3,50}$/.test(fullName.trim())) {
      newErrors.fullName = "Full name must be 3-50 letters only.";
    }

   if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
  newErrors.email = "Please enter a valid email address.";
}


    if (!/^(?:\+?8801|\b01)[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
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
      const { email, password, fullName } = form;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await updateProfile(user, { displayName: fullName });
      await sendEmailVerification(user);
      toast.success("Verification email sent. Please check your inbox.");

      setUserObj(user);
      setIsRegistered(true);
      setCheckingVerification(true);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Polling email verification status every 5 seconds
  useEffect(() => {
    if (!checkingVerification || !userObj) return;

    const intervalId = setInterval(async () => {
      try {
        await userObj.reload();
        if (userObj.emailVerified) {
          clearInterval(intervalId);
          toast.success("Email verified! Redirecting to homepage...");
          navigate("/");
        }
      } catch (err) {
        console.error("Error checking email verification:", err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [checkingVerification, userObj, navigate]);

  // Resend verification email handler
  const handleResendVerification = async () => {
    if (!userObj) return;
    try {
      setResendDisabled(true);
      await sendEmailVerification(userObj);
      toast.success("Verification email resent.");
      // Allow resend after 30 seconds cooldown
      setTimeout(() => setResendDisabled(false), 30000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend verification email.");
      setResendDisabled(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] flex items-center justify-center px-4 overflow-hidden">
      {/* Floating animated cards */}
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

      {/* Register Form Container */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
        {!isRegistered ? (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl font-bold text-center mb-6"
            >
              Click. Book. Enjoy!
            </motion.h2>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-1 text-white/80">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-white/80">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm mb-1 text-white/80">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1 text-white/80">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-xl" />
                    ) : (
                      <FiEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm mb-1 text-white/80">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="text-xl" />
                    ) : (
                      <FiEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`relative w-full bg-white text-[#1e293b] font-semibold py-2 rounded-xl shadow-md overflow-hidden transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
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

            {/* Google Button */}
            <div className="mt-6">
              <button
                onClick={() => toast("Google signup coming soon!")}
                className="w-full flex items-center justify-center gap-3 bg-white text-[#1e293b] font-medium py-2 rounded-xl shadow hover:bg-gray-100 transition"
              >
                <FcGoogle className="text-xl" />
                Sign up with Google
              </button>
            </div>

            {/* Redirect to login */}
            <p className="mt-6 text-sm text-center text-white/80">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-semibold underline">
                Log In
              </Link>
            </p>
          </>
        ) : (
          // Verification message after registration
          <div className="text-center p-10 text-white">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl font-bold mb-4"
            >
              Verify your email
            </motion.h2>
            <p>Please check your email inbox and click the verification link.</p>
            <p className="mt-4 animate-pulse">Waiting for verification...</p>

            <button
              onClick={handleResendVerification}
              disabled={resendDisabled}
              className={`mt-6 px-6 py-2 rounded-xl bg-white text-[#1e293b] font-semibold shadow-md transition ${
                resendDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              {resendDisabled ? "Please wait..." : "Resend Verification Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
