import React from "react";
import { Link, Outlet } from "react-router-dom";
import { BarChart3, CalendarDays, Home, PieChart as PieChartIcon, Ticket } from "lucide-react";

export default function AdminLayout() {
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
          <Link to="/admin/tickets-sold" className="flex items-center gap-2 hover:text-yellow-300">
            <Ticket size={18} /> Tickets & Revenue
          </Link>
          <Link to="/admin/manage-users" className="flex items-center gap-2 hover:text-yellow-300">
            <PieChartIcon size={18} /> Manage Users
          </Link>
          <Link to="/admin/manage-organizers" className="flex items-center gap-2 hover:text-yellow-300">
            <PieChartIcon size={18} /> Manage Organizers
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
