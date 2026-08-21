import { apiClient } from "./client";

export const getProducts = () => apiClient.get("/api/products");
export const getProduct = (id) => apiClient.get(`/api/products/${id}`);
export const createProduct = (product) => apiClient.post("/api/products", product);
export const updateProduct = (id, product) => apiClient.put(`/api/products/${id}`, product);
export const patchProduct = (id, updates) => apiClient.patch(`/api/products/${id}`, updates);
export const deleteProduct = (id) => apiClient.del(`/api/products/${id}`);