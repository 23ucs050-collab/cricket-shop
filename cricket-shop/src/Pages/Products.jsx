import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Products({ addToCart }) {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = products.filter((product) => {

    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" ||
      product.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="products-page">

      <h1>Cricket Products</h1>

      <div className="filters">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Bats">Bats</option>
          <option value="Gloves">Gloves</option>
          <option value="Helmets">Helmets</option>
          <option value="Pads">Pads</option>
          <option value="Shoes">Shoes</option>
        </select>

      </div>

      <div className="products-grid">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}

      </div>

    </div>
  );
}

export default Products;