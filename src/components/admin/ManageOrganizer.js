<<<<<<< HEAD
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
=======
// src/admin/ManageOrganizers.jsx
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { auth } from "../../firebase";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function ManageOrganizer() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(
        `${API_BASE}/api/admin/organizers?search=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Manage Organizers</h2>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="ml-2 outline-none"
            placeholder="Search name, email or org..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), load())}
          />
        </div>
        <button
          onClick={() => { setPage(1); load(); }}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Organization</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-6 py-6" colSpan={6}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-6 py-6" colSpan={6}>No organizers found.</td></tr>
            ) : (
              items.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{o.fullName}</td>
                  <td className="px-6 py-4">{o.email}</td>
                  <td className="px-6 py-4">{o.organizationName}</td>
                  <td className="px-6 py-4">{o.phoneNumber}</td>
                  <td className="px-6 py-4">{o.status || "active"}</td>
                  <td className="px-6 py-4">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))
>>>>>>> b0813ffeec7ec5e8809b33b759d38e33ad72dcb7
            )}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
=======

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(items.length ? (page - 1) * limit + 1 : 0)}–
          {(page - 1) * limit + items.length} of {total}
        </div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={(page * limit) >= total} onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
>>>>>>> b0813ffeec7ec5e8809b33b759d38e33ad72dcb7
    </div>
  );
}
