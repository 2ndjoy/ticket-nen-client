import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../../utils/api";

const fallbackEvents = [
  { id: "1", title: "Concert Night", category: "Music", location: "Dhaka", date: "2025-07-10", status: "draft" },
  { id: "2", title: "Football Final", category: "Sports", location: "Chattogram", date: "2025-08-15", status: "published" },
  { id: "3", title: "Drama Fest", category: "Theatre", location: "Sylhet", date: "2025-09-05", status: "archived" },
];

export default function ManageEvents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/events");
      // backend may return array or {items:[]}
      const list = Array.isArray(data) ? data : data?.items || [];
      if (!Array.isArray(list) || list.length === 0) {
        // show fallback if empty
        setRows(fallbackEvents);
      } else {
        setRows(list);
      }
    } catch (e) {
      setError(e?.message || "Failed to load events (showing sample data)");
      setRows(fallbackEvents); // fallback on failure
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    const prev = rows;
    setDeletingId(id);
    setRows(prev.filter((ev) => (ev._id || ev.id) !== id));
    setError("");

    try {
      // matches DELETE /api/admin/events/:id in your backend
      await apiDelete(`/api/events/${id}`);
    } catch (e) {
      setRows(prev); // rollback on failure
      setError(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Events</h1>

      {error && (
        <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

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
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-500">
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((e) => {
                const id = e._id || e.id;
                const dateTxt = e.date ? new Date(e.date).toLocaleDateString() : "—";
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-2">{e.title || e.name || "—"}</td>
                    <td className="px-4 py-2">{e.category || e.categoryName || "—"}</td>
                    <td className="px-4 py-2">{e.location || e.venue || "—"}</td>
                    <td className="px-4 py-2">{dateTxt}</td>
                    <td className="px-4 py-2">{e.status || "—"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        className={`px-3 py-1 rounded border text-red-700 border-red-200 bg-red-50 ${
                          deletingId === id ? "opacity-60 cursor-not-allowed" : "hover:bg-red-100"
                        }`}
                      >
                        {deletingId === id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
