import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]); // Real bookings from backend
  const [showEditProfile, setShowEditProfile] = useState(false); // For edit profile modal
  const [selectedBooking, setSelectedBooking] = useState(null); // For ticket download
  const ticketRef = useRef(null);

  // NEW: organizer state
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [checkingOrganizer, setCheckingOrganizer] = useState(true);

  // Fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("You must be logged in to view this page.");
        setLoading(false);
        return;
      }

      try {
        const { uid, email, displayName, photoURL } = user;
        const userData = {
          uid,
          email,
          fullName: displayName || "User",
          imageUrl: photoURL,
          createdAt: user.metadata.creationTime,
        };
        setProfile(userData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // NEW: check if user is an organizer (query backend by email)
  useEffect(() => {
    if (!profile?.email) return;

    const checkOrganizer = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(
          `http://localhost:5000/api/organizers?email=${encodeURIComponent(profile.email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.ok) {
          // Found organizer document
          const data = await res.json();
          const flag =
            !!data?.role?.toLowerCase?.() === "organizer" ||
            data?.role === "organizer" ||
            !!data?._id;
          setIsOrganizer(!!flag);
        } else if (res.status === 404) {
          // Not an organizer
          setIsOrganizer(false);
        } else {
          // Unexpected response -> soft fallback to localStorage list
          const list = JSON.parse(localStorage.getItem("organizerEmails") || "[]");
          setIsOrganizer(Array.isArray(list) && list.includes(profile.email));
        }
      } catch {
        // Network/other error -> fallback to localStorage
        const list = JSON.parse(localStorage.getItem("organizerEmails") || "[]");
        setIsOrganizer(Array.isArray(list) && list.includes(profile.email));
      } finally {
        setCheckingOrganizer(false);
      }
    };

    checkOrganizer();
  }, [profile]);

  // Fetch user bookings
  useEffect(() => {
    if (!profile) return;

    const fetchBookings = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, [profile]);

  // Ticket download
  const generateTicketId = (bookingId) => {
    const prefix = "TKT";
    const timestamp = new Date(bookingId).getTime().toString().slice(-8);
    const random = bookingId.slice(-6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const downloadTicket = async (booking) => {
    setSelectedBooking(booking);
    
    setTimeout(async () => {
      if (!ticketRef.current) return;

      try {
        const canvas = await html2canvas(ticketRef.current, { scale: 2 });
        const link = document.createElement("a");
        link.download = `ticket-${generateTicketId(booking._id)}-${booking.eventId?.title.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL();
        link.click();
        setSelectedBooking(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to download ticket.");
        setSelectedBooking(null);
      }
    }, 100);
  };

  const handleEditProfile = () => setShowEditProfile(true);

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditProfile(false);
    toast.success("Profile updated successfully.");
  };

  if (loading) return <div className="p-8 text-center">Loading your profile…</div>;
  if (!profile) return <div className="p-8 text-center">No profile data.</div>;

  return (
    <div className="bg-gray-50 py-8 px-6 mx-20">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white/30"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mb-4 bg-gray-300 flex items-center justify-center text-xl text-white">
            {profile.fullName.charAt(0) || "?"}
          </div>
        )}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">{profile.fullName}</p>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {/* NEW: role hint */}
          {!checkingOrganizer && (
            <p className="text-xs mt-1">
              Role:{" "}
              <span className={`font-semibold ${isOrganizer ? "text-emerald-600" : "text-gray-600"}`}>
                {isOrganizer ? "Organizer" : "Regular User"}
              </span>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button onClick={handleEditProfile} className="bg-[#837f0d] text-white px-4 py-2 rounded-md">Edit Profile</button>
          <Link to="/my-bookings" className="bg-[#0b7253] text-white px-4 py-2 rounded-md">My Bookings</Link>
          {/* NEW: Organizer Dashboard button (visible only if organizer) */}
          {isOrganizer && (
            <Link to="/organizer/organizer-dashboard" className="bg-[#0b5772] text-white px-4 py-2 rounded-md">
              Organizer Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <input type="text" placeholder="Full Name" defaultValue={profile.fullName} className="w-full p-2 mb-4 border border-gray-300 rounded-md"/>
            <input type="email" placeholder="Email" defaultValue={profile.email} className="w-full p-2 mb-4 border border-gray-300 rounded-md"/>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowEditProfile(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
              <button onClick={() => handleSaveProfile({...profile, fullName: "Updated Name"})} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase History */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No purchased tickets found.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{booking.eventId?.title}</p>
                  <p className="text-sm text-gray-600">{new Date(booking.eventId?.date).toLocaleDateString()}</p>
                </div>
                <Link to="/my-bookings" className="bg-[#0b5772] text-white px-4 py-2 rounded-md">See all bookings</Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hidden ticket for download */}
      {selectedBooking && (
        <div className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none">
          <div ref={ticketRef} className="bg-white p-6 rounded-xl">
            <h1>{selectedBooking.eventId?.title}</h1>
            <p>Date: {new Date(selectedBooking.eventId?.date).toLocaleDateString()}</p>
            <QRCodeCanvas value={JSON.stringify(selectedBooking)} size={150} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
