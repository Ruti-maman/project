import api from "./api";

// --- טיקטים ---
export const getTicketsRequest = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const getTicketRequest = async (id: string) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicketRequest = async (ticketData: {
  subject: string;
  description: string;
  priority_id: number;
}) => {
  const response = await api.post("/tickets", ticketData);
  return response.data;
};

export const updateTicketRequest = async (id: string, data: any) => {
  const response = await api.patch(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTicketRequest = async (id: string) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};

// --- תגובות ---
export const getCommentsRequest = async (ticketId: string) => {
  const response = await api.get(`/tickets/${ticketId}/comments`);
  return response.data;
};

export const postCommentRequest = async (
  ticketId: string,
  commentData: { content: string }
) => {
  const response = await api.post(`/tickets/${ticketId}/comments`, {
    content: commentData.content,
  });
  return response.data;
};

// --- סטטוסים ---
export const getStatusesRequest = async () => {
  const response = await api.get("/statuses");
  return response.data;
};

export const createStatusRequest = async (name: string) => {
  const response = await api.post("/statuses", { name });
  return response.data;
};

export const deleteStatusRequest = async (id: number) => {
  try {
    const response = await api.delete(`/statuses/${id}`);
    return response.data;
  } catch (e) {
    const response = await api.delete(`/status/${id}`);
    return response.data;
  }
};

// --- עדיפויות ---
export const getPrioritiesRequest = async () => {
  const response = await api.get("/priorities");
  return response.data;
};

export const createPriorityRequest = async (name: string) => {
  const response = await api.post("/priorities", { name });
  return response.data;
};

export const deletePriorityRequest = async (id: number) => {
  try {
    const response = await api.delete(`/priorities/${id}`);
    return response.data;
  } catch (e) {
    const response = await api.delete(`/priority/${id}`);
    return response.data;
  }
};

// --- משתמשים ---
export const getAllUsersRequest = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createUserRequest = async (userData: any) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// --- הפונקציה החדשה שהייתה חסרה לך! ---
export const getUserByIdRequest = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
