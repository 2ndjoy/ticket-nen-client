import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { NavLink } from "react-router-dom";

const ticketsByMonth = [
  { month: "Jan", ticketsSold: 400 },
  { month: "Feb", ticketsSold: 300 },
  { month: "Mar", ticketsSold: 500 },
  { month: "Apr", ticketsSold: 200 },
  { month: "May", ticketsSold: 700 },
  { month: "Jun", ticketsSold: 600 },
];

const revenueByCategory = [
  { category: "Concerts", revenue: 20000 },
  { category: "Sports", revenue: 15000 },
  { category: "Theater", revenue: 8000 },
  { category: "Tech", revenue: 12000 },
];


export default function Charts() {
  return (
    <div className="flex h-screen bg-gray-100">
 
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Charts</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tickets Sold Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Tickets Sold Over Months</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ticketsSold"
                  stroke="#8884d8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Revenue by Category ($)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
