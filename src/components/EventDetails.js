// EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: ticket type selection
  const [ticketType, setTicketType] = useState(null);

  // Helpers (UI only; no functionality change)
  const formatMoney = (n) => {
    if (n === 0) return "Free";
    if (n === undefined || n === null || n === "") return "-";
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(num);
  };

  const toNumber = (v) => {
    if (v === null || v === undefined || v === "") return undefined;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      if (v.trim().toLowerCase() === "free") return 0;
      const m = v.match(/\d+(\.\d+)?/);
      return m ? Number(m[0]) : undefined;
    }
    return undefined;
  };

  const lowestPrice = (ev) => {
    const candidates = [
      ev?.vipPrice,
      ev?.regularPrice,
      ev?.price, // fallback to legacy price
    ]
      .map((v) => (v === "" ? undefined : Number(v)))
      .filter((v) => typeof v === "number" && !Number.isNaN(v) && v >= 0);
    if (!candidates.length) return undefined;
    return Math.min(...candidates);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data);

        // NEW: pick default ticket type based on available (cheapest among VIP/Regular)
        const vip = toNumber(data.vipPrice);
        const reg = toNumber(data.regularPrice);
        if (vip !== undefined && reg !== undefined) {
          setTicketType(vip <= reg ? "vip" : "regular");
        } else if (vip !== undefined) {
          setTicketType("vip");
        } else if (reg !== undefined) {
          setTicketType("regular");
        } else {
          setTicketType(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>No event found</div>;

  const fromPrice = lowestPrice(event);

  // NEW: navigate including selected ticket type if available
  const handleBookNow = () => {
    const base = `/payment/${event._id || event.id}`;
    const url =
      ticketType ? `${base}?type=${encodeURIComponent(ticketType)}` : base;
    navigate(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-6 sm:mt-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          {event.status && (
            <span
              className={[
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                event.status === "Published" && "bg-emerald-100 text-emerald-700",
                event.status === "Draft" && "bg-yellow-100 text-yellow-700",
                event.status === "Cancelled" && "bg-red-100 text-red-700",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {event.status}
            </span>
          )}
          {event.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
              {event.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{event.title}</h1>
        {event.subtitle && <p className="text-gray-600 mt-2">{event.subtitle}</p>}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: media + description */}
        <div className="lg:col-span-2">
          {/* Media */}
          <div className="overflow-hidden rounded-2xl shadow ring-1 ring-black/5">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>

          {/* Quick facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Date</p>
              <p className="mt-1 text-base font-semibold">{event.date || "-"}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Time</p>
              <p className="mt-1 text-base font-semibold">{event.time || "-"}</p>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-gray-500">Location</p>
              <p className="mt-1 text-base font-semibold break-words">
                {event.location || "-"}
              </p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">About this event</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Extra media */}
          {(event.imageUrl || event.videoUrl) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.imageUrl && (
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="font-semibold mb-2">Additional Image</h3>
                  <img
                    src={event.imageUrl}
                    alt="Additional"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                </div>
              )}
              {event.videoUrl && (
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="font-semibold mb-2">Promo Video</h3>
                  <a
                    className="text-[#128f8b] underline break-words"
                    href={event.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch video
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Organizer & engagement */}
          {(event.email || event.phone || event.attendees !== undefined || event.rating !== undefined) && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(event.email || event.phone) && (
                <div className="rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="font-semibold mb-2">Organizer Contact</h3>
                  <div className="space-y-1 text-gray-700">
                    {event.email && <p><span className="font-medium">Email:</span> {event.email}</p>}
                    {event.phone && <p><span className="font-medium">Phone:</span> {event.phone}</p>}
                  </div>
                </div>
              )}
 
            </div>
          )}
        </div>

        {/* Right: booking card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border bg-white p-5 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Tickets</h3>

            {/* Pricing rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">VIP</p>
                  {event.vipTickets !== undefined && (
                    <p className="text-xs text-gray-500">{event.vipTickets} available</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">{formatMoney(event.vipPrice)}</p>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Regular</p>
                  {event.regularTickets !== undefined && (
                    <p className="text-xs text-gray-500">{event.regularTickets} available</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold">{formatMoney(event.regularPrice)}</p>
                </div>
              </div>

              {/* Legacy "price" support */}
              {event.price !== undefined && (
                <>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">From</p>
                    <p className="text-base font-semibold">
                      {fromPrice !== undefined ? formatMoney(fromPrice) : String(event.price)}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* NEW: Ticket type selector (only shows if at least one tier exists) */}
            {(toNumber(event.vipPrice) !== undefined || toNumber(event.regularPrice) !== undefined) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Select ticket type</p>
                <div className="space-y-2">
                  {toNumber(event.vipPrice) !== undefined && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ticketType"
                        value="vip"
                        checked={ticketType === "vip"}
                        onChange={() => setTicketType("vip")}
                        className="h-4 w-4 text-[#128f8b] focus:ring-[#128f8b]"
                      />
                      <span className="text-sm">
                        VIP — {formatMoney(event.vipPrice)}
                      </span>
                    </label>
                  )}
                  {toNumber(event.regularPrice) !== undefined && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ticketType"
                        value="regular"
                        checked={ticketType === "regular"}
                        onChange={() => setTicketType("regular")}
                        className="h-4 w-4 text-[#128f8b] focus:ring-[#128f8b]"
                      />
                      <span className="text-sm">
                        Regular — {formatMoney(event.regularPrice)}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}

            <button
              className="mt-5 w-full bg-[#128f8b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
              onClick={handleBookNow}
            >
              Book Now
            </button>

            {/* Small print */}
            <p className="mt-3 text-xs text-gray-500">
              All sales are final unless the event is cancelled.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetails;
