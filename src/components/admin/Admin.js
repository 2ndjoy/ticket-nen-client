import React from "react";
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
import { Link } from "react-router-dom";
import { BarChart3, CalendarDays, Home, PieChart as PieChartIcon } from "lucide-react";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Admin() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/admin-dashboard" className="flex items-center gap-2 hover:text-yellow-300">
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/admin/manage-events" className="flex items-center gap-2 hover:text-yellow-300">
            <CalendarDays size={18} /> Events
          </Link>
          <Link to="/admin/charts" className="flex items-center gap-2 hover:text-yellow-300">
            <BarChart3 size={18} /> Charts
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Events Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="events" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Event Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
