import axios from "axios";

// A API roda em http://localhost:8081 (ver README.MD do backend).
export const API_BASE_URL = "http://localhost:8081";

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("acervo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("acervo_token");
      localStorage.removeItem("acervo_usuario");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  return (
    error?.response?.data?.erro ||
    error?.response?.data?.message ||
    "Ocorreu um erro inesperado. Tente novamente."
  );
}

export default client;
