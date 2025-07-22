import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Bookings() {
  // ✅ FORM STATES
  const [forWhom, setForWhom] = useState("myself");
  const [services, setServices] = useState([]);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ DYNAMIC SERVICES (edit here later or load from JSON)
  const availableServices = [
    { name: "Swedish Massage", duration: 60, price: 500 },
    { name: "Deep Tissue Massage", duration: 90, price: 700 },
    { name: "Hot Stone Massage", duration: 75, price: 650 },
  ];

  // ✅ BUSINESS HOURS for Time Picker
  const businessHours = {
    Tuesday: { start: "08:30", end: "17:00" },
    Wednesday: { start: "08:30", end: "17:00" },
    Thursday: { start: "08:30", end: "17:00" },
    Friday: { start: "08:30", end: "17:00" },
    Saturday: { start: "08:30", end: "16:00" },
    Sunday: { start: "09:00", end: "14:00" },
  };

  // ✅ Generate available slots (every 30 min)
  const generateTimeSlots = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const hours = businessHours[today];
    if (!hours) return [];

    const slots = [];
    let [h, m] = hours.start.split(":").map(Number);
    const [endH, endM] = hours.end.split(":").map(Number);

    while (h < endH || (h === endH && m <= endM)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30;
      if (m >= 60) {
        h++;
        m = 0;
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // ✅ ADD / REMOVE SERVICES
  const addService = (service) => {
    if (!services.find((s) => s.name === service.name)) {
      setServices([...services, service]);
    }
    setShowServiceSelector(false);
  };

  const removeService = (name) => {
    setServices(services.filter((s) => s.name !== name));
  };

  // ✅ TOTAL
  const total = services.reduce((sum, s) => sum + s.price, 0);

  // ✅ ENV VARIABLES
  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  // ✅ BOOK NOW (Email Only)
  const handleBookNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${emailServer}/send-order`, {
        forWhom,
        services,
        selectedTime,
        email,
      });
      setSuccess("Booking request sent successfully!");
    } catch (err) {
      console.error(err);
      setError("Error sending booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ PAY NOW (PayFast)
  const handlePayNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${paymentPortal}/create-order`, {
        items: services.map((s) => ({ name: s.name, quantity: 1, price: s.price })),
        total,
        email,
      });
      submitPayFastForm(res.data);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit PayFast Form
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
    <div className="booking-container">
      {/* LEFT PANEL */}
      <div className="booking-left">
        <div className="for-who">
          <h3>I want to book for:</h3>
          <div className="who-buttons">
            <button
              className={forWhom === "myself" ? "active" : ""}
              onClick={() => setForWhom("myself")}
            >
              👤 Just myself
            </button>
            <button
              className={forWhom === "others" ? "active" : ""}
              onClick={() => setForWhom("others")}
            >
              👥 Me and others
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="selected-services">
          <h3>Your Selected Services</h3>
          {services.length === 0 ? (
            <p>No services selected yet.</p>
          ) : (
            services.map((s, i) => (
              <div key={i} className="service-card">
                <div>
                  <strong>{s.name}</strong>
                  <p>⏱ {s.duration} mins | R{s.price}.00</p>
                </div>
                <button className="remove-btn" onClick={() => removeService(s.name)}>
                  ✖ Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="actions">
          <button
            className="choose-staff-time"
            onClick={() => alert("Staff selection coming soon!")}
          >
            📅 Choose Staff & Time
          </button>
          <button className="add-service" onClick={() => setShowServiceSelector(true)}>
            ➕ Add Another Service
          </button>
        </div>

        {/* Time Picker */}
        <div className="time-picker">
          <h4>Select Time:</h4>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="time-select"
          >
            <option value="">Choose a time slot</option>
            {timeSlots.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Your email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Payment Buttons */}
        <div className="payment-buttons">
          <button
            onClick={handleBookNow}
            disabled={!email || services.length === 0 || loading}
          >
            {loading ? "Processing..." : "📩 Book Now"}
          </button>

          <button
            className="pay-btn"
            onClick={handlePayNow}
            disabled={!email || services.length === 0 || loading}
          >
            {loading ? "Processing..." : "💳 Pay Now"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {showServiceSelector && (
          <div className="service-selector">
            <h4>Select a Service</h4>
            {availableServices.map((service, i) => (
              <button
                key={i}
                onClick={() => addService(service)}
                className="service-option"
              >
                {service.name} - R{service.price}.00
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="booking-right">
        <h2>Tassel Beauty & Wellness</h2>
        <button className="visit-btn">Visit Us</button>
        <div className="business-hours">
          <h4>Business Hours</h4>
          <ul>
            <li>Monday: Closed</li>
            <li>Tuesday: 8:30 am – 5:00 pm</li>
            <li>Wednesday: 8:30 am – 5:00 pm</li>
            <li>Thursday: 8:30 am – 5:00 pm</li>
            <li>Friday: 8:30 am – 5:00 pm</li>
            <li>Saturday: 8:30 am – 4:00 pm</li>
            <li>Sunday: 9:00 am – 2:00 pm</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
