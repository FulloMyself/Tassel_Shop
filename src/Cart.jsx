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
    } catch {
      setError("Could not send order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      submitPayFastForm(payfastFields);
    } catch {
      setError("Could not start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    <aside className={`cart spa-cart ${className}`} role="complementary" aria-label="Shopping cart">
      <div className="cart-header">
        <h2 className="cart-title">
          <span role="img" aria-label="Lotus" style={{ marginRight: 8 }}>🪷</span>
          Your Cart
        </h2>
        <button className="cart-close-btn" onClick={onClose} aria-label="Close cart" type="button">
          &times;
        </button>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <p className="cart-empty">
            Your cart is empty. Pamper yourself with our products!
          </p>
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
                      aria-label={`Decrease quantity of ${item.name}`}
                      type="button"
                    >−</button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onIncrement(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                      type="button"
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
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
            aria-label="Customer email"
          />
        )}

        {error && <div className="cart-error">{error}</div>}
        {success && <div className="cart-success">{success}</div>}

        <div className="payment-options">
          <button
            type="button"
            className="checkout-btn order-btn"
            onClick={handleOrderNow}
            disabled={items.length === 0 || loading || !email}
          >
            {loading ? "Processing..." : "Order Now"}
          </button>

          <button
            type="button"
            className="checkout-btn buy-btn"
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
