import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  BarChart3,
  User,
  Pencil
} from "lucide-react";

export default function OrganizerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/organizer/organizer-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/organizer/add-event", label: "Add Event", icon: <PlusCircle size={18} /> },
    { to: "/organizer/my-events", label: "My Events", icon: <ListOrdered size={18} /> },
    { to: "/organizer/performance", label: "Performance", icon: <BarChart3 size={18} /> },
    { to: "/organizer/profile", label: "Profile", icon: <User size={18} /> },
    { to: "/organizer/edit-profile", label: "Edit Profile", icon: <Pencil size={18} /> },
  ];

  return (
    <div className="flex h-screen">
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
        <h1 className="text-2xl font-bold mb-6">Organizer Panel</h1>
        <nav className="flex flex-col space-y-4">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 hover:text-yellow-300 ${
                pathname === to ? "text-yellow-300 font-semibold" : ""
              }`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>
          <button
        className="md:hidden p-4 focus:outline-none bg-black border-white border text-white float-right mt-6"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
         Close 
      </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
