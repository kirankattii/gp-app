"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Clock, 
  ShieldCheck, 
  Mail, 
  ArrowLeft, 
  LayoutDashboard,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import AppCard from "@/components/core/card/AppCard";
import AppButton from "@/components/core/button/AppButton";
import AppLink from "@/components/core/link/AppLink";

export default function PendingApprovalPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { initializeSession, logout } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // If user is not logged in or not a seller, send them home
    if (!isAuthenticated || user?.role !== "SELLER") {
      router.push("/");
      return;
    }

    // If already approved, send to dashboard
    if (user?.sellerProfile?.approvalStatus === "APPROVED") {
      router.push("/seller/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await initializeSession.mutateAsync();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user || user.role !== "SELLER") return null;

  return (
    <div className="min-h-screen bg-[var(--gp-green)]/5 flex items-center justify-center p-4 selection:bg-[var(--gp-green)]/20 selection:text-[var(--gp-green)]">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0, 0.5, 0.2, 1] }}
        >
          <AppCard className="p-8 md:p-12 shadow-2xl shadow-black/5 bg-white rounded-[3rem] border-none overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--gp-green)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--gp-green)]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative space-y-10 text-center">
              {/* Status Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="h-24 w-24 bg-[var(--gp-green)]/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                  >
                    <Clock className="h-10 w-10 text-[var(--gp-green)]" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md border border-zinc-50"
                  >
                    <ShieldCheck className="h-5 w-5 text-[var(--gp-green)] fill-[var(--gp-green)]/10" />
                  </motion.div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--gp-black)] tracking-tight">
                  Your Profile is Under Review
                </h1>
                <p className="text-zinc-500 max-w-md mx-auto font-medium leading-relaxed">
                  Thank you for joining GreenPeddle! Our administrators are currently reviewing your business details. This usually takes <span className="text-[var(--gp-black)] font-bold">24-48 hours</span>.
                </p>
              </div>

              {/* Progress Steps (Simplified) */}
              <div className="grid grid-cols-3 gap-2 py-4">
                <div className="space-y-2">
                  <div className="h-1.5 bg-[var(--gp-green)] rounded-full w-full" />
                  <span className="text-[10px] font-bold text-[var(--gp-green)] uppercase">Registration</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-[var(--gp-green)] rounded-full w-full animate-pulse" />
                  <span className="text-[10px] font-bold text-[var(--gp-green)] uppercase">Admin Review</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-zinc-100 rounded-full w-full" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase">Dashboard Access</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <AppButton 
                  onClick={handleRefreshStatus}
                  loading={isRefreshing}
                  className="rounded-full px-8 shadow-xl shadow-gp-green/20"
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh Status
                </AppButton>
                <AppButton 
                  variant="outline"
                  onClick={() => logout.mutate()}
                  className="rounded-full px-8 bg-transparent border-foreground/5"
                >
                  Sign Out
                </AppButton>
              </div>

              {/* Informational Footer */}
              <div className="pt-8 flex flex-col items-center gap-4 border-t border-zinc-50">
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                  <Mail className="h-4 w-4" />
                  Questions? <AppLink href="mailto:support@greenpeddle.com" className="text-[var(--gp-green)] font-bold hover:underline">support@greenpeddle.com</AppLink>
                </div>
                <AppLink asLink href="/" noUnderline className="inline-flex items-center text-xs font-bold text-zinc-400 hover:text-[var(--gp-black)] transition-colors">
                  <ArrowLeft className="w-3 h-3 mr-1" /> Back to Home
                </AppLink>
              </div>
            </div>
          </AppCard>

          {/* Bonus Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white flex items-start gap-4 hover:bg-white transition-colors">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verify your details</h4>
                  <p className="text-xs text-zinc-500">Ensure all legal documents are clear and accurate to speed up approval.</p>
                </div>
             </div>
             <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white flex items-start gap-4 hover:bg-white transition-colors">
                <div className="p-3 bg-amber-50 rounded-2xl">
                  <LayoutDashboard className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Prepare your products</h4>
                  <p className="text-xs text-zinc-500">You can start gathering high-quality images for your electric bikes now.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
