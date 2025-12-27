import api from "./api";

export const getUsersRequest = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createUserRequest = async (userData: any) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUserRequest = async (id: string, data: any) => {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUserRequest = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
