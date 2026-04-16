"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const { initializeSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncSession = async () => {
      if (!_hasHydrated || syncAttempted.current) return;
      syncAttempted.current = true;
      
      try {
        if (isAuthenticated) {
          await initializeSession.mutateAsync();
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    syncSession();
  }, [_hasHydrated, isAuthenticated, initializeSession]);

  useEffect(() => {
    if (!_hasHydrated || isInitializing) return;

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
    const isFullyOnboarded = completion === 100;

    const isOnboardingPage = pathname.includes("/onboarding");
    const isPendingPage = pathname.includes("/pending-approval");
    const isRejectedPage = pathname.includes("/rejected");
    const isDashboardPath = pathname.includes("/dashboard") || 
                           pathname.includes("/products") || 
                           pathname.includes("/orders") || 
                           pathname.includes("/settings");

    // 1. APPROVED: Restricted to dashboard paths only
    if (isApproved) {
      if (isOnboardingPage || isPendingPage || isRejectedPage) {
        router.push("/seller/dashboard");
        return;
      }
    }

    // 2. REJECTED: Restricted to rejection page only
    if (isRejected) {
      if (!isRejectedPage) {
        router.push("/seller/rejected");
        return;
      }
    }

    // 3. PENDING:
    if (isPending) {
      if (isFullyOnboarded) {
        // If fully onboarded but still pending, force to pending page
        if (!isPendingPage) {
          router.push("/seller/pending-approval");
          return;
        }
      } else {
        // If not fully onboarded, force to onboarding
        if (!isOnboardingPage) {
          router.push("/seller/onboarding");
          return;
        }
      }
      
      // Prevent pending sellers (regardless of completion) from seeing the dashboard
      if (isDashboardPath) {
        router.push(isFullyOnboarded ? "/seller/pending-approval" : "/seller/onboarding");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, _hasHydrated, isInitializing, pathname, router]);

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
