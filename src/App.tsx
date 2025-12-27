import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {AppRoutes}  from './routes/AppRoutes'; // תיקון הנתיב ל-routes
import  authStore from './stores/AuthStore';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  // הבדיקה שמוודאת אם הטוקן שלך עדיין בתוקף
  useEffect(() => {
    if (authStore.token) {
      authStore.getMe();
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
});

export default App;