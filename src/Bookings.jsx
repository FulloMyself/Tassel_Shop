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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Existing Booking Submission (Email Only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://email-server-5l9g.onrender.com/send-manufacturing-booking",
        formData
      );
      window.location.href = `/#/shop?payFor=${formData.service}`;
      alert("Booking request sent! Redirecting to payment...");
    } catch (error) {
      console.error(error);
      alert("Error sending booking. Try again.");
    }
  };

  // ✅ New Payment Button Logic (Direct PayFast Payment)
  const handlePayment = async () => {
    if (!formData.email || !formData.service) {
      alert("Please complete the form before paying.");
      return;
    }

    // Determine price based on selected service
    const prices = {
      "Swedish Massage": 500,
      "Deep Tissue Massage": 700,
    };
    const total = prices[formData.service] || 0;

    if (total === 0) {
      alert("Please select a valid service.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://your-payment-portal-url.onrender.com/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: [{ name: formData.service, quantity: 1, price: total }],
            total,
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (data.payfast_url) {
        const payForm = document.createElement("form");
        payForm.method = "POST";
        payForm.action = data.payfast_url;

        Object.keys(data).forEach((key) => {
          if (key !== "payfast_url") {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            payForm.appendChild(input);
          }
        });

        document.body.appendChild(payForm);
        payForm.submit();
      } else {
        alert("Payment portal error. Try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to payment portal.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* ✅ Existing Booking Button */}
        <button
          type="submit"
          className="bg-gold text-white p-3 w-full rounded-lg font-bold"
        >
          Book Now
        </button>

        {/* ✅ New Direct Payment Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className="bg-pink-600 text-white p-3 w-full rounded-lg font-bold hover:bg-pink-700 mt-2"
        >
          {loading ? "Redirecting to PayFast..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
