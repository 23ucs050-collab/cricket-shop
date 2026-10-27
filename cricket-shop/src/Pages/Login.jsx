import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "";
const RESEND_SECONDS = 30;

// sa****@gmail.com maathiri kaattum
const maskEmail = (value) => {
  const [name, domain] = value.split("@");
  if (!domain) return value;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const navigate = useNavigate();

  // Animation mudinjadhum Home page-ku po
  useEffect(() => {
    if (!welcomeName) return;

    const timer = setTimeout(() => navigate("/"), 2600);
    return () => clearTimeout(timer);
  }, [welcomeName, navigate]);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const callApi = async (path, body) => {
    const response = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Server returned non-JSON:", text);
      throw new Error("Server error: backend URL / deployment check pannunga");
    }

    return { response, data };
  };

  // STEP 1: email + password -> OTP anuppu (Resend-kum idhe)
  const requestOtp = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const { response, data } = await callApi("/api/auth/login", {
        email,
        password,
      });

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      setOtp("");
      setStep("otp");
      setCooldown(RESEND_SECONDS);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentials = (e) => {
    e.preventDefault();
    requestOtp();
  };

  // STEP 2: OTP verify
  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      alert("6 digit OTP enter pannunga");
      return;
    }

    setLoading(true);

    try {
      const { response, data } = await callApi("/api/auth/verify-otp", {
        email,
        otp,
      });

      if (!response.ok) {
        alert(data.message || "OTP verification failed");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("customerUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // alert-ku badhula animation start pannu
      setWelcomeName(data.user?.name || "Player");
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
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

          {step === "credentials" ? (
            <>
              <h2>Login</h2>

              <form onSubmit={handleCredentials}>
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
                <button type="submit" disabled={loading}>
                  {loading ? "Sending OTP..." : "Login"}
                </button>
              </form>

              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </>
          ) : (
            <>
              <h2>Verify OTP</h2>
              <p className="otp-hint">
                <b>{maskEmail(email)}</b>-ku 6 digit OTP anuppirukkom. 5
                minutes-ku valid.
              </p>

              <form onSubmit={verifyOtp}>
                <input
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>

              <div className="otp-actions">
                <button
                  type="button"
                  className="link-btn"
                  onClick={requestOtp}
                  disabled={cooldown > 0 || loading}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                  }}
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;