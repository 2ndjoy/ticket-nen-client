import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../../utils/api";

export default function ManageOrganizers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/admin/organizers");
      setRows(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      setError(e.message || "Failed to load organizers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm("Delete this organizer?")) return;

    const prev = rows;
    setDeletingId(id);
    setRows(prev.filter(o => (o._id || o.id) !== id));
    setError("");

    try {
      await apiDelete(`/api/admin/organizers/${id}`);
    } catch (e) {
      setRows(prev); // rollback
      setError(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Organizers</h1>

      {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-gray-500">Loading…</td></tr>
            )}

            {!loading && rows.map(o => {
              const id = o._id || o.id;
              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{o.name || o.fullName || "—"}</td>
                  <td className="px-4 py-2">{o.email || "—"}</td>
                  <td className="px-4 py-2">{o.phoneNumber || o.phone || "—"}</td>
                  <td className="px-4 py-2">{o.status || "—"}</td>
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
              <tr><td colSpan={5} className="px-4 py-6 text-gray-500">No organizers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
