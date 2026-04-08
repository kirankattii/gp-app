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
