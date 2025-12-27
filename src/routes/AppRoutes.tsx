import React from 'react'; // חובה להוסיף!
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '../stores/AuthStore';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';

import AdminPage from '../pages/AdminPage';
import AgentPage from '../pages/AgentPage';
import TicketPage from '../pages/TicketPage';
import StatusesPage from '../pages/StatusesPage';
import UsersPage from '../pages/UsersPage';

// ייצוא מפורש כדי לפתור את השגיאה בתמונה image_7614e0.png
export const AppRoutes = observer(() => {
    if (authStore.isLoading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}>טוען מערכת...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={!authStore.isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} />
            <Route path="/register" element={!authStore.isAuthenticated ? <RegisterPage /> : <Navigate to="/home" />} />
            <Route
                path="/home"
                element={
                    authStore.isAuthenticated
                        ? (authStore.user?.role === 'admin' ? <Navigate to="/admin" /> : <HomePage />)
                        : <Navigate to="/login" />
                }
            />
            <Route path="/admin" element={authStore.isAuthenticated && authStore.user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/statuses" element={authStore.isAuthenticated && authStore.user?.role === 'admin' ? <StatusesPage /> : <Navigate to="/login" />} />
            <Route path="/users" element={authStore.isAuthenticated && authStore.user?.role === 'admin' ? <UsersPage /> : <Navigate to="/login" />} />
            <Route path="/agent" element={authStore.isAuthenticated && authStore.user?.role === 'agent' ? <AgentPage /> : <Navigate to="/login" />} />
            <Route path="/ticket/:id" element={authStore.isAuthenticated ? <TicketPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={authStore.isAuthenticated ? authStore.getRedirectPath() : '/login'} />} />
        </Routes>
    );
});

export default AppRoutes;