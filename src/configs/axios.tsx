import axios from "axios";
const baseUrl = "http://localhost:5155/api/";

const config = {
  baseURL: baseUrl, // Fix: It should be "baseURL", not "baseUrl" for axios config.
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl; // This line is redundant since you already set `baseURL` in the `config` object.

// Handle before API call
const handleBefore = (config) => {
  // Retrieve the token and attach it to the request
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(handleBefore, null);

export default api;
