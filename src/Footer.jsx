import React from "react";

export default function Footer() {
  return (
    <footer>
      <a href="https://tasselgroup.co.za/">
        <img
          src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`}
          alt="Tassel Logo"
          className="footer-logo"
        />
      </a>
      <div className="social-icons">
        <a href="https://facebook.com/tasselbeautyandwellnessstudio" target="_blank" title="Facebook"><i className="fab fa-facebook-f"></i></a>
        <a href="https://instagram.com/tasselbeautyandwellnessstudio" target="_blank" title="Instagram"><i className="fab fa-instagram"></i></a>
        <a href="https://wa.me/27729605153" target="_blank" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
        <a href="https://tiktok.com/@tasselgroup" target="_blank" title="TikTok"><i className="fab fa-tiktok"></i></a>
        <a href="mailto:info@tasselgroup.co.za" title="Email"><i className="fas fa-envelope"></i></a>
      </div>
      <p>&copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio</p>
    </footer>
  );
}
