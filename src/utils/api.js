// src/utils/api.js
const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null; // no content (e.g., successful DELETE)

  // Try to parse JSON; fall back to empty object on failure
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

/* -------- Generic helpers (back-compat for AdminDashboard) -------- */
export async function apiGet(path) {
  return request(path);
}
export async function apiDelete(path) {
  return request(path, { method: "DELETE" });
}

/* ------------------- USERS ------------------- */
export async function getUsers() {
  // Supports array or { total, items } from your backend
  return request("/api/admin/users");
}
export async function deleteUser(id) {
  return request(`/api/admin/users/${id}`, { method: "DELETE" });
}

/* ------------------- EVENTS ------------------ */
export async function getEvents() {
  return request("/api/admin/events");
}
export async function deleteEvent(id) {
  // Use admin route to match your updated backend
  return request(`/api/admin/events/${id}`, { method: "DELETE" });
}

/* ---------------- ORGANIZERS ----------------- */
export async function getOrganizers() {
  return request("/api/admin/organizers");
}
export async function deleteOrganizer(id) {
  return request(`/api/admin/organizers/${id}`, { method: "DELETE" });
}

export { API_BASE };
