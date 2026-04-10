import api from "@/lib/axios";

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  registerSeller: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register-seller", data),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post("/auth/refresh"),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),
  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),

  google: () =>
    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`),
};