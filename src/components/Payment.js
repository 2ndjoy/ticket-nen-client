import React, { useState } from "react";

export default function Payment() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handlePayment = () => {
    if (phoneNumber && amount) {
      setPaymentConfirmed(true);
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#F1F1F1] to-[#F5F5F5] rounded-lg shadow-md mt-10 font-light font-serif">
      {/* New Section with Details */}
      <div className="bg-[#FBE5E5] p-4 rounded-lg mb-6 text-center">
        <h3 className="text-xl font-semibold text-[#de166e]">
          To Activate your Promotion, please complete the payment process with platform fee 99/- BDT.
        </h3>
        <p className="text-lg mt-2">This payment will complete the promotion process and activate your event on our platform.</p>
      </div>

      <div className="bg-gradient-to-r from-[#de166e] to-[#de166e] text-white p-6 rounded-lg shadow-md mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
        <p className="mb-4">
          Please proceed with the payment to complete your registration. Below is your payment
          information.
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center text-[#de166e]">Payment via Bkash</h1>

      <div className="bg-white p-4 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Bkash Payment</h2>
        <p className="mb-4 text-lg">
          To complete your payment, please use the following details:
        </p>

        <div className="mb-6 text-left">
          <div className="mb-4">
            {/* Phone Number Input */}
            <label className="block text-lg font-semibold text-left mb-2" htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border-2 border-[#de166e] rounded px-2 py-1 mb-3 focus:outline-none focus:ring-1 focus:ring-[#de166e] focus:border-[#de166e]"
            />
          </div>

          <div className="mb-4">
            {/* Amount Input */}
            <label className="block text-lg font-semibold text-left mb-2" htmlFor="amount">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay (in BDT)"
              className="w-full border-2 border-[#de166e] rounded px-2 py-1 mb-4 focus:outline-none focus:ring-1 focus:ring-[#de166e] focus:border-[#de166e]"
            />
          </div>

          {/* Payment Confirmation Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePayment}
              className="bg-[#ef8bb7] text-white font-semibold py-3 px-8 rounded-lg mt-4 hover:bg-[#de166e] transition"
            >
              Confirm Payment
            </button>
          </div>
        </div>

        {paymentConfirmed && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg">
            <h3 className="font-semibold">Payment Confirmation</h3>
            <p>Your payment of BDT {amount} has been successfully confirmed. Please check your Bkash app for further details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
