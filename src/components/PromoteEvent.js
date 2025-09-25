import React, { useState } from "react";

export default function PromoteEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    email: "",
    phone: "",
    vipTickets: 0,
    regularTickets: 0,
  });

  const [reviewing, setReviewing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.description ||
      !formData.email ||
      !formData.phone
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setReviewing(true);
  };

  const handleConfirmAndPay = () => {
    // Store event data temporarily in localStorage
    localStorage.setItem("pendingEvent", JSON.stringify(formData));
    // Redirect to payment page
    window.location.href = "/organizer/payment";
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
          {/* Form Fields */}
          <div>
            <label className="block mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">VIP Tickets *</label>
            <input
              type="number"
              name="vipTickets"
              value={formData.vipTickets}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Regular Tickets *</label>
            <input
              type="number"
              name="regularTickets"
              value={formData.regularTickets}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Conferences">Conferences</option>
              <option value="Competitions">Competitions</option>
              <option value="Festivals">Festivals</option>
              <option value="Concerts">Concerts</option>
              <option value="Workshops">Workshops</option>
              <option value="Sports">Sports</option>
              <option value="Theater">Theater</option>
              <option value="Other">Other</option>
            </select>
          </div>


          <div>
            <label className="block mb-1">Price *</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              placeholder="Free or amount (e.g., 200)"
            />
          </div>


          <button
            type="submit"
            className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded"
          >
            Review
          </button>
        </form>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-3">Review Your Event</h2>
          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>Date:</strong> {formData.date}</p>
          <p><strong>Location:</strong> {formData.location}</p>
          <p><strong>Description:</strong> {formData.description}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>VIP Tickets:</strong> {formData.vipTickets}</p>
          <p><strong>Regular Tickets:</strong> {formData.regularTickets}</p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setReviewing(false)}
              className="bg-gray-400 text-white py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleConfirmAndPay}
              className="bg-[#128f8b] text-white py-2 px-4 rounded"
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
