import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "./stores/AuthStore";

// ייבוא הדפים
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TicketPage from "./pages/TicketPage";
import AdminPage from "./pages/AdminPage"; // <--- ודאי שהשורה הזו קיימת!

// רכיב "שומר" - מאפשר כניסה רק למי שמחובר
const RequireAuth = observer(({ children }: { children: JSX.Element }) => {
  if (!authStore.isAuthenticated && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }
  return children;
});

const App: React.FC = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* דף הבית */}
        <Route
          path="/home"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        {/* דף הטיקט */}
        <Route
          path="/ticket/:id"
          element={
            <RequireAuth>
              <TicketPage />
            </RequireAuth>
          }
        />

        {/* --- דף הניהול החדש (הוספנו אותו כאן) --- */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />

        {/* ניתוב ברירת מחדל */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
});

export default App;
