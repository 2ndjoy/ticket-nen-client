import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart4, Users, CalendarDays } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Total Events",
            count: 34,
            icon: <CalendarDays className="text-blue-600 w-6 h-6" />,
            color: "bg-blue-100",
          },
          {
            title: "Registered Users",
            count: 542,
            icon: <Users className="text-green-600 w-6 h-6" />,
            color: "bg-green-100",
          },
          {
            title: "Tickets Sold",
            count: 1200,
            icon: <BarChart4 className="text-purple-600 w-6 h-6" />,
            color: "bg-purple-100",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            className={`rounded-xl p-6 shadow-md ${card.color} hover:shadow-lg transition`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="flex items-center space-x-4">
              {card.icon}
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <h3 className="text-2xl font-semibold">{card.count}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Links */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          to="/admin/manage-events"
          className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition border-l-4 border-blue-500"
        >
          <h2 className="text-xl font-bold mb-2">Manage Events</h2>
          <p className="text-gray-600">View, edit, or remove events.</p>
        </Link>
        <Link
          to="/admin/manage-users"
          className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition border-l-4 border-green-500"
        >
          <h2 className="text-xl font-bold mb-2">Manage Users</h2>
          <p className="text-gray-600">See user list and activity.</p>
        </Link>
        <Link
          to="/admin/manage-organizers"
          className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition border-l-4 border-green-500"
        >
          <h2 className="text-xl font-bold mb-2">Manage Organizers</h2>
          <p className="text-gray-600">See user list and activity.</p>
        </Link>
      </motion.div>
    </div>
  );
}
