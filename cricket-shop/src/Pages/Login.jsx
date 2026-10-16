import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const navigate = useNavigate();

  // Animation mudinjadhum Home page-ku po
  useEffect(() => {
    if (!welcomeName) return;

    const timer = setTimeout(() => navigate("/"), 2600);
    return () => clearTimeout(timer);
  }, [welcomeName, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON:", text);
        alert("Server error: backend URL / deployment check pannunga");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("customerUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // alert-ku badhula animation start pannu
      setWelcomeName(data.user?.name || "Player");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend");
    }
  };

  return (
    <div className="login-page">
      {/* Login success animation */}
      {welcomeName && (
        <div className="welcome-overlay">
          <div className="ball-x">
            <div className="ball-y">
              <div className="ball"></div>
            </div>
          </div>

          <h1 className="six-text">SIX! 🏏</h1>
          <h2 className="welcome-text">Welcome, {welcomeName}!</h2>

          <div className="loader">
            <div className="loader-fill"></div>
          </div>
        </div>
      )}

      <div className={`stage ${welcomeName ? "leaving" : ""}`}>
        <div className="walker">
          <div className="walker-body">
            <span className="person">🚶</span>
            <span className="bat">🏏</span>
          </div>
          <div className="shadow"></div>
        </div>

        <div className="login-box">
          <h1>🏏 Cricket Shop</h1>
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Customer ID / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;