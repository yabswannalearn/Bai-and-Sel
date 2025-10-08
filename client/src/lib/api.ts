import axios from "axios";
import { NEXT_PUBLIC_API_URL } from "@/constants/paths";

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ send and receive cookies
});

// Register
export const register = (email: string, password: string) =>
  api.post("/auth/register", { email, password });

// Login
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// Logout
export const logout = () => api.post("/auth/logout");

// Get profile (protected route)
export const getProfile = () => api.get("/auth/profile");

export default api;
