export interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: 'open' | 'closed' | 'in_progress'; 
    userId: number;
    createdAt?: string; 
}