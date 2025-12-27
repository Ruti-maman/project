import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ticketStore from "../stores/TicketStore";
import authStore from "../stores/AuthStore";
import { getUsersRequest } from "../services/UserService";
import { useNavigate } from "react-router-dom";
import {
  updateTicketRequest,
  postCommentRequest,
} from "../services/TicketService";
import adminPageStyles from "../styles/adminPageStyles";

const AdminPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Array<{ id: number; name: string }>>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    ticketStore.fetchTickets();
    (async () => {
      try {
        const res = await getUsersRequest();
        const data = (res as any).data ?? res;
        const list = Array.isArray(data) ? data : [];
        setAgents(
          list
            .filter(
              (u: any) => u.role === "agent" || u.is_agent || u.type === "agent"
            )
            .map((u: any) => ({
              id: u.id,
              name: u.name || u.fullname || u.email,
            }))
        );
      } catch (err) {
        console.warn("Could not load agents", err);
      }
    })();
  }, []);

  const refresh = async () => {
    await ticketStore.fetchTickets();
  };

  const onChangeStatus = async (id: string, val: string) => {
    try {
      await updateTicketRequest(id, { status_id: Number(val) });
      await refresh();
    } catch (e) {
      console.error(e);
      alert("שגיאה בעדכון סטטוס");
    }
  };

  const onAssign = async (id: string, agentId: string) => {
    try {
      await updateTicketRequest(id, { agent_id: Number(agentId) || null });
      await refresh();
    } catch (e) {
      console.error(e);
      alert("שגיאה בהקצאת נציג");
    }
  };

  const onPostComment = async (id: string) => {
    const text = commentInputs[id];
    if (!text || text.trim() === "") return;
    try {
      await postCommentRequest(id, {
        body: text.trim(),
        author_id: authStore.user?.id,
      });
      setCommentInputs((prev) => ({ ...prev, [id]: "" }));
      await refresh();
    } catch (e) {
      console.error(e);
      alert("שגיאה בשליחת תגובה");
    }
  };

  const filtered = ticketStore.tickets.filter((t: any) => {
    if (statusFilter && String(t.status_id ?? t.status) !== statusFilter)
      return false;
    if (
      priorityFilter &&
      String(t.priority_id ?? t.priority) !== priorityFilter
    )
      return false;
    if (agentFilter && String(t.agent_id ?? "") !== agentFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const subject = String(t.subject || "").toLowerCase();
      const body = String(t.body || "").toLowerCase();
      if (!subject.includes(s) && !body.includes(s)) return false;
    }
    return true;
  });

  return (
    <div style={adminPageStyles.container}>
      <div style={adminPageStyles.headerRow}>
        <h1 style={adminPageStyles.title}>לוח בקרה למנהל</h1>
        <button
          style={adminPageStyles.backButton}
          onClick={() => navigate("/")}
        >
          חזור
        </button>
      </div>

      <div style={adminPageStyles.controlsWrapper}>
        <div style={adminPageStyles.controlsRow}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={adminPageStyles.select}
          >
            <option value="">כל הסטטוסים</option>
            <option value="1">פתוח</option>
            <option value="2">בטיפול</option>
            <option value="3">סגור</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={adminPageStyles.select}
          >
            <option value="">כל העדיפויות</option>
            <option value="1">נמוכה</option>
            <option value="2">בינונית</option>
            <option value="3">גבוהה</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            style={adminPageStyles.select}
          >
            <option value="">כל הנציגים</option>
            {agents.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
          </select>

          <input
            placeholder="חפש נושא/תוכן"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={adminPageStyles.input}
          />

          <button
            style={adminPageStyles.backButton}
            onClick={() => {
              setStatusFilter("");
              setPriorityFilter("");
              setAgentFilter("");
              setSearch("");
            }}
          >
            נקה
          </button>
        </div>
      </div>

      <div style={adminPageStyles.tableWrapper}>
        <table style={adminPageStyles.table}>
          <thead>
            <tr style={adminPageStyles.theadTr}>
              <th style={adminPageStyles.theadTh}>#</th>
              <th style={adminPageStyles.theadTh}>נושא</th>
              <th style={adminPageStyles.theadTh}>עדיפות</th>
              <th style={adminPageStyles.theadTh}>סטטוס</th>
              <th style={adminPageStyles.theadTh}>הקצה</th>
              <th style={adminPageStyles.theadTh}>תגובה</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any, i: number) => (
              <tr
                key={t.id}
                style={
                  i % 2 === 0 ? adminPageStyles.rowEven : adminPageStyles.rowOdd
                }
              >
                <td style={adminPageStyles.td}>{t.id}</td>
                <td style={adminPageStyles.td}>{t.subject}</td>
                <td style={adminPageStyles.td}>
                  <span
                    style={{
                      ...(adminPageStyles.priorityBadge as any),
                      background:
                        t.priority_id === 3
                          ? "#e74c3c"
                          : t.priority_id === 2
                          ? "#f39c12"
                          : "#2ecc71",
                    }}
                  >
                    {t.priority_he || t.priority || t.priority_id}
                  </span>
                </td>
                <td style={adminPageStyles.td}>
                  <select
                    value={String(t.status_id ?? (t.status || ""))}
                    onChange={(e) =>
                      onChangeStatus(String(t.id), e.target.value)
                    }
                    style={adminPageStyles.selectWide}
                  >
                    <option value="1">פתוח</option>
                    <option value="2">בטיפול</option>
                    <option value="3">סגור</option>
                  </select>
                </td>
                <td style={adminPageStyles.td}>
                  <select
                    value={String(t.agent_id ?? "")}
                    onChange={(e) => onAssign(String(t.id), e.target.value)}
                    style={adminPageStyles.selectAgent}
                  >
                    <option value="">בחר</option>
                    {agents.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={adminPageStyles.td}>
                  <div style={adminPageStyles.commentRow}>
                    <textarea
                      placeholder="הוסף תגובה..."
                      value={commentInputs[String(t.id)] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [String(t.id)]: e.target.value,
                        }))
                      }
                      style={adminPageStyles.commentArea as any}
                    />
                    <button
                      onClick={() => onPostComment(String(t.id))}
                      style={adminPageStyles.sendButton}
                    >
                      שלח
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AdminPage;
