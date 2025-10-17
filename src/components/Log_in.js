import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateInputs = () => {
    const newErrors = {};
    const { email, password } = form;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // === STATIC ADMIN SHORTCUT ===
    // Allow "admin"/"admin" to log into admin dashboard directly.
<<<<<<< HEAD
    if (form.email === "admin@ticketnen.com" && form.password === "admin") {
=======
    if (form.email === "admin" && form.password === "admin") {
>>>>>>> b0813ffeec7ec5e8809b33b759d38e33ad72dcb7
      toast.success("Welcome, Admin!");
      navigate("/admin/admin-dashboard");
      return;
    }

    if (!validateInputs()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const { email, password } = form;
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      const newErrors = {};

      if (err.code === "auth/user-not-found") {
        newErrors.email = "This email is not registered.";
      } else if (err.code === "auth/wrong-password") {
        newErrors.password = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        newErrors.email = "Invalid email format.";
      } else if (err.code === "auth/invalid-credential") {
        newErrors.email = "Email or password is incorrect.";
        newErrors.password = "Email or password is incorrect.";
      } else {
        toast.error(err.message || "Login failed");
      }

      setErrors(newErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === Decorative Background (layered gradients + blobs + subtle grid) === */}
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
            <pattern id="login-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-grid)" />
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

      {/* Card container */}
      <div className="w-full max-w-md mx-auto px-4">
        {/* Header hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69] text-white shadow-lg mb-6">
          <div className="p-6">
            <div className="flex w-full flex-col items-center text-center gap-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl font-bold"
              >
                Skip the Line, Book Online!
              </motion.h2>
              <p className="text-white/90 text-sm">
                Sign in to manage your tickets and discover great events.
              </p>
            </div>
          </div>
        </div>

        {/* Main login card */}
        <div className="bg-white/80 backdrop-blur-xl text-gray-900 rounded-2xl p-7 shadow-2xl border border-white/60">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email (changed to text so 'admin' works) */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com or admin"
                className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                  placeholder="•••••••• (or admin)"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full bg-[#128f8b] text-white font-semibold py-3 rounded-xl shadow-md overflow-hidden transition-all ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-700"
              }`}
            >
              <span className="relative z-10">
                {isSubmitting ? "Logging in..." : "Login"}
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

          <div className="flex justify-between text-sm text-gray-700 mt-4">
            <Link to="/forgot-password" className="underline text-emerald-700 font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-sm text-center text-gray-700">
            Don’t have an account?{" "}
            <Link to="/register" className="text-emerald-700 font-semibold underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
