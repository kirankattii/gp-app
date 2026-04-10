import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SellerProfile {
  id: string;
  storeName: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  profileCompletion: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "BUYER" | "SELLER" | "ADMIN" | "SUPERADMIN";
  isEmailVerified: boolean;
  sellerProfile?: SellerProfile | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);