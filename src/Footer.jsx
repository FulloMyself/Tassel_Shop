import React from "react";

export default function Footer() {
  return (
    <footer>
      <a href="https://tasselgroup.co.za/">
            <img src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`} alt="Tassel Logo" className="logo" style={{ height: 40, marginBottom: 8 }}/>
          </a>
      <p>&copy; {new Date().getFullYear()} Tassel Beauty And Wellness Studio</p>
    </footer>
  );
}