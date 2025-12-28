import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ticketStore from "../stores/TicketStore";
import {
  createStatusRequest,
  createPriorityRequest,
  createUserRequest,
} from "../services/TicketService";

const AdminPage: React.FC = observer(() => {
  const navigate = useNavigate();

  // --- התיקון שלך: role מתחיל כ-agent באופן אוטומטי ---
  const [userForm, setUserForm] = useState({
    firstName: "",
    email: "",
    password: "",
    role: "agent",
  });
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");

  useEffect(() => {
    ticketStore.fetchAllData();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserRequest({
        email: userForm.email,
        name: userForm.firstName,
        username: userForm.email,
        password: userForm.password,
        role: userForm.role,
      });
      alert(`🎉 המשתמש ${userForm.firstName} נוצר בהצלחה!`);
      // מאפסים את הטופס ושומרים על agent כברירת מחדל
      setUserForm({ firstName: "", email: "", password: "", role: "agent" });
      ticketStore.refreshLists();
    } catch (error) {
      alert("❌ שגיאה ביצירת משתמש.");
    }
  };

  const handleAddStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim()) return;
    try {
      await createStatusRequest(newStatus);
      setNewStatus("");
      ticketStore.refreshLists();
    } catch (error) {
      alert("❌ שגיאה בהוספה.");
    }
  };

  const handleAddPriority = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriority.trim()) return;
    try {
      await createPriorityRequest(newPriority);
      setNewPriority("");
      ticketStore.refreshLists();
    } catch (error) {
      alert("❌ שגיאה בהוספה.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={() => navigate("/home")} style={styles.backButton}>
          ⬅️ חזרה
        </button>
        <h1 style={styles.pageTitle}>⚙️ ניהול מערכת</h1>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.mainCard}>
          <div style={styles.cardHeader}>
            <span style={{ fontSize: "24px" }}>👤</span>
            <h2 style={styles.cardTitle}>הוספת משתמש</h2>
          </div>
          <form onSubmit={handleAddUser} style={styles.form}>
            <input
              style={styles.input}
              placeholder="שם מלא"
              value={userForm.firstName}
              onChange={(e) =>
                setUserForm({ ...userForm, firstName: e.target.value })
              }
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="אימייל"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="סיסמה"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              required
            />
            <select
              style={styles.select}
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
            >
              <option value="agent">נציג (Agent)</option>
              <option value="client">לקוח (Client)</option>
              <option value="admin">מנהל (Admin)</option>
            </select>
            <button type="submit" style={styles.submitButton}>
              הוסף משתמש ➕
            </button>
          </form>
        </div>

        <div style={styles.sideColumn}>
          <div style={styles.smallCard}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "20px" }}>🏷️</span>
              <h3 style={styles.smallCardTitle}>סטטוסים</h3>
            </div>
            <form
              onSubmit={handleAddStatus}
              style={{ ...styles.form, marginBottom: "15px" }}
            >
              <input
                style={styles.input}
                placeholder="חדש..."
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
              <button
                type="submit"
                style={{ ...styles.actionButton, background: "#a29bfe" }}
              >
                הוסף
              </button>
            </form>
            <div style={styles.listContainer}>
              {ticketStore.statuses.map((s: any) => (
                <div key={s.id} style={styles.listItem}>
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.smallCard}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "20px" }}>⚡</span>
              <h3 style={styles.smallCardTitle}>עדיפויות</h3>
            </div>
            <form
              onSubmit={handleAddPriority}
              style={{ ...styles.form, marginBottom: "15px" }}
            >
              <input
                style={styles.input}
                placeholder="חדש..."
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              />
              <button
                type="submit"
                style={{ ...styles.actionButton, background: "#ff7675" }}
              >
                הוסף
              </button>
            </form>
            <div style={styles.listContainer}>
              {ticketStore.priorities.map((p: any) => (
                <div key={p.id} style={styles.listItem}>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#f1f2f6",
    padding: "30px",
    fontFamily: "Segoe UI",
    direction: "rtl",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1000px",
    margin: "0 auto 30px",
  },
  pageTitle: { margin: 0, color: "#2d3436", fontSize: "28px" },
  backButton: {
    background: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    fontWeight: "bold",
    color: "#636e72",
  },
  contentGrid: {
    display: "flex",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  mainCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    flex: 2,
    minWidth: "320px",
  },
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
    minWidth: "300px",
  },
  smallCard: {
    background: "white",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "center",
  },
  cardTitle: { margin: 0, fontSize: "22px", color: "#2d3436" },
  smallCardTitle: { margin: 0, fontSize: "18px", color: "#2d3436" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #dfe6e9",
    fontSize: "14px",
    outline: "none",
    background: "#f9f9f9",
  },
  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #dfe6e9",
    fontSize: "14px",
    background: "white",
  },
  submitButton: {
    padding: "12px",
    background: "linear-gradient(45deg, #0984e3, #74b9ff)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "10px",
  },
  actionButton: {
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  listContainer: {
    maxHeight: "200px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
    marginTop: "10px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "#f1f2f6",
    borderRadius: "8px",
    fontSize: "14px",
    alignItems: "center",
  },
};

export default AdminPage;
