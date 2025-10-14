import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Ticket,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Plus,
  ListChecks,
  Gauge,
} from "lucide-react";
import { auth } from "../../firebase";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";

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

        // my-events (for count)
        const eRes = await fetch(
          `${API_BASE}/api/organizers/my-events?page=1&limit=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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

  const currency = (n) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const sellPct = (n) =>
    `${Number.isFinite(n) ? Number(n).toFixed(1) : "0.0"}%`;

  // Chart data: per-event sold vs remaining
  const chartData = useMemo(() => {
    const MAX = 12; // keep readable
    return (events || []).slice(0, MAX).map((ev) => ({
      name: truncate(ev.title, 14),
      Sold: ev.totals?.sold || 0,
      Remaining: ev.totals?.remaining || 0,
    }));
  }, [events]);

  // Top events by revenue (or sell-through as fallback)
  const topEvents = useMemo(() => {
    const copy = [...(events || [])];
    copy.sort((a, b) => (b.totals?.revenue || 0) - (a.totals?.revenue || 0));
    return copy.slice(0, 6);
  }, [events]);

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: <CalendarPlus className="text-blue-600 w-6 h-6" />,
      bg: "bg-blue-100",
    },
    {
      title: "Tickets Sold",
      value: totals.ticketsSold,
      icon: <Ticket className="text-green-600 w-6 h-6" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: currency(totals.revenue),
      icon: <BarChart3 className="text-purple-600 w-6 h-6" />,
      bg: "bg-purple-100",
    },
    {
      title: "Sell-through",
      value: sellPct(totals.sellThrough),
      icon: <Gauge className="text-rose-600 w-6 h-6" />,
      bg: "bg-rose-100",
    },
    // Optional/placeholder tiles you had:
    {
      title: "Followers",
      value: 0,
      icon: <Users className="text-orange-600 w-6 h-6" />,
      bg: "bg-orange-100",
    },
    {
      title: "Avg. Rating",
      value: "—",
      icon: <Star className="text-yellow-500 w-6 h-6" />,
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        className="flex items-center justify-between gap-3 mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-gray-600">
            At-a-glance revenue, sales, and availability.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/organizer/add-event"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 shadow hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </Link>
          <Link
            to="/organizer/performance"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            View Performance
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Error / Loading */}
      {err && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      )}
      {loading && !err && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          Loading…
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !err && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              className={`p-5 rounded-xl shadow-sm ${stat.bg} flex items-center gap-4`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {stat.icon}
              <div>
                <p className="text-gray-600 text-xs uppercase tracking-wide">
                  {stat.title}
                </p>
                <h2 className="text-xl font-bold">{stat.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content grid */}
      {!loading && !err && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart: Sold vs Remaining by Event */}
          <div className="lg:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Sales & Availability by Event</h3>
              <button
                onClick={() => navigate("/organizer/performance")}
                className="text-sm text-emerald-700 hover:underline"
              >
                Open Performance
              </button>
            </div>
            {chartData.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} stackOffset="sign">
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Sold" stackId="a" />
                    <Bar dataKey="Remaining" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No events to chart yet." />
            )}
            <p className="text-xs text-gray-500 mt-2">
              Showing up to 12 events. Go to Performance for full details.
            </p>
          </div>

          {/* Quick Actions / Health */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
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

            <div className="mt-6 rounded-lg border p-3">
              <p className="text-sm text-gray-700 mb-2">
                Capacity health
              </p>
              <HealthBar sold={totals.ticketsSold} cap={totals.capacity} />
              <div className="mt-1 text-xs text-gray-600">
                {totals.ticketsSold} sold / {totals.capacity} capacity —{" "}
                <span className="font-medium">{sellPct(totals.sellThrough)}</span>
              </div>
            </div>
          </div>

          {/* Top Events */}
          <div className="lg:col-span-3 rounded-xl border bg-white p-4 shadow-sm">
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
                        <td className="p-3">{currency(ev.totals.revenue)}</td>
                        <td className="p-3">{sellPct(ev.totals.sellThrough)}</td>
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

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
      {message}
    </div>
  );
}

function HealthBar({ sold = 0, cap = 0 }) {
  const pct = cap > 0 ? Math.min(100, Math.max(0, (sold / cap) * 100)) : 0;
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
    </div>
  );
}
