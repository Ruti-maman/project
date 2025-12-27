import React, { useEffect, useState } from "react";
import {
  getUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../services/UserService";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersRequest();
      setUsers(res.data || res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    setLoading(true);
    await createUserRequest(newUser);
    setNewUser({ name: "", email: "", password: "", role: "agent" });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await deleteUserRequest(id);
    fetchUsers();
  };

  return (
    <div
      style={{ padding: 24, direction: "rtl", maxWidth: 600, margin: "auto" }}
    >
      <h2>ניהול משתמשים (נציגים ומנהלים)</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="שם"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <input
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="אימייל"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <input
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="סיסמה"
          type="password"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          style={{ padding: 8, borderRadius: 6 }}
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAdd}
          style={{
            padding: 8,
            borderRadius: 6,
            background: "#222",
            color: "white",
          }}
          disabled={loading}
        >
          הוסף
        </button>
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: 8,
        }}
      >
        <thead>
          <tr style={{ background: "#333", color: "white" }}>
            <th style={{ padding: "10px" }}>שם</th>
            <th style={{ padding: "10px" }}>אימייל</th>
            <th style={{ padding: "10px" }}>תפקיד</th>
            <th style={{ padding: "10px" }}>מחק</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ padding: "10px" }}>{u.name}</td>
              <td style={{ padding: "10px" }}>{u.email}</td>
              <td style={{ padding: "10px" }}>{u.role}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleDelete(u.id)}
                  style={{
                    color: "red",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div style={{ marginTop: 20 }}>טוען...</div>}
    </div>
  );
};

export default UsersPage;
