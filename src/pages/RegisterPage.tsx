import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/AuthStore'; 
import { observer } from 'mobx-react-lite';

const RegisterPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ההרשמה מתבצעת
      await authStore.register({ email, firstName, password });
      
      // התיקון: במקום ללכת ללוגין, אנחנו הולכים ישר הביתה!
      // בגלל שה-Store כבר שמר את הטוקן, הכניסה תהיה חלקה.
      navigate('/home'); 

    } catch (error) {
      // ה-Store כבר מקפיץ את הודעת השגיאה, אז אין צורך לעשות כלום פה
    }
  };

  const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5', direction: 'rtl' };
  const cardStyle: React.CSSProperties = { background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const buttonStyle: React.CSSProperties = { width: '100%', padding: '12px', background: '#82ccdd', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={cardStyle}>
        <h2 style={{ marginBottom: '20px', color: '#2d3436' }}>הרשמה למערכת 🍦</h2>
        
        <input style={inputStyle} placeholder="שם מלא" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input style={inputStyle} type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="סיסמה (לפחות 6 תווים)" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" style={buttonStyle}>הירשמי וכנסי</button>
        
        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          כבר רשומה? <span onClick={() => navigate('/login')} style={{ color: '#0984e3', cursor: 'pointer', fontWeight: 'bold' }}>התחברי כאן</span>
        </p>
      </form>
    </div>
  );
});

export default RegisterPage;