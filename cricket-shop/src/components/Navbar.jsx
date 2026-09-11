import { Link, useNavigate } from "react-router-dom";

function Navbar({ cartCount }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="logo">
        🏏 Cricket Shop
      </div>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          Cart 🛒 ({cartCount})
        </Link>

        <Link to="/login">
          Login
        </Link>

        {/* Separate Logout Button */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;