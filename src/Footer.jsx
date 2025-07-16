import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* ✅ Logo */}
      <a href="https://tasselgroup.co.za/">
        <img
          src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`}
          alt="Tassel Logo"
          className="logo footer-logo"
          style={{ height: 40, marginBottom: 8 }}
        />
      </a>

      {/* ✅ Social Media Icons */}
      <div className="social-icons">
        <a
          href="https://facebook.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://instagram.com/tasselbeautyandwellnessstudio"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://wa.me/27729605153"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href="https://tiktok.com/@tasselgroup"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
        >
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="mailto:info@tasselgroup.co.za" title="Email">
          <i className="fas fa-envelope"></i>
        </a>
      </div>

      {/* ✅ Footer Text */}
      <p>&copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio</p>
    </footer>
  );
}
