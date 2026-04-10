import axios, { AxiosError } from "axios";

const getBaseURL = () => {
  const url = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  return url.endsWith("/api") ? url : `${url}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Required for cookies
});
// Optional: auto-attach JSON headers
api.defaults.headers.common["Content-Type"] = "application/json";

import { getCookie, removeCookie } from "./cookieUtils";

api.interceptors.request.use((config) => {
  const token = getCookie("gp_token");
  
  if (token) {
    // console.debug("Axios Interceptor: Token found, attaching to header");
    if (!config.headers.get("Authorization")) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  } else {
    // console.debug("Axios Interceptor: Token NOT found in cookies");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Remove token but avoid automatic redirection as requested
      removeCookie("gp_token");
      console.warn("Unauthorized (401). Redirect suppressed.");
    }
    return Promise.reject(error);
  }
);

/** Extracts a human-readable error message from an Axios error response. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default api;
