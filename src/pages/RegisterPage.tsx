import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authStore from '../stores/AuthStore';
import { loginStyles as styles } from '../styles/loginPageStyles';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await authStore.register(name, email, password);
        if (ok) {
            navigate(authStore.getRedirectPath());
        } else {
            alert(authStore.error || 'הרשמה נכשלה');
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.card} onSubmit={handleRegister}>
                <h2 style={styles.title}>הרשמה למערכת</h2>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="שם מלא"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button style={styles.button} type="submit" disabled={authStore.loading}>{authStore.loading ? 'טוען...' : 'הרשמה'}</button>
                {authStore.error && <div style={{ color: 'crimson', marginTop: 8 }}>{authStore.error}</div>}
                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                    כבר רשומה? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>התחברי כאן</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;