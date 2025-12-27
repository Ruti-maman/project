import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authStore from '../stores/AuthStore';
import { loginStyles as styles } from '../styles/loginPageStyles';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const ok = await authStore.login(email, password);
            if (ok) {
                navigate(authStore.getRedirectPath());
            } else {
                alert('התחברות נכשלה');
            }
        } catch (error) {
            alert("פרטי התחברות שגויים");
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.card} onSubmit={handleLogin}>
                <h2 style={styles.title}>כניסה למערכת</h2>
                <input 
                    style={styles.input} 
                    type="email" 
                    placeholder="אימייל" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    style={styles.input} 
                    type="password" 
                    placeholder="סיסמה" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button style={styles.button} type="submit" disabled={authStore.loading}>{authStore.loading ? 'טוען...' : 'התחברי'}</button>
                {authStore.error && <div style={{ color: 'crimson', marginTop: 8 }}>{authStore.error}</div>}
                
                {/* הנה הכפתור שהיה חסר לך! */}
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                    עדיין אין לך חשבון? <Link to="/register" style={{ color: '#007bff', fontWeight: 'bold' }}>הירשמי כאן</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;