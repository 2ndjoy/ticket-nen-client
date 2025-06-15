import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart4, Users, CalendarDays } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const lineData = [
  { name: "Jan", events: 4 },
  { name: "Feb", events: 6 },
  { name: "Mar", events: 9 },
  { name: "Apr", events: 5 },
  { name: "May", events: 10 },
];

const pieData = [
  { name: "Concerts", value: 400 },
  { name: "Sports", value: 300 },
  { name: "Theater", value: 200 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B"];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50 p-8">
      {/* Header */}
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
        {[
          {
            title: "Total Events",
            count: 34,
            icon: (
              <CalendarDays className="text-indigo-600 w-8 h-8" strokeWidth={1.5} />
            ),
            color: "bg-indigo-100",
          },
          {
            title: "Registered Users",
            count: 542,
            icon: <Users className="text-emerald-600 w-8 h-8" strokeWidth={1.5} />,
            color: "bg-emerald-100",
          },
          {
            title: "Tickets Sold",
            count: 1200,
            icon: (
              <BarChart4 className="text-yellow-500 w-8 h-8" strokeWidth={1.5} />
            ),
            color: "bg-yellow-100",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`${card.color} rounded-2xl p-8 shadow-md flex items-center space-x-6 cursor-default
              hover:shadow-xl transition-shadow duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="p-3 rounded-full bg-white shadow">{card.icon}</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{card.count}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Links */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[
          {
            to: "/admin/manage-events",
            title: "Manage Events",
            description: "View, edit, or remove events.",
            borderColor: "border-indigo-600",
          },
          {
            to: "/admin/manage-users",
            title: "Manage Users",
            description: "See user list and activity.",
            borderColor: "border-emerald-600",
          },
          {
            to: "/admin/manage-organizers",
            title: "Manage Organizers",
            description: "Manage organizer profiles and roles.",
            borderColor: "border-red-500",
          },
        ].map(({ to, title, description, borderColor }, i) => (
          <Link
            key={i}
            to={to}
            className={`bg-white rounded-2xl p-6 shadow-md border-l-8 ${borderColor}
              hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center`}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </Link>
        ))}
      </motion.div>

      {/* Charts Section */}
      <main className="bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 select-none">
          Insights & Analytics
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Line Chart */}
          <section className="p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-5 text-gray-800 select-none">
              Events Over Time
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontWeight: "600" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontWeight: "600" }}
                  axisLine={{ stroke: "#d1d5db" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fafafa", borderRadius: 6, border: "none" }}
                  itemStyle={{ color: "#4F46E5", fontWeight: "700" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Pie Chart */}
          <section className="p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-5 text-gray-800 select-none">
              Event Categories
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#fafafa", borderRadius: 6, border: "none" }}
                  itemStyle={{ fontWeight: "600" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </div>
      </main>
    </div>
  );
}
