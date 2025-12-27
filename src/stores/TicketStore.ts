import { makeAutoObservable, runInAction } from "mobx";
import api from "../services/api";

class TicketStore {
  tickets: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTickets(params?: Record<string, any>) {
    this.loading = true;
    this.error = null;
    try {
      console.log("TicketStore.fetchTickets params:", params);
      const response = await api.get("/tickets", { params });
      console.log("TicketStore.fetchTickets response.data:", response.data);
      let data = response.data?.data ?? response.data;
      if (Array.isArray(data)) {
        // נרמל שדות נפוצים כדי שה־UI יתאים ללא תלות בשמות השדות מה־backend
        data = data.map((t: any) => {
          const normalized: any = { ...t };
          // id, subject, description — נשאיר
          // priority_id
          normalized.priority_id =
            Number(
              t.priority_id ?? t.priority ?? t.priorityId ?? t.priority_id ?? 0
            ) || undefined;
          // status_id
          normalized.status_id =
            Number(t.status_id ?? t.status ?? t.statusId ?? 0) || undefined;
          // user_id (creator)
          normalized.user_id =
            t.user_id ??
            t.user?.id ??
            t.created_by ??
            t.created_by_id ??
            t.owner_id ??
            t.author_id ??
            t.author?.id ??
            undefined;
          // agent_id
          normalized.agent_id =
            t.agent_id ??
            t.agent?.id ??
            t.assigned_to ??
            t.assignee_id ??
            undefined;
          return normalized;
        });
      }
      runInAction(() => {
        this.tickets = Array.isArray(data) ? data : [];
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Fetch error";
        this.loading = false;
      });
      console.error("Fetch Error:", err);
    }
  }

  async createTicket(subject: string, priorityId: string | number) {
    try {
      const response = await api.post("/tickets", {
        subject,
        description: "פנייה מהממשק",
        priority_id: Number(priorityId),
        // also send alternate field names in case backend expects them
        priority: Number(priorityId),
        priorityId: Number(priorityId),
        status_id: 1,
        status: 1,
      });
      const created = response.data?.data ?? response.data;
      runInAction(() => {
        if (created) this.tickets.unshift(created);
      });
      // refresh list from server to ensure correct fields
      await this.fetchTickets();
      return created;
    } catch (err: any) {
      console.error("Create Error:", err);
      runInAction(() => {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Create error";
      });
      return null;
    }
  }
}
export default new TicketStore();
