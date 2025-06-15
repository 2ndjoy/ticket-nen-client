import React from "react";

const dummyEvents = [
  {
    id: 1,
    title: "Summer Music Fest",
    date: "2025-07-10",
    time: "18:00",
    location: "Dhaka Arena",
    category: "Concert",
  },
  {
    id: 2,
    title: "Startup Meetup",
    date: "2025-07-15",
    time: "10:00",
    location: "Sylhet Convention Hall",
    category: "Networking",
  },
];

export default function MyEvents() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Events</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {dummyEvents.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
            <p className="text-sm text-gray-600">{event.location}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">
              {event.category}
            </span>
            <div className="mt-4 flex gap-2">
              <button className="text-blue-600 hover:underline text-sm">Edit</button>
              <button className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
