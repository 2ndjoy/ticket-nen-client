import React, { useState } from "react";

export default function PromoteEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    email: "",
    phone: "",
    ticketCategories: [], // selected categories like ["VIP", "Regular"]
    ticketQuantities: {}, // { VIP: 0, Regular: 0 }
  });

  const [submitted, setSubmitted] = useState(false);

  const ticketOptions = ["VIP", "Regular"];

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let newCategories = [...formData.ticketCategories];

    if (checked) {
      newCategories.push(value);
      setFormData((prev) => ({
        ...prev,
        ticketCategories: newCategories,
        ticketQuantities: { ...prev.ticketQuantities, [value]: 1 }, // default 1 qty on add
      }));
    } else {
      newCategories = newCategories.filter((cat) => cat !== value);
      const { [value]: _, ...restQuantities } = formData.ticketQuantities;
      setFormData((prev) => ({
        ...prev,
        ticketCategories: newCategories,
        ticketQuantities: restQuantities,
      }));
    }
  };

  const handleQuantityChange = (e, category) => {
    const value = Math.max(0, Number(e.target.value));
    setFormData((prev) => ({
      ...prev,
      ticketQuantities: {
        ...prev.ticketQuantities,
        [category]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.date ||
      !formData.location ||
      !formData.description ||
      !formData.email ||
      !formData.phone ||
      formData.ticketCategories.length === 0
    ) {
      alert("Please fill all required fields and select at least one ticket category.");
      return;
    }

    // Check ticket quantities > 0 for each category
    for (const cat of formData.ticketCategories) {
      if (!formData.ticketQuantities[cat] || formData.ticketQuantities[cat] <= 0) {
        alert(`Please enter a valid ticket quantity for ${cat}.`);
        return;
      }
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-light font-serif">
      <h1 className="text-3xl font-bold mb-6 text-center">Promote Your Event</h1>

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

        {/* video url */}

        <div>
          <label className="block mb-1 font-semibold" htmlFor="imageUrl">
            Video URL (optional)
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

        {/* Ticket Categories */}
        <div>
          <label className="block mb-2 font-semibold">
            Ticket Categories <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-6 mb-4">
            {ticketOptions.map((option) => (
              <label key={option} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ticketCategories"
                  value={option}
                  checked={formData.ticketCategories.includes(option)}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

          {/* Show quantity inputs only for selected categories */}
          {formData.ticketCategories.length > 0 && (
            <div>
              <p className="mb-1 font-semibold">Ticket Quantities</p>
              <div className="flex space-x-6">
                {formData.ticketCategories.map((category) => (
                  <div key={category} className="flex flex-col">
                    <label className="mb-1 font-medium">{category}</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.ticketQuantities[category] || 0}
                      onChange={(e) => handleQuantityChange(e, category)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded transition"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-3">{formData.title}</h2>
          <p className="text-gray-600 mb-1">
            <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-1">
            <strong>Location:</strong> {formData.location}
          </p>
          <p className="mb-4">{formData.description}</p>
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt={formData.title}
              className="w-full max-h-72 object-cover rounded mb-4"
            />
          )}
          <p className="mb-1">
            <strong>Contact Email:</strong> {formData.email}
          </p>
          <p className="mb-1">
            <strong>Contact Phone:</strong> {formData.phone}
          </p>

          <div>
            <strong>Ticket Info:</strong>
            <ul className="list-disc ml-5">
              {formData.ticketCategories.map((cat) => (
                <li key={cat}>
                  {cat}: {formData.ticketQuantities[cat]} tickets
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
