import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#ffe7eb", // ✅ Same as Header
      }}
    >
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
      <div className="social-icons" style={{ marginTop: 10 }}>
        <a
          href="https://facebook.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          style={{ margin: "0 8px", color: "#000", fontSize: "1.2rem" }}
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://instagram.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          style={{ margin: "0 8px", color: "#000", fontSize: "1.2rem" }}
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://wa.me/27729605153"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          style={{ margin: "0 8px", color: "#000", fontSize: "1.2rem" }}
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href="https://tiktok.com/@tasselgroup"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
          style={{ margin: "0 8px", color: "#000", fontSize: "1.2rem" }}
        >
          <i className="fab fa-tiktok"></i>
        </a>
        <a
          href="mailto:info@tasselgroup.co.za"
          title="Email"
          style={{ margin: "0 8px", color: "#000", fontSize: "1.2rem" }}
        >
          <i className="fas fa-envelope"></i>
        </a>
      </div>

      {/* ✅ Footer Text */}
      <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
        &copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio
      </p>
    </footer>
  );
}
