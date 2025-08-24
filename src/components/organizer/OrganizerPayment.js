import React, { useEffect, useState } from "react";

export default function OrganizerPayment() {
  const [eventData, setEventData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [platformFee] = useState(500); // fixed fee in BDT
  const [bkashNumber, setBkashNumber] = useState("");

  useEffect(() => {
    // Retrieve pending event from localStorage
    const storedEvent = localStorage.getItem("pendingEvent");
    if (storedEvent) {
      setEventData(JSON.parse(storedEvent));
    }
  }, []);

  const handlePaymentConfirm = async () => {
    if (!eventData) return;

    if (!bkashNumber) {
      alert("Please enter your bKash number.");
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...eventData, 
          platformFee, 
          bkashNumber 
        }),
      });

      if (!res.ok) throw new Error("Failed to save event.");

      alert("✅ Payment successful! Your event has been published.");
      localStorage.removeItem("pendingEvent");
      window.location.href = "/myevents"; // redirect after saving
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while saving event.");
    } finally {
      setProcessing(false);
    }
  };

  if (!eventData) {
    return (
      <p className="text-center mt-10">
        No event found. Please create an event first.
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Organizer Payment
      </h1>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-4">
        <p className="text-gray-700 mb-2">
          <strong>Event:</strong> {eventData.title}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {eventData.date}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {eventData.location}
        </p>
        <p className="text-gray-700">
          <strong>Organizer Email:</strong> {eventData.email}
        </p>
      </div>

      {/* Platform Fee */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-700">
          Platform Fee (BDT)
        </label>
        <input
          type="number"
          value={platformFee}
          readOnly
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* bKash Number */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-700">
          bKash Number
        </label>
        <input
          type="text"
          value={bkashNumber}
          onChange={(e) => setBkashNumber(e.target.value)}
          placeholder="Enter your bKash number"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <p className="mb-4 text-gray-600 text-center">
        You are about to pay the <strong>platform fee</strong> to publish your
        event.
      </p>

      <button
        onClick={handlePaymentConfirm}
        disabled={processing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
      >
        {processing ? "Processing..." : `Pay ${platformFee} BDT & Confirm`}
      </button>
    </div>
  );
}
