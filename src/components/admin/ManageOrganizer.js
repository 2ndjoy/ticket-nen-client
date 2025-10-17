import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiDelete } from "../../utils/api";

const DEFAULT_LIMIT = 20;

export default function ManageOrganizers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // search & pagination
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);

  const showingFrom = useMemo(() => (rows.length ? (page - 1) * limit + 1 : 0), [rows.length, page, limit]);
  const showingTo = useMemo(() => (page - 1) * limit + rows.length, [rows.length, page, limit]);
  const canPrev = page > 1;
  const canNext = total ? page * limit < total : false; // only enable Next if API provides total

  async function load({ keepPage = false } = {}) {
    setLoading(true);
    setError("");

    try {
      const url = `/api/admin/organizers${
        q || page || limit
          ? `?search=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
          : ""
      }`;

      const data = await apiGet(url);

      if (Array.isArray(data)) {
        // No pagination info; treat as full list and slice client-side
        setTotal(data.length);
        const start = (page - 1) * limit;
        const slice = data.slice(start, start + limit);
        setRows(slice);
      } else {
        // { items, total } shape
        setRows(data?.items || []);
        setTotal(Number.isFinite(data?.total) ? data.total : (data?.items?.length || 0));
      }
    } catch (e) {
      setError(e?.message || "Failed to load organizers");
      setRows([]);
      setTotal(0);
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
    if (!window.confirm("Delete this organizer?")) return;

    const prev = rows;
    setDeletingId(id);
    setRows(prev.filter((o) => (o._id || o.id) !== id));
    setError("");

    try {
      await apiDelete(`/api/admin/organizers/${id}`);
      // After delete, refresh current page (may shift counts)
      await load({ keepPage: true });
    } catch (e) {
      setRows(prev); // rollback
      setError(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Manage Organizers</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          className="w-full max-w-md px-3 py-2 rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Search name, email, organization…"
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
        <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Organization</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-gray-500">
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((o) => {
                const id = o._id || o.id;
                const created =
                  o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—";
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-2">{o.fullName || o.name || "—"}</td>
                    <td className="px-4 py-2">{o.email || "—"}</td>
                    <td className="px-4 py-2">
                      {o.organizationName || o.organization || "—"}
                    </td>
                    <td className="px-4 py-2">{o.phoneNumber || o.phone || "—"}</td>
                    <td className="px-4 py-2">{o.status || "—"}</td>
                    <td className="px-4 py-2">{created}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        className={`px-3 py-1 rounded border text-red-700 border-red-200 bg-red-50 ${
                          deletingId === id
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-red-100"
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
                <td colSpan={7} className="px-4 py-6 text-gray-500">
                  No organizers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer (shown only if total is known) */}
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
  );
}
