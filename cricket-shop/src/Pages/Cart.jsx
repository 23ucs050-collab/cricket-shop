import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  if (cart.length === 0) {

    return (

      <div className="empty-cart">

        <h2>Your cart is empty 🛒</h2>

        <Link to="/products">
          Continue Shopping
        </Link>

      </div>

    );

  }

  return (

    <div className="cart-page">

      <h1>Shopping Cart</h1>

      {cart.map((item) => (

        <div className="cart-item" key={item.id}>

          <img
            src={item.image}
            alt={item.name}
          />

          <div>

            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

            <button
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>

          </div>

        </div>

      ))}

      <h2>Total: ₹{total}</h2>

      <Link to="/checkout">
        Proceed to Checkout
      </Link>

    </div>

  );
}

export default Cart;