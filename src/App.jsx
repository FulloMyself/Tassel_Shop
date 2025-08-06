import React, { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Products from "./Products";
import Cart from "./Cart";
import Footer from "./Footer";
import Gifts from "./Gifts";
import Bookings from "./Bookings";
import "./styles.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const cartRef = useRef(null);

  const toggleCart = () => {
    setCartOpen((open) => {
      if (!open) {
        gsap.to(cartRef.current, { x: 0, duration: 0.5, ease: "power3.out" });
      } else {
        gsap.to(cartRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });
      }
      return !open;
    });
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        !event.target.closest(".cart-icon")
      ) {
        gsap.to(cartRef.current, { x: "100%", duration: 0.5, ease: "power3.in" });
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen]);

  // Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <Router>
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        toggleCart={toggleCart}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Products onAddToCart={handleAddToCart} />
                <div
                  ref={cartRef}
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100%",
                    transform: "translateX(100%)",
                    zIndex: 9999
                  }}
                >
                  <Cart
                    items={cartItems}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onClose={toggleCart}
                    setCartItems={setCartItems}
                  />
                </div>
              </>
            }
          />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
