import React from "react";
import { observer } from "mobx-react-lite";
import { Routes, Route, Navigate } from "react-router-dom";
import { authStore } from "../stores/AuthStore";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { AdminPage } from "../pages/AdminPage";

export const AppRoutes = observer(() => {
  // בדיקה: האם אנחנו בתהליך טעינה? (יש טוקן אבל עוד אין משתמש)
  // זה מונע קפיצה מיותרת לדף ה-Login בזמן שהנתונים בדרך מהשרת
 
  if (authStore.token&& !authStore.user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h2>טוען נתונים...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          // שימוש ב-token במקום isAuthenticated לבדיקה מהירה
          authStore.token ? <Navigate to="/home" /> : <LoginPage />
        }
      />

      <Route
        path="/home"
        element={
          authStore.token ? <HomePage /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/admin"
        element={
          authStore.token && authStore.user?.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* נתיב ברירת מחדל */}
      <Route
        path="/"
        element={<Navigate to={authStore.token ? "/home" : "/login"} />}
      />
    </Routes>
  );
});