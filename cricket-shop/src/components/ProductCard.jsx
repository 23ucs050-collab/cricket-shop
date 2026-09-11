import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {

  return (

    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p className="category">
        {product.category}
      </p>

      <h3>₹{product.price}</h3>

      <div className="product-buttons">

        <Link to={`/product/${product.id}`}>
          View
        </Link>

        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>

      </div>

    </div>

  );
}

export default ProductCard;