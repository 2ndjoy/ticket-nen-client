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
            )}
          </tbody>
        </table>
      </div>

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
