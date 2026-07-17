import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      original._retry = true;

      try {

        const res = await axios.post(
          `${API_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(original);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;