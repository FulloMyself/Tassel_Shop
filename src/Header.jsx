import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Header({ cartCount, toggleCart, hideCart }) {
  const cartRef = useRef(null);

  // Bounce animation whenever cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      gsap.fromTo(
        cartRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
    }
  }, [cartCount]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="branding">
          <div className="sliding-text-container">
            <p className="sliding-text">
              55 True North Road, Mulbarton, Gauteng.
            </p>
          </div>
          <a href="https://tasselgroup.co.za/">
            <img
              src={`${import.meta.env.BASE_URL}images/products/Tassel_LOGO.png`}
              alt="Tassel Logo"
              className="logo"
            />
          </a>

          <div>
            <h1>Tassel Beauty And Wellness Studio - Online Store</h1>
            <p>Your favorite beauty products at your fingertips!</p>
          </div>
        </div>

        {/* Magnetized Cart Icon */}
        {!hideCart && (
          <div className="cart-icon-container" ref={cartRef}>
            <button className="cart-icon" onClick={toggleCart}>
              🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
