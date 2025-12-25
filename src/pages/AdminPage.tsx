import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ticketStore } from '../stores/TicketStore';
import { authStore } from '../stores/AuthStore';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../types/ticket'; 

export const AdminPage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    // מנהל טוען את כל הקריאות במערכת
    ticketStore.fetchTickets();
  }, []);

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>לוח בקרה למנהל 🛠️</h1>
        <button 
          onClick={() => navigate('/home')} 
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          חזרה לדף הבית
        </button>
      </div>

      <h3>ניהול כל הקריאות במערכת</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#333', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'right' }}>מזהה</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>נושא</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>סטטוס</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {ticketStore.tickets.map((ticket: Ticket) => (
            <tr key={ticket.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{ticket.id}</td>
              <td style={{ padding: '10px' }}>{ticket.subject}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  background: ticket.status === 'closed' ? '#ffcccc' : '#ccffcc' 
                }}>
                  {ticket.status || 'פתוח'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <button style={{ cursor: 'pointer' }}>ערוך</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});