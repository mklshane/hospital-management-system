// src/lib/axiosHeader.js
import axios from "axios";


const BASE_URL = "https://final-project-group1-webdevt-backend.onrender.com/api";
 /* "http://localhost:3000/api"; */

const axiosHeader = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // This sends cookies (token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Debug request (remove in production)
axiosHeader.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log("Cookies sent:", document.cookie);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
axiosHeader.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, request } = error;

    if (!response) {
      // Network error (no response)
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true,
      });
    }

    // 401: Unauthorized (cookie missing or invalid)
    if (response.status === 401) {
      console.warn("401 Unauthorized - Cookie may be missing or expired.");
      // Optional: trigger logout
      // window.location.href = "/login";
    }

    // Return clean error object
    return Promise.reject({
      message: response.data?.message || "An error occurred",
      status: response.status,
      data: response.data,
    });
  }
);

// API helper methods (ensures withCredentials is always true)
export const api = {
  get: (url, config = {}) =>
    axiosHeader.get(url, { ...config, withCredentials: true }),

  post: (url, data = {}, config = {}) =>
    axiosHeader.post(url, data, { ...config, withCredentials: true }),

  put: (url, data = {}, config = {}) =>
    axiosHeader.put(url, data, { ...config, withCredentials: true }),

  patch: (url, data = {}, config = {}) =>
    axiosHeader.patch(url, data, { ...config, withCredentials: true }),

  delete: (url, config = {}) =>
    axiosHeader.delete(url, { ...config, withCredentials: true }),
};

export default axiosHeader;
