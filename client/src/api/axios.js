import axios from "axios";

const api = axios.create({
  // Vite proxies /api to the Express server in development. Set VITE_API_URL
  // to the deployed API URL when building for production.
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("soleverse_admin_token") || localStorage.getItem("soleverse_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
