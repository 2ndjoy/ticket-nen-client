import React from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Ticket,
  BarChart3,
  Users,
  Star
} from "lucide-react";

export default function OrganizerDashboard() {
  const stats = [
    {
      title: "Total Events",
      value: 12,
      icon: <CalendarPlus className="text-blue-600 w-6 h-6" />,
      bg: "bg-blue-100"
    },
    {
      title: "Tickets Sold",
      value: 1200,
      icon: <Ticket className="text-green-600 w-6 h-6" />,
      bg: "bg-green-100"
    },
    {
      title: "Total Revenue",
      value: "৳ 18,000",
      icon: <BarChart3 className="text-purple-600 w-6 h-6" />,
      bg: "bg-purple-100"
    },
    {
      title: "Followers",
      value: 350,
      icon: <Users className="text-orange-600 w-6 h-6" />,
      bg: "bg-orange-100"
    },
    {
      title: "Avg. Rating",
      value: "4.5",
      icon: <Star className="text-yellow-500 w-6 h-6" />,
      bg: "bg-yellow-100"
    }
  ];

  return (
    <div className="p-6">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Organizer Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl shadow-md ${stat.bg} flex items-center gap-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {stat.icon}
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
