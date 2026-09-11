import { useState } from "react";

function Checkout() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const placeOrder = (e) => {

    e.preventDefault();

    alert("Order placed successfully! 🎉");

  };

  return (

    <div className="checkout">

      <h1>Checkout</h1>

      <form onSubmit={placeOrder}>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <button type="submit">
          Place Order
        </button>

      </form>

    </div>

  );
}

export default Checkout;