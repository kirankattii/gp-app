import axios, { AxiosError } from "axios";
import { getCookie, setCookie, removeCookie } from "@/lib/cookieUtils";

const getBaseURL = () => {
  const url = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  ).replace(/\/$/, "");
  return url.endsWith("/api") ? url : `${url}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

api.defaults.headers.common["Content-Type"] = "application/json";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getCookie("gp_token");

  if (token && config.headers) {
    const bearerToken = `Bearer ${token}`;

    if (typeof config.headers.set === "function") {
      if (!config.headers.get("Authorization")) {
        config.headers.set("Authorization", bearerToken);
      }
    } else {
      (config.headers as any).Authorization =
        (config.headers as any).Authorization || bearerToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes("/auth/refresh")
    ) {
      removeCookie("gp_token");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        api
          .post("/auth/refresh")
          .then(({ data }) => {
            const token = data.accessToken;
            setCookie("gp_token", token, 7);
            api.defaults.headers.common["Authorization"] = "Bearer " + token;
            originalRequest.headers["Authorization"] = "Bearer " + token;
            processQueue(null, token);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            removeCookie("gp_token");
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

/** Extracts a human-readable error message from an Axios error response. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default api;
