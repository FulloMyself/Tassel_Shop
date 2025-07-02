import React from "react";

export default function Header({ cartCount, toggleCart }) {
  return (
    <header>
      <div className="header-content">
        <div className="branding">
          <div className="sliding-text-container">
            <p className="sliding-text">55 True North Road, Mulbarton, Gauteng.</p>
          </div>
          <a href="https://tasselgroup.co.za/shop">
            <img src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`} alt="Tassel Logo" className="logo" />
          </a>
          <div>
            <h1>Tassel Beauty And Wellness Studio - Online Store</h1>
            <p>Your favorite beauty products at your fingertips!</p>
          </div>
        </div>
        <div id="cart-icon" onClick={toggleCart} title="Open cart">
          <span id="cart-icon-symbol">🛒</span>
          <span id="cart-count">{cartCount}</span>
        </div>
      </div>
    </header>
  );
}