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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Use the same env variables as Cart.jsx
  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Existing Email Booking Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${emailServer}/send-manufacturing-booking`, formData);
      window.location.href = `/#/shop?payFor=${formData.service}`;
      alert("Booking request sent! Redirecting to payment...");
    } catch (error) {
      console.error(error);
      alert("Error sending booking. Try again.");
    }
  };

  // ✅ New Direct Payment Logic (same as Cart.jsx)
  const handlePayment = async () => {
    if (!formData.email || !formData.email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    if (!formData.service) {
      alert("Please select a massage service.");
      return;
    }

    const prices = {
      "Swedish Massage": 500,
      "Deep Tissue Massage": 700,
    };
    const total = prices[formData.service] || 0;

    if (total === 0) {
      alert("Invalid service selected.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${paymentPortal}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: formData.service, quantity: 1, price: total }],
          total,
          email: formData.email,
        }),
      });

      if (!res.ok) throw new Error("Failed to initiate payment.");
      const payfastFields = await res.json();

      submitPayFastForm(payfastFields);
    } catch (err) {
      console.error(err);
      setError("Could not start payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  function submitPayFastForm(fields) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = fields.payfast_url;
    form.style.display = "none";

    Object.entries(fields).forEach(([key, value]) => {
      if (key === "payfast_url") return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gold">Massage Bookings</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-md"
      >
        <input
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="service"
          className="border p-2 w-full"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="">Select a Massage</option>
          <option value="Swedish Massage">Swedish Massage - R500</option>
          <option value="Deep Tissue Massage">Deep Tissue Massage - R700</option>
        </select>

        <input
          type="date"
          name="date"
          className="border p-2 w-full"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          className="border p-2 w-full"
          value={formData.time}
          onChange={handleChange}
          required
        />

        {/* ✅ Existing Booking Email Button */}
        <button
          type="submit"
          className="bg-gold text-white p-3 w-full rounded-lg font-bold"
          disabled={loading}
        >
          Book Now
        </button>

        {/* ✅ New Payment Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className="bg-pink-600 text-white p-3 w-full rounded-lg font-bold hover:bg-pink-700 mt-2"
        >
          {loading ? "Redirecting to PayFast..." : "Pay Now"}
        </button>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
    </div>
  );
}
