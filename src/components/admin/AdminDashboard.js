// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart4, Users, CalendarDays } from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Tooltip, XAxis, YAxis,
  CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { apiGet } from "../../utils/api";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

function asArray(x) {
  return Array.isArray(x) ? x : [];
}

function normalizeCategories(input) {
  const arr = asArray(input);
  // Accept shapes like: {name,value} OR {_id,count} OR {label,total}
  return arr.map((c, i) => ({
    name: String(c?.name ?? c?._id ?? c?.label ?? `Cat ${i + 1}`),
    value: Number(c?.value ?? c?.count ?? c?.total ?? 0),
  }));
}

function normalizeTopEvents(input) {
  const arr = asArray(input);
  return arr.map((t, i) => ({
    title: String(t?.title ?? t?.name ?? `Event ${i + 1}`),
    sold: Number(t?.sold ?? t?.tickets ?? t?.count ?? 0),
  }));
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ totalEvents: 0, totalUsers: 0, ticketsSold: 0 });
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);       // always array
  const [topEvents, setTopEvents] = useState([]);   // always array

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ov, monthly, cats, top] = await Promise.all([
          apiGet("/api/admin/metrics/overview").catch(() => ({ totalEvents: 0, totalUsers: 0, ticketsSold: 0 })),
          apiGet("/api/admin/metrics/events-by-month").catch(() => []),
          apiGet("/api/admin/metrics/categories").catch(() => []),
          apiGet("/api/admin/metrics/top-events?limit=8").catch(() => []),
        ]);
        if (!alive) return;

        setOverview(
          ov && typeof ov === "object"
            ? {
                totalEvents: Number(ov.totalEvents ?? 0),
                totalUsers: Number(ov.totalUsers ?? 0),
                ticketsSold: Number(ov.ticketsSold ?? 0),
              }
            : { totalEvents: 0, totalUsers: 0, ticketsSold: 0 }
        );

        setLineData(asArray(monthly));

        // 🔧 normalize to [{name, value}]
        setPieData(normalizeCategories(cats));

        // 🔧 normalize top events to [{title, sold}]
        setTopEvents(normalizeTopEvents(top));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
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

  const safePie = asArray(pieData);
  const safeTop = asArray(topEvents);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`${card.color} rounded-2xl p-8 shadow-md flex items-center space-x-6 hover:shadow-xl transition`}
          >
            <div className="p-3 rounded-full bg-white shadow">{card.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {loading ? <span className="inline-block h-6 w-16 bg-gray-200 rounded animate-pulse" /> : card.count}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {[
          { to: "/admin/manage-events", title: "Manage Events", description: "View, edit, or remove events.", border: "border-indigo-600" },
          { to: "/admin/manage-users", title: "Manage Users", description: "See user list and activity.", border: "border-emerald-600" },
          { to: "/admin/manage-organizers", title: "Manage Organizers", description: "Approve/suspend organizers.", border: "border-red-500" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`bg-white rounded-2xl p-6 shadow-md border-l-8 ${item.border} hover:shadow-2xl transition`}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Events Over Time</h3>
          <div className="h-[320px]">
            {loading ? (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={asArray(lineData)}>
                  <CartesianGrid stroke="#eee" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4">Event Categories</h3>
          <div className="h-[320px]">
            {loading ? (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={safePie} dataKey="value" nameKey="name" outerRadius={100} label>
                    {safePie.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-md lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">Top Events by Tickets Sold</h3>
          <div className="h-[360px]">
            {loading ? (
              <div className="h-full w-full bg-gray-100 rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeTop.map((e) => ({ name: e.title, sold: Number(e.sold || 0) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
