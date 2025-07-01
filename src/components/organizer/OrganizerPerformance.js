import React from "react";


export default function OrganizerPerformance() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg font-medium">Total Tickets Sold</p>
          <p className="text-3xl font-bold mt-2">650</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg font-medium">Total Revenue</p>
          <p className="text-3xl font-bold mt-2"><b> ৳ </b> 133,000</p>
        </div>
      </div>

      
    </div>
  );
}
