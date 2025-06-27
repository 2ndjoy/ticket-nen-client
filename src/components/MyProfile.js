// src/pages/MyProfile.js
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("You must be logged in to view this page.");
        setLoading(false);
        return;
      }

      try {
        const idToken = await user.getIdToken();

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load profile");
        }

        const { user: data } = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading your profile…</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center">No profile data.</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>

      <div className="flex flex-col items-center">
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mb-4 bg-white/20 flex items-center justify-center text-xl">
            {profile.fullName.charAt(0) || "?"}
          </div>
        )}

        <p><span className="font-semibold">Name:</span> {profile.fullName}</p>
        <p><span className="font-semibold">Email:</span> {profile.email}</p>
        <p><span className="font-semibold">Phone:</span> {profile.phoneNumber}</p>
        <p className="text-sm text-white/70 mt-2">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
