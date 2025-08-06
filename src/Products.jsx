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
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Beard_&_Hair_Oil.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 3,
    name: "Tassel Deep Cleanse Face Wash",
    price: 299,
    salePrice: 0,
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
    salePrice: 0,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hand_Made_Heel_Wax.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 6,
    name: "Tassel Hyaluric Acid And Vitamin C Serum",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hyaluric_Acid_And_Vitamin_C_Serum.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 7,
    name: "Tassel Menthol Body Rub",
    price: 299,
    salePrice: 0,
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
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Retinol_A_&E_Night_Cream_Anti_Wrinkle.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 10,
    name: "Tassel Sensitive Milk Cleanser & Make Up Remover",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Sensitive_Milk_Cleanser_&_Make_Up_Remover.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 11,
    name: "Tassel Skin Brightening Serum",
    price: 299,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Skin_Brightening_Serum.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 12,
    name: "Tassel Therapeutic Muscle Soothing Cream",
    price: 199,
    salePrice: 0,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Therapeutic_Muscle_Soothing_Cream.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 13,
    name: "Tassel Vitamin E Day Moisturising Cream",
    price: 299,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Day_Moisturising_Cream.jpg`,
    description: "Nourish your skin with our signature spa facial cream.",
  },
  {
    id: 14,
    name: "Tassel Vitamin E Oil",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Oil.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 15,
    name: "Tassel Hydrating Mist",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hydrating_Mist.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 16,
    name: "Esse Sensitive Serum",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Serum.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 17,
    name: "Esse Hydro Moisturiser",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Hydro_Moisturiser.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 18,
    name: "Esse Package",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Package.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 19,
    name: "Esse Protect Oil",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Protect_Oil.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 20,
    name: "Esse Resurrect Serum",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Resurrect_Serum.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 21,
    name: "Esse Sensitive Cleanser",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Cleanser.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 22,
    name: "Esse Sensitive Eye Cream",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Eye_Cream.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 23,
    name: "Esse Sensitive Mist",
    price: 199,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Mist.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 24,
    name: "BioDermal Advanced Corrective Scar Complex",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Advanced_Corrective_Scar_Complex.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 25,
    name: "BioDermal Advanced Advanced Moisture Absolute Day",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Advanced_Moisture_Absolute_Day.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 26,
    name: "BioDermal Bright Complexion",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Bright_Complexion.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 27,
    name: "BioDermal Cooling Enzymatic Peel",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Cooling_Enzymatic_Peel.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 28,
    name: "BioDermal Duo Purifier",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Duo_Purifier.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 29,
    name: "BioDermal Lucent",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Lucent.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 30,
    name: "BioDermal Moisture Essential Day And Night",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Moisture_Essential_Day_And_Night.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 31,
    name: "BioDermal Peptite Booster",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Peptite_Booster.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 32,
    name: "BioDermal Smudge And Polish",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Smudge_And_Polish.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 33,
    name: "BioDermal UV Fusion",
    price: 199,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_UV_Fusion.jpg`,
    description: "Relax and unwind with our soothing aromatic massage oil.",
  },
  {
    id: 34,
    name: "ResaK Collagen + Free Shaker",
    price: 1150,
    salePrice: 850,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/ResaK_Collagen.jpg`,
    description: "Buy the Collagen, get the shaker for free for a limited time only.",
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

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [search, category, minPrice, maxPrice, sortBy]);

  const applyFilters = () => {
    let filtered = products.filter((product) => {
      const priceToCheck =
        product.salePrice > 0 && product.salePrice < product.price
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
            (a.salePrice > 0 && a.salePrice < a.price ? a.salePrice : a.price) -
            (b.salePrice > 0 && b.salePrice < b.price ? b.salePrice : b.price)
        );
        break;
      case "priceHighLow":
        filtered.sort(
          (a, b) =>
            (b.salePrice > 0 && b.salePrice < b.price ? b.salePrice : b.price) -
            (a.salePrice > 0 && a.salePrice < a.price ? a.salePrice : a.price)
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

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };

  return (
    <section className="products" id="products">
      <h2 className="products-title">Our Products</h2>

      {/* ✅ Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products by brand..."
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
        {paginatedProducts.map((product) => {
          const onSale =
            product.salePrice > 0 && product.salePrice < product.price;
          const displayPrice = onSale ? product.salePrice : product.price;

          return (
            <div
              className="product-card"
              key={product.id}
              onClick={() => setSelectedProduct(product)}
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
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
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

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            « Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>
      )}

      {/* ✅ Popup Overlay */}
      {selectedProduct && (
        <div
          className="product-popup-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="popup-close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            {selectedProduct.salePrice > 0 &&
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
