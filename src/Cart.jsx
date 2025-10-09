import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Cart({
  items = [],
  onIncrement,
  onDecrement,
  onClose,
  className = "",
  setCartItems, // ✅ clear cart handler
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("collect"); // collect or delivery
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const DELIVERY_FEE = 200; // flat rate for delivery

  const emailServer = import.meta.env.VITE_EMAIL_SERVER_URL;
  const paymentPortal = import.meta.env.VITE_PAYMENT_PORTAL_URL;

  // ✅ Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const itemPrice =
      item.salePrice && item.salePrice > 0 && item.salePrice < item.price
        ? item.salePrice
        : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);


  // ✅ Apply discount
  const total = Math.max(subtotal - discount, 0);

  const totalWithDelivery =
    deliveryOption === "delivery" ? total + DELIVERY_FEE : total;

  // ✅ Persist cart on every update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!appliedVoucher) return setDiscount(0);

    let discountValue = 0;
    if (appliedVoucher.type === "percent") discountValue = (subtotal * appliedVoucher.value) / 100;
    if (appliedVoucher.type === "fixed") discountValue = appliedVoucher.value;

    setDiscount(Math.min(discountValue, subtotal));
  }, [items, appliedVoucher, subtotal]);


  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
      setDiscount(0);
      setVoucherCode("");
      setVoucherMessage("");
      setAppliedVoucher(null); // ✅ clear applied voucher
    }
  };


  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return setVoucherMessage("Enter a voucher code first.");

    setLoading(true);
    setVoucherMessage("");

    try {
      const res = await axios.post(`${emailServer}/api/validate-voucher`, { code: voucherCode });
      const voucher = res.data.voucher;
      if (!voucher) throw new Error("Voucher data missing from server.");

      setAppliedVoucher(voucher); // ✅ store voucher

      // Calculate discount
      const discountValue =
        voucher.type === "percent" ? (subtotal * voucher.value) / 100 : voucher.value;
      setDiscount(Math.min(discountValue, subtotal));
      setVoucherMessage(`✅ ${voucher.description} applied!`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setVoucherMessage("❌ Invalid or expired voucher code.");
      } else {
        setVoucherMessage("❌ Could not validate voucher. Try again.");
      }
      setDiscount(0);
      setAppliedVoucher(null); // remove applied voucher on fail
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send order via email
  const handleOrderNow = async () => {
  if (!accepted) {
    return setError("Please acknowledge the disclaimer before ordering.");
  }

  if (!email || !email.includes("@")) {
    return setError("Please enter a valid email address.");
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch(`${emailServer}/send-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        total: totalWithDelivery ?? total, // ✅ fallback safety
        email,
        deliveryOption: deliveryOption || "collection", // ✅ default to collection
        deliveryDetails:
          deliveryOption === "delivery" && deliveryDetails
            ? deliveryDetails
            : null,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to send order email.");
    }

    setSuccess("✅ Order sent successfully! We'll contact you soon.");
    setCartItems([]); // optional — clear cart after success
  } catch (err) {
    console.error("Order error:", err);
    setError("Could not send order. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // ✅ PayFast payment handler
  const handleBuyNow = async () => {
    if (!accepted) {
      return setError("Please acknowledge the disclaimer before continuing to payment.");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${paymentPortal}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: totalWithDelivery,
          email,
          deliveryOption,
          deliveryDetails: deliveryOption === "delivery" ? deliveryDetails : null
        }),
      });


      if (!res.ok) throw new Error("Failed to initiate payment.");
      const payfastFields = await res.json();
      submitPayFastForm(payfastFields);
    } catch (err) {
      setError("Could not start payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ PayFast auto-submit form
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
    <aside
      className={`cart spa-cart ${className}`}
      role="complementary"
      aria-label="Shopping cart"
    >
      <div className="cart-header">
        <h2>
          <span role="img" aria-label="Lotus" style={{ marginRight: 8 }}>
            🪷
          </span>
          Your Cart
        </h2>
        <button
          className="cart-close-btn"
          onClick={onClose}
          aria-label="Close cart"
          type="button"
        >
          &times;
        </button>
      </div>

      {/* Items */}
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
                    >
                      −
                    </button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onIncrement(item.id)}
                      aria-label={`Increase quantity of ${item.name}`}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="cart-item-price">
                  R{(
                    ((item.salePrice &&
                      item.salePrice > 0 &&
                      item.salePrice < item.price
                      ? item.salePrice
                      : item.price) *
                      item.quantity)
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="cart-footer">
        {/* Voucher Section */}
        {items.length > 0 && (
          <div className="voucher-section" style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              disabled={loading}
              style={{
                width: "70%",
                padding: "0.5rem",
                border: "1px solid #e9cfc3",
                borderRadius: "6px 0 0 6px",
              }}
            />
            <button
              onClick={handleApplyVoucher}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                background: "#bfa18c",
                color: "#fff",
                border: "none",
                borderRadius: "0 6px 6px 0",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
            {voucherMessage && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                {voucherMessage}
              </p>
            )}
          </div>
        )}

        {/* Total */}
        <div className="cart-total">
          <span>Total:</span>
          <span className="cart-total-amount">
            R{totalWithDelivery.toFixed(2)}
            {discount > 0 && (
              <small style={{ color: "#888" }}>
                (Saved R{discount.toFixed(2)})
              </small>
            )}
          </span>
        </div>


        <div className="delivery-options" style={{ marginBottom: "1rem" }}>
          <h4 style={{ marginBottom: "0.5rem" }}>Delivery Options</h4>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            <input
              type="radio"
              name="deliveryOption"
              value="collect"
              checked={deliveryOption === "collect"}
              onChange={(e) => setDeliveryOption(e.target.value)}
            />
            Collect in store (Free)
          </label>
          <label style={{ display: "block" }}>
            <input
              type="radio"
              name="deliveryOption"
              value="delivery"
              checked={deliveryOption === "delivery"}
              onChange={(e) => {
                setDeliveryOption(e.target.value);
                setShowDeliveryModal(true);
              }}
            />
            Delivery (R{DELIVERY_FEE})
          </label>
        </div>

        {items.length > 0 && (
          <>
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
              style={{
                margin: "1rem 0",
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #e9cfc3",
              }}
            />

            {/* Disclaimer Section */}
            <div
              className="disclaimer"
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                border: "1px solid #e0b000",
                borderRadius: "6px",
                background: "#fffbe6",
                fontSize: "0.85rem",
                lineHeight: "1.4",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={() => setAccepted(!accepted)}
                />
                {window.location.pathname.includes("bookings")
                  ? "I understand that a 50% non-refundable booking fee is required to confirm my booking."
                  : "I understand that delivery will be charged separately by courier."}
              </label>
            </div>

            {/* Clear Cart */}
            <button
              type="button"
              className="checkout-btn"
              style={{
                background: "#eee",
                color: "#333",
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
              onClick={handleClearCart}
              disabled={loading}
            >
              Clear Cart
            </button>
          </>
        )}

        {showDeliveryModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h4>Delivery Details</h4>
              <input
                type="text"
                placeholder="Full Name"
                value={deliveryDetails.name}
                onChange={(e) =>
                  setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={deliveryDetails.phone}
                onChange={(e) =>
                  setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={deliveryDetails.email}
                onChange={(e) =>
                  setDeliveryDetails({ ...deliveryDetails, email: e.target.value })
                }
              />
              <textarea
                placeholder="Delivery Address"
                value={deliveryDetails.address}
                onChange={(e) =>
                  setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
                }
              />
              <p style={{ fontSize: "0.75rem", color: "#555" }}>
                ⚠️ By submitting your details, you agree to Tassel Beauty & Wellness storing
                and processing your personal information in compliance with the POPI Act.
              </p>
              <button
                className="checkout-btn"
                onClick={() => setShowDeliveryModal(false)}
                style={{ marginTop: "0.5rem" }}
              >
                Save Details
              </button>
            </div>
          </div>
        )}


        {/* Status */}
        {error && <div className="cart-error" role="alert">{error}</div>}
        {success && <div className="cart-success" role="status">{success}</div>}

        {/* Payment */}
        <div className="payment-options">
          <button
            type="button"
            className="checkout-btn"
            onClick={handleOrderNow}
            disabled={items.length === 0 || loading || !email}
          >
            {loading ? "Processing..." : "Order Now"}
          </button>

          <button
            type="button"
            className="checkout-btn"
            style={{ background: "#bfa18c", marginTop: 8 }}
            onClick={handleBuyNow}
            disabled={
              items.length === 0 ||
              loading ||
              !email ||
              !email.includes("@") ||
              !accepted
            }
            aria-label="Buy now using PayFast"
          >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </aside>

  );
}
