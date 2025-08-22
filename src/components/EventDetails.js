import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <img src={event.image} alt={event.title} className="w-full h-96 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.subtitle}</p>
      <div className="mb-4">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Price:</strong> {event.price === "Free" ? "Free" : `Starts from ${event.price}`}</p>
      </div>
      <button
  className="bg-[#128f8b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
  onClick={() => navigate(`/payment/${event._id || event.id}`)}
>
  Book Now
</button>
    </div>
  );
};

export default EventDetails;
