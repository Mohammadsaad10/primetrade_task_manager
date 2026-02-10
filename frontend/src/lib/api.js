import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Error fetching auth user:", error);
    }
    return null;
  }
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const register = async (registerData) => {
  const res = await axiosInstance.post("/auth/register", registerData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const fetchTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axiosInstance.post("/tasks", taskData);
  return res.data;
};

export const updateTask = async ({ taskId, taskData }) => {
  const res = await axiosInstance.put(`/tasks/${taskId}`, taskData);
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await axiosInstance.delete(`/tasks/${taskId}`);
  return res.data;
};
