import React from "react";

const dummyOrganizers = [
  { id: 1, name: "Organizer One" },
  { id: 2, name: "Organizer Two" },
  { id: 3, name: "Organizer Three" },
  { id: 4, name: "Organizer Four" },
];

export default function ManageOrganizer() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Manage Organizers</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Organizer Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyOrganizers.map((organizer) => (
              <tr key={organizer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{organizer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Remove
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    See Profile
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
