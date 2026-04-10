"use client";

import { motion } from "framer-motion";
import {
  AlertOctagon,
  Mail,
  ArrowLeft,
  FileEdit,
  LifeBuoy
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { sellerService } from "@/services/sellerService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import AppCard from "@/components/core/card/AppCard";
import AppButton from "@/components/core/button/AppButton";
import AppLink from "@/components/core/link/AppLink";

export default function RejectedPage() {
  const { user } = useAuthStore();
  const { logout, initializeSession } = useAuth();
  const router = useRouter();

  const reapplyMutation = useMutation({
    mutationFn: sellerService.reapply,
    onSuccess: async () => {
      await initializeSession.mutateAsync();
      toast.success("You can now restart your onboarding.");
      router.push("/seller/onboarding");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to start reapplication.");
    },
  });

  if (!user || user.role !== "SELLER" || user.sellerProfile?.approvalStatus !== "REJECTED") {
    return null;
  }

  const reason = user.sellerProfile.rejectionReason || "Your application did not meet our current requirements or contained incomplete information.";

  return (
    <div className="min-h-screen bg-red-50/30 flex items-center justify-center p-4 selection:bg-red-200/50 selection:text-red-900">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppCard className="p-8 md:p-12 shadow-2xl shadow-red-900/5 bg-white rounded-[3rem] border-none overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />

            <div className="relative space-y-10 text-center">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <AlertOctagon className="h-10 w-10 text-red-500" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                  Application Not Approved
                </h1>
                <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100/50 text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Review Feedback</h4>
                  <p className="text-zinc-600 font-medium leading-relaxed">
                    {reason}
                  </p>
                </div>
              </div>

              {/* Guidance Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex gap-4">
                  <FileEdit className="w-5 h-5 text-zinc-400 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Next Steps</h5>
                    <p className="text-xs text-zinc-500">You can update your business details and reapply immediately.</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex gap-4">
                  <LifeBuoy className="w-5 h-5 text-zinc-400 shrink-0" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-sm">Need Help?</h5>
                    <p className="text-xs text-zinc-500">Our team can clarify which documents were missing or invalid.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <AppButton
                  onClick={() => reapplyMutation.mutate()}
                  loading={reapplyMutation.isPending}
                  className="rounded-full px-8 bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-black/10"
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Update & Reapply
                </AppButton>
                <AppButton
                  variant="outline"
                  onClick={() => logout.mutate()}
                  className="rounded-full px-8 bg-transparent border-zinc-200 text-zinc-600"
                >
                  Sign Out
                </AppButton>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-zinc-50">
                <AppLink asLink href="/" noUnderline className="inline-flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                  <ArrowLeft className="w-3 h-3 mr-1" /> Return to Home
                </AppLink>
              </div>
            </div>
          </AppCard>
        </motion.div>
      </div>
    </div>
  );
}
