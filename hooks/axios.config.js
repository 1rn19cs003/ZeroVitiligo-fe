import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;

    if (
      error?.response?.status === 401 ||
      message === "Invalid access token" ||
      message === "Token expired"
    ) {
      // clear storage
      localStorage.removeItem("user");

      // notify app
      window.dispatchEvent(new Event("authChanged"));

      // redirect to login
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
    }

    return Promise.reject(error);
  }
);

export default api;
