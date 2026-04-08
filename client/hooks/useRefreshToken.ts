import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

export const useRefresh = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: authService.refresh,
    onSuccess: (res) => {
      setUser(res.data.data);
    },
  });
};