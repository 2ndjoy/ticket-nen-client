import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  BarChart3,
  User,
  Pencil,
} from "lucide-react";

export default function OrganizerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button - visible only on small screens */}
      <button
        className="md:hidden p-4 focus:outline-none bg-black text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-black text-white p-6 space-y-4
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col
        `}
      >
        <h1 className="text-2xl font-bold mb-4">Organizer Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/organizer/organizer-dashboard"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            to="/organizer/add-event"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <PlusCircle size={18} /> Add Event
          </Link>
          <Link
            to="/organizer/my-events"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <ListOrdered size={18} /> My Events
          </Link>
          <Link
            to="/organizer/performance"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart3 size={18} /> Performance
          </Link>
          <Link
            to="/organizer/profile"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <User size={18} /> Profile
          </Link>
          <Link
            to="/organizer/edit-profile"
            className="flex items-center gap-2 hover:text-yellow-300"
            onClick={() => setSidebarOpen(false)}
          >
            <Pencil size={18} /> Edit Profile
          </Link>
        </nav>

        {/* Close button - only on mobile */}
        <button
          className="md:hidden p-4 focus:outline-none bg-black border-white border text-white float-right mt-6"
          onClick={() => setSidebarOpen(false)}
        >
          Close
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
