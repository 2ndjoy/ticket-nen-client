import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart4, Users, CalendarDays } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

const MOCK_OVERVIEW = { totalEvents: 34, totalUsers: 542, ticketsSold: 1200 };
const MOCK_LINE = [
  { name: "Jan", events: 4 },
  { name: "Feb", events: 6 },
  { name: "Mar", events: 9 },
  { name: "Apr", events: 5 },
  { name: "May", events: 10 },
];
const MOCK_PIE = [
  { name: "Concerts", value: 400 },
  { name: "Sports", value: 300 },
  { name: "Theater", value: 200 },
];
const MOCK_TOP = [
  { title: "Rock Night", sold: 320 },
  { title: "Tech Summit", sold: 210 },
  { title: "Comedy Fest", sold: 180 },
  { title: "Startup Pitch", sold: 120 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(MOCK_OVERVIEW);
  const [lineData, setLineData] = useState(MOCK_LINE);
  const [pieData, setPieData] = useState(MOCK_PIE);
  const [topEvents, setTopEvents] = useState(MOCK_TOP);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ovRes, lineRes, pieRes, topRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/admin/metrics/overview`),
          fetch(`${API_BASE}/api/admin/metrics/events-by-month`),
          fetch(`${API_BASE}/api/admin/metrics/categories`),
          fetch(`${API_BASE}/api/admin/metrics/top-events?limit=8`),
        ]);

        if (!alive) return;

        if (ovRes.status === "fulfilled" && ovRes.value.ok) {
          const data = await ovRes.value.json();
          setOverview({
            totalEvents: data?.totalEvents ?? MOCK_OVERVIEW.totalEvents,
            totalUsers: data?.totalUsers ?? MOCK_OVERVIEW.totalUsers,
            ticketsSold: data?.ticketsSold ?? MOCK_OVERVIEW.ticketsSold,
          });
        }

        if (lineRes.status === "fulfilled" && lineRes.value.ok) {
          const data = await lineRes.value.json();
          setLineData(Array.isArray(data) && data.length ? data : MOCK_LINE);
        }

        if (pieRes.status === "fulfilled" && pieRes.value.ok) {
          const data = await pieRes.value.json();
          setPieData(Array.isArray(data) && data.length ? data : MOCK_PIE);
        }

        if (topRes.status === "fulfilled" && topRes.value.ok) {
          const data = await topRes.value.json();
          const normalized = Array.isArray(data)
            ? data.map((d) => ({ title: d.title, sold: Number(d.sold || 0) }))
            : [];
          setTopEvents(normalized.length ? normalized : MOCK_TOP);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        title: "Total Events",
        count: overview.totalEvents,
        icon: <CalendarDays className="text-indigo-600 w-8 h-8" strokeWidth={1.5} />,
        color: "bg-indigo-100",
      },
      {
        title: "Registered Users",
        count: overview.totalUsers,
        icon: <Users className="text-emerald-600 w-8 h-8" strokeWidth={1.5} />,
        color: "bg-emerald-100",
      },
      {
        title: "Tickets Sold",
        count: overview.ticketsSold,
        icon: <BarChart4 className="text-yellow-500 w-8 h-8" strokeWidth={1.5} />,
        color: "bg-yellow-100",
      },
    ],
    [overview]
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50 p-8">
      <motion.h1
        className="text-4xl font-extrabold text-gray-900 mb-10 select-none"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className={`${card.color} rounded-2xl p-8 shadow-md flex items-center space-x-6 hover:shadow-xl transition-shadow`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="p-3 rounded-full bg-white shadow">{card.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {loading ? (
                  <span className="inline-block h-6 w-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  card.count
                )}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nav Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {[
          { to: "/admin/manage-events", title: "Manage Events", description: "View, edit, or remove events.", borderColor: "border-indigo-600" },
          { to: "/admin/manage-users", title: "Manage Users", description: "See user list and activity.", borderColor: "border-emerald-600" },
          { to: "/admin/manage-organizers", title: "Manage Organizers", description: "Manage organizer profiles and roles.", borderColor: "border-red-500" },
        ].map(({ to, title, description, borderColor }, i) => (
          <Link
            key={i}
            to={to}
            className={`bg-white rounded-2xl p-6 shadow-md border-l-8 ${borderColor} hover:shadow-2xl transition-shadow`}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Events Over Time</h3>
          <div className="h-[320px]">
            {!loading && lineData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Event Categories</h3>
          <div className="h-[320px]">
            {!loading && pieData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">Top Events by Tickets Sold</h3>
          <div className="h-[360px]">
            {!loading && topEvents?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEvents.map((e) => ({ name: e.title, sold: e.sold }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
