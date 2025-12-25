import api from './api';

export const getTicketsRequest = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

// הפונקציה הזו הייתה חסרה לך בתמונה!
export const createTicketRequest = async (ticketData: { subject: string; description: string }) => {
  const response = await api.post('/tickets', ticketData); 
  return response.data;
};
