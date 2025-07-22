import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Products from "./Products";
import Cart from "./Cart";
import Footer from "./Footer";
import Gifts from "./Gifts";
import Bookings from "./Bookings";  // ✅ Just import directly
import "./styles.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleCart = () => setCartOpen((open) => !open);

  // ✅ Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // ✅ Save to LocalStorage
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
                {cartOpen && (
                  <Cart
                    className="open"
                    items={cartItems}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onClose={toggleCart}
                    setCartItems={setCartItems}
                  />
                )}
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
