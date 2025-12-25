import { makeAutoObservable, runInAction } from "mobx";
import {
  getTicketsRequest,
  createTicketRequest,
} from "../services/TicketService";

class TicketStore {
  tickets = []; // כאן נשמרת הרשימה
  isLoading = false; // מצב טעינה

  constructor() {
    makeAutoObservable(this);
  }

  // --- כאן את מדביקה את הפונקציה ---
  async fetchTickets() {
    this.isLoading = true;
    try {
      const data = await getTicketsRequest();
      runInAction(() => {
        this.tickets = data; // הנתונים מהשרת נכנסים למשתנה tickets
      });
    } catch (error) {
      console.error("נכשלה הבאת הקריאות", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // כאן תבוא הפונקציה createTicket שהוספנו קודם
  async createTicket(subject: string, description: string) {
    try {
      await createTicketRequest({ subject, description });
      await this.fetchTickets(); // קריאה חוזרת ל-fetchTickets כדי לעדכן את הטבלה
    } catch (error) {
      console.error("שגיאה ביצירת קריאה", error);
    }
  }
}

export const ticketStore = new TicketStore();
