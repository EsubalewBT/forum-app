// src/utils/api.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./tokenStore";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:4001",
  withCredentials: true,
});

// Attach Authorization header
api.interceptors.request.use((config) => {
  const access = getAccessToken();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    // If 401, try refresh once
    if (status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token) => {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          });
        });
      }
      isRefreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw error;
        const resp = await api.post("/refresh-token", { refreshToken });
        const tokens = resp.data.tokens || resp.data;
        setTokens(tokens);
        processQueue(null, tokens.access.token);
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${tokens.access.token}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        clearTokens();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
