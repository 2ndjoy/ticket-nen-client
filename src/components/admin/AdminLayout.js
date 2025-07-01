import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Home, CalendarDays, BarChart3, Ticket, PieChartIcon } from "lucide-react";

export default function AdminLayout() {
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
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/admin-dashboard" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/admin/manage-events" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <CalendarDays size={18} /> Events
          </Link>
          <Link to="/admin/charts" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <BarChart3 size={18} /> Charts
          </Link>
          <Link to="/admin/tickets-sold" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <Ticket size={18} /> Tickets & Revenue
          </Link>
          <Link to="/admin/manage-users" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <PieChartIcon size={18} /> Manage Users
          </Link>
          <Link to="/admin/manage-organizers" className="flex items-center gap-2 hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>
            <PieChartIcon size={18} /> Manage Organizers
          </Link>
        </nav>
          <button
        className="md:hidden p-4 focus:outline-none bg-black border-white border text-white float-right mt-6"
        onClick={() => setSidebarOpen(!sidebarOpen)}
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
