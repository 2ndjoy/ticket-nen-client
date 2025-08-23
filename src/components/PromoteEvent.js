import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function PromoteEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    contactEmail: "",
    vipTicketQuantity: 0,
    ticketQuantity: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your event...");

    try {
      // Convert ticket quantities to numbers
      const payload = {
        ...formData,
        vipTicketQuantity: Number(formData.vipTicketQuantity),
        ticketQuantity: Number(formData.ticketQuantity),
      };

      const response = await fetch("http://localhost:5000/api/promoteevents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event.");
      }

      toast.success("Event created successfully!", { id: loadingToast });
      navigate("/organizer/my-events");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-light font-serif">
      <div className="bg-gradient-to-r from-[#128f8b] to-[#0e6b69] text-white p-6 rounded-lg shadow-md mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Register as an organizer to promote your event
        </h2>
        <p className="mb-4">Reach more people and manage your event easily.</p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-[#128f8b] font-semibold px-6 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          Register Now
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Promote Your Event</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Event Title", name: "title", type: "text", required: true },
          { label: "Date", name: "date", type: "date", required: true },
          { label: "Location", name: "location", type: "text", required: true },
          { label: "Description", name: "description", type: "textarea", required: true },
          { label: "Image URL", name: "imageUrl", type: "url", required: true },
          { label: "Video URL (Optional)", name: "videoUrl", type: "url" },
          { label: "Contact Email", name: "contactEmail", type: "email", required: true },
          { label: "VIP Ticket Quantity", name: "vipTicketQuantity", type: "number" },
          { label: "Ticket Quantity", name: "ticketQuantity", type: "number", required: true },
        ].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-semibold">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required={field.required || false}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder={field.label}
                min={field.type === "number" ? 0 : undefined}
                required={field.required || false}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#128f8b] text-white font-semibold py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Event"}
        </button>
      </form>
    </div>
  );
}
