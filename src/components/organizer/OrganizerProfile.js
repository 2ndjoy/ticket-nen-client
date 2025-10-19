import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase"; // adjust if your path differs
import { Loader2, AlertCircle } from "lucide-react";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString(); // tweak if you want a specific format
  } catch {
    return String(iso);
  }
}

export default function OrganizerProfile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [profile, setProfile] = useState(null);       // organizer doc (object) or null
  const [notFound, setNotFound] = useState(false);    // true when GET /me returns 404

  // Watch Firebase auth
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u || null));
    return () => unsub();
  }, []);

  // Fetch /api/organizers/me (defensive against empty body)
  useEffect(() => {
    (async () => {
      if (!user) {
        setLoading(false);
        setProfile(null);
        setNotFound(false);
        return;
      }
      setLoading(true);
      setErr("");
      setNotFound(false);
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/api/organizers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setNotFound(true);
          setProfile(null);
        } else if (!res.ok) {
          const t = await res.text();
          throw new Error(t || `Failed (${res.status})`);
        } else {
          // handle possible empty body
          const text = await res.text();
          const doc = text ? JSON.parse(text) : null;
          setProfile(doc);
        }
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // ---- Render paths ----

  // Not signed in
  if (!user) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">Please sign in to view your organizer profile.</p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  // Error
  if (err) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>{err}</div>
        </div>
      </div>
    );
  }

  // First-time user: no profile yet (404)
  if (notFound) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Organizer Profile</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            You don’t have a profile yet. Create one to get started.
          </p>
          <Link
            to="/organizer/edit-profile"
            className="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  // No explicit 404 but no data (empty body) — gentle fallback
  if (!profile) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Organizer Profile</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700">No profile data yet.</p>
          <Link
            to="/organizer/edit-profile"
            className="inline-block mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Create / Edit Profile
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Null-safe mapping using local alias
  const p = profile ?? {};
  const organizer = {
    id: p._id || "",
    name: p.fullName || "",
    email: p.email || user.email || "",
    phone: p.phoneNumber || "",
    company: p.organizationName || "",
    organizationType: p.organizationType || "", // e.g., "Music"
    website: p.website || "",                   // optional (not in sample)
    description: p.description || "",           // optional (not in sample)
    profileImage: p.logoUrl || "https://via.placeholder.com/150",
    address: [p.area, p.district, p.division].filter(Boolean).join(", "),
    role: p.role || "",
    status: p.status || "",
    createdFrom: p.createdFrom || "",
    createdAt: p.createdAt ? formatDate(p.createdAt) : "",
    updatedAt: p.updatedAt ? formatDate(p.updatedAt) : "",
    social: {
      facebook: p.facebook,
      instagram: p.instagram,
      twitter: p.twitter,
    },
    nidNumber: p.nidNumber || "",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Organizer Profile</h2>
      {(organizer.status || organizer.role) && (
        <p className="text-sm text-gray-600 mb-6">
          {organizer.role && <span className="mr-2">Role: <strong>{organizer.role}</strong></span>}
          {organizer.status && <span>Status: <strong>{organizer.status}</strong></span>}
        </p>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 flex gap-6">
        <img
          src={organizer.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold">{organizer.name}</h3>
            {organizer.company && (
              <p className="text-gray-600">
                {organizer.company}
                {organizer.organizationType ? ` · ${organizer.organizationType}` : ""}
              </p>
            )}
            {!organizer.company && organizer.organizationType && (
              <p className="text-gray-600">{organizer.organizationType}</p>
            )}

            {organizer.description && <p className="text-sm mt-2">{organizer.description}</p>}
            {organizer.address && (
              <p className="text-sm mt-2 text-gray-600">
                <strong>Address:</strong> {organizer.address}
              </p>
            )}
          </div>

          <div className="mt-4 text-sm space-y-1">
            <p><strong>Email:</strong> {organizer.email}</p>
            {organizer.phone && <p><strong>Phone:</strong> {organizer.phone}</p>}
            {organizer.nidNumber && <p><strong>NID:</strong> {organizer.nidNumber}</p>}
            {organizer.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={organizer.website}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {organizer.website}
                </a>
              </p>
            )}
            {(organizer.createdAt || organizer.updatedAt) && (
              <p className="text-xs text-gray-500 pt-1">
                {organizer.createdAt && <>Created: {organizer.createdAt}</>}{" "}
                {organizer.updatedAt && <> · Updated: {organizer.updatedAt}</>}
              </p>
            )}

            {(organizer.social.facebook || organizer.social.instagram || organizer.social.twitter) && (
              <div className="flex gap-3 pt-2">
                {organizer.social.facebook && (
                  <a className="text-blue-600 underline" href={organizer.social.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}
                {organizer.social.instagram && (
                  <a className="text-blue-600 underline" href={organizer.social.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                )}
                {organizer.social.twitter && (
                  <a className="text-blue-600 underline" href={organizer.social.twitter} target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        {organizer.id && <>ID: <code>{organizer.id}</code></>}
        </div>

      <Link
        to="/organizer/edit-profile"
        className="mt-6 inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Edit Profile
      </Link>
    </div>
  );
}
