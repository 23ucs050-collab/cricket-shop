import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import "./Products.css";

const categories = ["All", "Bats", "Gloves", "Helmets", "Pads", "Shoes"];

function Products({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || product.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="products-page">
      <div className="products-layout">
        <Sidebar />

        <div className="products-content">
          <h1>Cricket Products</h1>
          <p className="products-count">{filteredProducts.length} products</p>

          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-bar">
            {categories.map((c) => (
              <button
                key={c}
                className={`category-chip ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <p className="no-products">No products found.</p>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;