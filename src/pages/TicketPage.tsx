import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
    postCommentRequest, getTicketRequest, updateTicketRequest, deleteTicketRequest, getUserByIdRequest
} from '../services/TicketService';
import ticketStore from '../stores/TicketStore';
import authStore from '../stores/AuthStore';

const TicketPage: React.FC = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const commentsEndRef = useRef<HTMLDivElement>(null);
  
  const [ticket, setTicket] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [fetchedAgentName, setFetchedAgentName] = useState<string | null>(null);

  const userRole = authStore.user?.role;
  const isAdmin = userRole === 'admin';
  const isAgent = userRole === 'agent';
  
  // גם מנהל וגם נציג יכולים לעדכן (חלק מהדברים)
  const canUpdate = isAdmin || isAgent;

  useEffect(() => {
    if (id) loadTicket();
    ticketStore.fetchAllData(); 
  }, [id]);

  useEffect(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.comments]);

  useEffect(() => {
      const fetchSpecificAgent = async () => {
          if (!ticket || !ticket.assigned_to) return;
          const agentId = Number(ticket.assigned_to);

          const inStore = ticketStore.users.find(u => u.id === agentId);
          if (inStore) {
              setFetchedAgentName(inStore.name || inStore.first_name || inStore.username);
              return;
          }

          if (ticket.comments && ticket.comments.length > 0) {
              const agentComment = ticket.comments.find((c: any) => 
                  Number(c.author_id) === agentId || Number(c.user_id) === agentId
              );
              if (agentComment && agentComment.author_name) {
                  setFetchedAgentName(agentComment.author_name);
                  return;
              }
          }

          try {
              const user = await getUserByIdRequest(agentId);
              if (user && (user.name || user.first_name || user.username)) {
                  setFetchedAgentName(user.name || user.first_name || user.username);
              }
          } catch (e) { console.log("Blocked"); }
      };
      
      fetchSpecificAgent();
  }, [ticket, ticketStore.users.length]);

  const loadTicket = () => {
      if(id) getTicketRequest(id).then(data => setTicket(data));
  }

  const handleSendComment = async () => {
    if (!comment.trim() || !id) return;
    try {
      await postCommentRequest(id, { content: comment });
      setComment('');
      loadTicket();
    } catch (e) { alert("שגיאה בשליחה"); }
  };

  const handleUpdate = async (field: string, value: any) => {
      if(!id) return;
      try {
          await updateTicketRequest(id, { [field]: value });
          
          setTicket((prev: any) => {
              const updated = { ...prev, [field]: value };
              if (field === 'assigned_to') {
                  setFetchedAgentName(null); 
                  const user = ticketStore.users.find(u => u.id == value);
                  if (user) {
                      updated.assigned_name = user.name || user.first_name || user.username;
                  }
              }
              return updated;
          });
          if (field === 'assigned_to') loadTicket();
      } catch (e) { alert("שגיאה בעדכון"); }
  };

  const handleDelete = async () => {
      if (!id) return;
      if (ticket.comments && ticket.comments.length > 0) {
          alert("⛔ לא ניתן למחוק קריאה שיש בה תגובות.");
          return;
      }
      if (window.confirm("🗑️ בטוחה שאת רוצה למחוק את הקריאה?")) {
          try {
              await deleteTicketRequest(id);
              navigate('/home');
          } catch (e) { alert("שגיאה במחיקה"); }
      }
  };

  const resolveAgentName = () => {
      if (!ticket || !ticket.assigned_to) return 'טרם הוקצה';
      if (fetchedAgentName) return fetchedAgentName;
      if (ticket.assigned_name) return ticket.assigned_name;
      if (ticket.agent_name) return ticket.agent_name;
      if (ticket.assigned_user?.name) return ticket.assigned_user.name;
      return `... (נציג #${ticket.assigned_to})`;
  };

  const getStatusName = () => {
      if (!ticket) return "";
      const s = ticketStore.statuses.find(x => x.id === ticket.status_id);
      return s ? s.name : ticket.status_name || "Unknown";
  };

  const getPriorityName = () => {
      if (!ticket) return "";
      const p = ticketStore.priorities.find(x => x.id === ticket.priority_id);
      return p ? p.name : ticket.priority_name || "Unknown";
  };

  const getStatusColor = (name: string) => {
      const lower = (name || "").toLowerCase();
      if (lower.includes('open') || lower.includes('פתוח')) return '#10ac84'; 
      if (lower.includes('progress') || lower.includes('בטיפול')) return '#feca57'; 
      if (lower.includes('closed') || lower.includes('סגור')) return '#576574'; 
      return '#2e86de';
  };

  const getPriorityColor = (name: string) => {
      const lower = (name || "").toLowerCase();
      if (lower.includes('highest')) return '#e84393'; 
      if (lower.includes('high') || lower.includes('urgent') || lower.includes('דחוף')) return '#ff6b6b'; 
      if (lower.includes('medium') || lower.includes('בינונ')) return '#ff9f43'; 
      if (lower.includes('low') || lower.includes('נמוך')) return '#1dd1a1'; 
      const palette = ['#4f46e5', '#e55039', '#130f40', '#fdcb6e', '#00cec9', '#6c5ce7', '#e84393', '#e17055'];
      const id = ticket.priority_id || 0;
      return palette[id % palette.length]; 
  };

  if (!ticket) return <div style={{...styles.pageContainer, justifyContent: 'center'}}><h2>טוען נתונים... ⏳</h2></div>;

  return (
    <div style={styles.pageContainer}>
      <button onClick={() => navigate('/home')} style={styles.backButton}>⬅️ חזרה לרשימה</button>

      <div style={styles.mainCard}>
        <div style={styles.headerSection}>
            <div style={styles.headerTop}>
                <h1 style={styles.ticketTitle}>קריאה #{id}: {ticket.subject}</h1>
                {isAdmin && (
                    <button onClick={handleDelete} style={styles.deleteButton}>🗑️ מחק</button>
                )}
            </div>

            <div style={styles.badgesRow}>
                <span style={{...styles.badge, background: getStatusColor(getStatusName())}}>
                    🏷️ סטטוס: {getStatusName()}
                </span>
                <span style={{...styles.badge, background: getPriorityColor(getPriorityName())}}>
                    ⚡ עדיפות: {getPriorityName()}
                </span>
                <span style={{...styles.badge, background: '#a29bfe'}}>
                    👤 נציג מטפל: {resolveAgentName()}
                </span>
            </div>
        </div>

        {/* --- פאנל הניהול - מופיע כעת גם לנציגים (canUpdate) --- */}
        {canUpdate && (
            <div style={styles.adminPanel}>
                <h4 style={{margin: '0 0 10px 0', color: '#636e72'}}>🛠️ פאנל ניהול</h4>
                <div style={styles.controlsGrid}>
                    <div style={styles.controlGroup}>
                        <label>שני סטטוס:</label>
                        <select style={styles.selectInput} value={ticket.status_id} onChange={(e) => handleUpdate('status_id', Number(e.target.value))}>
                            {ticketStore.statuses.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div style={styles.controlGroup}>
                        <label>שני עדיפות:</label>
                        <select style={styles.selectInput} value={ticket.priority_id} onChange={(e) => handleUpdate('priority_id', Number(e.target.value))}>
                            {ticketStore.priorities.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    
                    {/* אפשרות הקצאת נציג - מופיעה אך ורק למנהל! (isAdmin) */}
                    {isAdmin && (
                        <div style={styles.controlGroup}>
                            <label>הקצה נציג:</label>
                            <select style={styles.selectInput} value={ticket.assigned_to || ''} onChange={(e) => handleUpdate('assigned_to', Number(e.target.value))}>
                                <option value="">-- ללא נציג --</option>
                                {ticketStore.users.filter((u: any) => u.role === 'agent').map((u: any) => (
                                    <option key={u.id} value={u.id}>{u.name || u.first_name || u.email}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        )}

        <hr style={{border: '0', borderTop: '1px solid #dfe6e9', margin: '20px 0'}} />

        <h3 style={{color: '#2d3436'}}>💬 השתלשלות האירועים</h3>
        <div style={styles.chatContainer}>
          {ticket.comments?.length > 0 ? ticket.comments.map((c: any) => {
            const isAgent = c.is_agent || (c.author_role === 'agent' || c.author_role === 'admin');
            return (
                <div key={c.id} style={{
                    ...styles.chatBubble,
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                    background: isAgent ? '#d1ccc0' : '#dff9fb',
                    borderBottomRightRadius: isAgent ? '0' : '15px',
                    borderBottomLeftRadius: isAgent ? '15px' : '0',
                }}>
                    <div style={styles.chatHeader}>
                        <strong>{c.author_name || 'משתמש'}:</strong>
                        <span style={{fontSize: '0.8em', opacity: 0.7}}> ({isAgent ? 'נציג' : 'לקוח'})</span>
                    </div>
                    <div style={styles.chatBody}>{c.content || c.body}</div>
                </div>
            );
          }) : (
            <div style={styles.emptyState}>
                <div style={{fontSize: '40px'}}>📭</div>
                <p>אין עדיין תגובות בקריאה זו.</p>
            </div>
          )}
          <div ref={commentsEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input 
            style={styles.messageInput} 
            placeholder="כתבי תגובה..." 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
          />
          <button onClick={handleSendComment} style={styles.sendButton}>שליחה ✈️</button>
        </div>
      </div>
    </div>
  );
});

const styles: any = {
    pageContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Segoe UI', direction: 'rtl' },
    backButton: { alignSelf: 'flex-start', background: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontWeight: 'bold', marginBottom: '20px', color: '#636e72' },
    mainCard: { background: 'white', width: '100%', maxWidth: '800px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' },
    headerSection: { marginBottom: '10px' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    ticketTitle: { margin: '0 0 15px 0', color: '#2d3436', fontSize: '24px' },
    deleteButton: { background: '#ff7675', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    badgesRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    badge: { padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    adminPanel: { background: '#f1f2f6', padding: '20px', borderRadius: '15px', border: '1px solid #dfe6e9' },
    controlsGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    controlGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '150px' },
    selectInput: { padding: '10px', borderRadius: '8px', border: '1px solid #b2bec3', background: 'white', fontSize: '14px' },
    chatContainer: { background: '#fdfdfd', border: '1px solid #eee', borderRadius: '15px', padding: '20px', height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' },
    chatBubble: { maxWidth: '70%', padding: '15px', borderRadius: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative', lineHeight: '1.5' },
    chatHeader: { fontSize: '0.85em', marginBottom: '5px', color: '#636e72' },
    chatBody: { color: '#2d3436', fontSize: '15px' },
    emptyState: { textAlign: 'center', color: '#b2bec3', marginTop: '50px' },
    inputArea: { display: 'flex', gap: '10px', marginTop: '10px' },
    messageInput: { flex: 1, padding: '15px', borderRadius: '30px', border: '1px solid #dfe6e9', fontSize: '16px', outline: 'none', background: '#f1f2f6' },
    sendButton: { padding: '0 25px', borderRadius: '30px', background: '#0984e3', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 4px 6px rgba(9, 132, 227, 0.3)' }
};

export default TicketPage;