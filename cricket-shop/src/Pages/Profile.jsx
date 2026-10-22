import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL || "";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
};

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(emptyProfile); // form-la edit aagura data
  const [savedProfile, setSavedProfile] = useState(emptyProfile); // DB-la irukkura data
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Toast 3 sec-la maraiyum
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Profile load
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
          setError(data.message || "Could not load profile");
          return;
        }

        const loaded = {
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          pincode: data.user.pincode || "",
        };

        setProfile(loaded);
        setSavedProfile(loaded);

        // Details innum fill pannala na direct-a form kaattu
        const hasDetails =
          loaded.phone || loaded.address || loaded.city || loaded.pincode;
        setIsEditing(!hasDetails);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setProfile(savedProfile);
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!profile.name.trim()) {
      setError("Name is required");
      return;
    }

    if (profile.phone && !/^\d{10}$/.test(profile.phone)) {
      setError("Phone number 10 digits irukkanum");
      return;
    }

    if (profile.pincode && !/^\d{6}$/.test(profile.pincode)) {
      setError("Pincode 6 digits irukkanum");
      return;
    }

    setSaving(true);

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
        setError(data.message || "Update failed");
        return;
      }

      const updated = {
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        city: data.user.city || "",
        pincode: data.user.pincode || "",
      };

      const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
      localStorage.setItem(
        "customerUser",
        JSON.stringify({ ...stored, name: updated.name })
      );

      setProfile(updated);
      setSavedProfile(updated);
      setIsEditing(false); // view mode-ku maaru
      setToast("Profile saved ✅");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to backend");
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
      {/* Success message (3 sec-la maraiyum) */}
      {toast && <div className="profile-toast">{toast}</div>}

      <div className="profile-card">
        <div className="profile-avatar">
          {(savedProfile.name || "U").charAt(0).toUpperCase()}
        </div>
        <h2>{savedProfile.name || "My Profile"}</h2>
        <p className="profile-email">{savedProfile.email}</p>

        {isEditing ? (
          /* ---------- EDIT MODE ---------- */
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
                <input
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                />
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

            <div className="profile-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* ---------- VIEW MODE ---------- */
          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">📞 Phone</span>
              <span className="detail-value">
                {savedProfile.phone || <em>Not added</em>}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">🏠 Address</span>
              <span className="detail-value">
                {savedProfile.address || <em>Not added</em>}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">🏙️ City</span>
              <span className="detail-value">
                {savedProfile.city || <em>Not added</em>}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">📮 Pincode</span>
              <span className="detail-value">
                {savedProfile.pincode || <em>Not added</em>}
              </span>
            </div>

            <button className="btn-primary edit-btn" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          </div>
        )}

        {error && <p className="profile-error">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;