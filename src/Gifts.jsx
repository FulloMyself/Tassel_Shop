import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const images = [
  "https://via.placeholder.com/300x300?text=Gift+Box+1",
  "https://via.placeholder.com/300x300?text=Gift+Box+2",
  "https://via.placeholder.com/300x300?text=Gift+Box+3",
];

export default function Gifts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://email-server-5l9g.onrender.com/send-manufacturing-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone + " (Gift Inquiry)",
          message: formData.message,
        }),
      });

      if (res.ok) {
        toast.success("Thank you! We'll get back to you soon.", {
          position: "top-center",
          autoClose: 3000,
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error("Failed to send. Please try again later.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error submitting:", err);
      toast.error("Something went wrong. Try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="gifts-page"
    >
      <div className="gifts-header">
        <h1>Tassel Beauty Gifts</h1>
        <p>Perfect gifting options for any occasion — enquire now!</p>
      </div>

      <div className="gift-gallery">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Gift ${idx + 1}`}
            onClick={() =>
              toast.info("To view image options, right-click the image.", {
                position: "top-center",
                autoClose: 2000,
              })
            }
          />
        ))}
      </div>
      <ToastContainer />

      <form className="gift-form" onSubmit={handleSubmit}>
        <h2>Express Your Interest</h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Contact Number"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Tell us what you're looking for..."
          rows="4"
          value={formData.message}
          onChange={handleChange}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Interest"}
        </button>
      </form>
    </motion.div>
  );
}
