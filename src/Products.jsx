import React, { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Tassel 12 Hour Concentrated Skin Balm",
    price: 199,
    salePrice: 120,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_12_Hour_Concentrated_Skin_Balm.jpg`,
description: "12-Hour Concentrated Skin Balm delivers deep, long-lasting hydration while soothing and restoring the skin’s natural balance. Its rich, intensive formula locks in moisture for up to 12 hours, helping to strengthen the skin’s protective barrier. This product will give you skin that feels deeply nourished, supple, and beautifully radiant.",
  },
  {
    id: 2,
    name: "Tassel Beard & Hair Oil",
    price: 199,
    salePrice: 150,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Beard_&_Hair_Oil.jpg`,
    description: "This oil has specifically been formulated to encourage beard growth. This top quality beard oil has the following benefits: Stimulates hair growth and may even encourage regrowth. Fortifies your beard and slows aging of facial hair. Acts as insect repellent. Has calming and stress relieving properties. Stops that beard itch. Provides a shine but without greasiness. Hydrates, conditions, soothes and calms your skin. Moisturises and conditions beard. Contains magnesium, biotin and vitamin E, known to strengthen facial hair and prevent loss. Increases blood flow and circulation. Helps prevent dandruff.",
  },
  {
    id: 3,
    name: "Tassel Deep Cleanse Face Wash",
    price: 149,
    salePrice: 100,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Deep_Cleanse_Face_Wash.jpg`,
description: "A rich face wash that deeply cleanses the skin, refreshes pores, aids in removal of dead skin cells and maintains the skin's natural moisture. For all other skin types apart from sensitive as it is soapy which we do not promote for clients with sensitive skin.",
  },
  {
    id: 4,
    name: "Tassel Eye Serum",
    price: 250,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Eye_Serum.jpg`,
    description: "Serum 4 Eyes with Caffeine, Co Enzyme Q10, Nutri Peptide & Hyaluronic Acid is a smooth serum that can be used on face and below eyes to target dark circles under eyes, hyperpigmentation, fine lines, skin elasticity and aging. Caffeine is known to target dark circles under eyes, hyperpigmentation and blemishes while smoothing skin and reducing fine lines and wrinkles. Co Enzyme Q10 is known to support collagen and elastin production in skin, enhance hydration and skin regeneration.",
  },
  {
    id: 5,
    name: "Tassel Hand Made Heel Wax",
    price: 150,
    salePrice: 0,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hand_Made_Heel_Wax.jpg`,
description: "This thick, heel wax helps repair painful cracked feet with natural oils. Nourishing and moisturizing oils and butters soothe and help heal even the roughest, driest, cracked heels and feet.",
  },
  {
    id: 6,
    name: "Tassel Hyaluric Acid And Vitamin C Serum",
    price: 250,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hyaluric_Acid_And_Vitamin_C_Serum.jpg`,
    description: "The Serum is for daily use and it contains Hylauronic Acid, which is an active ingredient known to reduce the appearance of fine lines and wrinkles. Vitamin C boosts collagen production which can help prevent pre mature aging of the skin, restoring a youthful,smooth appearance to the skin and ultimately illuminates(brightens) the skin.",
  },
  {
    id: 7,
    name: "Tassel Menth Body Rub",
    price: 150,
    salePrice: 0,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Menthol_Body_Rub.jpg`,
    description: "Refreshing Mint Body Scrub invigorates and renews the skin with a cooling burst of minty freshness. Formulated with natural exfoliants, it gently buffs away dead skin cells, leaving the skin smooth, polished, and glowing. The refreshing mint infusion awakens the senses, making it the perfect scrub for an energizing self-care ritual.",
  },
  {
    id: 8,
    name: "Tassel Muscle Rub",
    price: 150,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Muscle_Rub.jpg`,
    description: "Deep relief muscle rub delivers targeted cooling relief for sore, stiff, and overworked muscles. This lightweight, fast-absorbing gel penetrates deep into the tissue, easing tension and promoting recovery. Perfect for post-workout use or everyday muscle support, it provides instant comfort with a refreshing, non-greasy finish.",
  },
  {
    id: 9,
    name: "Tassel Retinol A & E Night Cream Anti-Wrinkle",
    price: 200,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Retinol_A_&E_Night_Cream_Anti_Wrinkle.jpg`,
    description: "This luxurious cream targets signs of ageing, reduces wrinkles, and provide the skin with a nourishing and revitalizing boost, to be used 2 to 3 times a week at night. Wash the skin with a cleanser (Toner optional) and then put on your retinol cream.",
  },
  {
    id: 10,
    name: "Tassel Sensitive Milk Cleanser & Make Up Remover",
    price: 199,
    salePrice: 100,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Sensitive_Milk_Cleanser_&_Make_Up_Remover.jpg`,
    description: "Cleansing milk is a soothing and mild cleanser which removes impurities, excess oil and makeup from the skin without irritation or drying out the skin.",
  },
  {
    id: 11,
    name: "Tassel Skin Brightening Serum",
    price: 250,
    salePrice: 200,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Skin_Brightening_Serum.jpg`,
description: "Our skin brightening gel contains arbutin and vitamin C. Alpha arbutin targets and prevents dark spots, while vitamin C stimulates collagen production, fights free radicals, and enhances overall skin brightness. Together, they create a harmonious blend that not only tackles pigmentation issues but also promotes a healthier and more youthful complexion.",
  },
  {
    id: 12,
    name: "Tassel Therapeutic Muscle Soothing Cream",
    price: 150,
    salePrice: 0,
    category: "bodycare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Therapeutic_Muscle_Soothing_Cream.jpg`,
    description: "Therapeutic Muscle Cream provides fast acting relief for tired, tense, and overworked muscles. Enriched with a blend of soothing botanicals and warming agents, this intensive cream helps ease discomfort, improve circulation, and promote relaxation. Ideal for post-workout recovery or daily muscle care, it leaves the body feeling refreshed, relaxed, and revitalised.",
  },
  {
    id: 13,
    name: "Tassel Vitamin E Day Moisturising Cream",
    price: 199,
    salePrice: 150,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Day_Moisturising_Cream.jpg`,
    description: "A soothing, moisturising and softening cream. Vitamin E is known to repair skin and reduce the appearance of scars creating supple and youthful looking skin",
  },
  {
    id: 14,
    name: "Tassel Vitamin E Oil",
    price: 150,
    salePrice: 0,
    category: "wellness, skincare",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Vitamin_E_Oil.jpg`,
    description: "Vitamin E is known to repair the skin and reduce appearance on scars, stretch marks and dark areas, creating supple and youthful looking skin. Vitamin E may also reduce sun damage by absorbing UVB rays and reducing your skin’s inflammatory response, which includes: • Swelling. • Reddening. • Thickening",
  },
  {
    id: 15,
    name: "Tassel Hydrating Mist",
    price: 150,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Tassel_Hydrating_Mist.jpg`,
    description: "Can be used as a secondary cleanser to further cleanse the skin and remove impurities and excess oil. Hydrating Mist with Skincare Actives Niacinamide, Hyaluronic Acid, Seaweed Extracts and Centella Asiatica Extract. Niacinamide is known to infuse hydration into the skin and assist with inflammation and skin irritation while Hyaluronic Acid is a powerful skin hydrator known for its plumping and firming properties that promote gentle aging by lessening the appearance of fine lines and wrinkles. Used before or after applying serums, moisturisers but before SPF. It can be used throughout the day to boost skins hydration and give your skin a healthy glow.",
  },
  {
    id: 16,
    name: "Esse Sensitive Serum",
    price: 965,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Serum.jpg`,
    description: "Repairs and desensitises sensitive skin. This serum contains high doses of live probiotic microbes to heal and protect your skin and to calm your skin’s immune system. 15ml / FOR ALL SENSITIVE SKIN",
  },
  {
    id: 17,
    name: "Esse Hydro Moisturiser",
    price: 770,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Hydro_Moisturiser.jpg`,
    description: "Hydrates and protects sensitive skin. Probiotic extracts and prebiotic nutrients are included in an ultra-gentle, light Aloe base to soothe and hydrate sensitive skin. 50ml / FOR OILY / COMBINATION, SENSITIVE SKIN",
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
    price: 1250,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Resurrect_Serum.jpg`,
    description: "Anti-ageing treatment for sensitive skin. A hydrating and plumping serum that addresses the signs of ageing without overstimulating. Independent testing shows that it reduces wrinkle depth. 30ml / FOR SIGNS OF AGEING IN SENSITIVE SKIN. Anti-ageing treatment for sensitive skin. A hydrating and plumping serum that addresses the signs of ageing without overstimulating. Independent testing shows that it reduces wrinkle depth. 30ml / FOR SIGNS OF AGEING IN SENSITIVE SKIN",
  },
  {
    id: 21,
    name: "Esse Sensitive Cleanser",
    price: 695,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Cleanser.jpg`,
    description: "Soothes and calms sensitive skin. This pH-balanced, creamy cleanser has been formulated to minimise irritation to sensitive skin while still removing make-up effectively. 200ml / FOR ALL SENSITIVE SKIN",
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
    price: 572,
    salePrice: 0,
    category: "wellness",
    image: `${import.meta.env.BASE_URL}images/products/Esse_Sensitive_Mist.jpg`,
    description: "Probiotic mist to calm sensitive skin. This mist contains probiotic extracts and prebiotic nutrients to support a state of equilibrium in the skin’s microbiome. Gentle, moisturising ingredients improve skin hydration. Can be used throughout the day to calm and hydrate skin. 100ml / FOR ALL SKIN TYPES",
  },
  {
    id: 24,
    name: "BioDermal Advanced Corrective Scar Complex",
    price: 599,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Advanced_Corrective_Scar_Complex.jpg`,
    description: "ADVANCED CORRECTIVE SCAR COMPLEX forms a transparent film over compromised tissue in order to provide maximum protection while deeply hydrating. Powerful anti-oxidants and anti-inflammatory actives aid to restore elasticity to the skin, even out skin tone while reducing projection and redness of the scar. ADVANCED CORRECTIVE SCAR COMPLEX promotes wound healing, is anti-Inflammatory & anti-bacterial, aids with repair & regeneration, treats stretch marks, moisturises, softens skin, boosts collagen production.",
  },
  {
    id: 25,
    name: "BioDermal Advanced Advanced Moisture Absolute Day",
    price: 634,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Advanced_Moisture_Absolute_Day.jpg`,
    description: "Anti-Ageing DNA Repair Cream. Enhanced with plant oils to create a rich texture, protect the skin from trans epidermal water loss, deeply nourish, combat skin inflammation and protect against oxidative stress. > Pure Macadamia & Sweet Almond Oil, > Cocoa Seed Butter, Echium Seed Oil, > Passiflora Edulis Seed Oil, > Helianthus Annuus Seed Oil Unsaponifiables, > Baloon Flower/Leaf/Vine Extract, > Synthetic Beeswax. High % actives defy ageing by stimulating collagen & elastin formation, combating sun damage, supporting skin stem cells. > Silk Acacia Extract, > Palmitoyl Tripeptide-1, > Palmitoyl Tetrapeptide-7, > Darutoside, > Liposomal Swiss Apple Stem Cells, > Vitamin E.",
  },
  {
    id: 26,
    name: "BioDermal Bright Complexion",
    price: 599,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Bright_Complexion.jpg`,
    description: "Luminosity & Hydration. Formulated to improve pigmentation while maintaining barrier function and hydration, resulting in an even complexion.",
  },
  {
    id: 27,
    name: "BioDermal Cooling Enzymatic Peel",
    price: 696,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Cooling_Enzymatic_Peel.jpg`,
    description: "Rejuvenating fruit exfoliator. Exfoliates and purifies tired, lacklustre skin. Its non-abrasive formula leaves skin soft, revitalised and radiant. Suitable for all skin types.",
  },
  {
    id: 28,
    name: "BioDermal Duo Purifier",
    price: 696,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Duo_Purifier.jpg`,
    description: "Bio-active cleanser & toner. Rich in cleansing bio-actives that gently and effectively remove impurities and make-up without causing dryness. Natural plant extracts tone and moisturise the skin.",
  },
  {
    id: 29,
    name: "BioDermal Lucent",
    price: 996,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Lucent.jpg`,
    description: "Hyperpigmentation result from changes in the melanocytes present in epidermal cells. Melanocytes, which are located at the base of the epidermis, lose their normal regulation process with aging, a shift in hormone levels, exessive UV and HEV exposure or with inflammation, which may result in the production of excess pigments. This excess production leads to the formation of dense perinuclear clumps of melanin in keratinocytes within the epidermis, resulting in areas of hyperpigmentation. TYPES OF HYPER PIGMENTATION: Melasma. Melasma is believed to be caused by hormonal changes and may develop during pregnancy. Areas of hyperpigmentation can appear on any area of the body, but they appear most commonly on the stomach and face. Sunspots/ Photoaging. Also called liver spots or solar lentigines, sunspots are common. They’re related to when the sun prematurely ages the skin/ excess sun exposure over time. Generally, they appear as spots on areas exposed to the sun, like the hands and face. Post-inflammatory hyperpigmentation. This is a result of injury or inflammation to the skin. A common cause of this type is acne. BRIGHT COMPLEXION – LUCENT is formulated to target the skin’s pigment cells, melanocytes, and the body’s reaction to pigment stimulating factors; photoinduced oxidative damage and skin inflammation. LUCENT’s combination ingredients does not only promote an even skin by fading age spots, melasma, hyper-pigmentation, but also combats the signs of premature skin ageing. Hyperpigmentation result from changes in the melanocytes present in epidermal cells. Melanocytes, which are located at the base of the epidermis, lose their normal regulation process with aging, a shift in hormone levels, exessive UV and HEV exposure or with inflammation, which may result in the production of excess pigments. This excess production leads to the formation of dense perinuclear clumps of melanin in keratinocytes within the epidermis, resulting in areas of hyperpigmentation. TYPES OF HYPER PIGMENTATION: Melasma. Melasma is believed to be caused by hormonal changes and may develop during pregnancy. Areas of hyperpigmentation can appear on any area of the body, but they appear most commonly on the stomach and face. Sunspots/ Photoaging. Also called liver spots or solar lentigines, sunspots are common. They’re related to when the sun prematurely ages the skin/ excess sun exposure over time. Generally, they appear as spots on areas exposed to the sun, like the hands and face. Post-inflammatory hyperpigmentation. This is a result of injury or inflammation to the skin. A common cause of this type is acne. BRIGHT COMPLEXION – LUCENT is formulated to target the skin’s pigment cells, melanocytes, and the body’s reaction to pigment stimulating factors; photoinduced oxidative damage and skin inflammation. LUCENT’s combination ingredients does not only promote an even skin by fading age spots, melasma, hyper-pigmentation, but also combats the signs of premature skin ageing.",
  },
  {
    id: 30,
    name: "BioDermal Moisture Essential Day And Night",
    price: 715,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Moisture_Essential_Day_And_Night.jpg`,
    description: "Anti-ageing DNA repair cream. A unique blend of retinol, peptides, antioxidants and humectants aimed at boosting collagen production, increasing cell turnover, fighting sun damage, deeply hydrating and nourishing while softening the appearance of fine lines and wrinkles.",
  },
  {
    id: 31,
    name: "BioDermal Peptite Booster",
    price: 793,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_Peptite_Booster.jpg`,
    description: "Firming, calming & replenishing, complex. Improves skin firmness, intensively replenishes nourishment, boosts resilience, calms inflammation and aids in skin healing. Short terms firming is achieved by attracting water from deep within in the skin to the outer-most layer of the skin resulting in plumper skin cells. Long term firming is achieved by improving the skins barrier function through: > Interrupting Glycation processes. > Calming skin inflammation. Inflammation is responsible for accelerating fine lines, wrinkles and enlarged pores, as well as puffiness, sagging, blotchiness or reddening of the skin. Our complex calming blend includes amongst others: Witch Hazel Extract, Niacinamide, Rooibos Extract, Cucumber Extract, Aloe Extract, Arnica Extract, Calendula Flower Extract, > Protecting against environmental damage: our high dose of Oxidoreductase, a large group of enzymes, block oxygen in different forms from generating environmental damage to the skin. > Providing nourishment to the skin.",
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
    price: 599,
    salePrice: 0,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/BioDermal_UV_Fusion.jpg`,
    description: "Broad spectrum UVA & UVB shield. Reflects, scatters and absorbs the sun’s UV rays away from the skin to aid in preventing premature skin aging and damage. A water-based, light and silky textured cream that offers a soft finish while providing a high level of broad-spectrum protection plus age-fighting antioxidants.",
  },
  {
    id: 34,
    name: "ResaK Collagen + Free Shaker",
    price: 1150,
    salePrice: 850,
    category: "skincare",
    image: `${import.meta.env.BASE_URL}images/products/ResaK_Collagen.jpg`,
    description: "Beauty Supplements: Collagen Skin Rejuvenation • Hair & Nail Health • Gut, Bone, Joint Health • Female Health ElixHer is expertly formulated to address the prominent concerns of feminine beauty and physical health. With collagen decreasing from the age of 18, and a yearly loss of 1% after 40 years of age, supplementing with Collagen is essential. Collagen is integral in maintaining optimum hydration levels in the skin, which promotes elasticity and supports essential cellular processes. This Beauty Blend utilises skillfully selected ingredients of the highest quality to ensure optimum bioavailability of its actives. Beauty Benefits include the softening and smoothing of fine lines and wrinkles, boosting of skin hydration levels, improvement of skin texture, firmness and cellulite reduction, building nail strength and promoting the health and growth of hair. Health Benefits include the promotion of wound healing, gut health, nutritional absorption, metabolic functions, antioxidant defenses, iron formation, resilient bones and connective tissues, immune support as well as symptomatic relief of menopause. Buy the Collagen, get the shaker for free for a limited time only.",
  },
];

export default function Products({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [expandedProduct, setExpandedProduct] = useState(null);
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

  const truncateText = (text, maxLength = 80) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
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
<p className="product-desc">
  {expandedProduct === product.id
    ? product.description
    : truncateText(product.description, 80)}
</p>
{product.description.length > 80 && (
  <button
    className="see-more-btn"
    onClick={(e) => {
      e.stopPropagation(); // don’t open popup
      setExpandedProduct(
        expandedProduct === product.id ? null : product.id
      );
    }}
  >
    {expandedProduct === product.id ? "See Less" : "See More"}
  </button>
)}
              <div className="product-footer">
  <div className="product-price-container">
    {onSale && (
      <span className="original-price">
        R{product.price.toFixed(2)}
      </span>
    )}
    <span className="product-price">
      R{displayPrice.toFixed(2)}
    </span>
  </div>

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
