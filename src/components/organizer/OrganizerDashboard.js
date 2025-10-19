import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  CalendarPlus,
  ListChecks,
  BarChart3,
  Gauge,
  Plus,
  ArrowRight,
} from "lucide-react";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function OrganizerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [totals, setTotals] = useState({
    ticketsSold: 0,
    capacity: 0,
    remaining: 0,
    revenue: 0,
    orders: 0,
    sellThrough: 0,
  });
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const token = await user.getIdToken();

        // metrics
        const mRes = await fetch(`${API_BASE}/api/organizers/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mRes.ok) throw new Error(await mRes.text());
        const m = await mRes.json();
        setTotals(m.totals || {});
        setEvents(m.events || []);

        // my-events (just to get a count)
        const eRes = await fetch(
          `${API_BASE}/api/organizers/my-events?page=1&limit=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!eRes.ok) throw new Error(await eRes.text());
        const e = await eRes.json();
        setTotalEvents(e?.total || 0);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Top events by revenue (limit 5)
  const topEvents = useMemo(() => {
    const copy = [...(events || [])];
    copy.sort((a, b) => (b.totals?.revenue || 0) - (a.totals?.revenue || 0));
    return copy.slice(0, 5);
  }, [events]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header + quick CTAs */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-gray-600">A quick look at your sales and events.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/organizer/add-event"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </Link>
          <Link
            to="/organizer/performance"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            View Performance <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Error / Loading */}
      {err && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}
      {loading && !err && (
        <div className="mb-6 rounded-lg border bg-white p-6">Loading…</div>
      )}

      {/* Stat cards */}
      {!loading && !err && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Events"
            value={totalEvents}
            icon={<CalendarPlus className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            title="Tickets Sold"
            value={totals.ticketsSold}
            icon={<ListChecks className="w-5 h-5 text-green-600" />}
          />
          <StatCard
            title="Revenue"
            value={"N/A"}
            icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
          />
          <StatCard
            title="Sell-through"
            value={"N/A"}
            icon={<Gauge className="w-5 h-5 text-rose-600" />}
          />
        </div>
      )}

      {/* Quick actions */}
      {!loading && !err && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/organizer/add-event"
                className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4 text-emerald-700" />
                  Create new event
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                to="/organizer/my-events"
                className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-700" />
                  Manage my events
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link
                to="/organizer/performance"
                className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  Performance & sales
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>

            {/* Capacity health */}
        
          </div>

          {/* Top events table */}
          <div className="lg:col-span-2 rounded-lg border bg-white p-4">
            <h3 className="text-lg font-semibold mb-3">Top Events (by revenue)</h3>
            {topEvents.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Event</th>
                      <th className="text-left p-3 font-semibold">Date</th>
                      <th className="text-left p-3 font-semibold">Sold</th>
                      <th className="text-left p-3 font-semibold">Remaining</th>
                      <th className="text-left p-3 font-semibold">Revenue</th>
                      <th className="text-left p-3 font-semibold">Sell-through</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEvents.map((ev) => (
                      <tr key={ev.eventId} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">{ev.title}</div>
                          <div className="text-xs text-gray-500">{ev.location}</div>
                        </td>
                        <td className="p-3">
                          {ev.date ? new Date(ev.date).toLocaleDateString() : "-"}
                          <div className="text-xs text-gray-500">{ev.time}</div>
                        </td>
                        <td className="p-3">{ev.totals.sold}</td>
                        <td className="p-3">{ev.totals.remaining}</td>
                        <td className="p-3">N/A</td>
                        <td className="p-3">N/A</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No sales yet. Share your event to start selling!" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-lg border bg-white p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
      {message}
    </div>
  );
}

