import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
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
  { key: "body", label: "Body Contouring" },
];

export default function Bookings() {
  const [forWhom, setForWhom] = useState("myself");
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTime, setSelectedTime] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);
  const selectorRef = useRef(null);

  const servicesPerPage = 8;

  useEffect(() => {
    setAvailableServices(servicesData);
  }, []);

  useEffect(() => {
    if (showServiceSelector && selectorRef.current) {
      gsap.from(selectorRef.current.querySelectorAll(".service-card"), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [showServiceSelector, selectedCategory, currentPage]);

  const businessHours = {
    Monday: { start: "09:00", end: "17:00" },
    Tuesday: { start: "09:00", end: "17:00" },
    Wednesday: { start: "09:00", end: "17:00" },
    Thursday: { start: "09:00", end: "17:00" },
    Friday: { start: "09:00", end: "17:00" },
    Saturday: { start: "09:00", end: "17:00" },
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const generateTimeSlots = () => {
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

  const filteredServices =
    selectedCategory === "all"
      ? availableServices
      : availableServices.filter((s) => s.category === selectedCategory);

  const searchedServices = filteredServices.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(searchedServices.length / servicesPerPage);
  const paginatedServices = searchedServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  const addService = (service) => {
    if (!services.find((s) => s.name === service.name)) {
      setServices([...services, service]);
    }
    setShowServiceSelector(false);
  };

  const removeService = (name) => {
    setServices(services.filter((s) => s.name !== name));
  };

  const total = services.reduce((sum, s) => sum + s.price, 0);

  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  const handleBookNow = async () => {
  if (!selectedTime) {
    showToast("⏰ Please choose a time slot before booking.");
    return;
  }
  if (!email) {
    showToast("📧 Please enter your email address.");
    return;
  }
  if (services.length === 0) {
    showToast("💆‍♀️ Please select at least one service.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    await axios.post(`${emailServer}/send-massage-booking`, {
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

const handlePayNow = async () => {
  if (!selectedTime) {
    showToast("⏰ Please choose a time slot before paying.");
    return;
  }
  if (!email) {
    showToast("📧 Please enter your email address.");
    return;
  }
  if (services.length === 0) {
    showToast("💆‍♀️ Please select at least one service.");
    return;
  }

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

  const [toast, setToast] = useState("");

  const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(""), 3000); // hides toast after 3s
  };

  return (
    <div className="booking-page">
      {/* ✅ HERO SECTION */}
      <section className="booking-hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Relax. Refresh. Rejuvenate.</h1>
          <p className="hero-subtitle">
            Book your massage at Tassel Beauty & Wellness Studio today.
          </p>
          <button className="hero-button" onClick={scrollToForm}>
            Book Now
          </button>
        </div>
      </section>

      {/* ✅ BOOKING FORM */}
      <div className="booking-wrapper" ref={formRef}>
        <div className="booking-card">
          {/* Left Column */}
          <div className="booking-left">
            <h2 className="section-title">Your Booking Details</h2>

            {/* For Whom */}
            <div className="for-who">
              <p className="label">Booking For:</p>
              <div className="who-buttons">
                <button
                  className={`spa-btn ${forWhom === "myself" ? "active" : ""}`}
                  onClick={() => setForWhom("myself")}
                >
                  👤 Myself
                </button>
                <button
                  className={`spa-btn ${forWhom === "others" ? "active" : ""}`}
                  onClick={() => setForWhom("others")}
                >
                  👥 Me & Others
                </button>
              </div>
            </div>

            {/* Selected Services */}
            <div className="selected-services">
              <p className="label">Selected Services</p>
              {services.length === 0 ? (
                <p className="empty-state">No services selected yet.</p>
              ) : (
                services.map((s, i) => (
                  <div key={i} className="service-card">
                    <div>
                      <strong>{s.name}</strong>
                      <p className="service-details">
                        ⏱ {s.duration} mins | R{s.price}.00
                      </p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeService(s.name)}
                    >
                      ✖
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              className="spa-btn add-service"
              onClick={() => setShowServiceSelector(true)}
            >
              ➕ Add Service
            </button>

            {/* Time Picker */}
            <div className="time-picker">
              <p className="label">Choose Time</p>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="time-select"
              >
                <option value="">Available Slots</option>
                {timeSlots.map((t, i) => (
                  <option key={i} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Your email address"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Payment Buttons */}
            <div className="payment-buttons">
              <button
                className="spa-btn"
                onClick={handleBookNow}
                disabled={!email || services.length === 0 || loading}
              >
                {loading ? "Processing..." : "📩 Book Now"}
              </button>
              <button
                className="spa-btn pay-btn"
                onClick={handlePayNow}
                disabled={!email || services.length === 0 || loading}
              >
                {loading ? "Processing..." : "💳 Pay Now"}
              </button>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {/* Service Selector */}
            {showServiceSelector && (
              <div className="service-selector" ref={selectorRef}>
                <h4>Select a Service</h4>
                {/* Dropdown and Search */}
                <div className="filter-bar">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Paginated Service List */}
                <div className="service-list">
                  {paginatedServices.map((service, i) => (
                    <div key={i} className="service-card">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="service-image"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "1rem",
                        }}
                      />
                      <div>
                        <strong>{service.name}</strong>
                        <p className="service-details">
                          ⏱ {service.duration} mins | R{service.price}.00
                        </p>
                        {expanded === i && (
                          <p className="service-desc">{service.description}</p>
                        )}
                        <button
                          className="spa-btn"
                          onClick={() =>
                            setExpanded(expanded === i ? null : i)
                          }
                        >
                          {expanded === i ? "Hide Details" : "View Details"}
                        </button>
                        <button
                          className="spa-btn add-btn"
                          onClick={() => addService(service)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="booking-right">
            <h2 className="studio-title">Tassel Beauty & Wellness</h2>
            <p className="studio-subtitle">
              Indulge in the ultimate relaxation experience.
            </p>
            <div className="business-hours">
              <h4>Business Hours</h4>
              <ul>
                <li>Monday – Saturday: 9am – 5:00pm</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
