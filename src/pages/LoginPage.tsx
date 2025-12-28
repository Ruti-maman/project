import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authStore from "../stores/AuthStore"; // שימוש ב-Store המעודכן
import { observer } from "mobx-react-lite";

const LoginPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. שולחים את הבקשה ל-Store
      await authStore.login({ email, password });

      // 2. אם הגענו לפה, הסיסמה נכונה! עכשיו מנווטים הביתה
      // זו השורה שהייתה חסרה לך ולכן זה נתקע
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("שגיאה בהתחברות: שם משתמש או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  // עיצוב נקי
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
    direction: "rtl",
  };
  const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };
  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#82ccdd",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    opacity: loading ? 0.7 : 1,
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍦</div>
        <h2 style={{ marginBottom: "20px", color: "#2d3436" }}>התחברות</h2>

        <input
          style={inputStyle}
          type="email" // חשוב מאוד כדי שהדפדפן ידע שזה אימייל
          placeholder="כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "מתחבר..." : "כניסה"}
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          עדיין אין לך חשבון?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#0984e3", cursor: "pointer", fontWeight: "bold" }}
          >
            הירשמי כאן
          </span>
        </p>
      </form>
    </div>
  );
});

export default LoginPage;
