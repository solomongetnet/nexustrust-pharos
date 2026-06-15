import axios from "axios";
const SERVER_URL = "https://nexustrust-backend.solomongetnet.site";

export const api = axios.create({
    baseURL: `${SERVER_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // handle errors globally
        console.error("API error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);