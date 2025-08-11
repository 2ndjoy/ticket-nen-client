import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginOrg = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl text-white rounded-3xl p-8 shadow-2xl border border-white/20">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold text-center mb-6"
        >
          More Sales, Less Effort!
        </motion.h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-white/80">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
              required
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
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
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none"
                required
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative w-full bg-white text-[#1e293b] font-semibold py-2 rounded-xl shadow-md overflow-hidden transition-all ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
          >
            <span className="relative z-10">
              {isSubmitting ? "Logging in..." : "Login"}
            </span>
          </button>
        </form>

       
        <div className="flex justify-between text-sm text-white/70">

          <Link to="/forgot-password" className="underline text-white font-medium">
            Forgot password?
          </Link>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center text-white/80">
          Don’t have an account?{" "}
          <Link to="/registerorg" className="text-white font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginOrg;
