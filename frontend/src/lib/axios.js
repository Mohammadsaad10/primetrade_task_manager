import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});

// response interceptor to suppress 401 errors for auth/me
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.config?.url?.includes("/auth/me") &&
      error.response?.status === 401
    ) {
      // Suppress 401 errors for auth/me as they're expected when not authenticated
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
