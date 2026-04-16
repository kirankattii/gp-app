import React from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { useAuth } from "@/app/hooks/useAuth";
import { Phone, User, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";

const UserProfile: React.FC = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-1 px-4 py-4 border-t border-zinc-100/50 bg-white/40">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {user.sellerProfile?.storeLogo ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image 
                src={user.sellerProfile.storeLogo}
                alt={user.name || "User"} 
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border-2 border-white shadow-sm">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-zinc-800 truncate leading-tight">
            {user.name}
          </div>
          <div className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-wider">
            {user.role}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-gp-green font-bold bg-gp-green/5 px-2 py-0.5 rounded-full border border-gp-green/10">
            {user.sellerProfile?.approvalStatus || "ACTIVE"}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-gp-error transition-colors px-2 py-1 rounded-lg hover:bg-gp-error/5 group"
        >
          {logout.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
          )}
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
