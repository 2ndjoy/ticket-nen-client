import React, { useEffect, useMemo, useRef, useState } from "react";
import { auth } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const ticketRef = useRef(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("upcoming"); // 'all' | 'upcoming' | 'past'

  // ————— Helpers —————
  const formatMoney = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    });
  };

  const safeEvent = (b) =>
    b?.eventId && typeof b.eventId === "object"
      ? b.eventId
      : { title: "Event", subtitle: "", date: "", time: "", location: "" };

  const computeAmount = (b) => {
    if (typeof b?.amount === "number") return b.amount;
    const qty = Number(b?.quantity || 1);
    const unit = Number(b?.unitPrice || 0);
    return qty * unit;
  };

  // Parse a Date object that includes time if provided
  const getEventDateTime = (evt) => {
    if (!evt?.date) return null;
    const d = new Date(evt.date);
    if (isNaN(d)) return null;

    if (evt.time) {
      const parts = String(evt.time).split(":");
      const hh = parseInt(parts[0] || "0", 10);
      const mm = parseInt(parts[1] || "0", 10);
      d.setHours(hh, mm, 0, 0);
    } else {
      // Assume start of day if no time
      d.setHours(0, 0, 0, 0);
    }
    return d;
  };

  // Ticket ID: createdAt + _id suffix -> readable & stable
  const generateTicketId = (booking) => {
    const prefix = "TKT";
    const created = new Date(booking?.createdAt || Date.now());
    const y = created.getFullYear().toString().slice(-2);
    const m = String(created.getMonth() + 1).padStart(2, "0");
    const d = String(created.getDate()).padStart(2, "0");
    const hh = String(created.getHours()).padStart(2, "0");
    const mm = String(created.getMinutes()).padStart(2, "0");
    const seed = String(booking?._id || "").slice(-6).toUpperCase();
    return `${prefix}-${y}${m}${d}${hh}${mm}-${seed}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    if (isNaN(date)) return String(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Time TBA";
    const parts = String(timeString).split(":");
    const hours = parseInt(parts[0] || "0", 10);
    const minutes = parseInt(parts[1] || "0", 10);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ————— Auth listener —————
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // ————— Fetch bookings —————
  useEffect(() => {
    if (!user) return;

    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to load bookings (${res.status})`);
        }

        const data = await res.json();

        // Sort newest first by createdAt (fallback to _id time-ish)
        const sorted = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
            )
          : [];

        if (alive) setBookings(sorted);
      } catch (err) {
        console.error(err);
        if (alive) setError(err.message || "Failed to load bookings");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  // ————— Derived: filtered by tab —————
  const now = new Date();

  const filteredBookings = useMemo(() => {
    if (tab === "all") return bookings;

    return bookings.filter((b) => {
      const evt = safeEvent(b);
      const dt = getEventDateTime(evt);
      if (!dt) return tab === "past"; // if undated, treat as past to avoid blocking upcoming
      return tab === "upcoming" ? dt >= now : dt < now;
    });
  }, [bookings, tab]); // eslint-disable-line

  const counts = useMemo(() => {
    let upcoming = 0;
    let past = 0;
    bookings.forEach((b) => {
      const evt = safeEvent(b);
      const dt = getEventDateTime(evt);
      if (!dt) past += 1;
      else if (dt >= now) upcoming += 1;
      else past += 1;
    });
    return { all: bookings.length, upcoming, past };
  }, [bookings]); // eslint-disable-line

  // ————— Download ticket as PNG —————
  const downloadTicket = async (booking) => {
    setSelectedBooking(booking);

    // Wait for the ticket to render in the hidden container
    requestAnimationFrame(async () => {
      try {
        if (!ticketRef.current) return;

        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: false,
        });

        const link = document.createElement("a");
        const ticketId = generateTicketId(booking);
        const evt = safeEvent(booking);
        const fileTitle = String(evt.title || "ticket").replace(/\s+/g, "-");
        link.download = `ticket-${ticketId}-${fileTitle}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error("Error downloading ticket:", error);
        alert("Failed to download ticket. Please try again.");
      } finally {
        setTimeout(() => setSelectedBooking(null), 200);
      }
    });
  };

  const viewTicketDetails = (booking) => {
    const evt = safeEvent(booking);
    const msg = `Ticket Details:
Event: ${evt.title}
Date: ${formatDate(evt.date)}, ${formatTime(evt.time)}
Venue: ${evt.location || evt.venue || "-"}
Ticket Type: ${booking.ticketType || "-"}
Quantity: ${booking.quantity || 1}
Amount: ${formatMoney(computeAmount(booking))}
Booking ID: ${booking._id}`;
    alert(msg);
  };

  // ————— Render —————
  if (!user) {
    return (
      <p className="text-center mt-10 text-lg">
        Please login to see your bookings.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-56 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-72 mx-auto" />
          <div className="grid gap-6 mt-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0b7253] mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and download your event tickets</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[
          { key: "all", label: `All (${counts.all})` },
          { key: "upcoming", label: `Upcoming (${counts.upcoming})` },
          { key: "past", label: `Past (${counts.past})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "px-4 py-2 rounded-full text-sm font-semibold transition border",
              tab === key
                ? "bg-[#0b7253] text-white border-[#0b7253]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {tab === "upcoming"
              ? "No upcoming bookings"
              : tab === "past"
              ? "No past bookings"
              : "No bookings yet"}
          </h3>
          <p className="text-gray-500">
            {tab === "upcoming"
              ? "When you book an event in the future, it will show up here."
              : tab === "past"
              ? "Completed events you booked will show here."
              : "Book your first event to see tickets here!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {filteredBookings.map((booking) => {
            const evt = safeEvent(booking);
            const ticketId = generateTicketId(booking);
            const amount = computeAmount(booking);

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-[#0b7253] mb-2">
                            {evt.title}
                          </h2>
                          {evt.subtitle && (
                            <p className="text-gray-600 text-lg mb-3">
                              {evt.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Confirmed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Date
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(evt.date)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Time
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatTime(evt.time)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Venue
                          </p>
                          <p className="font-semibold text-gray-800">
                            {evt.venue || evt.location || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Type
                          </p>
                          <p className="font-semibold text-gray-800 capitalize">
                            {booking.ticketType || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Quantity
                          </p>
                          <p className="font-semibold text-gray-800">
                            {booking.quantity || 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Amount
                          </p>
                          <p className="font-semibold text-gray-800">
                            {formatMoney(amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide">
                            Ticket ID
                          </p>
                          <p className="font-semibold text-[#0b7253]">
                            {ticketId}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => downloadTicket(booking)}
                          className="bg-[#0b7253] text-white px-6 py-2 rounded-lg hover:bg-[#0a6247] transition duration-300 inline-flex items-center gap-2 font-semibold"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                          Download Ticket
                        </button>
                        <button
                          onClick={() => viewTicketDetails(booking)}
                          className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-300 inline-flex items-center gap-2 font-semibold"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center lg:w-48">
                      <div className="bg-white border-2 border-gray-200 p-3 rounded-lg shadow-sm">
                        <QRCodeCanvas
                          value={JSON.stringify({
                            ticketId,
                            bookingId: booking._id,
                            eventId: evt?._id,
                            eventTitle: evt?.title,
                            name: booking.name,
                            email: booking.email,
                            phoneNumber: booking.phoneNumber,
                            amount,
                            ticketType: booking.ticketType,
                            quantity: booking.quantity,
                            date: evt?.date,
                            time: evt?.time,
                            venue: evt?.venue || evt?.location,
                          })}
                          size={120}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-sm mt-2 text-center text-gray-600 font-medium">
                        Scan to verify
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden ticket for download */}
      {selectedBooking && (() => {
        const evt = safeEvent(selectedBooking);
        const ticketId = generateTicketId(selectedBooking);
        const amount = computeAmount(selectedBooking);

        return (
          <div className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none">
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
                  <span className="text-sm font-semibold tracking-wide">
                    EVENT TICKET
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2 leading-tight">
                  {evt.title}
                </h1>
                {evt.subtitle && (
                  <p className="text-lg opacity-90">{evt.subtitle}</p>
                )}
              </div>

              {/* Ticket Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
                {/* Event Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Date
                        </p>
                        <p className="font-semibold">{formatDate(evt.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Time
                        </p>
                        <p className="font-semibold">{formatTime(evt.time)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Venue
                        </p>
                        <p className="font-semibold">
                          {evt.venue || evt.location || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Attendee
                        </p>
                        <p className="font-semibold">{selectedBooking.name}</p>
                        <p className="text-sm opacity-90">
                          {selectedBooking.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Phone
                        </p>
                        <p className="font-semibold">
                          {selectedBooking.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Ticket ID
                        </p>
                        <p className="font-semibold text-lg text-yellow-200">
                          {ticketId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Amount Paid
                        </p>
                        <p className="font-semibold text-xl">
                          {formatMoney(amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Type
                        </p>
                        <p className="font-semibold capitalize">
                          {selectedBooking.ticketType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Quantity
                        </p>
                        <p className="font-semibold">
                          {selectedBooking.quantity}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm opacity-75 uppercase tracking-wide">
                          Booking ID
                        </p>
                        <p className="font-semibold text-xs opacity-75">
                          {selectedBooking._id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        ticketId,
                        bookingId: selectedBooking._id,
                        eventId: evt?._id,
                        eventTitle: evt?.title,
                        name: selectedBooking.name,
                        email: selectedBooking.email,
                        phoneNumber: selectedBooking.phoneNumber,
                        amount,
                        ticketType: selectedBooking.ticketType,
                        quantity: selectedBooking.quantity,
                        date: evt?.date,
                        time: evt?.time,
                        venue: evt?.venue || evt?.location,
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
          </div>
        );
      })()}
    </div>
  );
}
