import { useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails({ addToCart }) {

  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (

    <div className="product-details">

      <img
        src={product.image}
        alt={product.name}
      />

      <div>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <h2>₹{product.price}</h2>

        <p>
          Category: {product.category}
        </p>

        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>

      </div>

    </div>

  );
}

export default ProductDetails;