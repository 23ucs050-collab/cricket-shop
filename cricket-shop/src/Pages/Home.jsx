import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const categories = ["Bats", "Balls", "Gloves", "Helmets", "Pads", "Shoes"];

const categoryIcons = {
  Bats: "🏏",
  Balls: "🔴",
  Gloves: "🧤",
  Helmets: "⛑️",
  Pads: "🛡️",
  Shoes: "👟",
};

function Home({ addToCart }) {
  return (
    <div className="home-page">
      {/* Category row */}
      <div className="home-categories">
        <Link to="/products" className="home-cat">
          <span className="home-cat-icon">⭐</span>
          <span>All</span>
        </Link>
        {categories.map((c) => (
          <Link key={c} to="/products" className="home-cat">
            <span className="home-cat-icon">{categoryIcons[c]}</span>
            <span>{c}</span>
          </Link>
        ))}
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Play Like a Champion</h1>
          <p>Premium cricket equipment for every player.</p>
          <Link to="/products" className="shop-now-btn">Shop Now</Link>
        </div>
      </section>

      {/* Category-wise products */}
      {categories.map((c) => {
        const list = products.filter((p) => p.category === c);
        if (list.length === 0) return null;
        return (
          <section key={c} className="home-section">
            <div className="home-section-head">
              <h2>Best of {c}</h2>
              <Link to="/products" className="view-all">View all →</Link>
            </div>
            <div className="home-row">
              {list.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* About shop */}
      <section className="home-info">
        <h2>About Cricket Shop 🏏</h2>
        <p>
          We sell genuine cricket bats, balls, gloves, helmets, pads and shoes
          for every player, from beginners to professionals.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>📍 Address</h3>
            <p>12, Main Road, Chennai, Tamil Nadu</p>
          </div>
          <div className="about-card">
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>
          <div className="about-card">
            <h3>🕒 Timings</h3>
            <p>Mon - Sat: 9 AM to 9 PM</p>
          </div>
          <div className="about-card">
            <h3>✅ Why choose us</h3>
            <p>Genuine products, fair prices, fast delivery.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;