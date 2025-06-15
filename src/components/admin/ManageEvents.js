import React from "react";

const dummyEvents = [
  { id: 1, name: "Concert Night", organizer:"A",location: "Dhaka", date: "2025-07-10" },
  { id: 2, name: "Football Final",organizer:"A", location: "Chattogram", date: "2025-08-15" },
  { id: 3, name: "Drama Fest", organizer:"A",location: "Sylhet", date: "2025-09-05" },
];

export default function ManageEvents() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Event Name</th>
              <th className="px-6 py-3 font-medium">Organizer</th>
              
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{event.name}</td>
                <td className="px-6 py-4">{event.organizer}</td>
                <td className="px-6 py-4">{event.location}</td>
                <td className="px-6 py-4">{event.date}</td>
                <td className="px-6 py-4 space-x-2">
                  <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
