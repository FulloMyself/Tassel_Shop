import React, { useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use the SAME email server but new endpoint
      await axios.post("https://email-server-5l9g.onrender.com/send-manufacturing-booking", formData);
      
      // ✅ Redirect to payment portal (reuse Shop logic)
      window.location.href = `/#/shop?payFor=${formData.service}`;

      alert("Booking request sent! Redirecting to payment...");
    } catch (error) {
      console.error(error);
      alert("Error sending booking. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gold">Massage Bookings</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-md">
        <input name="name" placeholder="Full Name" className="border p-2 w-full" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" className="border p-2 w-full" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" className="border p-2 w-full" value={formData.phone} onChange={handleChange} required />

        <select name="service" className="border p-2 w-full" value={formData.service} onChange={handleChange} required>
          <option value="">Select a Massage</option>
          <option value="Swedish Massage">Swedish Massage - R500</option>
          <option value="Deep Tissue Massage">Deep Tissue Massage - R700</option>
        </select>

        <input type="date" name="date" className="border p-2 w-full" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" className="border p-2 w-full" value={formData.time} onChange={handleChange} required />

        <button type="submit" className="bg-gold text-white p-3 w-full rounded-lg font-bold">Book Now</button>
      </form>
    </div>
  );
}
