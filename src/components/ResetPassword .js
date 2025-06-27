
import React, { useState, useEffect } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oobCode = searchParams.get("oobCode");

  const isValidPassword = (password) => {
    // ✅ Example regex: at least 6 chars, one uppercase, one number
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidPassword(newPassword)) {
      toast.error("Password must be at least 6 characters, include 1 uppercase letter and 1 number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password has been reset!");
      // Optionally redirect to login
    } catch (err) {
      toast.error(err.message || "Password reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!oobCode) {
    return <p className="text-center mt-10">Invalid password reset link.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-8 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-white/20 text-white focus:outline-none"
            placeholder="New Password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-white/20 text-white focus:outline-none"
            placeholder="Confirm Password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
