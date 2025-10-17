import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
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

const RegisterOrg = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    // NEW FIELDS
    nidNumber: "",
    organizationName: "",
    organizationType: "",
    division: "",
    district: "",
    area: "",
    // NEW: agree to T&C
    agreeTerms: false,
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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // NEW: checkbox handler for agreeTerms
  const handleAgreeChange = (e) => {
    const { checked } = e.target;
    setForm((prev) => ({ ...prev, agreeTerms: checked }));
  };

  const validateInputs = () => {
    const newErrors = {};
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      nidNumber,
      organizationName,
      organizationType,
      division,
      district,
      area,
      agreeTerms,
    } = form;

    if (!/^[a-zA-Z\s]{3,50}$/.test(fullName.trim())) {
      newErrors.fullName = "Full name must be 3-50 letters only.";
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!/^(?:\+?8801|\b01)[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number.";
    }

    // NEW VALIDATIONS
    if (!/^\d{10,17}$/.test(nidNumber.trim())) {
      newErrors.nidNumber = "NID must be 10–17 digits.";
    }

    if (!/^[A-Za-z0-9\s.&-]{2,100}$/.test(organizationName.trim())) {
      newErrors.organizationName = "Organization name should be 2–100 characters.";
    }

    if (!/^[A-Za-z\s]{2,50}$/.test(organizationType.trim())) {
      newErrors.organizationType = "Organization type should be 2–50 letters.";
    }

    if (!/^[A-Za-z\s-]{2,50}$/.test(division.trim())) {
      newErrors.division = "Division should be 2–50 letters.";
    }

    if (!/^[A-Za-z\s-]{2,50}$/.test(district.trim())) {
      newErrors.district = "District should be 2–50 letters.";
    }

    if (!/^.{2,100}$/.test(area.trim())) {
      newErrors.area = "Area should be at least 2 characters.";
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

    // NEW: must agree to terms
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms & Conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save organizer profile to Mongo after verification
  const saveOrganizerToMongo = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken?.(); // optional if you want to protect route
      const payload = {
        email: firebaseUser.email,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        nidNumber: form.nidNumber,
        organizationName: form.organizationName,
        organizationType: form.organizationType,
        division: form.division,
        district: form.district,
        area: form.area,
        firebaseUid: firebaseUser.uid,
      };

      const res = await fetch("http://localhost:5000/api/organizers/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save organizer profile.");
      }
    } catch (err) {
      console.error("Organizer upsert failed:", err);
      toast.error("Could not save organizer profile. You can try again later.");
    }
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

      // 1) If a user is already logged in with this email and verified => skip verification
      const current = auth.currentUser;
      if (current && current.email === email) {
        // ensure display name is up to date
        if (!current.displayName || current.displayName !== fullName) {
          try {
            await updateProfile(current, { displayName: fullName });
          } catch {}
        }
        if (current.emailVerified) {
          // save organizer to Mongo immediately
          await saveOrganizerToMongo(current);
          toast.success("You're already verified. Organizer profile created!");
          navigate("/my-profile");
          return;
        } else {
          // not verified -> proceed to verification flow
          await sendEmailVerification(current);
          toast.success("Verification email sent. Please check your inbox.");
          setUserObj(current);
          setIsRegistered(true);
          setCheckingVerification(true);
          return;
        }
      }

      // 2) Check if an account already exists for this email
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        // Existing account. Try to sign in with the given password.
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const user = cred.user;

          // keep profile name in sync
          if (!user.displayName || user.displayName !== fullName) {
            try {
              await updateProfile(user, { displayName: fullName });
            } catch {}
          }

          if (user.emailVerified) {
            // Already verified -> no second verification required
            await saveOrganizerToMongo(user);
            toast.success("Welcome back! Email already verified. Organizer profile created.");
            navigate("/my-profile");
            return;
          } else {
            // Not verified -> send verification and show waiting screen
            await sendEmailVerification(user);
            toast.success("Verification email sent. Please check your inbox.");
            setUserObj(user);
            setIsRegistered(true);
            setCheckingVerification(true);
            return;
          }
        } catch (signInErr) {
          // Sign-in failed (wrong password, etc.)
          console.error(signInErr);
          toast.error("We found an existing account. Please log in with the correct password.");
          setIsSubmitting(false);
          return;
        }
      }

      // 3) New account -> create and start verification flow
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
          try {
            await saveOrganizerToMongo(userObj);
          } catch {}
          toast.success("Email verified! Redirecting to Profile");
          navigate("/my-profile");
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === Decorative Background === */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-200 blur-3xl opacity-50" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-emerald-300 blur-3xl opacity-40" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[60rem] rounded-[50%] bg-emerald-100 blur-3xl opacity-40" />
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

      {/* === Main container === */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-10">
        {/* Top hero / header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69] text-white shadow-lg mb-8">
          <div className="p-6 md:p-8">
            <div className="flex w-full flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Register as an Organizer</h1>
                <p className="mt-1 text-white/90">
                  Create your organizer account to publish events and start selling tickets.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  Secure • Fast • Free
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="mt-6 flex items-center gap-3 text-sm">
              <div className={`h-2 w-2 rounded-full ${!isRegistered ? "bg-white" : "bg-white/60"}`} />
              <span className={`${!isRegistered ? "text-white" : "text-white/80"}`}>1) Fill Details</span>
              <div className="h-[1px] flex-1 bg-white/30 mx-3" />
              <div className={`h-2 w-2 rounded-full ${isRegistered ? "bg-white" : "bg-white/60"}`} />
              <span className={`${isRegistered ? "text-white" : "text-white/80"}`}>2) Verify Email</span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: promo card */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-white/70 backdrop-blur-md shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Why organize with us?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Publish events in minutes with beautiful pages and instant checkout.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Real-time dashboard for sales & attendee insights.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Multiple payment methods and instant ticket delivery.
                </li>
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Average setup</p>
                  <p className="mt-1 text-base font-semibold">~5 minutes</p>
                </div>
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Fees</p>
                  <p className="mt-1 text-base font-semibold">Transparent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: the form / verification panel */}
          <div className="lg:col-span-3">
            <div className="relative w-full bg-white/80 backdrop-blur-2xl text-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl border border-white/50 overflow-hidden">
              {!isRegistered ? (
                <>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-6"
                  >
                    Why Print? Just Click, Sell & Earn!
                  </motion.h2>

                  <form onSubmit={handleRegister} className="space-y-6">
                    {/* Section: Personal */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Phone Number</label>
                          <input
                            type="text"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                            placeholder="Your phone number"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                          <label className="block text-sm mb-1 text-gray-600">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section: Organization */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Organization Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NID Number */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">NID Number</label>
                          <input
                            type="text"
                            name="nidNumber"
                            value={form.nidNumber}
                            onChange={handleChange}
                            required
                            placeholder="Your NID number"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.nidNumber && (
                            <p className="text-red-500 text-xs mt-1">{errors.nidNumber}</p>
                          )}
                        </div>

                        {/* Organization Name */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Organization Name</label>
                          <input
                            type="text"
                            name="organizationName"
                            value={form.organizationName}
                            onChange={handleChange}
                            required
                            placeholder="Organization name"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.organizationName && (
                            <p className="text-red-500 text-xs mt-1">{errors.organizationName}</p>
                          )}
                        </div>

                        {/* Organization Type */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Organization Type</label>
                          <input
                            type="text"
                            name="organizationType"
                            value={form.organizationType}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Non-Profit, Corporate"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.organizationType && (
                            <p className="text-red-500 text-xs mt-1">{errors.organizationType}</p>
                          )}
                        </div>

                        {/* Division */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Division</label>
                          <input
                            type="text"
                            name="division"
                            value={form.division}
                            onChange={handleChange}
                            required
                            placeholder="Division"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.division && (
                            <p className="text-red-500 text-xs mt-1">{errors.division}</p>
                          )}
                        </div>

                        {/* District */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">District</label>
                          <input
                            type="text"
                            name="district"
                            value={form.district}
                            onChange={handleChange}
                            required
                            placeholder="District"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.district && (
                            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                          )}
                        </div>

                        {/* Area */}
                        <div className="md:col-span-2">
                          <label className="block text-sm mb-1 text-gray-600">Area</label>
                          <input
                            type="text"
                            name="area"
                            value={form.area}
                            onChange={handleChange}
                            required
                            placeholder="Area / Thana / Locality"
                            className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                          {errors.area && (
                            <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section: Security */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Security</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={form.password}
                              onChange={handleChange}
                              required
                              placeholder="Create a password"
                              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                            >
                              {showPassword ? (
                                <FiEyeOff className="text-xl" />
                              ) : (
                                <FiEye className="text-xl" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                          )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-sm mb-1 text-gray-600">Confirm Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              required
                              placeholder="Confirm your password"
                              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <FiEyeOff className="text-xl" />
                              ) : (
                                <FiEye className="text-xl" />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={handleAgreeChange}
                        className="mt-1 h-5 w-5 rounded border-gray-300 bg-white"
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-700 leading-5">
                        I agree to the{" "}
                        <Link to="/terms" className="underline text-emerald-700">
                          Terms &amp; Conditions
                        </Link>
                        .
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-xs -mt-2">{errors.agreeTerms}</p>
                    )}

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
                    <Link to="/loginOrg" className="text-emerald-700 font-semibold underline">
                      Log In
                    </Link>
                  </p>
                </>
              ) : (
                // Verification message after registration
                <div className="text-center p-6 md:p-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-3xl font-bold mb-4 text-gray-900"
                  >
                    Verify your email
                  </motion.h2>
                  <p className="text-gray-700">
                    Please check your email inbox and click the verification link.
                  </p>
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
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Protected by industry-standard security. We never share your personal details without consent.
        </p>
      </div>
    </div>
  );
};

export default RegisterOrg;
