import React, { useState } from "react";

export default function Cart({
  items = [],
  onIncrement,
  onDecrement,
  onClose,
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handler for "Order Now" (send order email)
  const handleOrderNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${emailServer}/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, email }),
      });
      if (!res.ok) throw new Error("Failed to send order email.");
      setSuccess("Order sent! We'll contact you soon.");
    } catch (err) {
      setError("Could not send order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for "Buy Now" (redirect to PayFast)
  const handleBuyNow = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${paymentPortal}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, email }),
      });
      if (!res.ok) throw new Error("Failed to initiate payment.");
      const payfastFields = await res.json();
      submitPayFastForm(payfastFields); // Submit to PayFast
    } catch (err) {
      setError("Could not start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to submit a hidden form to PayFast
  function submitPayFastForm(fields) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = fields.payfast_url;
    form.style.display = "none";

    Object.entries(fields).forEach(([key, value]) => {
      if (key === "payfast_url") return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  return (
    <aside className={`cart spa-cart ${className}`}>
      <div className="cart-header">
        <h2>
          <span role="img" aria-label="Lotus" style={{ marginRight: 8 }}>🪷</span>
          Your Cart
        </h2>
        <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
          &times;
        </button>
      </div>
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty. Pamper yourself with our products!</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <span className="cart-item-name">{item.name}</span>
                  <div className="cart-qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onDecrement(item.id)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onIncrement(item.id)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                </div>
                <span className="cart-item-price">
                  R{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span className="cart-total-amount">R{total.toFixed(2)}</span>
        </div>
        {items.length > 0 && (
          <input
            type="email"
            className="cart-email-input"
            placeholder="Your email for order confirmation"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            style={{ margin: "1rem 0", width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #e9cfc3" }}
          />
        )}
        {error && <div className="cart-error">{error}</div>}
        {success && <div className="cart-success">{success}</div>}
        <div className="payment-options">
          <button
            className="checkout-btn"
            onClick={handleOrderNow}
            disabled={items.length === 0 || loading || !email}
          >
            {loading ? "Processing..." : "Order Now"}
          </button>
          <button
            className="checkout-btn"
            style={{ background: "#bfa18c", marginTop: 8 }}
            onClick={handleBuyNow}
            disabled={items.length === 0 || loading || !email || !email.includes("@")}
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </aside>
  );
}