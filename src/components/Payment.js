import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Calendar, Clock, MapPin, Star, Users } from 'lucide-react';
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [user, setUser] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const ticketRef = useRef(null);
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  // Generate unique ticket ID
  const generateTicketId = () => {
    const prefix = "TKT";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  // Listen to Firebase auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event details");
        const data = await res.json();
        setEvent(data);

        // Auto-fill amount
        if (data.price && data.price.toLowerCase() !== "free") {
          const numericPrice = parseInt(data.price.replace(/[^\d]/g, ""));
          setAmount(numericPrice);
        } else setAmount(0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  // Fetch suggested events
  useEffect(() => {
    const fetchSuggestedEvents = async () => {
      if (!event) return; // Wait until the main event is fetched

      try {
        const res = await fetch('http://localhost:5000/api/events');
        if (res.ok) {
          const data = await res.json();
          // Filter events by the same category, excluding the current event
          const filtered = data.filter(e => e.category === event.category && e._id !== id).slice(0, 5);
          setSuggestedEvents(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch suggested events:", err);
      }
    };
    fetchSuggestedEvents();
  }, [event, id]);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to complete the payment.");
      return;
    }
    if (!phoneNumber || amount === "") {
      alert("Please fill all fields.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          phoneNumber,
          amount,
          name: user.displayName,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      // Generate unique ticket ID
      const uniqueTicketId = generateTicketId();
      setTicketId(uniqueTicketId);
      
      setBookingData(data);
      setPaymentConfirmed(true);

      // Optional: redirect to My Bookings after 10 seconds to give time to download
      setTimeout(() => {
        navigate("/my-bookings");
      }, 10000);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });

      const link = document.createElement("a");
      link.download = `ticket-${ticketId}-${event.title.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#F1F1F1] to-[#F5F5F5] rounded-lg shadow-md mt-10 font-light font-serif">
      {event && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#0b7253]">
            Payment for {event.title}
          </h1>
          <p className="text-lg text-gray-700">{event.subtitle}</p>
        </div>
      )}

      <div className="bg-[#FBE5E5] p-4 rounded-lg mb-6 text-center">
        <h3 className="text-xl font-semibold text-[#0b7253]">
          Please complete the payment process to confirm your booking.
        </h3>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="mb-4 text-left">
          <label className="block text-lg font-semibold mb-2" htmlFor="phoneNumber">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full border-2 border-[#0b7253] rounded px-2 py-1 mb-4 focus:outline-none focus:ring-1 focus:ring-[#0b7253]"
          />
        </div>

        <div className="mb-4 text-left">
          <label className="block text-lg font-semibold mb-2" htmlFor="amount">
            Amount (BDT) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            readOnly
            className="w-full border-2 border-[#0b7253] rounded px-2 py-1 mb-4 focus:outline-none focus:ring-1 focus:ring-[#0b7253]"
          />
        </div>

        <button
          onClick={handlePayment}
          className="bg-[#0c8a64] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#0b7253] transition"
        >
          Confirm Payment
        </button>

        {paymentConfirmed && bookingData && (
          <div className="mt-8">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
              <h3 className="font-semibold text-xl">Payment Confirmed! 🎉</h3>
              <p>Your ticket has been generated. You can download it below.</p>
            </div>

            {/* Beautiful Ticket */}
            <div 
              ref={ticketRef}
              className="bg-gradient-to-br from-[#0b7253] to-[#ef8bb7] p-8 rounded-2xl shadow-2xl text-white mx-auto max-w-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #0b7253 0%, #ef8bb7 100%)`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/10 rounded-full"></div>
              
              {/* Ticket Header */}
              <div className="text-center mb-6 relative z-10">
                <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <span className="text-sm font-semibold tracking-wide">EVENT TICKET</span>
                </div>
                <h1 className="text-3xl font-bold mb-2 leading-tight">{event.title}</h1>
                <p className="text-lg opacity-90">{event.subtitle}</p>
              </div>

              {/* Ticket Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
                {/* Event Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Date</p>
                        <p className="font-semibold">{formatDate(event.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Time</p>
                        <p className="font-semibold">{formatTime(event.time)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm opacity-75 uppercase tracking-wide">Venue</p>
                        <p className="font-semibold">{event.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Attendee</p>
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-sm opacity-90">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Phone</p>
                        <p className="font-semibold">{phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Ticket ID</p>
                        <p className="font-semibold text-lg text-yellow-200">{ticketId}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">Amount Paid</p>
                        <p className="font-semibold text-xl">৳{amount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm opacity-75 uppercase tracking-wide">Booking ID</p>
                        <p className="font-semibold text-xs opacity-75">{bookingData._id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        ticketId: ticketId,
                        bookingId: bookingData._id,
                        eventId: event._id,
                        eventTitle: event.title,
                        name: user.displayName,
                        email: user.email,
                        phoneNumber,
                        amount,
                        date: event.date,
                        time: event.time,
                        venue: event.venue,
                        generatedAt: new Date().toISOString(),
                      })}
                      size={150}
                      level="H"
                      includeMargin={true}
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </div>
                  <p className="text-sm mt-2 opacity-90 text-center">
                    Scan for verification
                  </p>
                </div>
              </div>

              {/* Ticket Footer */}
              <div className="border-t border-white/20 pt-4 text-center text-sm opacity-75 relative z-10">
                <p>Present this ticket at the venue entrance</p>
                <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center mt-6">
              <button
                onClick={downloadTicket}
                className="bg-[#0b7253] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#c01456] transition shadow-lg inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Ticket
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Save your ticket for easy access at the event
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Events Section */}
      {suggestedEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">You Might Also Like</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {suggestedEvents.map((sEvent) => (
              <div key={sEvent._id} className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-40 overflow-hidden">
                  <img src={sEvent.image} alt={sEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {sEvent.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-md text-gray-800 mb-1 line-clamp-2">{sEvent.title}</h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{sEvent.subtitle}</p>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <Calendar className="w-3 h-3" /><span>{sEvent.date}</span>
                      <Clock className="w-3 h-3 ml-1" /><span>{sEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <MapPin className="w-3 h-3" /><span>{sEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1"><Users className="w-3 h-3 text-gray-500" /><span className="text-gray-600">{sEvent.attendees}</span></div>
                      <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-current" /><span className="text-gray-600">{sEvent.rating}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#0b7253] font-bold text-md">
                      {sEvent.price === "Free" ? "Free" : `Starts from ${sEvent.price}`}
                    </div>
                    <button
                      className="bg-[#0b7253] text-white font-semibold text-xs px-3 py-2 rounded-md"
                      onClick={() => navigate(`/events/${sEvent._id}`)}
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}