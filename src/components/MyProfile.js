import React, { useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const API_BASE =
  process.env.REACT_APP_API_BASE?.replace(/\/$/, "") || "http://localhost:5000";

export default function MyProfile() {
  const navigate = useNavigate();

  // auth/profile
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // organizer state
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [checkingOrganizer, setCheckingOrganizer] = useState(true);

  // edit modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // ticket download
  const [selectedBooking, setSelectedBooking] = useState(null);
  const ticketRef = useRef(null);

  // --- helpers ---
  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "-";
  const fmtTime = (t) => t || "-";
  const fmtBDT = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );

  const generateTicketId = (booking) => {
    // stable & readable: TKT-yyMMddHHmm-XXXX
    const ts = new Date(booking?.createdAt || Date.now());
    const pad = (x) => String(x).padStart(2, "0");
    const idPart =
      String(ts.getFullYear()).slice(-2) +
      pad(ts.getMonth() + 1) +
      pad(ts.getDate()) +
      pad(ts.getHours()) +
      pad(ts.getMinutes());
    const suffix = String(booking?._id || Math.random().toString(36)).slice(-4).toUpperCase();
    return `TKT-${idPart}-${suffix}`;
  };

  // --- auth & base profile ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        toast.error("You must be logged in to view this page.");
        navigate("/login");
        return;
      }
      const { uid, email, displayName, photoURL, metadata } = user;
      setProfile({
        uid,
        email,
        fullName: displayName || "User",
        imageUrl: photoURL || "",
        createdAt: metadata?.creationTime || new Date().toISOString(),
      });
      setEditName(displayName || "User");
      setEditPhoto(photoURL || "");
      setLoading(false);
    });
    return () => unsub();
  }, [navigate]);

  // --- check organizer (secure first, legacy fallback) ---
  useEffect(() => {
    (async () => {
      if (!profile?.email) return;
      setCheckingOrganizer(true);
      try {
        const token = await auth.currentUser.getIdToken();
        // Prefer secure /me endpoint
        const me = await fetch(`${API_BASE}/api/organizers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (me.ok) {
          const doc = await me.json();
          setIsOrganizer((doc?.role || "").toLowerCase() === "organizer");
        } else if (me.status === 404) {
          // Fallback to old GET ?email=
          const res = await fetch(
            `${API_BASE}/api/organizers?email=${encodeURIComponent(profile.email)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.ok) {
            const data = await res.json();
            setIsOrganizer((data?.role || "").toLowerCase() === "organizer");
          } else {
            setIsOrganizer(false);
          }
        } else {
          setIsOrganizer(false);
        }
      } catch (e) {
        console.error("Organizer check error:", e);
        setIsOrganizer(false);
      } finally {
        setCheckingOrganizer(false);
      }
    })();
  }, [profile?.email]);

  // --- fetch bookings for this user ---
  useEffect(() => {
    (async () => {
      if (!profile?.email) return;
      setBookingsLoading(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // Expecting array of bookings populated with eventId
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Load bookings error:", e);
        toast.error("Failed to load your bookings.");
      } finally {
        setBookingsLoading(false);
      }
    })();
  }, [profile?.email]);

  // --- edit profile (Firebase display name & photo) ---
  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    try {
      setSavingProfile(true);
      await updateProfile(auth.currentUser, {
        displayName: (editName || "").trim() || "User",
        photoURL: (editPhoto || "").trim() || null,
      });
      setProfile((p) => ({
        ...p,
        fullName: (editName || "").trim() || "User",
        imageUrl: (editPhoto || "").trim() || "",
      }));
      toast.success("Profile updated.");
      setShowEditProfile(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // --- ticket PNG download ---
  const downloadTicket = async (booking) => {
    setSelectedBooking(booking);
    // Wait a frame for the hidden ticket to render
    setTimeout(async () => {
      try {
        if (!ticketRef.current) return;
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: false,
        });
        const link = document.createElement("a");
        const tId = generateTicketId(booking);
        const safeTitle = (booking?.eventId?.title || "ticket").replace(/\s+/g, "-");
        link.download = `ticket-${tId}-${safeTitle}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setSelectedBooking(null);
      } catch (err) {
        console.error("Ticket download error:", err);
        toast.error("Failed to download ticket.");
        setSelectedBooking(null);
      }
    }, 80);
  };

  if (loading) {
    return (
      <div className="p-8 mx-20">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-1/3 bg-gray-200 rounded" />
          <div className="h-56 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-center">No profile data.</div>;
  }

  return (
    <div className="bg-gray-50 py-8 px-6 mx-20">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white/30"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mb-4 bg-gray-300 flex items-center justify-center text-xl text-white">
            {profile.fullName?.charAt(0) || "?"}
          </div>
        )}

        <div className="text-center space-y-1">
          <p className="text-lg font-semibold">{profile.fullName}</p>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Member since {fmtDate(profile.createdAt)}
          </p>
          {!checkingOrganizer && (
            <p className="text-xs mt-1">
              Role:{" "}
              <span
                className={`font-semibold ${isOrganizer ? "text-emerald-600" : "text-gray-600"}`}
              >
                {isOrganizer ? "Organizer" : "Regular User"}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setShowEditProfile(true)}
            className="bg-[#837f0d] text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>

          <Link
            to="/my-bookings"
            className="bg-[#0b7253] text-white px-4 py-2 rounded-md"
          >
            My Bookings
          </Link>

          {isOrganizer ? (
            <Link
              to="/organizer/organizer-dashboard"
              className="bg-[#0b5772] text-white px-4 py-2 rounded-md"
            >
              Organizer Dashboard
            </Link>
          ) : (
            <Link
              to="/registerorg"
              className="bg-[#0b5772] text-white px-4 py-2 rounded-md"
            >
              Become an Organizer
            </Link>
          )}
        </div>
      </div>

      {/* Purchase History */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
          {bookings?.length > 0 && (
            <Link
              to="/my-bookings"
              className="text-sm text-emerald-700 hover:underline"
            >
              Open all bookings
            </Link>
          )}
        </div>

        {bookingsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-lg shadow animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-500">No purchased tickets found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const ev = b.eventId || {};
              const tId = generateTicketId(b);
              return (
                <div
                  key={b._id}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden">
                      {ev.image ? (
                        <img src={ev.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{ev.title || "Event"}</p>
                      <p className="text-sm text-gray-600">
                        {fmtDate(ev.date)} • {fmtTime(ev.time)} • {ev.location || "-"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Booking ID: <span className="font-mono">{b._id}</span> • Ticket:{" "}
                        <span className="font-mono">{tId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {b.quantity} × {b.ticketType?.toUpperCase()} • {fmtBDT(b.amount)}
                    </span>
                    <button
                      onClick={() => downloadTicket(b)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm"
                    >
                      Download Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[420px]">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Photo URL</label>
                <input
                  type="url"
                  value={editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  placeholder="https://…"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowEditProfile(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-60"
              >
                {savingProfile ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden printable ticket for download */}
      {selectedBooking && (
        <div className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none">
          <div
            ref={ticketRef}
            className="w-[700px] bg-gradient-to-br from-[#0b7253] to-[#ef8bb7] text-white rounded-2xl p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-semibold">
                EVENT TICKET
              </div>
              <h1 className="text-3xl font-bold mt-3">{selectedBooking.eventId?.title}</h1>
              <p className="opacity-90">{selectedBooking.eventId?.subtitle}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6 bg-white/10 rounded-xl p-5 mb-4">
              <div>
                <p className="text-xs uppercase opacity-80">Date</p>
                <p className="font-semibold">{fmtDate(selectedBooking.eventId?.date)}</p>
              </div>
              <div>
                <p className="text-xs uppercase opacity-80">Time</p>
                <p className="font-semibold">{fmtTime(selectedBooking.eventId?.time)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase opacity-80">Venue</p>
                <p className="font-semibold">{selectedBooking.eventId?.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-white/10 rounded-xl p-5 mb-4">
              <div>
                <p className="text-xs uppercase opacity-80">Attendee</p>
                <p className="font-semibold">{profile.fullName}</p>
                <p className="text-sm opacity-90">{profile.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase opacity-80">Type / Qty</p>
                <p className="font-semibold capitalize">
                  {selectedBooking.ticketType} × {selectedBooking.quantity}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase opacity-80">Ticket ID</p>
                <p className="font-semibold">{generateTicketId(selectedBooking)}</p>
              </div>
              <div>
                <p className="text-xs uppercase opacity-80">Amount Paid</p>
                <p className="font-semibold">{fmtBDT(selectedBooking.amount)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase opacity-80">Booking ID</p>
                <p className="font-mono text-xs">{selectedBooking._id}</p>
              </div>
            </div>

            {/* QR */}
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-lg p-4">
                <QRCodeCanvas
                  value={JSON.stringify({
                    ticketId: generateTicketId(selectedBooking),
                    bookingId: selectedBooking._id,
                    eventId: selectedBooking.eventId?._id,
                    eventTitle: selectedBooking.eventId?.title,
                    name: profile.fullName,
                    email: profile.email,
                    ticketType: selectedBooking.ticketType,
                    quantity: selectedBooking.quantity,
                    amount: selectedBooking.amount,
                    date: selectedBooking.eventId?.date,
                    time: selectedBooking.eventId?.time,
                    venue: selectedBooking.eventId?.location,
                    generatedAt: new Date().toISOString(),
                  })}
                  size={160}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            <p className="text-center text-sm opacity-80 mt-4">
              Present this ticket at the venue entrance • Generated on{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
