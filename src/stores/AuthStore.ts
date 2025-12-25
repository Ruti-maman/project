import { makeAutoObservable } from "mobx";
import { User } from "../types/auth";
import api from "../services/api";

class AuthStore {
  user: User | null = null;
  token: string | null = localStorage.getItem("token");

  constructor() {
    makeAutoObservable(this);
    if (this.token) {
      this.getMe();
    }
  }

  setAuth(token: string, user: User) {
    // הגנה: אם הנתונים לא הגיעו, אל תמשיך
    if (!token || !user) {
      console.error("Missing token or user in setAuth!");
      return;
    }
    this.token = token;
    this.user = user;
    localStorage.setItem("token", token);
  }

async register(name: string, email: string, password: string) {
  try {
    // 1. מבצעים הרשמה
    const response = await api.post('/auth/register', { name, email, password });
    console.log("Register success, server returned:", response.data);

    // 2. מבצעים לוגין אוטומטי כדי לקבל את הטוקן והמשתמש המלא
    // זה השלב שחסר לך וגורם ל"טוען נתונים"
    await this.login(email, password);
    
    // 3. עוברים לדף הבית בכוח כדי לרענן את המצב
    window.location.href = '/home';

  } catch (error) {
    console.error("Register or Auto-Login failed:", error);
    throw error;
  }
}
// src/stores/AuthStore.ts

async login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    const token = response.data.token || response.data.accessToken;
    let user = response.data.user;

    // --- השורה שחיפשת! כאן אנחנו "מזריקים" את ה-Admin ---
    if (email === 'ruti@admin.com') {
      user = { ...user, role: 'admin', name: 'רותי המנהלת' };
    }
    // --------------------------------------------------

    if (token && user) {
      this.setAuth(token, user);
    } else {
      throw new Error("Missing token or user");
    }
  } catch (error) {
    throw error;
  }
}

async getMe() {
  if (!this.token) return;

 // בתוך פונקציית getMe ב-AuthStore.ts
try {
  const response = await api.get('/auth/me');
  let userData = response.data;

  // הוספת השורה הזו כאן תבטיח שהשם ישתנה גם אחרי רענון דף
  if (userData.email === 'ruti@admin.com') {
    userData.role = 'admin';
    userData.name = 'רותי המנהלת'; // כאן אנחנו קובעים את השם שיוצג
  }

  this.user = userData;
} catch (error: any) {
  // במקרה של שגיאה, ה-fallback שלך כבר מוגדר נכון
  this.user = { id: 'temp', name: 'רותי המנהלת', email: 'ruti@admin.com', role: 'admin' } as any;
}
}
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    window.location.href = '/login';
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

export const authStore = new AuthStore();