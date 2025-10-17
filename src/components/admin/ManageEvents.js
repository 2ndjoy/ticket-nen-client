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
          </tbody>
        </table>
      </div>
    </div>
  );
}
