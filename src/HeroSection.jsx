// src/HeroSection.jsx
import React from "react";
import "./styles.css";

export default function HeroSection() {
  return (
    <section className="hero-section-img">
      <img
        src={`${import.meta.env.BASE_URL}images/products/Tassel_Retinol_A_&E_Night_Cream_Anti_Wrinkle.jpg`}
        alt="Tassel Beauty background"
        className="hero-image"
      />
      <div className="hero-content-img">
        <h1 className="hero-title">Glow Starts Here</h1>
        <p className="hero-subtitle">Discover our natural skincare essentials.</p>
        <a href="#product-list" className="hero-cta">Shop Now</a>
      </div>
    </section>
  );
}
