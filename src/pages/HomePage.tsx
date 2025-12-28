import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ticketStore from "../stores/TicketStore";
import authStore from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import {
  createTicketRequest,
  deleteTicketRequest,
} from "../services/TicketService";
import s from "../styles/homePageStyles";

const HomePage: React.FC = observer(() => {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [prio, setPrio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const userRole = authStore.user?.role;
  const isAdmin = userRole === "admin";
  const isAgent = userRole === "agent";

  // התיקון: אנחנו מציגים את הטופס לכל מי שהוא לא מנהל ולא נציג (כלומר לקוח)
  const showCreateForm = !isAdmin && !isAgent;

  const userDisplayName =
    authStore.user?.name ||
    authStore.user?.first_name ||
    authStore.user?.username ||
    "משתמשת";

  useEffect(() => {
    ticketStore.fetchAllData();
    if (!authStore.user) authStore.fetchMe();
  }, []);

  useEffect(() => {
    if (ticketStore.priorities.length > 0 && !prio) {
      setPrio(String(ticketStore.priorities[0].id));
    }
  }, [ticketStore.priorities]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicketRequest({
        subject,
        description: subject,
        priority_id: Number(prio),
      });
      setSubject("");
      ticketStore.fetchTickets();
    } catch (error) {
      alert("שגיאה בפתיחת הקריאה");
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm("בטוחה שאת רוצה למחוק את הקריאה?")) {
      try {
        await deleteTicketRequest(id);
        ticketStore.fetchTickets();
      } catch (error) {
        alert("שגיאה במחיקה");
      }
    }
  };

  const getPriorityTheme = (id: number) => {
    const p = ticketStore.priorities.find((x) => x.id === id);
    const label = p ? p.name : "Unknown";
    const lowerName = label.toLowerCase();

    if (lowerName.includes("highest"))
      return { bg: "#ffdde1", color: "#e84393", label };
    if (
      lowerName.includes("high") ||
      lowerName.includes("urgent") ||
      lowerName.includes("דחוף")
    )
      return { bg: "#fee2e2", color: "#ef4444", label };
    if (
      lowerName.includes("medium") ||
      lowerName.includes("mid") ||
      lowerName.includes("בינונ")
    )
      return { bg: "#fef3c7", color: "#f59e0b", label };
    if (lowerName.includes("low") || lowerName.includes("נמוך"))
      return { bg: "#d1fae5", color: "#10b981", label };

    const palette = [
      { bg: "#e0e7ff", color: "#4f46e5" },
      { bg: "#fae3d9", color: "#e55039" },
      { bg: "#dff9fb", color: "#130f40" },
      { bg: "#ffeaa7", color: "#fdcb6e" },
      { bg: "#81ecec", color: "#00cec9" },
      { bg: "#a29bfe", color: "#6c5ce7" },
      { bg: "#fd79a8", color: "#e84393" },
      { bg: "#fab1a0", color: "#e17055" },
    ];
    const theme = palette[id % palette.length];
    return { ...theme, label };
  };

  const getStatusName = (id: number) => {
    const s = ticketStore.statuses.find((x) => x.id === id);
    return s ? s.name : "פתוח";
  };

  const filteredTickets = ticketStore.tickets.filter((t) => {
    const matchesSearch = t.subject
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "" || String(t.priority_id) === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h1 style={s.title}>שלום, {userDisplayName} 👋</h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              style={{
                background: "#6c5ce7",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              ⚙️ ניהול מערכת
            </button>
          )}
        </div>
        <button
          style={s.logoutButton}
          onClick={() => {
            authStore.logout();
            navigate("/login");
          }}
        >
          🚪 יציאה
        </button>
      </div>

      {/* --- התיקון: השימוש במשתנה showCreateForm --- */}
      {showCreateForm && (
        <div style={s.createCard}>
          <h3 style={{ marginBottom: "15px", color: "#2d3436" }}>
            פתיחת קריאה חדשה
          </h3>
          <form
            onSubmit={handleCreateTicket}
            style={{ display: "flex", gap: "10px", alignItems: "stretch" }}
          >
            <input
              style={{ ...s.input, marginBottom: 0, flex: 3, height: "50px" }}
              placeholder="מה הנושא של הפנייה?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <select
              style={{ ...s.input, marginBottom: 0, flex: 1, height: "50px" }}
              value={prio}
              onChange={(e) => setPrio(e.target.value)}
            >
              {ticketStore.priorities.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                ...s.submitBtn,
                width: "auto",
                padding: "0 30px",
                height: "50px",
                background: "#82ccdd",
              }}
            >
              שלחי 🚀
            </button>
          </form>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          marginTop: !showCreateForm ? "20px" : "0",
        }}
      >
        <input
          style={{
            flex: 2,
            height: "45px",
            borderRadius: "12px",
            padding: "0 15px",
            border: "1px solid #dfe6e9",
            outline: "none",
          }}
          placeholder="🔍 חפשי לפי נושא..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={{
            flex: 1,
            height: "45px",
            borderRadius: "12px",
            border: "1px solid #dfe6e9",
            padding: "0 10px",
            outline: "none",
            background: "#fff",
          }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">כל העדיפויות</option>
          {ticketStore.priorities.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={s.tableWrapper}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>נושא</th>
              <th style={s.th}>עדיפות</th>
              <th style={s.th}>סטטוס</th>
              <th style={{ ...s.th, textAlign: "center" }}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t: any) => {
              const theme = getPriorityTheme(t.priority_id);
              return (
                <tr key={t.id} style={s.tr}>
                  <td style={s.td}>
                    <strong>{t.subject}</strong>
                  </td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.priorityBadge,
                        background: theme.bg,
                        color: theme.color,
                      }}
                    >
                      {theme.label}
                    </span>
                  </td>
                  <td style={s.td}>{getStatusName(t.status_id)}</td>
                  <td style={{ ...s.td, minWidth: "150px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "0 10px",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/ticket/${t.id}`)}
                        style={{
                          background: "#82ccdd",
                          color: "white",
                          border: "none",
                          padding: "8px 15px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        👁️ צפייה
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteTicket(t.id)}
                          style={{
                            background: "none",
                            color: "#ff7675",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default HomePage;
