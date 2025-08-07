import axios from "axios";

// Create an instance of axios with the base URL set to the API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // Default to local API if not set
const Client = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add the Authorization token
Client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        // Prevent adding token to refresh token or logout requests
        if (token && !config.url.includes("/auth/token/refresh/") && !config.url.includes("/auth/logout/")) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
Client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Skip retry for logout or token refresh requests to prevent infinite loops
        if (error.response.status === 401 && !originalRequest._retry &&
            !originalRequest.url.includes("/auth/logout/") &&
            !originalRequest.url.includes("/auth/token/refresh/")) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (refreshToken) {
                    const response = await Client.post("/auth/token/refresh/", {
                        refresh: refreshToken,
                    });
                    const { access } = response.data;
                    localStorage.setItem("access_token", access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return Client(originalRequest);
                }
                // If no refresh token, clear local storage
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                delete Client.defaults.headers.common["Authorization"];
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login"; // Redirect to login page
                }
                return Promise.reject(error);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                delete Client.defaults.headers.common["Authorization"];
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login"; // Redirect to login page
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default Client;