// הגדרת המבנה של משתמש במערכת
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer' | 'agent'; // כולל את agent כפי שביקשת
}

// הגדרת המבנה של התשובה שמגיעה מהשרת בזמן התחברות
export interface LoginResponse {
    token: string;
    user: User;
}