import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ticketStore from "../stores/TicketStore";

const StatusesPage = observer(() => {
  const [statuses, setStatuses] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    // דמו: נניח שיש API לסטטוסים
    setStatuses([
      { id: 1, name: "פתוח" },
      { id: 2, name: "בטיפול" },
      { id: 3, name: "סגור" },
    ]);
  }, []);

  const handleAdd = () => {
    if (newStatus.trim()) {
      setStatuses([...statuses, { id: Date.now(), name: newStatus }]);
      setNewStatus("");
    }
  };

  return (
    <div
      style={{ padding: 24, direction: "rtl", maxWidth: 500, margin: "auto" }}
    >
      <h2>ניהול סטטוסים</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="סטטוס חדש"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: 8,
            borderRadius: 6,
            background: "#222",
            color: "white",
          }}
        >
          הוסף
        </button>
      </div>
      <ul>
        {statuses.map((s) => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default StatusesPage;
