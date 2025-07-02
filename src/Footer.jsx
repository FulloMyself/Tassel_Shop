import React from "react";

export default function Footer() {
  return (
    <footer>
      <img
        src="/images/Tassel_LOGO.png"
        alt="Tassel Logo"
        className="footer-logo"
        style={{ height: 40, marginBottom: 8 }}
      />
      <p>&copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio</p>
    </footer>
  );
}