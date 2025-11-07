import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://final-project-group1-webdevt-backend.onrender.com/api";
/* 
const BASE_URL = "https://final-project-group1-webdevt-backend.onrender.com/api"; */
 /* "http://localhost:3000/api"; */


const axiosHeader = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
axiosHeader.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 → auto logout
axiosHeader.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    }
    return Promise.reject({
      message: error.response?.data?.message || "An error occurred",
      status: error.response?.status,
    });
  }
);

export const api = {
  get: (url, config = {}) => axiosHeader.get(url, config),
  post: (url, data = {}, config = {}) => axiosHeader.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosHeader.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosHeader.patch(url, data, config),
  delete: (url, config = {}) => axiosHeader.delete(url, config),
};

export default axiosHeader;
