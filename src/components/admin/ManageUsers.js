<<<<<<< HEAD
import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../utils/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data.items || data);
      } catch (e) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    const prev = users;
    setDeletingId(id);
    setUsers(prev.filter(u => u._id !== id));
    try {
      await deleteUser(id);
    } catch (e) {
      console.error(e);
      setError(e.message || "Delete failed");
      setUsers(prev); // rollback
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Joined</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Loading users…
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

              {!loading && users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{u.fullName || u.name || "—"}</td>
                  <td className="px-4 py-2">{u.email || "—"}</td>
                  <td className="px-4 py-2">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={deletingId === u._id}
                      className={`px-3 py-1 rounded border text-red-700 border-red-200 bg-red-50 text-sm transition 
                      ${deletingId === u._id ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5 hover:shadow"}`}
                    >
                      {deletingId === u._id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
=======
// src/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { auth } from "../../firebase";


const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function ManageUsers() {
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
        `${API_BASE}/api/admin/users?search=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
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
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center bg-white rounded-lg shadow px-3 py-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            className="ml-2 outline-none"
            placeholder="Search name or email..."
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Created</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-6 py-6" colSpan={5}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-6 py-6" colSpan={5}>No users found.</td></tr>
            ) : (
              items.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.name || "—"}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.role || "user"}</td>
                  <td className="px-6 py-4 text-right">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <button className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
                    <button className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
>>>>>>> b0813ffeec7ec5e8809b33b759d38e33ad72dcb7
        </div>
      </div>
    </div>
  );
}
