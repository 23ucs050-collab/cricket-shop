import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL || "";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("customerUser");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          setMessage(data.message || "Could not load profile");
          return;
        }

        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          pincode: data.user.pincode || "",
        });
      } catch (error) {
        console.error(error);
        setMessage("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          pincode: profile.pincode,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
      localStorage.setItem(
        "customerUser",
        JSON.stringify({ ...stored, name: data.user.name })
      );

      setMessage("Profile saved ✅");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to backend");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {(profile.name || "U").charAt(0).toUpperCase()}
        </div>
        <h2>{profile.name || "My Profile"}</h2>
        <p className="profile-email">{profile.email}</p>

        <form onSubmit={handleSave}>
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} />

          <label>Email</label>
          <input value={profile.email} disabled />

          <label>Phone</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            maxLength={10}
            placeholder="10 digit mobile number"
          />

          <label>Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            rows={3}
            placeholder="Door no, street, area"
          />

          <div className="profile-row">
            <div>
              <label>City</label>
              <input name="city" value={profile.city} onChange={handleChange} />
            </div>
            <div>
              <label>Pincode</label>
              <input
                name="pincode"
                value={profile.pincode}
                onChange={handleChange}
                maxLength={6}
              />
            </div>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;