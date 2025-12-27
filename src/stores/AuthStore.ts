import { makeAutoObservable, runInAction } from "mobx";
import api from "../services/api";

class AuthStore {
    user: any = null;
    token: string | null = localStorage.getItem("token");
    isAuthenticated = !!localStorage.getItem("token");
    isLoading = true;
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.init();
    }

    async init() {
        if (this.token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            try {
                await this.getMe();
            } catch (e) {
                // אם ה־token לא תקין - ננקה ונמשיך
                this.logout();
            }
        }
        runInAction(() => { this.isLoading = false; });
    }

    async setAuth(data: any) {
        const token = data?.token ?? data?.data?.token ?? null;
        const user = data?.user ?? data?.data?.user ?? null;
        if (!token) return false;
        localStorage.setItem("token", token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        runInAction(() => {
            this.token = token;
            this.user = user;
            this.isAuthenticated = true;
        });
        return true;
    }

    getRedirectPath() {
        const role = this.user?.role;
        if (role === 'admin') return '/admin';
        if (role === 'agent') return '/agent';
        return '/home';
    }

    async login(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            const res = await api.post("/auth/login", { email, password });
            const ok = await this.setAuth(res.data);
            // אם קיבלנו טוקן אך לא קיבלנו פרטי משתמש מלאים, נבקש /auth/me
            if (ok && !this.user) {
                await this.getMe();
            }
            this.loading = false;
            return !!ok;
        } catch (err: any) {
            runInAction(() => {
                this.error = err?.response?.data?.message ?? err?.message ?? 'Login failed';
                this.loading = false;
            });
            throw err;
        }
    }

    async register(name: string, email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            const res = await api.post("/auth/register", { name, email, password, role: "customer" });
            const ok = await this.setAuth(res.data);
            if (ok && !this.user) {
                await this.getMe();
            }
            // אם השרת לא החזיר טוקן, ננסה להתחבר מיד
            if (!ok) {
                const loginOk = await this.login(email, password).catch(() => false);
                runInAction(() => { this.loading = false; });
                return !!loginOk;
            }
            runInAction(() => { this.loading = false; });
            return true;
        } catch (err: any) {
            runInAction(() => {
                this.error = err?.response?.data?.message ?? err?.message ?? 'Register failed';
                this.loading = false;
            });
            return false;
        }
    }

    async getMe() {
        try {
            const res = await api.get("/auth/me");
            const user = res.data?.data ?? res.data;
            runInAction(() => { this.user = user; });
        } catch { this.logout(); }
    }

    logout() {
        runInAction(() => {
            localStorage.removeItem("token");
            delete api.defaults.headers.common['Authorization'];
            this.user = null;
            this.isAuthenticated = false;
        });
    }
}
export default new AuthStore();