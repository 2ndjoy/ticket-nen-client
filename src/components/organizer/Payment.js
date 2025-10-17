import React, { useEffect, useState } from "react";

export default function Payment() {
  const [eventData, setEventData] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const storedEvent = localStorage.getItem("pendingEvent");
    if (storedEvent) {
      setEventData(JSON.parse(storedEvent));
    }
  }, []);

  const handlePaymentConfirm = async () => {
    if (!eventData) return;

    setProcessing(true);

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to save event.");

      alert("✅ Payment successful! Event published.");
      localStorage.removeItem("pendingEvent");
      window.location.href = "/myevents";
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while saving event.");
    } finally {
      setProcessing(false);
    }
  };

  if (!eventData) {
    return <p className="text-center mt-10">No event found. Please create an event first.</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Payment</h1>
      <p className="mb-4 text-gray-700">
        You are about to pay the <strong>platform fee</strong> for publishing your event:
      </p>
      <p className="mb-4 font-semibold">{eventData.title}</p>

      <button
        onClick={handlePaymentConfirm}
        disabled={processing}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        {processing ? "Processing..." : "Confirm Payment"}
      </button>
    </div>
  );
}
