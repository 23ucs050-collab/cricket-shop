import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import ProtectedRoute from "./ProtectedRoute";

function App() {

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {

    setCart((previousCart) => [
      ...previousCart,
      product
    ]);

    alert("Product added to cart!");
  };

  const removeFromCart = (id) => {

    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== id
      )
    );

  };

  return (

    <BrowserRouter>

      <Navbar cartCount={cart.length} />

      <main>

        <Routes>

  {/* Website starting point */}
  <Route
    path="/"
    element={
      localStorage.getItem("isLoggedIn") === "true"
        ? <Navigate to="/home" replace />
        : <Navigate to="/login" replace />
    }
  />

  {/* Register */}
  <Route
    path="/register"
    element={<Register />}
  />

  {/* Login */}
  <Route
    path="/login"
    element={<Login />}
  />

  {/* Home - Login required */}
  <Route
    path="/home"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />

  {/* Products - Login required */}
  <Route
    path="/products"
    element={
      <ProtectedRoute>
        <Products addToCart={addToCart} />
      </ProtectedRoute>
    }
  />

  {/* Product Details - Login required */}
  <Route
    path="/product/:id"
    element={
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    }
  />

  {/* Cart - Login required */}
  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
        />
      </ProtectedRoute>
    }
  />

  {/* Checkout - Login required */}
  <Route
    path="/checkout"
    element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    }
  />

</Routes>

      </main>

      <Footer />

    </BrowserRouter>

  );
}



export default App;