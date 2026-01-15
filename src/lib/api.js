import axios from "axios";
import {
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "@/lib/utils";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getItemFromLocalStorage("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeItemFromLocalStorage("accessToken");
      removeItemFromLocalStorage("user");
      removeItemFromLocalStorage("email");
      removeItemFromLocalStorage("otp");
      removeItemFromLocalStorage("username");

      // Optional toast

      // Hard redirect to avoid broken state
      window.location.href = "/login";

      toast.error("Session expired. Please login again.");
    }

    return Promise.reject(error);
  },
);

export default api;
