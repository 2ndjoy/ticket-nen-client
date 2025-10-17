import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../utils/api"; // uses the generic helper you added

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function formatBDT(n) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n || 0);
}

export default function TicketsSold() {
  const [rows, setRows] = useState([]);         // merged + computed rows for table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load bookings + events and merge
  async function load() {
    setLoading(true);
    setError("");
    try {
      // Fetch both in parallel
      const [bookingsRes, eventsRes] = await Promise.all([
        apiGet("/api/admin/bookings"),
        apiGet("/api/admin/events"),
      ]);

      const bookings = Array.isArray(bookingsRes) ? bookingsRes : bookingsRes.items || [];
      const events = Array.isArray(eventsRes) ? eventsRes : eventsRes.items || [];

      // index events by _id for quick lookup
      const eventById = new Map(
        events.map((ev) => [String(ev._id || ev.id), ev])
      );

      // Merge + compute
      const enriched = bookings.map((b) => {
        const evId = String(b.eventId || b._id || ""); // depends on your Booking schema
        const ev = eventById.get(evId) || {};

        const ticketsSold = b.quantity ?? b.ticketsSold ?? 0;

        // prefer booking price if present, else event's regularPrice (or vipPrice if you want)
        const pricePerTicket =
          b.pricePerTicket ??
          b.ticketPrice ??
          ev.regularPrice ??
          ev.vipPrice ??
          0;

        const revenue = Number(ticketsSold) * Number(pricePerTicket);

        return {
          id: String(b._id || `${evId}-${b.createdAt || Math.random()}`),
          eventName: ev.title || b.eventName || "—",
          ticketsSold,
          pricePerTicket,
          revenue,
          date: b.createdAt || ev.date || null,
        };
      });

      setRows(enriched);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => {
          acc.tickets += Number(r.ticketsSold || 0);
          acc.revenue += Number(r.revenue || 0);
          return acc;
        },
        { tickets: 0, revenue: 0 }
      ),
    [rows]
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6 md:p-10 overflow-auto max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Total Tickets Sold & Revenue</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 transition text-sm"
              title="Reload data"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {/* Overview Card */}
        <div className="mb-6 p-6 bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">Overall Revenue</h3>
              <p className="text-sm text-gray-500">Sum of all bookings</p>
            </div>
            <div className="text-3xl font-extrabold text-green-600">
              {formatBDT(totals.revenue)}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border-b px-4 py-3 text-left">Event Name</th>
                <th className="border-b px-4 py-3 text-right">Tickets Sold</th>
                <th className="border-b px-4 py-3 text-right">
                  Ticket Price <span className="font-semibold">৳</span>
                </th>
                <th className="border-b px-4 py-3 text-right">
                  Revenue <span className="font-semibold">৳</span>
                </th>
                <th className="border-b px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No data found.
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map(({ id, eventName, ticketsSold, pricePerTicket, revenue, date }) => (
                  <tr key={id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{eventName}</td>
                    <td className="px-4 py-3 text-right font-semibold">{ticketsSold}</td>
                    <td className="px-4 py-3 text-right">{formatBDT(pricePerTicket)}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      {formatBDT(revenue)}
                    </td>
                    <td className="px-4 py-3">{formatDate(date)}</td>
                  </tr>
                ))}

              {/* Totals row */}
              {!loading && rows.length > 0 && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3 text-right">Totals:</td>
                  <td className="px-4 py-3 text-right">{totals.tickets}</td>
                  <td className="px-4 py-3 text-right">—</td>
                  <td className="px-4 py-3 text-right text-green-700">
                    {formatBDT(totals.revenue)}
                  </td>
                  <td className="px-4 py-3">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
