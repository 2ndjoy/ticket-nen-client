import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const ticketRef = useRef(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Fetch user bookings
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Generate unique ticket ID (same format as payment component)
  const generateTicketId = (bookingId) => {
    const prefix = "TKT";
    const timestamp = new Date(bookingId).getTime().toString().slice(-8);
    const random = bookingId.slice(-6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
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
    if (!timeString) return "Time TBA";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const downloadTicket = async (booking) => {
    setSelectedBooking(booking);
    
    // Wait for the ticket to render
    setTimeout(async () => {
      if (!ticketRef.current) return;

      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: false,
        });

        const link = document.createElement("a");
        const ticketId = generateTicketId(booking._id);
        link.download = `ticket-${ticketId}-${booking.eventId?.title.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        // Clear selected booking after download
        setTimeout(() => setSelectedBooking(null), 500);
      } catch (error) {
        console.error("Error downloading ticket:", error);
        alert("Failed to download ticket. Please try again.");
        setSelectedBooking(null);
      }
    }, 100);
  };

  const viewTicketDetails = (booking) => {
    // You can implement a modal or detailed view here
    alert(`Ticket Details:\nEvent: ${booking.eventId?.title}\nBooking ID: ${booking._id}\nAmount: BDT ${booking.amount || booking.eventId?.price}`);
  };

  if (!user)
    return <p className="text-center mt-10 text-lg">Please login to see your bookings.</p>;
  if (loading)
    return <p className="text-center mt-10 text-lg">Loading bookings...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0b7253] mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and download your event tickets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
          <p className="text-gray-500">Book your first event to see tickets here!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {bookings.map((booking) => (
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
                          {booking.eventId?.title}
                        </h2>
                        <p className="text-gray-600 text-lg mb-3">{booking.eventId?.subtitle}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Date</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(booking.eventId?.date)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Time</p>
                        <p className="font-semibold text-gray-800">
                          {formatTime(booking.eventId?.time)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Venue</p>
                        <p className="font-semibold text-gray-800">
                          {booking.eventId?.venue || booking.eventId?.location}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Tickets</p>
                        <p className="font-semibold text-gray-800">{booking.tickets || 1}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Amount</p>
                        <p className="font-semibold text-gray-800">
                          ৳{booking.amount || booking.eventId?.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Ticket ID</p>
                        <p className="font-semibold text-[#0b7253]">
                          {generateTicketId(booking._id)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Booking ID</p>
                        <p className="font-semibold text-gray-600 text-xs">
                          {booking._id}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => downloadTicket(booking)}
                        className="bg-[#0b7253] text-white px-6 py-2 rounded-lg hover:bg-[#c01456] transition duration-300 inline-flex items-center gap-2 font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download Ticket
                      </button>
                      <button
                        onClick={() => viewTicketDetails(booking)}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition duration-300 inline-flex items-center gap-2 font-semibold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
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
                          ticketId: generateTicketId(booking._id),
                          bookingId: booking._id,
                          eventId: booking.eventId?._id,
                          eventTitle: booking.eventId?.title,
                          name: booking.name,
                          email: booking.email,
                          phoneNumber: booking.phoneNumber,
                          amount: booking.amount || booking.eventId?.price,
                          date: booking.eventId?.date,
                          time: booking.eventId?.time,
                          venue: booking.eventId?.venue || booking.eventId?.location,
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
          ))}
        </div>
      )}

      {/* Hidden ticket for download (same design as payment component) */}
      {selectedBooking && (
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
                <span className="text-sm font-semibold tracking-wide">EVENT TICKET</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 leading-tight">{selectedBooking.eventId?.title}</h1>
              <p className="text-lg opacity-90">{selectedBooking.eventId?.subtitle}</p>
            </div>

            {/* Ticket Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 relative z-10">
              {/* Event Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Date</p>
                      <p className="font-semibold">{formatDate(selectedBooking.eventId?.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Time</p>
                      <p className="font-semibold">{formatTime(selectedBooking.eventId?.time)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm opacity-75 uppercase tracking-wide">Venue</p>
                      <p className="font-semibold">{selectedBooking.eventId?.venue || selectedBooking.eventId?.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Attendee</p>
                      <p className="font-semibold">{selectedBooking.name}</p>
                      <p className="text-sm opacity-90">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Phone</p>
                      <p className="font-semibold">{selectedBooking.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Ticket ID</p>
                      <p className="font-semibold text-lg text-yellow-200">{generateTicketId(selectedBooking._id)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75 uppercase tracking-wide">Amount Paid</p>
                      <p className="font-semibold text-xl">৳{selectedBooking.amount || selectedBooking.eventId?.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm opacity-75 uppercase tracking-wide">Booking ID</p>
                      <p className="font-semibold text-xs opacity-75">{selectedBooking._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      ticketId: generateTicketId(selectedBooking._id),
                      bookingId: selectedBooking._id,
                      eventId: selectedBooking.eventId?._id,
                      eventTitle: selectedBooking.eventId?.title,
                      name: selectedBooking.name,
                      email: selectedBooking.email,
                      phoneNumber: selectedBooking.phoneNumber,
                      amount: selectedBooking.amount || selectedBooking.eventId?.price,
                      date: selectedBooking.eventId?.date,
                      time: selectedBooking.eventId?.time,
                      venue: selectedBooking.eventId?.venue || selectedBooking.eventId?.location,
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
      )}
    </div>
  );
}