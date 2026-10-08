import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Logged-in user (Razorpay popup-la name, email auto-fill aaga)
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("customerUser")) || {};
    } catch {
      return {};
    }
  };

  // ==================== RAZORPAY PAYMENT ====================
  const handlePayment = async () => {
    try {
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        try {
          // Create order from backend
          const response = await fetch("/api/payment/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: total,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            alert(data.message || "Could not create payment order");
            return;
          }

          const user = getUser();

          // Razorpay Checkout options
          const options = {
            key: data.key,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "Cricket Shop",
            description: "Cricket Shop Purchase",
            order_id: data.order.id,

            handler: async function (paymentResponse) {
              try {
                // Verify payment with backend
                const verifyResponse = await fetch("/api/payment/verify", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(paymentResponse),
                });

                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                  alert("Payment Successful! 🎉");
                } else {
                  alert("Payment verification failed");
                }
              } catch (error) {
                console.log(error);
                alert("Payment verification error");
              }
            },

            prefill: {
              name: user.name || "",
              email: user.email || "",
              contact: "",
            },

            theme: {
              color: "#3399cc",
            },
          };

          const razorpay = new window.Razorpay(options);

          razorpay.on("payment.failed", function () {
            alert("Payment Failed ❌");
          });

          razorpay.open();
        } catch (error) {
          console.log(error);
          alert("Could not connect to payment server");
        }
      };

      script.onerror = () => {
        alert("Razorpay failed to load");
      };

      document.body.appendChild(script);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // ==================== EMPTY CART ====================
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty 🛒</h2>

        <Link to="/products">Continue Shopping</Link>
      </div>
    );
  }

  // ==================== CART PAGE ====================
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />

          <div>
            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        </div>
      ))}

      <h2>Total: ₹{total}</h2>

      {/* PAY NOW BUTTON */}
      <button onClick={handlePayment}>Pay Now 💳</button>

      <br />
      <br />

      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
}

export default Cart;