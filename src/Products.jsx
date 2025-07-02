import React from "react";

const products = [
  {
    id: 1,
    name: "Tassel 12 Hour Concentrated Skin Balm",
    price: 299,
    image: "/images/products/Tassel_12_Hour_Concentrated_Skin_Balm.jpg",
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 2,
    name: "Tassel Beard & Hair Oil",
    price: 199,
    image: "/images/products/Tassel_Beard_&_Hair_Oil.jpg",
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  // Add more products as needed
];

export default function Products({ onAddToCart }) {
  return (
    <section className="products">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer">
            <span className="product-price">R{product.price}</span>
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}