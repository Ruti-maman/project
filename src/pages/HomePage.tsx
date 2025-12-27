import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/AuthStore";
import ticketStore from "../stores/TicketStore";
import { homeStyles as styles } from "../styles/homePageStyles";
import { postCommentRequest } from "../services/TicketService";
import { Link } from "react-router-dom";

const HomePage = observer(() => {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("1");

  useEffect(() => {
    // אם המשתמש מאומת — למשוך טיקטים; תלות ב-isAuthenticated כדי שיקפוץ גם אחרי התחברות
    if (authStore.isAuthenticated) {
      ticketStore.fetchTickets();
    }
  }, [authStore.isAuthenticated]);

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [filtering, setFiltering] = useState(false);
  const [filterMessage, setFilterMessage] = useState<string | null>(null);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [commentTextMap, setCommentTextMap] = useState<{
    [id: string]: string;
  }>({});
  const [loadingCommentMap, setLoadingCommentMap] = useState<{
    [id: string]: boolean;
  }>({});

  const applyFilters = async () => {
    setFiltering(true);
    setFilterMessage(null);
    const params: Record<string, any> = {};
    if (filterStatus) {
      params.status = filterStatus;
      const statusMap: Record<string, number> = {
        open: 1,
        in_progress: 2,
        closed: 3,
      };
      const sid = statusMap[filterStatus];
      if (sid) params.status_id = sid;
    }
    if (filterPriority) {
      params.priority = filterPriority;
      const pid = Number(filterPriority);
      if (!Number.isNaN(pid)) params.priority_id = pid;
    }
    try {
      await ticketStore.fetchTickets(params);
      // סינון בצד הקליינט
      let filtered = [...ticketStore.tickets];
      if (filterStatus) {
        filtered = filtered.filter((t) => {
          const statusVal = (t.status_id ?? t.status ?? "").toString();
          if (filterStatus === "open")
            return statusVal === "1" || statusVal === "open";
          if (filterStatus === "in_progress")
            return statusVal === "2" || statusVal === "in_progress";
          if (filterStatus === "closed")
            return statusVal === "3" || statusVal === "closed";
          return true;
        });
      }
      if (filterPriority) {
        filtered = filtered.filter((t) => {
          const prioVal = (t.priority_id ?? t.priority ?? "").toString();
          return prioVal === filterPriority;
        });
      }
      setFilteredTickets(filtered);
      if (ticketStore.error) {
        setFilterMessage("שגיאה מהשרת: " + ticketStore.error);
      } else if (filtered.length === 0) {
        setFilterMessage("לא נמצאו טיקטים מתאימים לסינון שבחרת.");
      } else {
        setFilterMessage(null);
      }
    } catch (err) {
      setFilterMessage("שגיאה כללית: " + err);
    } finally {
      setFiltering(false);
    }
  };

  // כאשר המשתמש בוחר ערך בסינון, נפעיל את הסינון אוטומטית לאחר debounce קצר
  const autoFilterTimer = useRef<number | null>(null);
  useEffect(() => {
    // נקבע debounce של 300ms לפני קריאה ל־applyFilters
    if (autoFilterTimer.current) {
      clearTimeout(autoFilterTimer.current);
    }
    autoFilterTimer.current = window.setTimeout(() => {
      applyFilters();
    }, 300);
    return () => {
      if (autoFilterTimer.current) clearTimeout(autoFilterTimer.current);
    };
    // נפעיל את האפקט כשאחד משני שדות הסינון משתנה
  }, [filterStatus, filterPriority]);

  const handleCreate = async () => {
    if (!subject.trim()) return;
    // שליחה עם description כפי שהשרת דורש
    const success = await ticketStore.createTicket(subject, priority);
    if (success) setSubject("");
  };

  const getPriorityLabel = (idOrTicket: any) => {
    let val: any = null;
    if (idOrTicket && typeof idOrTicket === "object") {
      val =
        idOrTicket.priority_id ??
        idOrTicket.priority ??
        idOrTicket.priorityId ??
        null;
    } else {
      val = idOrTicket;
    }
    const num = Number(val);
    if (num === 3) return "דחוף 🔥";
    if (num === 2) return "בינוני";
    return "קל/רגיל";
  };

  // תמיד נציג את filteredTickets אם יש סינון, אחרת את כל הטיקטים
  let ticketsToShow =
    filterStatus || filterPriority ? filteredTickets : ticketStore.tickets;
  // אם המשתמש הוא לקוח, להציג רק טיקטים שהוא יצר
  if (authStore.user?.role === "customer") {
    const myId = authStore.user.id;
    ticketsToShow = ticketsToShow.filter((t) => {
      // בדיקות נגד שדות שיוכלו להכיל את מזהה היוצר (שמות שונים ב-backend אפשריים)
      return (
        t.user_id === myId ||
        t.user?.id === myId ||
        t.created_by === myId ||
        t.created_by_id === myId ||
        t.owner_id === myId ||
        t.author_id === myId ||
        t.author?.id === myId
      );
    });
  }

  // דיבג: הדפסת טיקטים ופרטי משתמש לעזרה באיתור שגיאות במידה ולא מוצגים
  if (!ticketStore.loading) {
    // eslint-disable-next-line no-console
    console.debug("HomePage tickets sample:", ticketStore.tickets.slice(0, 10));
    // eslint-disable-next-line no-console
    console.debug("Auth user:", authStore.user);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>שלום, {authStore.user?.name || "טוען..."}</h1>
          <small>
            {authStore.user?.role === "admin" ? "מנהל מערכת" : "לקוח"}
          </small>
        </div>
        <button
          onClick={() => authStore.logout()}
          style={{ ...styles.submitBtn, backgroundColor: "#e74c3c" }}
        >
          התנתקות
        </button>
      </header>

      <div style={styles.formSection}>
        <h3>פתיחת פנייה חדשה</h3>
        <input
          style={styles.input}
          placeholder="מה הנושא?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <select
          style={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="1">קל/רגיל</option>
          <option value="2">בינוני</option>
          <option value="3">דחוף</option>
        </select>
        <button style={styles.submitBtn} onClick={handleCreate}>
          שלח בקשה
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>סינון טיקטים</h4>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {authStore.user?.role !== "customer" && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: 120 }}
            >
              <option value="">כל הסטטוסים</option>
              <option value="open">פתוח</option>
              <option value="in_progress">בטיפול</option>
              <option value="closed">סגור</option>
            </select>
          )}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <option value="">כל העדיפויות</option>
            <option value="1">קל/רגיל</option>
            <option value="2">בינוני</option>
            <option value="3">דחוף</option>
          </select>
          <div
            style={{
              minWidth: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {filtering || ticketStore.loading ? (
              <span style={{ fontWeight: 700 }}>טוען...</span>
            ) : null}
          </div>
        </div>
        {filterMessage && (
          <div style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>
            {filterMessage}
          </div>
        )}
      </div>

      <div style={styles.card}>
        {ticketStore.loading || filtering ? (
          <div style={{ textAlign: "center", padding: 30, fontSize: 18 }}>
            טוען נתונים...
          </div>
        ) : ticketsToShow.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "#888" }}>
            לא נמצאו טיקטים להצגה
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>נושא</th>
                <th style={styles.th}>עדיפות</th>
                <th style={styles.th}>סטטוס</th>
                <th style={styles.th}>הוסף תגובה</th>
              </tr>
            </thead>
            <tbody>
              {ticketsToShow.map((t: any) => (
                <tr key={t.id}>
                  <td style={styles.td}>
                    <Link to={`/ticket/${t.id}`}>{t.subject}</Link>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.priorityBadge(t.priority_id)}>
                      {getPriorityLabel(t.priority_id)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {(t.status_id ?? t.status ?? "")
                      .toString()
                      .includes("closed") || Number(t.status_id) === 3
                      ? "✅ סגור"
                      : "⏳ בטיפול"}
                  </td>
                  <td style={styles.td}>
                    {/* אפשרות תגובה ישירות בשורה — זמינה לכל משתמש שמורשה (בדר״כ הלקוח היוצר והאדמין/נציג) */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <textarea
                        rows={2}
                        placeholder="הוסף תגובה..."
                        value={commentTextMap[t.id] || ""}
                        onChange={(e) =>
                          setCommentTextMap((prev) => ({
                            ...prev,
                            [t.id]: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          borderRadius: 6,
                          border: "1px solid #ddd",
                          padding: 6,
                        }}
                      />
                      <div>
                        <button
                          onClick={async () => {
                            const text = (commentTextMap[t.id] || "").trim();
                            if (!text) return alert("הזן תגובה");
                            setLoadingCommentMap((prev) => ({
                              ...prev,
                              [t.id]: true,
                            }));
                            try {
                              await postCommentRequest(t.id, {
                                body: text,
                                author_id: authStore.user?.id,
                              });
                              setCommentTextMap((prev) => ({
                                ...prev,
                                [t.id]: "",
                              }));
                              alert("תגובה נוספה בהצלחה");
                              await ticketStore.fetchTickets();
                            } catch (e: any) {
                              alert(
                                "שגיאה בשליחת תגובה: " +
                                  (e?.response?.data?.message ||
                                    e?.message ||
                                    "")
                              );
                            }
                            setLoadingCommentMap((prev) => ({
                              ...prev,
                              [t.id]: false,
                            }));
                          }}
                          disabled={!!loadingCommentMap[t.id]}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 6,
                            background: "#2ecc71",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {loadingCommentMap[t.id] ? "שולח..." : "שלח"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

export default HomePage;
