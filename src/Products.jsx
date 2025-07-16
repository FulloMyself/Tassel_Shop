import React, { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Tassel 12 Hour Concentrated Skin Balm",
    price: 299,
    salePrice: 249,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_12_Hour_Concentrated_Skin_Balm.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 2,
    name: "Tassel Beard & Hair Oil",
    price: 199,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Beard_&_Hair_Oil.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 3,
    name: "Tassel Deep Cleanse Face Wash",
    price: 299,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Deep_Cleanse_Face_Wash.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 4,
    name: "Tassel Eye Serum",
    price: 199,
    salePrice: 159,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Eye_Serum.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 5,
    name: "Tassel Hand Made Heel Wax",
    price: 299,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hand_Made_Heel_Wax.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 6,
    name: "Tassel Hyaluric Acid And Vitamin C Serum",
    price: 199,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hyaluric_Acid_And_Vitamin_C_Serum.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 7,
    name: "Tassel Menthol Body Rub",
    price: 299,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Menthol_Body_Rub.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 8,
    name: "Tassel Muscle Rub",
    price: 199,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Muscle_Rub.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 9,
    name: "Tassel Retinol A & E Night Cream Anti-Wrinkle",
    price: 299,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Retinol_A_&E_Night_Cream_Anti_Wrinkle.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 10,
    name: "Tassel Sensitive Milk Cleanser & Make Up Remover",
    price: 199,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Sensitive_Milk_Cleanser_&_Make_Up_Remover.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 11,
    name: "Tassel Skin Brightening Serum",
    price: 299,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Skin_Brightening_Serum.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 12,
    name: "Tassel Therapeutic Muscle Soothing Cream",
    price: 199,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Therapeutic_Muscle_Soothing_Cream.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 13,
    name: "Tassel Vitamin E Day Moisturising Cream",
    price: 299,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Day_Moisturising_Cream.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 14,
    name: "Tassel Vitamin E Oil",
    price: 199,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Oil.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
];

export default function Products({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    applyFilters();
  }, [search, category, minPrice, maxPrice, sortBy]);

  const applyFilters = () => {
    let filtered = products.filter((product) => {
      const priceToCheck =
        product.salePrice && product.salePrice < product.price
          ? product.salePrice
          : product.price;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "all" || product.category === category;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      const matchesPrice = priceToCheck >= min && priceToCheck <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "priceLowHigh":
        filtered.sort(
          (a, b) =>
            (a.salePrice || a.price) - (b.salePrice || b.price)
        );
        break;
      case "priceHighLow":
        filtered.sort(
          (a, b) =>
            (b.salePrice || b.price) - (a.salePrice || a.price)
        );
        break;
      case "nameAZ":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <section className="products">
      <h2 className="products-title">Our Products</h2>

      {/* ✅ Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="skincare">Skincare</option>
          <option value="bodycare">Bodycare</option>
          <option value="wellness">Wellness</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="nameAZ">Name: A to Z</option>
          <option value="nameZA">Name: Z to A</option>
        </select>
      </div>

      {/* ✅ Product Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => {
          const onSale =
            product.salePrice && product.salePrice < product.price;
          const displayPrice = onSale
            ? product.salePrice
            : product.price;

          return (
            <div
              className="product-card"
              key={product.id}
              onClick={() => setSelectedProduct(product)} // ✅ Opens popup
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                {onSale && (
                  <span className="original-price">
                    R{product.price.toFixed(2)}
                  </span>
                )}
                <span className="product-price">
                  R{displayPrice.toFixed(2)}
                </span>
                {/* ✅ Add to Cart Button (restored) */}
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening popup
                    onAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
              {onSale && <div className="sale-badge">SALE</div>}
            </div>
          );
        })}
      </div>

      {/* ✅ Popup Overlay */}
      {selectedProduct && (
        <div
          className="product-popup-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="popup-close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            {selectedProduct.salePrice &&
            selectedProduct.salePrice < selectedProduct.price ? (
              <div>
                <span className="original-price">
                  R{selectedProduct.price.toFixed(2)}
                </span>{" "}
                <span className="product-price">
                  R{selectedProduct.salePrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="product-price">
                R{selectedProduct.price.toFixed(2)}
              </div>
            )}
            <button
              className="add-to-cart-btn"
              onClick={() => {
                onAddToCart(selectedProduct);
                setSelectedProduct(null);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
