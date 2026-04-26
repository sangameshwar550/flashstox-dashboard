import axios from "axios";
import env from "./env";

const api = axios.create({
  baseURL: env.BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const fetchSummary = (days = 5, threshold = 30) =>
  api.get(`/api/dashboard/summary?days=${days}&threshold=${threshold}`).then((r) => r.data);

export const fetchRecentOrders = (days = 5, limit = 50, exchange = "") =>
  api.get(`/api/orders/recent?days=${days}&limit=${limit}&exchange=${exchange}`).then((r) => r.data);

export const fetchLargeOrders = (days = 10, threshold = 30) =>
  api.get(`/api/orders/large?days=${days}&threshold=${threshold}`).then((r) => r.data);

export const fetchTopGainers = (limit = 20) =>
  api.get(`/api/top-gainers?limit=${limit}`).then((r) => r.data);

export const fetchRepeatOrders = (months = 3, minOrders = 2) =>
  api.get(`/api/orders/repeat?months=${months}&minOrders=${minOrders}`).then((r) => r.data);

export const searchOrders = (q, days = 5, limit = 50) =>
  api.get(`/api/orders/search?q=${encodeURIComponent(q)}&days=${days}&limit=${limit}`).then((r) => r.data);

export default api;
