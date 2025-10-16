import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const axiosHeader = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosHeader.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosHeader.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      console.error("Network error:", error);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        isNetworkError: true,
      });
    }

    switch (response.status) {
      case 401:
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        window.location.href = "/login";
        break;

      case 403:
        console.error("Forbidden access");
        break;

      case 404:
        console.error("Resource not found");
        break;

      case 500:
        console.error("Server error occurred");
        break;

      default:
        console.error("Request failed with status:", response.status);
    }

    return Promise.reject({
      message: response.data?.message || "An error occurred",
      status: response.status,
      data: response.data,
    });
  }
);

export const api = {
  get: (url, config = {}) => axiosHeader.get(url, config),
  post: (url, data = {}, config = {}) => axiosHeader.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosHeader.put(url, data, config),
  delete: (url, config = {}) => axiosHeader.delete(url, config),
  patch: (url, data = {}, config = {}) => axiosHeader.patch(url, data, config),
};

export default axiosHeader;
