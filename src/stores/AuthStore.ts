import { makeAutoObservable, runInAction } from "mobx";
import {
  loginRequest,
  registerRequest,
  getMeRequest,
} from "../services/AuthService";

class AuthStore {
  user: any = null;
  isAuthenticated: boolean = false;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    const token = localStorage.getItem("token");
    if (token) {
      this.isAuthenticated = true;
      this.fetchMe();
    }
  }

  async fetchMe() {
    try {
      const userData = await getMeRequest();
      runInAction(() => {
        this.user = userData;
        this.isAuthenticated = true;
      });
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  }

  async login(credentials: { email: string; password: string }) {
    this.loading = true;
    try {
      const data = await loginRequest(credentials);
      const token = data.token || data.access_token;

      if (!token) {
        alert("שגיאה: השרת לא החזיר טוקן.");
        runInAction(() => {
          this.loading = false;
        });
        return;
      }

      runInAction(() => {
        localStorage.setItem("token", token);
        this.isAuthenticated = true;
        if (data.user) this.user = data.user;
        else this.fetchMe();
        this.loading = false;
      });
      return data; // מחזירים את המידע כדי שנדע שהצליח
    } catch (error: any) {
      runInAction(() => {
        this.loading = false;
      });
      const message = error.response?.data?.message || "שגיאה לא ידועה";
      alert(`נכשל בהתחברות: ${message}`);
      throw error;
    }
  }

  // --- הפונקציה שמתקנת את הבעיה שלך ---
  async register(userData: {
    email: string;
    firstName: string;
    password: string;
  }) {
    this.loading = true;
    try {
      // 1. מבצעים הרשמה
      const data = await registerRequest(userData);

      // 2. בודקים: האם קיבלנו מפתח כניסה?
      let token = data.token || data.access_token;

      // 3. אם לא קיבלנו טוקן - נעשה לוגין אוטומטי בשבילך!
      if (!token) {
        console.log("Registration successful, performing auto-login...");
        // אנחנו קוראים לפונקציית הלוגין שלנו עם הסיסמה שהמשתמש הרגע הזין
        const loginResponse = await loginRequest({
          email: userData.email,
          password: userData.password,
        });
        token = loginResponse.token || loginResponse.access_token;
      }

      // 4. שמירת הנתונים וכניסה למערכת
      runInAction(() => {
        if (token) {
          localStorage.setItem("token", token);
          this.isAuthenticated = true; // זה הדבר הכי חשוב!

          // משיכת פרטי משתמש אם חסרים
          if (data.user) this.user = data.user;
          else this.fetchMe();
        }
        this.loading = false;
      });
    } catch (error: any) {
      runInAction(() => {
        this.loading = false;
      });
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        alert(
          "ההרשמה נכשלה: " +
            (Array.isArray(serverMsg) ? serverMsg.join("\n") : serverMsg)
        );
      } else {
        alert("שגיאה בהרשמה.");
      }
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("token");
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
  }
}

const authStore = new AuthStore();
export default authStore;
