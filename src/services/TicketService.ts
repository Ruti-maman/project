import api from './api';

export const getTicketsRequest = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

// בתוך TicketService.ts
export const createTicketRequest = async (ticketData: any) => {
  // מוודאים שכל ה-ticketData נשלח ב-POST
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

// תוסיפי את זה:
export const updateTicketRequest = async (id: string, data: any) => {
  const response = await api.patch(`/tickets/${id}`, data);
  return response.data;
};