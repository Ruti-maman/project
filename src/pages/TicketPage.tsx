import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTicketRequest,
  getCommentsRequest,
  postCommentRequest,
} from "../services/TicketService";
import authStore from "../stores/AuthStore";

const TicketPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getTicketRequest(id);
        setTicket(res.data ?? res);
      } catch (e) {
        console.error(e);
      }
      try {
        const c = await getCommentsRequest(id);
        setComments(c.data ?? c);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const handlePost = async () => {
    if (!text.trim() || !id) return;
    try {
      const body = { body: text, author_id: authStore.user?.id };
      const res = await postCommentRequest(id, body);
      const created = res.data ?? res;
      setComments((s) => [created, ...s]);
      setText("");
    } catch (e) {
      console.error(e);
      alert("שגיאה בשליחת תגובה");
    }
  };

  if (!ticket) return <div style={{ padding: 20 }}>טוען טיקט...</div>;

  return (
    <div style={{ padding: 20, direction: "rtl" }}>
      <h2>
        טיקט #{ticket.id} - {ticket.subject}
      </h2>
      <div
        style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}
      >
        <div>
          <strong>עדיפות:</strong>
          <span
            style={{
              marginLeft: 8,
              padding: "4px 8px",
              borderRadius: 6,
              background:
                ticket.priority_id === 3
                  ? "#e74c3c"
                  : ticket.priority_id === 2
                  ? "#f1c40f"
                  : "#2ecc71",
              color: "white",
              fontWeight: 700,
            }}
          >
            {ticket.priority_id === 3
              ? "דחוף"
              : ticket.priority_id === 2
              ? "בינוני"
              : "קל/רגיל"}
          </span>
        </div>
        <div>
          <strong>סטטוס:</strong>
          <span style={{ marginLeft: 8 }}>
            {ticket.status_id === 3 || ticket.status === "3"
              ? "סגור"
              : ticket.status_id === 2 || ticket.status === "2"
              ? "בטיפול"
              : "פתוח"}
          </span>
        </div>
      </div>
      <p style={{ marginTop: 12 }}>{ticket.description}</p>

      <div style={{ marginTop: 20 }}>
        <h3>תגובות</h3>
        <div style={{ marginBottom: 10 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
          />
          <button onClick={handlePost} style={{ marginTop: 8 }}>
            שלח תגובה
          </button>
        </div>
        <ul>
          {comments.map((c: any) => (
            <li
              key={c.id}
              style={{ padding: 8, borderBottom: "1px solid #eee" }}
            >
              <div>
                <strong>{c.author_name ?? c.author?.name ?? "משתמש"}</strong>
              </div>
              <div>{c.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketPage;
