import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import ticketStore from '../stores/TicketStore';
import authStore from '../stores/AuthStore';
import s from '../styles/homePageStyles';

const AgentPage: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    ticketStore.fetchTickets();
  }, []);

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h1 style={s.title}>לוח בקרה לנציג: {authStore.user?.username} 🎧</h1>
        <button style={s.logoutButton} onClick={() => { authStore.logout(); navigate('/login'); }}>יציאה</button>
      </div>

      <div style={s.tableWrapper}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>לקוח</th>
              <th style={s.th}>נושא</th>
              <th style={s.th}>סטטוס</th>
              <th style={s.th}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {ticketStore.tickets.map((t: any) => (
              <tr key={t.id} style={s.tr}>
                <td style={s.td}>{t.customer_name}</td>
                <td style={s.td}><strong>{t.subject}</strong></td>
                <td style={s.td}>{t.status_name}</td>
                <td style={s.td}>
                  <button 
                    onClick={() => navigate(`/ticket/${t.id}`)} 
                    style={{ background: '#82ccdd', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ענה ללקוח 💬
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default AgentPage;