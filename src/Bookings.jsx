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
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherMessage, setVoucherMessage] = useState("");


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
      const icons = contactRef.current.querySelectorAll(".social-icon svg");

      gsap.fromTo(
        icons,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(icons, {
              scale: 1.15,
              duration: 1.5,
              yoyo: true,
              repeat: -1,
              ease: "easeInOut",
              stagger: {
                each: 0.3,
                repeat: -1,
                yoyo: true
              }
            });
          }
        }
      );
    }
  }, []);

  // Slide-in animation for service selector
  useEffect(() => {
    if (selectorRef.current) {
      if (showServiceSelector) {
        gsap.fromTo(
          selectorRef.current,
          { x: window.innerWidth > 768 ? 400 : 0, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      } else {
        if (window.innerWidth > 768) {
          gsap.to(selectorRef.current, {
            x: 400,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
          });
        }
      }
    }
  }, [showServiceSelector]);

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
        toast.success(`${service.name} has been added to your booking.`);
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

  // Total calculation:
const totalBeforeDiscount = services.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);

const total = appliedVoucher
  ? appliedVoucher.type === "percent"
    ? Math.max(0, totalBeforeDiscount * (1 - appliedVoucher.value)) // value like 0.1
    : Math.max(0, totalBeforeDiscount - appliedVoucher.value)
  : totalBeforeDiscount;

  const handleApplyVoucher = async () => {
  if (!voucherCode.trim()) return toast.warn("⚠️ Please enter a voucher code.");

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_EMAIL_SERVER_URL}/api/validate-voucher`,
      { code: voucherCode }
    );
    const voucher = res.data.voucher;
    if (!voucher) throw new Error("Voucher data missing from server.");

    // Normalize percent values
    if (voucher.type === "percent") voucher.value = voucher.value / 100;

    setAppliedVoucher(voucher);

    // Calculate total before discount
    const totalBeforeDiscount = services.reduce(
      (sum, s) => sum + s.price * (s.quantity || 1),
      0
    );

    // Calculate discount in rands
    const discountAmount =
      voucher.type === "percent"
        ? totalBeforeDiscount * voucher.value
        : voucher.value;

    setDiscount(Math.min(discountAmount, totalBeforeDiscount));

    // Craft success message
    const formattedDiscount = discountAmount.toFixed(2);
    const discountMessage =
      voucher.type === "percent"
        ? `✅ ${voucher.description} applied! You saved R${formattedDiscount} (${voucher.value * 100}% off).`
        : `✅ ${voucher.description} applied! You saved R${formattedDiscount}.`;

    setVoucherMessage(discountMessage);
    toast.success("Voucher applied!");
  } catch (err) {
    console.error(err);
    setAppliedVoucher(null);
    setDiscount(0);
    setVoucherMessage("❌ Invalid or expired voucher.");
    toast.error("Invalid voucher.");
  }
};



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

            {/* Voucher Section */}
            <div className="voucher-section">
              <input
                type="text"
                placeholder="Enter voucher code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="voucher-input"
              />
              <button className="spa-btn" onClick={handleApplyVoucher}>
                Apply
              </button>
              {voucherMessage && <p className="voucher-message">{voucherMessage}</p>}
            </div>


            {/* Total */}
            <div className="total-price" ref={totalRef}>
              <strong>Total: </strong>R{total.toFixed(2)}
              {appliedVoucher && <span> (discount applied)</span>}
            </div>
            {voucherMessage && <p className="voucher-message">{voucherMessage}</p>}




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

              <div className={`service-selector ${showServiceSelector ? "open" : ""}`} ref={selectorRef}>

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

            {/* Contact Card */}
            <div className="contact-card" ref={contactRef}>
              <h4>Connect With Us</h4>
              <div className="social-icons">
                {/* Facebook */}
                <a href="https://facebook.com/tasselbeautyandwellnessstudio" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#a67c52" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.597 0 0 .6 0 1.333v21.333C0 23.4.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.657-4.788 1.324 0 2.463.097 2.795.141v3.24l-1.918.001c-1.504 0-1.797.716-1.797 1.764v2.314h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.4 24 22.667V1.333C24 .6 23.403 0 22.675 0z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="https://instagram.com/tasselbeautyandwellnessstudio" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#a67c52" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.75-.88a.88.88 0 1 1-1.76 0 .88.88 0 0 1 1.76 0Z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/27729605153" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#a67c52" viewBox="0 0 24 24">
                    <path d="M20.52 3.48a11.91 11.91 0 0 0-16.9 0c-4.66 4.66-4.66 12.24 0 16.9A11.91 11.91 0 0 0 12 24c2.02 0 4-.5 5.76-1.46l3.58 1.06a1 1 0 0 0 1.25-1.25l-1.06-3.58A11.91 11.91 0 0 0 24 12c0-3.18-1.24-6.17-3.48-8.52ZM12 21.5c-1.86 0-3.64-.48-5.21-1.39a1 1 0 0 0-.88-.08l-2.63.78.78-2.63a1 1 0 0 0-.08-.88A9.92 9.92 0 0 1 2 12C2 6.48 6.48 2 12 2c2.66 0 5.17 1.04 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10Zm4.3-6.7c-.24-.12-1.4-.7-1.62-.78s-.37-.12-.53.12-.62.78-.76.94-.28.18-.52.06a8.1 8.1 0 0 1-2.4-1.48 9.03 9.03 0 0 1-1.68-2.07c-.18-.3 0-.46.12-.58.12-.12.24-.3.36-.46.12-.18.18-.3.3-.5s.06-.36 0-.5c-.06-.12-.53-1.28-.72-1.76-.18-.44-.36-.38-.53-.38h-.44c-.14 0-.38.06-.58.28s-.76.74-.76 1.8.78 2.08.9 2.22c.12.18 1.54 2.36 3.72 3.3.52.22.92.34 1.24.44.52.16 1 .14 1.38.08.42-.06 1.3-.54 1.48-1.06.18-.54.18-.98.12-1.06-.06-.08-.22-.14-.46-.26Z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com/@tasselgroup" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#a67c52" viewBox="0 0 24 24">
                    <path d="M12.75 2v13.5a3.75 3.75 0 1 1-3.75-3.75h.75V8.25H9a7.5 7.5 0 1 0 7.5 7.5V9.75a6.75 6.75 0 0 0 3.75 1.125V8.25a3 3 0 0 1-3-3V2h-4.5Z" />
                  </svg>
                </a>

                {/* Email */}
                <a href="mailto:info@tasselgroup.co.za" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#a67c52" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2Zm0 2v.01L12 13l8-6.99V6H4Zm0 2.2V18h16V8.2l-8 7-8-7Z" />
                  </svg>
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
