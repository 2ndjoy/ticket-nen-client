import React from "react";
import { NavLink } from "react-router-dom";

const ticketsSoldData = [
  { id: 1, eventName: "Music Concert", ticketsSold: 150, ticketPrice: 50, date: "2025-06-10" },
  { id: 2, eventName: "Football Match", ticketsSold: 300, ticketPrice: 40, date: "2025-06-12" },
  { id: 3, eventName: "Theater Play", ticketsSold: 120, ticketPrice: 35, date: "2025-06-15" },
  { id: 4, eventName: "Art Exhibition", ticketsSold: 90, ticketPrice: 25, date: "2025-06-18" },
  { id: 5, eventName: "Tech Conference", ticketsSold: 200, ticketPrice: 75, date: "2025-06-20" },
];

// Calculate total revenue for all events
const totalRevenue = ticketsSoldData.reduce(
  (sum, event) => sum + event.ticketsSold * event.ticketPrice,
  0
);


function formatDate(dateStr) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

export default function TicketsSold() {
  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Total Tickets Sold & Revenue</h2>

        <div className="mb-6 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Overall Revenue:</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Event Name</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Tickets Sold</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Ticket Price ($)</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Revenue ($)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {ticketsSoldData.map(({ id, eventName, ticketsSold, ticketPrice, date }) => {
                const revenue = ticketsSold * ticketPrice;
                return (
                  <tr key={id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{eventName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                      {ticketsSold}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {ticketPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right font-bold text-green-700">
                      {revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{formatDate(date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
