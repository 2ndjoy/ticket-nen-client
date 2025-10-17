<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../../utils/api";

export default function ManageEvents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/admin/events");
      setRows(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      setError(e.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    const prev = rows;
    setDeletingId(id);
    setRows(prev.filter(ev => (ev._id || ev.id) !== id));
    setError("");

    try {
      // matches DELETE /api/admin/events/:id in your backend
      await apiDelete(`/api/admin/events/${id}`);
    } catch (e) {
      setRows(prev); // rollback
      setError(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Events</h1>

      {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-gray-500">Loading…</td></tr>
            )}

            {!loading && rows.map(e => {
              const id = e._id || e.id;
              const dateTxt = e.date ? new Date(e.date).toLocaleDateString() : "—";
              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{e.title || "—"}</td>
                  <td className="px-4 py-2">{e.category || e.categoryName || "—"}</td>
                  <td className="px-4 py-2">{e.location || e.venue || "—"}</td>
                  <td className="px-4 py-2">{dateTxt}</td>
                  <td className="px-4 py-2">{e.status || "—"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      className={`px-3 py-1 rounded border text-red-700 border-red-200 bg-red-50 ${deletingId === id ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {deletingId === id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-gray-500">No events found.</td></tr>
            )}
=======
import React from "react";

const dummyEvents = [
  { id: 1, name: "Concert Night", organizer:"A",location: "Dhaka", date: "2025-07-10" },
  { id: 2, name: "Football Final",organizer:"A", location: "Chattogram", date: "2025-08-15" },
  { id: 3, name: "Drama Fest", organizer:"A",location: "Sylhet", date: "2025-09-05" },
];

export default function ManageEvents() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Event Name</th>
              <th className="px-6 py-3 font-medium">Organizer</th>
              
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{event.name}</td>
                <td className="px-6 py-4">{event.organizer}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4 space-x-2">
                  <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
>>>>>>> b0813ffeec7ec5e8809b33b759d38e33ad72dcb7
          </tbody>
        </table>
      </div>
    </div>
  );
}
