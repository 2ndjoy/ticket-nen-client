// Payment.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { Calendar, Clock, MapPin, Star, Users } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [user, setUser] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const ticketRef = useRef(null);
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  // --- helpers (shared with PDF look/feel) ---
  const moneyBDT = (n) =>
    `৳${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? dateString
      : date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = (timeString || "00:00").split(":");
    const date = new Date();
    date.setHours(parseInt(hours || 0, 10), parseInt(minutes || 0, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // small presentational subcomponent to match PDF label/value rhythm
  function Info({ label, value, mono = false, accent = false }) {
    return (
      <div>
        <div className="text-[10px] tracking-widest font-semibold uppercase text-[#6B7280]">
          {label}
        </div>
        <div
          className={[
            "mt-1 text-[13px] md:text-sm",
            mono ? "font-mono" : "font-semibold",
            accent ? "text-[#0b7253]" : "text-[#111827]",
          ].join(" ")}
        >
          {String(value ?? "-")}
        </div>
      </div>
    );
  }

  // --- effects & data loading ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("type");
    if (t === "vip" || t === "regular") setTicketType(t);
  }, [location.search]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event details");
        const data = await res.json();
        setEvent(data);

        if (!ticketType) {
          const vip = Number(data.vipPrice || 0);
          const reg = Number(data.regularPrice || 0);
          if (vip > 0 && reg > 0) setTicketType(vip <= reg ? "vip" : "regular");
          else if (vip > 0) setTicketType("vip");
          else if (reg > 0) setTicketType("regular");
        }
      } catch (err) {
        console.error(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch suggested events (same category, excluding current)
  useEffect(() => {
    (async () => {
      if (!event) return;
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const filtered = data
          .filter((e) => e.category === event.category && e._id !== id)
          .slice(0, 5);
        setSuggestedEvents(filtered);
      } catch (err) {
        console.error("Failed to fetch suggested events:", err);
      }
    })();
  }, [event, id]);

  useEffect(() => {
    if (!event || !ticketType) return;
    const price =
      ticketType === "vip"
        ? Number(event.vipPrice || 0)
        : Number(event.regularPrice || 0);
    setAmount(price * quantity);
  }, [event, ticketType, quantity]);

  // --- quantity / inventory ---
  const availableForType = () => {
    if (!event || !ticketType) return 0;
    return ticketType === "vip"
      ? Number(event.vipTickets || 0)
      : Number(event.regularTickets || 0);
    };
  const clampQty = (q) => {
    const max = Math.max(0, availableForType());
    return Math.min(Math.max(1, q), Math.max(1, max));
  };

  // --- booking / ticketid ---
  const generateTicketId = () => {
    const prefix = "TKT";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to complete the payment.");
      return;
    }
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }
    if (!event || !ticketType) {
      alert("Please select a ticket type.");
      return;
    }

    const avail = availableForType();
    if (avail <= 0) {
      alert("Selected ticket type is sold out.");
      return;
    }
    const qty = clampQty(quantity);

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
          name: user.displayName,
          email: user.email,
          ticketType,
          quantity: qty,
          // amount computed server-side
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          alert("You already booked this event. Redirecting to My Bookings.");
          return navigate("/my-bookings");
        }
        if (res.status === 400 && data?.error?.toLowerCase().includes("insufficient")) {
          alert("Insufficient tickets available for your selected quantity.");
          return;
        }
        throw new Error(data.error || "Booking failed");
      }

      const uniqueTicketId = generateTicketId();
      setTicketId(uniqueTicketId);
      setBookingData(data.booking);
      setPaymentConfirmed(true);

      // update local inventory counts from server response
      if (data.event) setEvent(data.event);

      setTimeout(() => navigate("/my-bookings"), 10000);
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

  // Helper: show best starting price for suggested cards
  const getStartingPriceLabel = (e) => {
    const vip = Number(e.vipPrice);
    const reg = Number(e.regularPrice);
    const candidates = [vip, reg].filter((n) => Number.isFinite(n) && n > 0);
    if (candidates.length) return `Starts from ৳${Math.min(...candidates)}`;
    if (e.price === "Free" || Number(e.price) === 0) return "Free";
    if (e.price) return `Starts from ${e.price}`;
    return "Price not set";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-[#F1F1F1] to-[#F5F5F5] rounded-lg shadow-md mt-10 font-light font-serif">
      {event && (
        <>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#0b7253]">
              Payment for {event.title}
            </h1>
            <p className="text-lg text-gray-700">{event.subtitle}</p>
          </div>

          {/* Ticket selector */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold mb-2">Ticket Type</label>
                <select
                  value={ticketType || ""}
                  onChange={(e) => {
                    setTicketType(e.target.value);
                    setQuantity(1);
                  }}
                  className="w-full border-2 border-[#0b7253] rounded px-2 py-2"
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  {Number(event.vipPrice) > 0 && (
                    <option value="vip">
                      VIP — ৳{Number(event.vipPrice)} ({event.vipTickets} left)
                    </option>
                  )}
                  {Number(event.regularPrice) > 0 && (
                    <option value="regular">
                      Regular — ৳{Number(event.regularPrice)} ({event.regularTickets} left)
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={availableForType()}
                  value={quantity}
                  onChange={(e) => setQuantity(clampQty(Number(e.target.value) || 1))}
                  className="w-full border-2 border-[#0b7253] rounded px-2 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {availableForType()} available
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Total</label>
                <input
                  type="text"
                  readOnly
                  value={moneyBDT(amount)}
                  className="w-full border-2 border-[#0b7253] rounded px-2 py-2 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </>
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

        <button
          onClick={handlePayment}
          className="bg-[#0c8a64] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#0b7253] transition"
          disabled={!event || !ticketType}
        >
          Confirm Payment
        </button>

        {paymentConfirmed && bookingData && (
          <div className="mt-8">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
              <h3 className="font-semibold text-xl">Payment Confirmed! 🎉</h3>
              <p>Your ticket has been generated. You can download it below.</p>
              <p className="mt-2 text-sm text-gray-600">
                A copy of your ticket has been emailed to <b>{user?.email}</b>.
              </p>
            </div>

            {/* Unified Ticket (matches PDF design) */}
            <div
              ref={ticketRef}
              className="relative mx-auto max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,#0b7253 0%,#ef8bb7 100%)",
              }}
            >
              {/* soft blobs */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 bg-white/15 rounded-full" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 bg-white/15 rounded-full" />

              {/* content card */}
              <div className="relative z-10 p-7 md:p-8">
                {/* pill */}
                <div className="inline-flex -mt-3 mb-5">
                  <span
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider text-white"
                    style={{ background: "#ef8bb7" }}
                  >
                    EVENT TICKET
                  </span>
                </div>

                <div className="rounded-xl bg-white/95 backdrop-blur-sm p-5 md:p-6">
                  {/* header */}
                  <div className="text-center mb-5">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] leading-tight">
                      {event.title}
                    </h1>
                    {event.subtitle && (
                      <p className="mt-1 text-[13px] md:text-sm text-[#64748B]">
                        {event.subtitle}
                      </p>
                    )}
                  </div>

                  {/* divider */}
                  <div className="h-px w-full bg-[#E2E8F0] mb-5" />

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* left info column */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Info label="Date" value={formatDate(event.date)} />
                        <Info label="Time" value={formatTime(event.time)} />
                        <div className="col-span-2">
                          <Info label="Venue" value={event.location} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Info label="Attendee" value={user.displayName} />
                        <Info label="Phone" value={phoneNumber} />
                      </div>

                      <Info label="Email" value={user.email} />

                      <div className="grid grid-cols-3 gap-4">
                        <Info
                          label="Ticket Type"
                          value={String(bookingData.ticketType).toUpperCase()}
                        />
                        <Info label="Quantity" value={bookingData.quantity} />
                        <Info label="Amount Paid" value={moneyBDT(amount)} />
                      </div>

                      <Info label="Booking ID" value={bookingData._id} mono />
                      <Info label="Ticket ID" value={ticketId} mono accent />
                    </div>

                    {/* right QR panel */}
                    <div className="flex flex-col items-center">
                      <div className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col items-center">
                        <div className="bg-white rounded-lg p-3 shadow">
                          <QRCodeCanvas
                            value={JSON.stringify({
                              ticketId,
                              bookingId: bookingData._id,
                              eventId: event._id,
                              eventTitle: event.title,
                              name: user.displayName,
                              email: user.email,
                              phoneNumber,
                              amount,
                              ticketType: bookingData.ticketType,
                              quantity: bookingData.quantity,
                              date: event.date,
                              time: event.time,
                              venue: event.location,
                              generatedAt: new Date().toISOString(),
                            })}
                            size={150}
                            level="H"
                            includeMargin
                            fgColor="#000000"
                            bgColor="#ffffff"
                          />
                        </div>
                        <p className="mt-2 text-xs text-[#64748B]">Scan to verify</p>
                      </div>
                    </div>
                  </div>

                  {/* footer */}
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
                    <p className="text-[11px] text-[#64748B]">
                      Present this ticket at the venue entrance. Keep a digital copy as backup.
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#0b7253]">
                      Generated {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="text-center mt-6">
              <button
                onClick={downloadTicket}
                className="bg-[#0b7253] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#0a6b4c] transition shadow-lg inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
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
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            You Might Also Like
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {suggestedEvents.map((sEvent) => (
              <div
                key={sEvent._id}
                className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={sEvent.image}
                    alt={sEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {sEvent.category}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-md text-gray-800 mb-1 line-clamp-2">
                    {sEvent.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {sEvent.subtitle}
                  </p>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(sEvent.date)}</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{formatTime(sEvent.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{sEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{sEvent.attendees}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-gray-600">{sEvent.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[#0b7253] font-bold text-md">
                      {getStartingPriceLabel(sEvent)}
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
