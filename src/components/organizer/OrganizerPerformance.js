import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const performanceData = [
  { name: "Jan", tickets: 120, revenue: 24000 },
  { name: "Feb", tickets: 200, revenue: 40000 },
  { name: "Mar", tickets: 150, revenue: 30000 },
  { name: "Apr", tickets: 180, revenue: 36000 },
];

export default function OrganizerPerformance() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg font-medium">Total Tickets Sold</p>
          <p className="text-3xl font-bold mt-2">650</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg font-medium">Total Revenue</p>
          <p className="text-3xl font-bold mt-2"><b> ৳ </b> 133,000</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tickets" fill="#8884d8" name="Tickets Sold" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
