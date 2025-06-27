// src/components/EmailVerification.jsx
import React from "react";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const user = auth.currentUser;

  const resendVerification = async () => {
    if (user) {
      try {
        await user.sendEmailVerification();
        toast.success("Verification email resent. Please check your inbox.");
      } catch (error) {
        toast.error("Failed to resend verification email.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-6 text-center max-w-md">
        We've sent a verification email to your inbox. Please click the link in
        that email to activate your account.
      </p>
      <button
        onClick={resendVerification}
        className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
      >
        Resend Verification Email
      </button>
    </div>
  );
};

export default EmailVerification;
