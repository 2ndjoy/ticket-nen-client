import React, { useState } from "react";

export default function PromoteEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    videoUrl: "", // Added from other branch
    email: "",
    phone: "",
    vipTickets: 0,
    regularTickets: 0,
  });

  const [reviewing, setReviewing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.description ||
      !formData.email ||
      !formData.phone ||
      formData.vipTickets <= 0 ||
      formData.regularTickets <= 0
    ) {
      alert("Please fill all required fields and enter valid ticket quantities.");
      return;
    }

    setReviewing(true);
  };

  const handleConfirmReview = () => {
    setSubmitted(true);
    window.location.href = "/payment";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-light font-serif">
      <div className="bg-gradient-to-r from-[#128f8b] to-[#0e6b69] text-white p-6 rounded-lg shadow-md mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Register as an organizer to promote your event
        </h2>
        <p className="mb-4">Reach more people and manage your event easily.</p>
        <button
          onClick={() => (window.location.href = "/registerorg")}
          className="bg-white text-[#128f8b] font-semibold px-6 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Register Now
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Promote Your Event</h1>

      {!reviewing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Title */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="title">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="date">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="location">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="imageUrl">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="videoUrl">
              Video URL (optional)
            </label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="Enter video URL"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter contact email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="phone">
              Contact Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter contact phone number"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* VIP Ticket Quantity */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="vipTickets">
              VIP Tickets <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="vipTickets"
              name="vipTickets"
              value={formData.vipTickets}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Regular Ticket Quantity */}
          <div>
            <label className="block mb-1 font-semibold" htmlFor="regularTickets">
              Regular Tickets <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="regularTickets"
              name="regularTickets"
              value={formData.regularTickets}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded transition"
          >
            Submit
          </button>
        </form>
      ) : (
        // Review Mode
        <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-3">Please Review Your Data</h2>
          <p>
            <strong>Event Title:</strong> {formData.title}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(formData.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Location:</strong> {formData.location}
          </p>
          <p>
            <strong>Description:</strong> {formData.description}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>VIP Tickets:</strong> {formData.vipTickets}
          </p>
          <p>
            <strong>Regular Tickets:</strong> {formData.regularTickets}
          </p>
          {formData.videoUrl && (
            <p>
              <strong>Video URL:</strong>{" "}
              <a
                href={formData.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {formData.videoUrl}
              </a>
            </p>
          )}

          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleConfirmReview}
              className="bg-[#128f8b] text-white font-semibold py-3 rounded transition"
            >
              Confirm and Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
