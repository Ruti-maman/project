import { makeAutoObservable, runInAction } from "mobx";
import {
  getTicketsRequest,
  createTicketRequest,
  updateTicketRequest // ודאי שאת מוסיפה פונקציה כזו ב-TicketService
} from "../services/TicketService";
import { Ticket } from "../types/ticket"; // ודאי שהנתיב נכון למיקום הקובץ

class TicketStore {
  tickets: Ticket[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

// TicketStore.ts

async fetchTickets() {
  this.isLoading = true;
  try {
    // אם המשתמש הוא אדמין, אנחנו רוצים נתיב שמביא את הכל
    // בדקי ב-Swagger אם קיים נתיב כזה, למשל '/tickets' למנהל מחזיר הכל?
    // אם לא, נסי להוסיף פרמטר (אם השרת תומך):
    const data = await getTicketsRequest(); 
    
    runInAction(() => {
      this.tickets = data;
    });
  } catch (error) {
    console.error("נכשלה הבאת הקריאות", error);
  } finally {
    runInAction(() => {
      this.isLoading = false;
    });
  }
}

// בתוך TicketStore.ts
// src/stores/TicketStore.ts

async createTicket(ticketData: { subject: string, description: string, priority: string }) {
  try {
    // תרגום העדיפות למזהה שהשרת מכיר (לפי ה-Swagger)
    const priorityMap: Record<string, number> = {
      'low': 1,
      'medium': 2,
      'high': 3
    };

    const finalData = {
      subject: ticketData.subject,
      description: ticketData.description,
      priority_id: priorityMap[ticketData.priority] || 1 // שולחים priority_id במקום priority
    };

    console.log("שולח לשרת נתונים מתורגמים:", finalData);
    
    await createTicketRequest(finalData); 
    await this.fetchTickets(); 
  } catch (error) {
    console.error("שגיאה ביצירת קריאה", error);
  }
}

  // פונקציה חדשה שחשובה מאוד ל-README: עדכון סטטוס
async updateStatus(id: string, status: string) {
  try {
    await updateTicketRequest(id, { status }); 
    runInAction(() => {
      // עדכון המערך בצורה ש-React בטוח יזהה
      this.tickets = this.tickets.map((t: any) => {
        // בודק גם id וגם _id וגם הופך למחרוזת להשוואה בטוחה
        if (String(t.id) === String(id) || String(t._id) === String(id)) {
          return { ...t, status: status };
        }
        return t;
      });
    });
  } catch (error) {
    console.error("שגיאה בעדכון הסטטוס", error);
  }
}
}

export const ticketStore = new TicketStore();