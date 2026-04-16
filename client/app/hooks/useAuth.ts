import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios";
import { setCookie, removeCookie } from "@/lib/cookieUtils";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      setUser(res.data.user);
      if (res.data.accessToken) {
        setCookie("gp_token", res.data.accessToken, 7);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: (res) => {
      if (res.data.user) setUser(res.data.user);
      if (res.data.accessToken) {
        setCookie("gp_token", res.data.accessToken, 7);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
    },
  });

  const registerSeller = useMutation({
    mutationFn: authService.registerSeller,
    onSuccess: (res) => {
      if (res.data.user) setUser(res.data.user);
      if (res.data.accessToken) {
        setCookie("gp_token", res.data.accessToken, 7);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Seller registration failed. Please try again."));
    },
  });

  const logout = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearUser();
      removeCookie("gp_token");
      if (typeof window !== "undefined") window.location.href = "/login";
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Logout failed. Please try again."));
      clearUser();
      removeCookie("gp_token");
      if (typeof window !== "undefined") window.location.href = "/login";
    },
  });

  const forgotPassword = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success("Reset link sent! Please check your email.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to send reset link. Please try again."));
    },
  });

  const resetPassword = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Password updated successfully! Redirecting to login...");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to reset password. The link may have expired."));
    },
  });

  const initializeSession = useMutation({
    mutationFn: authService.refresh,
    onSuccess: (res) => {
      setUser(res.data.user);
      if (res.data.accessToken) {
        setCookie("gp_token", res.data.accessToken, 7);
      }
    },
    onError: () => {
      clearUser();
      removeCookie("gp_token");
    },
  });

  return { login, register, registerSeller, logout, forgotPassword, resetPassword, initializeSession };
};
