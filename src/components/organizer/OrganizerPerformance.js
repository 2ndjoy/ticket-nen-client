import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function OrganizerPerformance() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");



  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsub();
  }, []);

  const fetchMetrics = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const token = await user.getIdToken();
      const params = new URLSearchParams();

      const res = await fetch(
        `${API_BASE}/api/organizers/metrics?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed (${res.status})`);
      }
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMetrics(); 
  }, [user]);

  const totals = metrics?.totals || {
    ticketsSold: 0,
    capacity: 0,
    remaining: 0,
    revenue: 0,
    orders: 0,
    sellThrough: 0,
  };

  const events = metrics?.events || [];

  const currency = (n) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(n || 0);



  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Ticket Availability & Sales</h1>
        <p className="text-gray-600">
          Track capacity, sell-through, and revenue across your events.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Tickets Sold
          </p>
          <p className="mt-1 text-2xl font-bold">{totals.ticketsSold}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Remaining
          </p>
          <p className="mt-1 text-2xl font-bold">{totals.remaining}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Revenue
          </p>
          <p className="mt-1 text-2xl font-bold">N/A</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Sell-through
          </p>
          <p className="mt-1 text-2xl font-bold">N/A</p>
        </div>
      </div>

      {/* Error/Loading */}
      {loading && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">Loading…</div>
      )}
      {error && !loading && (
        <div className="rounded-xl border bg-red-50 p-4 text-red-700 shadow-sm mb-4">
          {error}
        </div>
      )}

      {/* Events Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Event</th>
                <th className="text-left p-3 font-semibold">Date</th>
                <th className="text-left p-3 font-semibold">VIP</th>
                <th className="text-left p-3 font-semibold">Regular</th>
                <th className="text-left p-3 font-semibold">Sold / Capacity</th>
                <th className="text-left p-3 font-semibold">Revenue</th>
                <th className="text-left p-3 font-semibold">Sell-through</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.eventId} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-xs text-gray-500">{ev.location}</div>
                    <div className="text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 mt-1">
                      {ev.category}
                    </div>
                  </td>
                  <td className="p-3">
                    {ev.date ? new Date(ev.date).toLocaleDateString() : "-"}
                    <div className="text-xs text-gray-500">{ev.time}</div>
                  </td>

                  {/* VIP (no progress bar) */}
                  <td className="p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      Price: {currency(ev.vip.price ?? 0)}
                    </div>
                    <div className="text-xs text-gray-700">
                      {ev.vip.sold} / {ev.vip.capacity} (
                      {Math.max(0, (ev.vip.capacity || 0) - (ev.vip.sold || 0))}{" "}
                      left)
                    </div>
                  </td>

                  {/* Regular (no progress bar) */}
                  <td className="p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      Price: {currency(ev.regular.price ?? 0)}
                    </div>
                    <div className="text-xs text-gray-700">
                      {ev.regular.sold} / {ev.regular.capacity} (
                      {Math.max(
                        0,
                        (ev.regular.capacity || 0) - (ev.regular.sold || 0)
                      )}{" "}
                      left)
                    </div>
                  </td>

                  {/* Totals */}
                  <td className="p-3">
                    <div className="font-medium">
                      {ev.totals.sold} / {ev.totals.capacity}
                    </div>
                    <div className="text-xs text-gray-600">
                      {ev.totals.remaining} remaining
                    </div>
                  </td>

                  <td className="p-3">N/A</td>
                  <td className="p-3">N/A</td>
                </tr>
              ))}

              {events.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No events found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
