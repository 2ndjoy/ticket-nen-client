import React, { useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function PromoteEvent() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    date: "",
    time: "",
    price: "",
    vipPrice: "",
    regularPrice: "",
    category: "",
    location: "",
    status: "",
    description: "",
    image: "",
    imageUrl: "",
    videoUrl: "",
    email: "",
    phone: "",
    attendees: 0,
    rating: 0,
    vipTickets: 0,
    regularTickets: 0,
  });

  // auth & role states
  const [user, setUser] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [roleError, setRoleError] = useState("");

  // ui state
  const [reviewing, setReviewing] = useState(false);

  // derived flags
  const canEditAndSubmit = useMemo(
    () => !!user && !checkingRole && isOrganizer,
    [user, checkingRole, isOrganizer]
  );

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u || null);
      setIsOrganizer(false);
      setRoleError("");
      setCheckingRole(true);

      try {
        if (!u) {
          return;
        }

        const email = u.email;
        if (!email) {
          setRoleError("Signed-in account doesn’t include an email.");
          return;
        }

        // Optional: include Firebase ID token if your API checks it.
        let token = "";
        try {
          token = await u.getIdToken();
        } catch {
          // ignore token failure; endpoint may be public
        }

        const url = `${API_BASE}/api/organizers?email=${encodeURIComponent(email)}`;
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.status === 404) {
          setIsOrganizer(false);
          return;
        }
        if (!res.ok) {
          setIsOrganizer(false);
          setRoleError(`Failed to verify organizer status (${res.status}).`);
          return;
        }

        const data = await res.json();
        // API might return an object or an array—handle both.
        const profile = Array.isArray(data) ? data[0] : data;

        const role = String(profile?.role || "").toLowerCase();
        const status = String(profile?.status || "").toLowerCase();

        setIsOrganizer(role === "organizer" && status === "active");

        // Prefill contact from profile if blank
        setFormData((prev) => ({
          ...prev,
          email: prev.email || profile?.email || email || "",
          phone: prev.phone || profile?.phoneNumber || "",
        }));
      } catch (e) {
        setIsOrganizer(false);
        setRoleError("Could not reach the server to verify organizer status.");
      } finally {
        setCheckingRole(false);
      }
    });

    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in first.");
      return;
    }

    if (checkingRole) {
      alert("Checking your organizer status. Please try again shortly.");
      return;
    }

    if (!isOrganizer) {
      alert("Register as an Organizer to promote events.");
      window.location.href = "/registerorg";
      return;
    }

    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.description ||
      !formData.email ||
      !formData.phone ||
      !formData.vipTickets ||
      !formData.vipPrice ||
      !formData.regularTickets ||
      !formData.regularPrice ||
      !formData.category ||
      !formData.status ||
      !formData.image
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setReviewing(true);
  };

  const handleConfirmAndPay = () => {
    localStorage.setItem("pendingEvent", JSON.stringify(formData));
    window.location.href = "/organizer/payment";
  };

  return (
    <div className="relative isolate min-h-screen">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200 blur-3xl opacity-50" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-teal-300 blur-3xl opacity-40" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-[28rem] w-[60rem] rounded-[50%] bg-emerald-100 blur-3xl opacity-40" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="bg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-emerald-700/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-grid)" />
        </svg>
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 mt-6 sm:mt-0 font-serif">
        {/* Top banner changes based on role */}
        <div
          className={`relative overflow-hidden rounded-2xl text-white shadow-lg mb-8 ${
            canEditAndSubmit
              ? "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700"
              : "bg-gradient-to-r from-[#128f8b] via-[#0e7d7a] to-[#0e6b69]"
          }`}
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {canEditAndSubmit ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold">Organizer verified</h2>
                    <p className="mt-1 text-white/90">
                      You can promote your event. Fill in the details below.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold">Register as an organizer</h2>
                    <p className="mt-1 text-white/90">
                      Promote your event, reach more people, and manage everything smoothly.
                    </p>
                  </>
                )}
              </div>

              {!canEditAndSubmit && (
                <button
                  onClick={() => (window.location.href = "/registerorg")}
                  className="inline-flex items-center justify-center bg-white text-[#128f8b] font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-gray-100 transition"
                >
                  Register Now
                </button>
              )}
            </div>

            {/* Stepper */}
            <div className="mt-6 flex items-center gap-3 text-sm">
              <div
                className={`h-2 w-2 rounded-full ${
                  !reviewing ? "bg-white" : "bg-white/60"
                }`}
              />
              <span className={`${!reviewing ? "text-white" : "text-white/80"}`}>
                1) Fill details
              </span>
              <div className="h-[1px] flex-1 bg-white/30 mx-3" />
              <div
                className={`h-2 w-2 rounded-full ${
                  reviewing ? "bg-white" : "bg-white/60"
                }`}
              />
              <span className={`${reviewing ? "text-white" : "text-white/80"}`}>
                2) Review & Pay
              </span>
            </div>

            {/* Role check status */}
            <div className="mt-4 text-sm">
              {checkingRole && (
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  Checking organizer status…
                </span>
              )}
              {!checkingRole && user && !isOrganizer && (
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded">
                  <span className="h-2 w-2 rounded-full bg-yellow-300" />
                  Not an organizer yet. Please register.
                </span>
              )}
              {!user && (
                <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded">
                  <span className="h-2 w-2 rounded-full bg-yellow-300" />
                  Please sign in to continue.
                </span>
              )}
              {roleError && (
                <div className="mt-2 bg-white/15 px-3 py-2 rounded">
                  <span className="text-red-100">Note: {roleError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-5 text-center">Promote Your Event</h1>

        {!reviewing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Subtitle *</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  >
                    <option value="">Select a category</option>
                    <option value="Conference">Conference</option>
                    <option value="Concert">Concert</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-sm text-gray-700">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  >
                    <option value="">Select status</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 min-h-28 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows="3"
                  required
                  disabled={!canEditAndSubmit}
                />
              </div>
            </div>

            {/* Media */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Main Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Additional Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={!canEditAndSubmit}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm text-gray-700">Video URL</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={!canEditAndSubmit}
                  />
                </div>
              </div>
            </div>

            {/* Organizer Contact */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Organizer Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>
              </div>
            </div>

            {/* Tickets & Pricing */}
            <div className="rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Tickets & Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">VIP Tickets *</label>
                  <input
                    type="number"
                    name="vipTickets"
                    value={formData.vipTickets}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">VIP Ticket Price *</label>
                  <input
                    type="number"
                    name="vipPrice"
                    value={formData.vipPrice}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">Regular Tickets *</label>
                  <input
                    type="number"
                    name="regularTickets"
                    value={formData.regularTickets}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">Regular Ticket Price *</label>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    min="0"
                    step="0.01"
                    required
                    disabled={!canEditAndSubmit}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={!canEditAndSubmit}
                className={`inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl shadow transition ${
                  canEditAndSubmit
                    ? "bg-[#128f8b] text-white hover:bg-emerald-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                title={
                  !user
                    ? "Sign in to continue"
                    : checkingRole
                    ? "Verifying organizer status"
                    : !isOrganizer
                    ? "Register as an Organizer to promote events"
                    : "Review your event"
                }
              >
                Review
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border bg-white/90 backdrop-blur-sm shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Review Your Event</h2>
                <p className="text-sm text-gray-600">
                  Please confirm all details before proceeding to payment.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 font-semibold">
                Step 2 of 2
              </span>
            </div>

            {/* Summary grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Title", formData.title],
                ["Subtitle", formData.subtitle],
                ["Date", formData.date],
                ["Time", formData.time],
                ["Price", formData.regularPrice],
                ["Category", formData.category],
                ["Location", formData.location],
                ["Status", formData.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border p-4 bg-white">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold break-all">{value}</p>
                </div>
              ))}

              <div className="sm:col-span-2 rounded-xl border p-4 bg-white">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-normal text-gray-800 whitespace-pre-wrap">
                  {formData.description}
                </p>
              </div>

              {[
                ["Main Image URL", formData.image],
                ["Additional Image URL", formData.imageUrl],
                ["Video URL", formData.videoUrl],
                ["Email", formData.email],
                ["Phone", formData.phone],
                ["VIP Tickets", formData.vipTickets],
                ["VIP Ticket Price", formData.vipPrice],
                ["Regular Tickets", formData.regularTickets],
                ["Regular Ticket Price", formData.regularPrice],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border p-4 bg-white">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-semibold break-all">{String(value || "")}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setReviewing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 py-2.5 px-5 rounded-xl transition"
              >
                Edit
              </button>
              <button
                onClick={handleConfirmAndPay}
                className="bg-[#128f8b] hover:bg-emerald-700 text-white py-2.5 px-6 rounded-xl font-semibold shadow transition"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
