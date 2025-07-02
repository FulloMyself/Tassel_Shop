import { useState } from "react";
import Header from "./Header";
import Products from "./Products";
import Cart from "./Cart";
import Footer from "./Footer";
import "./styles.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleCart = () => setCartOpen((open) => !open);

  // Add product to cart or increase quantity if already in cart
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

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    // Handle checkout logic here
    console.log("Checkout clicked");
  };

  return (
    <div>
      <Header cartCount={cartCount} toggleCart={toggleCart} />
      <main>
        <Products onAddToCart={handleAddToCart} />
        {cartOpen && (
          <Cart
            className="open"
            items={cartItems}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onCheckout={handleCheckout}
            onClose={toggleCart}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
