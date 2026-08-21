import { apiClient } from "./client";

export const getMe = (token) => apiClient.get("/api/me", { token });
export const createOrder = (order, token) => apiClient.post("/api/orders", order, { token });
export const getAdminStats = (token) => apiClient.get("/api/admin/stats", { token });
export const triggerError = () => apiClient.get("/api/error");
export const getHealth = () => apiClient.get("/api/health");