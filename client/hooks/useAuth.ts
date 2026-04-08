import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      setUser(res.data.data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    },
  });

  const register = useMutation({
    mutationFn: authService.register,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
    },
  });

  const logout = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => clearUser(),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Logout failed. Please try again."));
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
    },
    onError: () => {
      clearUser();
    },
  });

  return { login, register, logout, forgotPassword, resetPassword, initializeSession };
};