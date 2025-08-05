import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import servicesData from "./Services.json";
import "./styles.css";

const categories = [
  { key: "all", label: "All" },
  { key: "massage", label: "Massages" },
  { key: "nail", label: "Nail Services" },
  { key: "facial", label: "Facials" },
  { key: "event", label: "Events" },
  { key: "microneedling", label: "Microneedling" },
  { key: "wax", label: "Waxes" },
  { key: "chemical_peel", label: "Chemical Peels" },
  { key: "skin_tag_removals", label: "Skin Tag Removals" },
  { key: "add_on_treatments", label: "Add On Treatments" },
  { key: "body", label: "Body Contouring" }
];

export default function Bookings() {
  const [forWhom, setForWhom] = useState("myself");
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);

  const servicesPerPage = 8;

  useEffect(() => {
    setAvailableServices(servicesData);
  }, []);

  const filteredServices = availableServices.filter(
    (s) =>
      (selectedCategory === "all" || s.category === selectedCategory) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const addService = (service) => {
    if (!services.find((s) => s.name === service.name)) {
      setServices([...services, service]);
    }
  };

  const removeService = (name) => {
    setServices(services.filter((s) => s.name !== name));
  };

  const total = services.reduce((sum, s) => sum + s.price, 0);

  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  const handleBookNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${emailServer}/send-massage-booking`, {
        forWhom,
        services,
        selectedTime,
        email
      });
      setSuccess("Booking request sent successfully!");
    } catch (err) {
      console.error(err);
      setError("Error sending booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${paymentPortal}/create-order`, {
        items: services.map((s) => ({ name: s.name, quantity: 1, price: s.price })),
        total,
        email
      });
      submitPayFastForm(res.data);
    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Relax. Refresh. Rejuvenate.</h1>
          <p className="hero-subtitle">Book your treatment at Tassel Beauty today.</p>
          <button className="hero-button" onClick={scrollToForm}>Book Now</button>
        </div>
      </section>

      <div className="booking-wrapper" ref={formRef}>
        <div className="booking-card">
          <div className="booking-left">
            <h2 className="section-title">Your Booking Details</h2>

            <div className="dropdown-filter">
              <label>Filter by Category:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search service name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="service-list">
              {paginatedServices.map((service, i) => (
                <div key={i} className="service-card">
                  <img src={service.image} alt={service.name} className="service-image" />
                  <div>
                    <strong>{service.name}</strong>
                    <p className="service-details">⏱ {service.duration} mins | R{service.price}.00</p>
                    {expanded === i && <p>{service.description}</p>}
                    <button className="spa-btn" onClick={() => setExpanded(expanded === i ? null : i)}>
                      {expanded === i ? "Hide Details" : "View Details"}
                    </button>
                    <button className="spa-btn add-btn" onClick={() => addService(service)}>Add</button>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
              </div>
            </div>

            <div className="selected-services">
              <h3>Selected Services</h3>
              {services.map((s, i) => (
                <div key={i} className="selected-service">
                  {s.name} - R{s.price}.00
                  <button onClick={() => removeService(s.name)}>Remove</button>
                </div>
              ))}
              <p><strong>Total:</strong> R{total}.00</p>
            </div>

            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
              <option value="">Choose Time</option>
              {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"].map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleBookNow} disabled={loading || !email || services.length === 0}>
              {loading ? "Booking..." : "📩 Book Now"}
            </button>
            <button onClick={handlePayNow} disabled={loading || !email || services.length === 0}>
              {loading ? "Redirecting..." : "💳 Pay Now"}
            </button>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
