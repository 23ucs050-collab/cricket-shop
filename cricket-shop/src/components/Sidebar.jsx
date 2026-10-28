import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <p className="sidebar-title">MENU</p>

      <NavLink to="/products" className="sidebar-link">🏏 Products</NavLink>
      <NavLink to="/cart" className="sidebar-link">🛒 Cart</NavLink>
      <NavLink to="/orders" className="sidebar-link">📦 Orders</NavLink>

      <p className="sidebar-title">OTHER</p>

      <NavLink to="/profile" className="sidebar-link">👤 Profile</NavLink>

      <button className="sidebar-logout" onClick={handleLogout}>
        ⏻ Logout
      </button>
    </aside>
  );
}

export default Sidebar;