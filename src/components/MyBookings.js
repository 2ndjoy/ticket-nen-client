import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${user.uid}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading your bookings...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-4">
              <img src={booking.eventImage} alt={booking.eventTitle} className="w-full h-40 object-cover rounded-md" />
              <h3 className="mt-3 font-bold">{booking.eventTitle}</h3>
              <p className="text-gray-600">{booking.date} at {booking.time}</p>
              <p className="text-gray-500">{booking.location}</p>
              <p className="text-[#128f8b] font-semibold">{booking.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
