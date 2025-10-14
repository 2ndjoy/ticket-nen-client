import React, { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function formatDate(ds) {
  const d = new Date(ds);
  return isNaN(d) ? String(ds ?? "-") : d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyEvents() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState("");

  const [data, setData] = useState({ events: [], total: 0, pages: 0 });
  const [busyIds, setBusyIds] = useState({}); // track per-card operations
  const navigate = useNavigate();

  const canFetch = useMemo(() => Boolean(user && token), [user, token]);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (!u) {
        setToken("");
        setLoading(false);
        return;
      }
      try {
        const t = await u.getIdToken();
        setToken(t);
      } catch {
        setToken("");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  async function fetchPage(p = page, s = status) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        ...(s ? { status: s } : {}),
      });
      const res = await fetch(`${API_BASE}/api/organizers/my-events?${qs.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const payload = await res.json();
      setData(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to load your events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canFetch) return;
    fetchPage(1, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canFetch, status]);

  // --- Actions ---
  const setBusy = (id, v) => setBusyIds((st) => ({ ...st, [id]: v }));

  const doStatus = async (ev, newStatus) => {
    const id = ev._id;
    setBusy(id, true);
    const prev = data.events;
    const optimistic = prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e));
    setData((d) => ({ ...d, events: optimistic }));
    try {
      const res = await fetch(`${API_BASE}/api/organizers/events/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed: ${res.status}`);
      }
      // refetch current page for certainty
      await fetchPage();
    } catch (err) {
      console.error(err);
      alert(`Failed to update status: ${err.message}`);
      // rollback
      setData((d) => ({ ...d, events: prev }));
    } finally {
      setBusy(id, false);
    }
  };

  const doDelete = async (ev) => {
    const id = ev._id;
    if (!window.confirm(`Delete "${ev.title}"? This cannot be undone.`)) return;

    setBusy(id, true);
    const prev = data.events;
    const optimistic = prev.filter((e) => e._id !== id);
    setData((d) => ({ ...d, events: optimistic, total: d.total - 1 }));

    try {
      const res = await fetch(`${API_BASE}/api/organizers/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Failed: ${res.status}`);
      }
      // Optionally refetch if you want exact counts/pages
      await fetchPage();
    } catch (err) {
      console.error(err);
      alert(`Failed to delete: ${err.message}`);
      // rollback
      setData((d) => ({ ...d, events: prev, total: d.total + 1 }));
    } finally {
      setBusy(id, false);
    }
  };

  const doEdit = (ev) => {
    // If you have a dedicated edit page use that route.
    // Here we reuse your "add-event" page and pass ?edit=<id> to trigger edit mode.
    navigate(`/organizer/add-event?edit=${ev._id}`);
  };

  if (!user && !loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-10 text-center">
        <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
        <p className="text-gray-600">Sign in to view your events.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Events</h1>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-lg px-3 py-2 bg-white"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            <option value="">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : data?.events?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.events.map((ev) => (
              <div
                key={ev._id}
                className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <div className="w-28 h-28 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/112x112?text=Event"; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={[
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          ev.status === "Published" && "bg-emerald-100 text-emerald-700",
                          ev.status === "Draft" && "bg-yellow-100 text-yellow-700",
                          ev.status === "Cancelled" && "bg-red-100 text-red-700",
                        ].filter(Boolean).join(" ")}
                      >
                        {ev.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                        {ev.category}
                      </span>
                    </div>
                    <h3 className="font-semibold line-clamp-2">{ev.title}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatDate(ev.date)} · {ev.time} · {ev.location}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border p-2">
                        <div className="text-gray-500">VIP Left</div>
                        <div className="font-semibold">{ev.vipTickets ?? 0}</div>
                      </div>
                      <div className="rounded-lg border p-2">
                        <div className="text-gray-500">Regular Left</div>
                        <div className="font-semibold">{ev.regularTickets ?? 0}</div>
                      </div>
                      <div className="rounded-lg border p-2">
                        <div className="text-gray-500">From</div>
                        <div className="font-semibold">
                          {(() => {
                            const nums = [ev.vipPrice, ev.regularPrice]
                              .map((n) => Number(n))
                              .filter((n) => Number.isFinite(n) && n >= 0);
                            if (!nums.length) return ev.price ?? "-";
                            const min = Math.min(...nums);
                            return min === 0 ? "Free" : `৳${min}`;
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Link
                        to={`/events/${ev._id}`}
                        className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => doEdit(ev)}
                        className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                        disabled={busyIds[ev._id]}
                      >
                        Edit
                      </button>

                      {ev.status !== "Published" && (
                        <button
                          onClick={() => doStatus(ev, "Published")}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                          disabled={busyIds[ev._id]}
                        >
                          Publish
                        </button>
                      )}

                      {ev.status === "Published" && (
                        <button
                          onClick={() => doStatus(ev, "Draft")}
                          className="px-3 py-2 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600 disabled:opacity-50"
                          disabled={busyIds[ev._id]}
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        onClick={() => doStatus(ev, "Cancelled")}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                        disabled={busyIds[ev._id]}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => doDelete(ev)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm hover:bg-red-50 disabled:opacity-50"
                        disabled={busyIds[ev._id]}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
              onClick={() => { const np = Math.max(1, page - 1); setPage(np); fetchPage(np, status); }}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {data.page} of {data.pages || 1}
            </span>
            <button
              className="px-3 py-2 rounded-lg border bg-white disabled:opacity-50"
              onClick={() => { const np = data.pages ? Math.min(data.pages, page + 1) : page + 1; setPage(np); fetchPage(np, status); }}
              disabled={data.pages ? page >= data.pages : data.events.length < limit}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
          You haven’t created any events yet.
        </div>
      )}
    </div>
  );
}
