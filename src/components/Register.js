import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

import card1 from "../images/1.png";
import card2 from "../images/1.png";
import card3 from "../images/1.png";
import card4 from "../images/1.png";

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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* === Decorative Background (matches your improved style) === */}
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
            <pattern id="reg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reg-grid)" />
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

      {/* Floating animated cards */}
      {[card1, card2, card3, card4].map((src, i) => (
        <motion.div
          key={i}
          {...floatAnim}
          className={`pointer-events-none absolute w-20 md:w-24 h-28 md:h-32 overflow-hidden opacity-70 ${
            i === 0
              ? "top-16 left-6"
              : i === 1
              ? "top-10 right-8"
              : i === 2
              ? "bottom-28 left-10"
              : "bottom-12 right-12"
          }`}
        >
          <img src={src} alt="Card" className="w-full h-full object-cover rounded-xl shadow-lg" />
        </motion.div>
      ))}

      {/* Register Form Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-2xl text-gray-900 rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden">
        {!isRegistered ? (
          <>
            {/* Top header / stepper */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69] text-white shadow mb-6">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-2xl font-bold">Create your account</h2>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                    Secure • Fast • Free
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-white">1) Fill Details</span>
                  <div className="h-[1px] flex-1 bg-white/30 mx-3" />
                  <div className="h-2 w-2 rounded-full bg-white/60" />
                  <span className="text-white/80">2) Verify Email</span>
                </div>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-2xl font-bold text-center mb-6"
            >
              Click. Book. Enjoy!
            </motion.h2>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-xl" />
                    ) : (
                      <FiEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm mb-1 text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="text-xl" />
                    ) : (
                      <FiEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`relative w-full bg-[#128f8b] text-white font-semibold py-3 rounded-xl shadow-md overflow-hidden transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-700"
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
                    className="absolute inset-0 bg-white/10"
                  />
                )}
              </button>
            </form>

            {/* Redirect to login */}
            <p className="mt-6 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-700 font-semibold underline">
                Log In
              </Link>
            </p>
          </>
        ) : (
          // Verification message after registration
          <div className="text-center p-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-3xl font-bold mb-4 text-gray-900"
            >
              Verify your email
            </motion.h2>
            <p className="text-gray-700">Please check your email inbox and click the verification link.</p>
            <p className="mt-4 text-emerald-700/80 animate-pulse">Waiting for verification...</p>

            <button
              onClick={handleResendVerification}
              disabled={resendDisabled}
              className={`mt-6 px-6 py-2 rounded-xl bg-[#128f8b] text-white font-semibold shadow-md transition ${
                resendDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-700"
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
