export interface Ticket {
    status: string;
    id: number | string;
    subject: string;
    description?: string;
    status_id?: number;
    priority_id?: number;
    created_at?: string;
    user_id?: number;
    user?: {
        name: string;
        role: string;
        id?: number;
    };
    agent_id?: number;
    agent?: {
        id: number;
        name: string;
    };
}


