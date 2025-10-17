// src/admin/ManageUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getUsers, deleteUser } from "../../utils/api";

const DEFAULT_LIMIT = 20;

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // search & pagination
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);

  const showingFrom = useMemo(
    () => (users.length ? (page - 1) * limit + 1 : 0),
    [users.length, page, limit]
  );
  const showingTo = useMemo(
    () => (page - 1) * limit + users.length,
    [users.length, page, limit]
  );
  const canPrev = page > 1;
  const canNext = total ? page * limit < total : false; // only enable Next if API provides total

  async function load({ keepPage = false } = {}) {
    setLoading(true);
    setError("");
    try {
      // Try calling with search/pagination; your getUsers can ignore if unsupported
      const data = await getUsers({ search: q, page, limit });

      if (Array.isArray(data)) {
        // No pagination info; slice on client
        setTotal(data.length);
        const start = (page - 1) * limit;
        setUsers(data.slice(start, start + limit));
      } else {
        // Expecting { items, total }
        const items = data?.items || [];
        setUsers(items);
        setTotal(Number.isFinite(data?.total) ? data.total : items.length);
      }
    } catch (e) {
      setUsers([]);
      setTotal(0);
      setError(e?.message || "Failed to load users");
      if (!keepPage) setPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ keepPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async () => {
    setPage(1);
    await load();
  };

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm("Delete this user?")) return;

    const prev = users;
    setDeletingId(id);
    setUsers(prev.filter((u) => (u._id || u.id) !== id));
    setError("");

    try {
      await deleteUser(id);
      // refresh current page after delete (counts may shift)
      await load({ keepPage: true });
    } catch (e) {
      setUsers(prev); // rollback on failure
      setError(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

        {/* Search */}
        <div className="mb-4 flex gap-2">
          <input
            className="w-full max-w-md px-3 py-2 rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Search name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button
            onClick={onSearch}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            Search
          </button>
        </div>

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
                <th className="px-4 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Joined</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    Loading users…
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}

              {!loading &&
                users.map((u) => {
                  const id = u._id || u.id;
                  const created = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—";
                  return (
                    <tr key={id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{u.fullName || u.name || "—"}</td>
                      <td className="px-4 py-2">{u.email || "—"}</td>
                      <td className="px-4 py-2">{u.role || "user"}</td>
                      <td className="px-4 py-2">{created}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className={`px-3 py-1 rounded border text-red-700 border-red-200 bg-red-50 text-sm transition 
                            ${
                              deletingId === id
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:-translate-y-0.5 hover:shadow"
                            }`}
                        >
                          {deletingId === id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer (only useful when total is known) */}
        {Number.isFinite(total) && total > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {showingFrom}–{showingTo} of {total}
            </div>
            <div className="flex gap-2">
              <button
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={!canNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
