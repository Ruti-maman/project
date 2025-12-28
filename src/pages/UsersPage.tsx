import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/AuthService'; // נשתמש בזה ליצירת משתמשים
import s from '../styles/homePageStyles';
import api from '../services/api'; // לצורך שליחה ישירה אם צריך התאמות

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      firstName: '', email: '', password: '', role: 'client'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // אנחנו משתמשים בטריק: שולחים בקשה לשרת ליצירת משתמש
        // נשתמש בנתיב המיוחד של יצירת משתמשים אם קיים, או בהרשמה הרגילה עם תוספת תפקיד
        await api.post('/users', {
            name: formData.firstName,
            email: formData.email,
            username: formData.email,
            password: formData.password,
            role: formData.role // כאן המנהל קובע את התפקיד!
        });
        
        alert("המשתמש נוצר בהצלחה! 🎉");
        setFormData({ firstName: '', email: '', password: '', role: 'client' });
    } catch (error) {
        alert("שגיאה ביצירת המשתמש. אולי האימייל תפוס?");
    }
  };

  return (
    <div style={s.container}>
        <button onClick={() => navigate('/home')} style={{ marginBottom: '20px', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>⬅️ חזרה</button>
        
        <div style={s.createCard}>
            <h2 style={{ textAlign: 'center', color: '#2d3436' }}>ניהול משתמשים 👥</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>הוסיפי לקוח, סוכן או מנהל חדש למערכת</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input style={s.input} placeholder="שם מלא" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                <input style={s.input} placeholder="אימייל (שם משתמש)" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input style={s.input} placeholder="סיסמה" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                
                <label style={{ fontWeight: 'bold' }}>תפקיד:</label>
                <select style={{ ...s.input, height: '50px' }} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="client">לקוח (Client)</option>
                    <option value="agent">סוכן (Agent)</option>
                    <option value="admin">מנהל (Admin)</option>
                </select>

                <button type="submit" style={{ ...s.submitBtn, marginTop: '10px' }}>צור משתמש ➕</button>
            </form>
        </div>
    </div>
  );
};

export default UsersPage;