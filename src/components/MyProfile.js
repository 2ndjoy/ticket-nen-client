import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasedTickets, setPurchasedTickets] = useState([]); // To store purchased tickets
  const [showEditProfile, setShowEditProfile] = useState(false); // For showing the edit profile form

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("You must be logged in to view this page.");
        setLoading(false);
        return;
      }

      try {
        // Fetching profile data from Firebase
        const { uid, email, displayName, photoURL } = user;
        const userData = {
          uid,
          email,
          fullName: displayName || "User",
          imageUrl: photoURL,
          createdAt: user.metadata.creationTime,
        };
        setProfile(userData);

        // Fetching purchased tickets (mocked data as an example)
        const mockPurchasedTickets = [
          {
            id: "ticket1",
            eventName: "Concert A",
            eventDate: "2023-10-10",
          },
          {
            id: "ticket2",
            eventName: "Event B",
            eventDate: "2023-11-15",
          },
        ];
        setPurchasedTickets(mockPurchasedTickets);

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTicketAction = (ticketId, action) => {
    if (action === "download") {
      // Logic for downloading the ticket (mocked)
      toast.success("Downloading ticket...");
    } else if (action === "cancel") {
      // Logic for canceling the ticket (mocked)
      toast.success("Ticket canceled successfully.");
    } else if (action === "refund") {
      // Logic for refunding the ticket (mocked)
      toast.success("Ticket refund processed.");
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true); // Display the profile edit form/modal
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditProfile(false); // Close the edit profile form/modal
    toast.success("Profile updated successfully.");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your profile…</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center">No profile data.</div>;
  }

  return (
    <div className="bg-gray-50 py-8 px-6 mx-20">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      {/* Profile Information */}
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
          <p className="text-sm text-gray-600">{profile.phoneNumber}</p>
          <p className="text-sm text-gray-500 mt-2">
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {/* Edit Profile Button */}
        <button
          onClick={handleEditProfile}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>

      {/* Edit Profile Modal/Form */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {/* Here you can create form fields for profile update */}
            <input
              type="text"
              placeholder="Full Name"
              defaultValue={profile.fullName}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue={profile.email}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditProfile(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleSaveProfile({ ...profile, fullName: "Updated Name" })
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase History Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
        <div className="space-y-4">
          {purchasedTickets.length === 0 ? (
            <p className="text-center text-gray-500">No purchased tickets found.</p>
          ) : (
            purchasedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{ticket.eventName}</p>
                  <p className="text-sm text-gray-600">{ticket.eventDate}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleTicketAction(ticket.id, "download")}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Orders Details Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-semibold">Order #12345</p>
            <p className="text-sm text-gray-600">Placed on: 2023-09-25</p>
            <p className="text-sm text-gray-600">Status: Shipped</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-semibold">Order #12346</p>
            <p className="text-sm text-gray-600">Placed on: 2023-09-20</p>
            <p className="text-sm text-gray-600">Status: Delivered</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
