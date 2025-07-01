import React, { useState } from "react";

export default function PromoteEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketCategories, setTicketCategories] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const ticketOptions = ["VIP", "Regular"];

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTicketCategories([...ticketCategories, value]);
      setTicketQuantities((prev) => ({ ...prev, [value]: 1 }));
    } else {
      setTicketCategories(ticketCategories.filter((c) => c !== value));
      const { [value]: _, ...rest } = ticketQuantities;
      setTicketQuantities(rest);
    }
  };

  const handleQuantityChange = (e, category) => {
    const qty = Math.max(0, Number(e.target.value));
    setTicketQuantities((prev) => ({ ...prev, [category]: qty }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !location || !description || !email || !phone || ticketCategories.length === 0) {
      return alert("Please fill all required fields and select at least one ticket category.");
    }
    for (const cat of ticketCategories) {
      if (!ticketQuantities[cat] || ticketQuantities[cat] <= 0) {
        return alert(`Please enter a valid ticket quantity for ${cat}.`);
      }
    }
    setSubmitted(true);
  };

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Event Title <span className="text-red-500">*</span></label>
          <input
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date <span className="text-red-500">*</span></label>
          <input
            type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Location <span className="text-red-500">*</span></label>
          <input
            type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description <span className="text-red-500">*</span></label>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            rows={4} placeholder="Enter description"
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image URL (optional)</label>
          <input
            type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Video URL (optional)</label>
          <input
            type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Contact Email <span className="text-red-500">*</span></label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter contact email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Contact Phone <span className="text-red-500">*</span></label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter contact phone"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Ticket categories */}
        <div>
          <label className="block mb-2 font-semibold">Ticket Categories <span className="text-red-500">*</span></label>
          <div className="flex space-x-6 mb-4">
            {ticketOptions.map(option => (
              <label key={option} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={ticketCategories.includes(option)}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {ticketCategories.length > 0 && (
            <div>
              <p className="mb-1 font-semibold">Ticket Quantities</p>
              <div className="flex space-x-6">
                {ticketCategories.map(cat => (
                  <div key={cat} className="flex flex-col">
                    <label className="mb-1 font-medium">{cat}</label>
                    <input
                      type="number"
                      min={0}
                      value={ticketQuantities[cat] || 0}
                      onChange={(e) => handleQuantityChange(e, cat)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded transition">
          Submit
        </button>
      </form>

      {submitted && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
          <p className="text-gray-600 mb-1"><strong>Location:</strong> {location}</p>
          <p className="mb-4">{description}</p>
          {imageUrl && <img src={imageUrl} alt={title} className="w-full max-h-72 object-cover rounded mb-4" />}
          <p className="mb-1"><strong>Contact Email:</strong> {email}</p>
          <p className="mb-1"><strong>Contact Phone:</strong> {phone}</p>
          <div>
            <strong>Ticket Info:</strong>
            <ul className="list-disc ml-5">
              {ticketCategories.map(cat => (
                <li key={cat}>{cat}: {ticketQuantities[cat]} tickets</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
