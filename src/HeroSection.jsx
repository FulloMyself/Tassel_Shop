// src/HeroSection.jsx
import React from "react";
import "./styles.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Glow Starts Here</h1>
        <p className="hero-subtitle">Discover our natural skincare essentials.</p>
        <a href="#product-list" className="hero-cta">Shop Now</a>
      </div>
    </section>
  );
}
