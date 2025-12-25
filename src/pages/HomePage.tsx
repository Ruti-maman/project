import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ticketStore } from '../stores/TicketStore';
import { authStore } from '../stores/AuthStore';

export const HomePage = observer(() => {
  const [subject, setSubject] = React.useState('');
  const [description, setDescription] = React.useState('');
  // ודאי שזה מתחיל ככה:
  const [priority, setPriority] = React.useState('medium');

  // טעינת הנתונים מהשרת בכניסה לדף
  useEffect(() => {
    ticketStore.fetchTickets();
  }, []);
const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // חשוב מאוד: הסוגריים המסולסלים כאן הם אלו שאורזים את ה-priority יחד עם השאר
  await ticketStore.createTicket({ subject, description, priority });
  
  setSubject('');
  setDescription('');
  setPriority('medium');
};
// HomePage.tsx

const translatePriority = (priority: any) => {
  // אם השרת מחזיר priority_id (מספר)
  if (priority === 3 || priority === '3') return 'גבוהה';
  if (priority === 2 || priority === '2') return 'בינונית';
  if (priority === 1 || priority === '1') return 'נמוכה';
  
  // ליתר ביטחון, אם זה עדיין מגיע כמחרוזת טקסט
  if (priority === 'high') return 'גבוהה';
  if (priority === 'medium') return 'בינונית';
  
  return 'נמוכה';
};

  const getPriorityStyle = (p: string) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as 'bold',
    background: p === 'high' ? '#ffebee' : '#f5f5f5',
    color: p === 'high' ? '#d32f2f' : '#616161',
    border: p === 'high' ? '1px solid #ffcdd2' : '1px solid #e0e0e0'
  });

  const thStyle: React.CSSProperties = {
    padding: '15px',
    textAlign: 'right',
    borderBottom: '2px solid #eee',
    color: '#666'
  };

  const tdStyle: React.CSSProperties = {
    padding: '15px',
    textAlign: 'right',
    borderBottom: '1px solid #eee'
  };

return (
  <div style={{ padding: '30px', direction: 'rtl', fontFamily: 'Arial' }}>
    {/* שורת כותרת קבועה עם כפתור התנתק */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1>שלום, {authStore.user?.name}! 👋</h1>
      <button onClick={() => authStore.logout()} style={{ background: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
        התנתק
      </button>
    </div>

    {authStore.user?.role === 'admin' ? (
      /* --- תצוגת מנהל --- */
      <section>
        <h2 style={{ color: '#d32f2f' }}>לוח בקרה למנהל - כל הקריאות</h2>
        {/* כאן הטבלה הגדולה של המנהל עם כפתורי ה"סגור קריאה" */}
      </section>
    ) : (
      /* --- תצוגת לקוח (כאן היה חסר הקוד!) --- */
      <>
        {/* 1. טופס פתיחת קריאה חדשה */}
        <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>פתיחת קריאה חדשה</h3>
          {/* כאן הקוד של ה-Inputs (נושא, תיאור וכו') וכפתור "שלח קריאה" */}
        </section>

        {/* 2. טבלת הקריאות שלי */}
        <section>
          <h3>הקריאות שלי</h3>
          {/* כאן ה-Map על ticketStore.tickets שמציג רק את הקריאות של המשתמש */}
        </section>
      </>
    )}
  </div>
);
});