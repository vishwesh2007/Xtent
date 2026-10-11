import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const activeOrg = localStorage.getItem("activeOrg");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeOrg) {
      try {
        const organization = JSON.parse(activeOrg);

        if (organization?._id) {
          config.headers["x-org-id"] = organization._id;
        }
      } catch {
        localStorage.removeItem("activeOrg");
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
