import React from "react";

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "20px 10px", background: "#f8f5f0" }}>
      {/* ✅ Logo */}
      <a href="https://tasselgroup.co.za/">
        <img
          src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`}
          alt="Tassel Logo"
          className="logo"
          style={{ height: 40, marginBottom: 8 }}
        />
      </a>

      {/* ✅ Social Media Icons */}
      <div className="social-icons" style={{ margin: "10px 0" }}>
        <a
          href="https://facebook.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          style={{ margin: "0 8px", color: "#8b6f4e", fontSize: 18 }}
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://instagram.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          style={{ margin: "0 8px", color: "#8b6f4e", fontSize: 18 }}
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://wa.me/27729605153"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          style={{ margin: "0 8px", color: "#8b6f4e", fontSize: 18 }}
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href="https://tiktok.com/@tasselgroup"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
          style={{ margin: "0 8px", color: "#8b6f4e", fontSize: 18 }}
        >
          <i className="fab fa-tiktok"></i>
        </a>
        <a
          href="mailto:info@tasselgroup.co.za"
          title="Email"
          style={{ margin: "0 8px", color: "#8b6f4e", fontSize: 18 }}
        >
          <i className="fas fa-envelope"></i>
        </a>
      </div>

      {/* ✅ Footer Text */}
      <p style={{ fontSize: 14, color: "#777" }}>
        &copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio
      </p>
    </footer>
  );
}
