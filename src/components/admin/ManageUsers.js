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
        </div>
      </div>
    </div>
  );
}
