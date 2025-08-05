import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import servicesData from "./Services.json";
import "./styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const totalRef = useRef(null);

useEffect(() => {
  if (totalRef.current) {
    gsap.fromTo(
      totalRef.current,
      { scale: 1.1, color: "#ff4081" },
      { scale: 1, color: "#000", duration: 0.3, ease: "power2.out" }
    );
  }
}, [services]);

const contactRef = useRef(null);

useEffect(() => {
  if (contactRef.current) {
    gsap.from(contactRef.current.querySelectorAll(".social-icon"), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.7)"
    });
  }
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
    if (forWhom === "myself") {
      if (!services.find((s) => s.name === service.name)) {
        setServices([...services, { ...service, quantity: 1 }]);
        toast.success(`✅ ${service.name} has been added to your booking.`);
      } else {
        toast.warn(`⚠️ ${service.name} is already in your booking.`);
      }
    } else {
      const existingService = services.find((s) => s.name === service.name);
      if (existingService) {
        setServices(
          services.map((s) =>
            s.name === service.name
              ? { ...s, quantity: s.quantity + 1 }
              : s
          )
        );
        toast.info(`➕ Increased quantity for ${service.name}.`);
      } else {
        setServices([...services, { ...service, quantity: 1 }]);
        toast.success(`✅ ${service.name} has been added to your booking.`);
      }
    }
    setShowServiceSelector(false);
  };

  const updateQuantity = (name, change) => {
    setServices((prev) =>
      prev.map((s) =>
        s.name === name
          ? { ...s, quantity: Math.max(1, s.quantity + change) }
          : s
      )
    );

    toast.info(
      change > 0
        ? `➕ Increased quantity for ${name}.`
        : `➖ Reduced quantity for ${name}.`
    );
  };

  const removeService = (name) => {
    const serviceToRemove = services.find((s) => s.name === name);

    if (forWhom === "others" && serviceToRemove?.quantity > 1) {
      setServices(
        services.map((s) =>
          s.name === name ? { ...s, quantity: s.quantity - 1 } : s
        )
      );
      toast.info(`➖ Reduced quantity for ${name}.`);
    } else {
      setServices(services.filter((s) => s.name !== name));
      toast.error(`🗑 ${name} removed from booking.`);
    }
  };

  const total = services.reduce(
    (sum, s) => sum + s.price * (s.quantity || 1),
    0
  );

  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  const handleBookNow = async () => {
    if (!selectedTime) return toast.warn("⏰ Please choose a time slot.");
    if (!email) return toast.warn("📧 Please enter your email address.");
    if (services.length === 0)
      return toast.error("💆‍♀️ Please select at least one service.");

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
      toast.success("📩 Booking request sent successfully!");
    } catch (err) {
      setError("Error sending booking. Try again.");
      toast.error("❌ Error sending booking. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedTime) return toast.warn("⏰ Please choose a time slot.");
    if (!email) return toast.warn("📧 Please enter your email address.");
    if (services.length === 0)
      return toast.error("💆‍♀️ Please select at least one service.");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${paymentPortal}/create-order`, {
        items: services.map((s) => ({
          name: s.name,
          quantity: s.quantity || 1,
          price: s.price,
        })),
        total,
        email,
      });
      submitPayFastForm(res.data);
    } catch (err) {
      setError("Payment failed. Try again.");
      toast.error("❌ Payment failed. Try again.");
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
      if (key !== "payfast_url") {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="booking-page">
      {/* Hero */}
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

      {/* Booking Form */}
      <div className="booking-wrapper" ref={formRef}>
        <div className="booking-card">
          {/* Left */}
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

            {/* Total */}
            <div className="total-price" ref={totalRef}>
  <strong>Total: </strong>R{total}.00
</div>


            {/* Selected Services */}
            <p className="label">Selected Services</p>
            {services.length === 0 ? (
              <p className="empty-state">No services selected yet.</p>
            ) : (
              services.map((s, i) => (
                <div key={i} className="service-card">
                  <div>
                    <strong>{s.name}</strong>
                    <p className="service-details">
                      ⏱ {s.duration} mins | R{s.price}.00{" "}
                      {s.quantity > 1 && <span> × {s.quantity}</span>}
                    </p>
                  </div>

                  <div className="quantity-controls">
                    {forWhom === "others" && (
                      <>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(s.name, -1)}
                        >
                          ➖
                        </button>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(s.name, 1)}
                        >
                          ➕
                        </button>
                      </>
                    )}
<button
  className="remove-btn"
  onClick={() => {
    setServices(services.filter((item) => item.name !== s.name));
    toast.error(`🗑 ${s.name} removed from booking.`);
  }}
>
  ✖
</button>
                  </div>
                </div>
              ))
            )}

            {/* Add Service */}
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
                disabled={loading}
              >
                {loading ? "Processing..." : "📩 Book Now"}
              </button>
              <button
                className="spa-btn pay-btn"
                onClick={handlePayNow}
                disabled={loading}
              >
                {loading ? "Processing..." : "💳 Pay Now"}
              </button>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {/* Service Selector */}
            {showServiceSelector && (
              <div className="service-selector" ref={selectorRef}>
                {/* Mobile close button */}
    <button
      className="close-selector-btn"
      onClick={() => setShowServiceSelector(false)}
    >
      ✖
    </button>
                <h4>Select a Service</h4>
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

          {/* Right */}
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

{/* ✅ Contact Card */}
<div className="contact-card" ref={contactRef}>
  <h4>Contact Us</h4>
  <div className="social-icons">
    <a href="https://facebook.com/tasselbeauty" target="_blank" rel="noopener noreferrer" className="social-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#3b5998" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 .013.592.013 1.324v21.351c0 .732.584 1.325 1.312 1.325h11.492v-9.282H9.692V9.691h3.125V7.309c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.464.099 2.797.143v3.244h-1.92c-1.507 0-1.799.717-1.799 1.765v2.318h3.598l-.468 3.327h-3.13V24h6.133c.729 0 1.312-.593 1.312-1.325V1.324C23.988.592 23.404 0 22.675 0z"/></svg>
    </a>
    <a href="https://instagram.com/tasselbeauty" target="_blank" rel="noopener noreferrer" className="social-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#E1306C" viewBox="0 0 24 24"><path d="M7.75 2h8.5C19.097 2 21 3.903 21 6.25v8.5C21 18.097 19.097 20 16.25 20h-8.5C4.903 20 3 18.097 3 15.25v-8.5C3 3.903 4.903 2 7.75 2zM12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.5-.625a1.125 1.125 0 1 1-1.125-1.125A1.126 1.126 0 0 1 18.5 6.875zM12 9a3 3 0 1 1-3 3 3.003 3.003 0 0 1 3-3z"/></svg>
    </a>
    <a href="https://wa.me/27679304049" target="_blank" rel="noopener noreferrer" className="social-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.029-.967-.273-.102-.472-.149-.671.15-.197.297-.768.966-.941 1.164-.174.198-.348.223-.645.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.373-.025-.521-.075-.149-.671-1.612-.919-2.207-.242-.579-.487-.5-.671-.51-.174-.007-.373-.009-.572-.009-.199 0-.521.075-.794.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.099 3.205 5.077 4.492.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347zM12.004 2c-5.514 0-9.996 4.482-9.996 9.996 0 1.761.46 3.482 1.337 5.006L2 22l5.121-1.341a9.94 9.94 0 0 0 4.883 1.25h.001c5.514 0 9.996-4.482 9.996-9.996s-4.482-9.996-9.996-9.996z"/></svg>
    </a>
    <a href="mailto:info@tasselgroup.co.za" className="social-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#EA4335" viewBox="0 0 24 24"><path d="M12 13.065L0 6.375V19.5A1.5 1.5 0 0 0 1.5 21h21a1.5 1.5 0 0 0 1.5-1.5V6.375l-12 6.69zM12 11l12-6.75H0L12 11z"/></svg>
    </a>
  </div>
</div>

          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
