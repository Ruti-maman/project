
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import ticketStore from '../stores/TicketStore';
import authStore from '../stores/AuthStore';
import { postCommentRequest, updateTicketRequest } from '../services/TicketService';

const AgentPage = observer(() => {
  const [statusUpdate, setStatusUpdate] = useState<{ [id: string]: string }>({});
  const [commentText, setCommentText] = useState<{ [id: string]: string }>({});
  const [loadingStatus, setLoadingStatus] = useState<{ [id: string]: boolean }>({});
  const [loadingComment, setLoadingComment] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    ticketStore.fetchTickets();
  }, []);

  // הצג רק טיקטים שמוקצים לאייג'נט הנוכחי
  const myTickets = ticketStore.tickets.filter(
    (t: any) => t.agent_id === authStore.user?.id || t.agent?.id === authStore.user?.id
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: newStatus }));
    setLoadingStatus((prev) => ({ ...prev, [id]: true }));
    try {
      // קריאה לשרת לעדכון סטטוס בפועל (אם יש)
      await updateTicketRequest(id, { status: newStatus, status_id: Number(newStatus) });
      await ticketStore.fetchTickets();
    } catch (e) {
      alert('שגיאה בעדכון סטטוס');
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddComment = async (id: string) => {
    if (!commentText[id] || !commentText[id].trim()) return;
    setLoadingComment((prev) => ({ ...prev, [id]: true }));
    try {
      await postCommentRequest(id, { body: commentText[id], author_id: authStore.user?.id });
      setCommentText((prev) => ({ ...prev, [id]: '' }));
      alert('התגובה נוספה בהצלחה!');
    } catch (e) {
      alert('שגיאה בשליחת תגובה');
    } finally {
      setLoadingComment((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div style={{ padding: 30, direction: 'rtl', background: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 32, color: '#2c3e50', letterSpacing: 1 }}>לוח בקרה לנציג</h1>
        <button onClick={() => authStore.logout()} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #e74c3c33' }}>התנתקות</button>
      </div>
      <button onClick={() => ticketStore.fetchTickets()} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', marginBottom: 20, boxShadow: '0 2px 8px #007bff33' }}>רענון טיקטים</button>
      <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px #0001', padding: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#3498db', color: 'white' }}>
              <th style={{ padding: 12, borderRadius: '8px 0 0 0' }}>נושא</th>
              <th style={{ padding: 12 }}>עדיפות</th>
              <th style={{ padding: 12 }}>סטטוס</th>
              <th style={{ padding: 12 }}>עדכן סטטוס</th>
              <th style={{ padding: 12, borderRadius: '0 8px 0 0' }}>פרטי טיקט / תגובות</th>
            </tr>
          </thead>
          <tbody>
            {myTickets.map((t: any) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee', background: '#f9fafd' }}>
                <td style={{ padding: 12 }}>{t.subject}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: '4px 8px', borderRadius: 6, background: t.priority_id === 3 ? '#e74c3c' : t.priority_id === 2 ? '#f1c40f' : '#2ecc71', color: 'white', fontWeight: 'bold' }}>
                    {t.priority_id === 3 ? 'דחוף' : t.priority_id === 2 ? 'בינוני' : 'קל/רגיל'}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: t.status === '3' || t.status_id === 3 ? '#e74c3c' : t.status === '2' || t.status_id === 2 ? '#f1c40f' : '#2ecc71',
                    color: 'white', fontWeight: 'bold', fontSize: 15
                  }}>{t.status === '3' || t.status_id === 3 ? 'סגור' : t.status === '2' || t.status_id === 2 ? 'בטיפול' : 'פתוח'}</span>
                </td>
                <td style={{ padding: 12 }}>
                  <select
                    value={statusUpdate[t.id] || t.status || t.status_id || ''}
                    onChange={e => handleStatusChange(t.id, e.target.value)}
                    style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', fontSize: 15 }}
                    disabled={loadingStatus[t.id]}
                  >
                    <option value="1">פתוח</option>
                    <option value="2">בטיפול</option>
                    <option value="3">סגור</option>
                  </select>
                  {loadingStatus[t.id] && <span style={{ marginRight: 8, color: '#888' }}>שומר...</span>}
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Link to={`/ticket/${t.id}`} style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'underline', marginBottom: 4 }}>לפרטי טיקט + תגובות</Link>
                    <textarea
                      rows={2}
                      placeholder="הוסף תגובה..."
                      value={commentText[t.id] || ''}
                      onChange={e => setCommentText(prev => ({ ...prev, [t.id]: e.target.value }))}
                      style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 6, fontSize: 14 }}
                    />
                    <button
                      onClick={() => handleAddComment(t.id)}
                      disabled={loadingComment[t.id] || !(commentText[t.id] && commentText[t.id].trim())}
                      style={{ background: '#2ecc71', color: 'white', border: 'none', borderRadius: 6, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
                    >
                      {loadingComment[t.id] ? 'שולח...' : 'הוסף תגובה'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myTickets.length === 0 && <div style={{ marginTop: 30, color: '#888', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>אין טיקטים שמוקצים אליך.<br/>אם אין טיקטים, בקש מהמנהל להקצות אליך טיקט!</div>}
      </div>
    </div>
  );
});

export default AgentPage;
