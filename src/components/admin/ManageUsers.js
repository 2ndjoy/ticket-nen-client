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
        </div>
      </div>
    </div>
  );
}
