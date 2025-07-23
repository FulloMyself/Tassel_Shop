// src/HeroSection.jsx
import React from "react";
import "./styles.css";

export default function HeroSection() {
  const handleScrollToProducts = (e) => {
    e.preventDefault();
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="booking-hero">
      <img
        src={`${import.meta.env.BASE_URL}images/products/Hero_Tassel.png`}
        alt="Tassel Beauty background"
        className="hero-image"
      />
      <div className="hero-content-img">
        <h1 className="hero-title">Glow Starts Here</h1>
        <p className="hero-subtitle">Discover our natural skincare essentials.</p>
        <button
          className="hero-cta"
          onClick={() => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })}
      >
          Shop Now
      </button>
      </div>
    </section>
  );
}
