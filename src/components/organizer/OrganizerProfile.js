import React from "react";
import { Link } from "react-router-dom";

export default function OrganizerProfile() {
  const organizer = {
    name: "EventHub BD",
    email: "eventhubbd@example.com",
    phone: "017XXXXXXXX",
    company: "EventHub Limited",
    website: "https://eventhubbd.com",
    description: "We help organize and promote the most exciting events in Bangladesh!",
    profileImage: "https://via.placeholder.com/150", // You can replace with actual image
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Organizer Profile</h2>
      <div className="bg-white shadow-md rounded-lg p-6 flex gap-6">
        <img
          src={organizer.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold">{organizer.name}</h3>
            <p className="text-gray-600">{organizer.company}</p>
            <p className="text-sm mt-2">{organizer.description}</p>
          </div>
          <div className="mt-4 text-sm space-y-1">
            <p><strong>Email:</strong> {organizer.email}</p>
            <p><strong>Phone:</strong> {organizer.phone}</p>
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
          </div>
        </div>
      </div>
    
      <Link to="/organizer/edit-profile" className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
        Edit Profile
      </Link>
    </div>
  );
}
