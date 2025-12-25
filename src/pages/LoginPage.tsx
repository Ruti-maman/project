import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { authStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../components/CustomInput"; // ודאי שהנתיב נכון

export const LoginPage = observer(() => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  
  try {
    if (isLogin) {
      await authStore.login(email, password);
    } else {
      await authStore.register(name, email, password);
    }
    
    // במקום navigate הרגיל, נשתמש בזה כדי לוודא שהדף "מתעורר" בכתובת החדשה
    window.location.href = '/home';
    
  } catch (err) {
    setError('אירעה שגיאה בחיבור');
  }
};
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        direction: "rtl",
      }}
    >
      <div
        style={{
          padding: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          {isLogin ? "ברוכים הבאים" : "יצירת חשבון חדש"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* שימוש בקומפוננטה שייצרת - חוסך המון קוד כפול */}
          {!isLogin && (
            <CustomInput
              label="שם מלא"
              type="text"
              placeholder="הכנס שם מלא"
              value={name}
              onChange={setName}
            />
          )}

          <CustomInput
            label="אימייל"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={setEmail}
          />

          <CustomInput
            label="סיסמה"
            type="password"
            placeholder="הכנס סיסמה"
            value={password}
            onChange={setPassword}
          />

          {error && (
            <p style={{ color: "#ff4444", fontSize: "14px" }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {isLogin ? "התחבר" : "הירשם עכשיו"}
          </button>
        </form>

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <span>{isLogin ? "עדיין אין לך חשבון?" : "כבר יש לך חשבון?"}</span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2196F3",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "8px",
            }}
          >
            {isLogin ? "הירשם כאן" : "חזור להתחברות"}
          </button>
        </div>
      </div>
    </div>
  );
});
