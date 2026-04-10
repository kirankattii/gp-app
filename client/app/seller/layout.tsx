"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import { Loader2 } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=" + pathname);
      return;
    }

    if (user?.role !== "SELLER") {
      router.push("/");
      return;
    }

    // Protection logic for specific status-based pages
    const status = user.sellerProfile?.approvalStatus;
    const completion = user.sellerProfile?.profileCompletion || 0;
    const isApproved = status === "APPROVED";
    const isPending = status === "PENDING";
    const isRejected = status === "REJECTED";
    const hasStartedOnboarding = completion > 10;

    // If approved, they should always be on the dashboard
    if (isApproved && (pathname.includes("/onboarding") || pathname.includes("/pending-approval") || pathname.includes("/rejected"))) {
      router.push("/seller/dashboard");
      return;
    }

    // If pending and finished/started onboarding (threshold > 10), they should be on the pending page
    if (isPending && hasStartedOnboarding && (pathname.includes("/dashboard") || pathname.includes("/onboarding"))) {
      router.push("/seller/pending-approval");
      return;
    }

    // If pending but NOT finished onboarding, they should be allowed on the onboarding page
    if (isPending && !hasStartedOnboarding && (pathname.includes("/dashboard") || pathname.includes("/pending-approval"))) {
      router.push("/seller/onboarding");
      return;
    }

    // If rejected, redirect to rejection page
    if (isRejected && !pathname.includes("/rejected")) {
      router.push("/seller/rejected");
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, _hasHydrated, pathname, router]);

  if (!_hasHydrated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[var(--gp-green)] animate-spin mx-auto" />
          <p className="text-zinc-500 font-medium text-sm animate-pulse tracking-tight">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
