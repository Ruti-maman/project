import React, { useEffect } from 'react'; // הוספנו useEffect
import { observer } from 'mobx-react-lite';
import { ticketStore } from '../stores/TicketStore';
import { authStore } from '../stores/AuthStore';

export const HomePage = observer(() => {
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');

  // --- שלב 1: פקודה להבאת נתונים ברגע שהדף עולה ---
  useEffect(() => {
    ticketStore.fetchTickets();
  }, []); 

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await ticketStore.createTicket(subject, description);
    setSubject(''); 
    setDescription('');
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      {/* --- שלב 2: כפתור התנתקות --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>שלום, {authStore.user?.name || 'משתמש'}! 👋</h1>
        <button 
          onClick={() => authStore.logout()} 
          style={{ background: '#ff4444', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
        >
          התנתק
        </button>
      </div>

      <form onSubmit={handleCreate} style={{ marginBottom: '30px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <h3>פתיחת קריאה חדשה</h3>
        <input 
          placeholder="נושא (Subject)" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          required
        />
        <textarea 
          placeholder="תיאור הבעיה" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px', minHeight: '60px' }}
          required
        />
        <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
          שלח קריאה
        </button>
      </form>

      <h2>רשימת הקריאות שלי</h2>
      {ticketStore.isLoading ? <p>טוען קריאות...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>נושא</th>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>תיאור</th>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {ticketStore.tickets.map((ticket: any) => (
              <tr key={ticket.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ticket.subject}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ticket.description}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{ticket.status || 'פתוח'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});