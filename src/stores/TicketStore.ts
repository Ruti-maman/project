import { makeAutoObservable, runInAction } from "mobx";
import {
  getTicketsRequest,
  getStatusesRequest,
  getPrioritiesRequest,
  getAllUsersRequest,
} from "../services/TicketService";

class TicketStore {
  tickets: any[] = [];
  statuses: any[] = [];
  priorities: any[] = [];
  users: any[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // טעינת נתונים חכמה שלא קורסת
  async fetchAllData() {
    this.loading = true;
    try {
      // 1. נתונים שכולם יכולים לראות (משותף)
      const [ticketsData, statusesData, prioritiesData] = await Promise.all([
        getTicketsRequest(),
        getStatusesRequest(),
        getPrioritiesRequest(),
      ]);

      runInAction(() => {
        this.tickets = ticketsData;
        this.statuses = statusesData;
        this.priorities = prioritiesData;
      });

      // 2. ננסה לטעון משתמשים (רק אם מותר)
      try {
        const usersData = await getAllUsersRequest();
        runInAction(() => {
          this.users = usersData;
        });
      } catch (error) {
        // אם קיבלנו 403 (Forbidden), זה בסדר, כנראה אנחנו לקוח רגיל
        // פשוט נתעלם ולא נשבור את האפליקציה
        console.log("User list fetch skipped (probably client role)");
      }
    } catch (error) {
      console.error("Critical error fetching data", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchTickets() {
    try {
      const data = await getTicketsRequest();
      runInAction(() => {
        this.tickets = data;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async refreshLists() {
    this.fetchAllData();
  }
}

const ticketStore = new TicketStore();
export default ticketStore;
