import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import AdminPage from '../pages/AdminPage';
import AgentPage from '../pages/AgentPage';
import TicketPage from '../pages/TicketPage'; 

const AppRoutes: React.FC = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/agent" element={<AgentPage />} />
        
        {/* הנתיב שמאפשר לראות פרטי טיקט - חשוב שיהיה בדיוק כך */}
        <Route path="/ticket/:id" element={<TicketPage />} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
});

export default AppRoutes;