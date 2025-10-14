import React, { useEffect, useMemo, useRef, useState } from "react";
import { auth } from "../../firebase";
import { Loader2, Upload, Save, AlertCircle, CheckCircle2 } from "lucide-react";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";
const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY; // set in .env

export default function EditOrganizerProfile() {
  const [user, setUser] = useState(null);

  // server state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    description: "",
    logoUrl: "",         // new: organizer logo/avatar
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const initialRef = useRef(formData);
  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialRef.current),
    [formData]
  );

  // Load user + profile
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);
      setErr("");
      setOkMsg("");
      try {
        const token = await user.getIdToken();
        const res = await fetch(`${API_BASE}/api/organizers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) {
          // first-time profile: prefill email from auth
          const fallback = {
            name: "",
            email: user.email || "",
            phone: "",
            company: "",
            website: "",
            description: "",
            logoUrl: "",
            facebook: "",
            instagram: "",
            twitter: "",
          };
          setFormData(fallback);
          initialRef.current = fallback;
        } else if (!res.ok) {
          throw new Error(await res.text());
        } else {
          const profile = await res.json();
          // normalize fields
          const data = {
            name: profile.name || "",
            email: profile.email || user.email || "",
            phone: profile.phone || profile.phoneNumber || "",
            company: profile.company || profile.organization || "",
            website: profile.website || "",
            description: profile.description || "",
            logoUrl: profile.logoUrl || "",
            facebook: profile.facebook || "",
            instagram: profile.instagram || "",
            twitter: profile.twitter || "",
          };
          setFormData(data);
          initialRef.current = data;
        }
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // dirty-state guard
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr("");
    setOkMsg("");
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ---- ImgBB upload helpers ----
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function uploadImageToImgBB(file) {
    if (!IMGBB_API_KEY) {
      throw new Error(
        "Missing REACT_APP_IMGBB_API_KEY. Add it to your .env and restart the dev server."
      );
    }
    if (!file) throw new Error("No file selected");

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      throw new Error("Unsupported file type. Please upload PNG, JPG, or WEBP.");
    }
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      throw new Error(`File too large. Max ${maxMB}MB.`);
    }

    const dataUrl = await toBase64(file);
    const base64 = String(dataUrl).split(",")[1];

    const body = new FormData();
    body.append("image", base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body,
    });
    const payload = await res.json();
    if (!res.ok || !payload?.success) {
      const msg = payload?.error?.message || `Upload failed (${res.status}).`;
      throw new Error(msg);
    }
    return payload.data.url;
  }

  const onLogoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setOkMsg("");
    try {
      setSaving(true);
      const url = await uploadImageToImgBB(file);
      setFormData((p) => ({ ...p, logoUrl: url }));
    } catch (error) {
      setErr(error.message || "Logo upload failed");
    } finally {
      setSaving(false);
    }
  };

  // Validate & normalize
  const normalizeWebsite = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const validate = () => {
    if (!formData.name.trim()) return "Organizer name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (formData.website && !/^https?:\/\/.+/i.test(normalizeWebsite(formData.website))) {
      return "Website URL is invalid.";
    }
    if (formData.phone && !/^[0-9+()\-\s]{6,}$/.test(formData.phone)) {
      return "Phone seems invalid.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    if (!user) {
      setErr("Please sign in.");
      return;
    }

    try {
      setSaving(true);
      const token = await user.getIdToken();

      const payload = {
        name: formData.name.trim(),
        // email is taken from auth on server; send for display too
        email: formData.email.trim() || user.email,
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        website: normalizeWebsite(formData.website),
        description: formData.description.trim(),
        logoUrl: formData.logoUrl,
        // socials (optional)
        facebook: formData.facebook.trim(),
        instagram: formData.instagram.trim(),
        twitter: formData.twitter.trim(),
      };

      const res = await fetch(`${API_BASE}/api/organizers/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Save failed (${res.status})`);
      }

      const updated = await res.json();
      const normalized = {
        name: updated.name || payload.name,
        email: updated.email || user.email || payload.email,
        phone: updated.phone || updated.phoneNumber || payload.phone,
        company: updated.company || updated.organization || payload.company,
        website: updated.website || payload.website,
        description: updated.description || payload.description,
        logoUrl: updated.logoUrl || payload.logoUrl,
        facebook: updated.facebook || payload.facebook,
        instagram: updated.instagram || payload.instagram,
        twitter: updated.twitter || payload.twitter,
      };

      setFormData(normalized);
      initialRef.current = normalized;
      setOkMsg("Profile updated successfully.");
    } catch (e2) {
      console.error(e2);
      setErr(e2?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span>Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Organizer Profile</h2>

      {/* Alerts */}
      {err && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-800">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div className="text-sm">{err}</div>
        </div>
      )}
      {okMsg && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <div className="text-sm">{okMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Logo */}
        <div>
          <label className="block font-semibold">Logo / Avatar</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 border overflow-hidden">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>
            <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={onLogoPick}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            PNG/JPG/WEBP, up to 10MB. Hosted via ImgBB.
          </p>
        </div>

        <div>
          <label className="block font-semibold">Organizer Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Email (from account)</label>
            <input
              type="email"
              name="email"
              value={formData.email || user?.email || ""}
              readOnly
              className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="e.g., 017XXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {/* Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block font-semibold">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
          <div>
            <label className="block font-semibold">Twitter/X</label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="https://x.com/yourhandle"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {isDirty && (
            <span className="text-xs text-gray-500">
              Unsaved changes
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
