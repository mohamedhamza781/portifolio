import axios from 'axios';

// Base API instance — swap baseURL to connect a real backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 20000, // 20s — generous enough for a slow connection or a cold backend
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling + one automatic retry on
// timeout/network failures. Free-tier hosts (e.g. Render) can take 30-50s
// to wake a sleeping backend, and a weak connection can simply be slow —
// a single longer-timeout retry recovers from both without the user
// having to do anything.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }

    const isTimeout = error.code === 'ECONNABORTED';
    const isNetworkError = !error.response && error.message === 'Network Error';
    const config = error.config;

    if ((isTimeout || isNetworkError) && config && !config.__isRetry) {
      config.__isRetry = true;
      config.timeout = 40000; // give the retry extra room to wake a sleeping backend
      try {
        return await api(config);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;