import React from "react";

export default function PromoteEvent() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-light font-serif">
      <div className="bg-gradient-to-r from-[#128f8b] to-[#0e6b69] text-white p-6 rounded-lg shadow-md mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Register as an organizer to promote your event</h2>
        <p className="mb-4">Reach more people and manage your event easily.</p>
        <button
          onClick={() => window.location.href = "/register"}
          className="bg-white text-[#128f8b] font-semibold px-6 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Register Now
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Promote Your Event</h1>

      <form className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Event Title</label>
          <input
            type="text"
            placeholder="Enter event title"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            rows={4}
            placeholder="Enter description"
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="url"
            placeholder="Enter image URL"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Video URL</label>
          <input
            type="url"
            placeholder="Enter video URL"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Contact Email</label>
          <input
            type="email"
            placeholder="Enter contact email"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">VIP Ticket Quantity</label>
          <input
            type="number"
            placeholder="VIP Ticket Quantity"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Ticket Quantity</label>
          <input
            type="number"
            placeholder="Ticket Quantity"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button type="submit" className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
