"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import AppCard from "@/components/core/card/AppCard";
import AppSpinner from "@/components/core/Spinner/AppSpinner";
import AppButton from "@/components/core/button/AppButton";
import { CheckCircle2, XCircle, ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AppLink from "@/components/core/link/AppLink";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { setUser } = useAuthStore();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    authService.verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage("Your email has been verified successfully! Redirecting...");
        
        // Update auth state with verified user data only if it exists
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
        
        // Always schedule redirect on success (with or without user data)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      });

    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [token, setUser, router]);

  return (
    <div className="p-8 text-center space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        {status === "loading" && (
          <div className="h-16 w-16 bg-[var(--gp-green)]/10 rounded-full flex items-center justify-center">
            <AppSpinner size="lg" />
          </div>
        )}
        {status === "success" && (
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
        )}
        {status === "error" && (
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--gp-black)]">
            {status === "loading" ? "Verifying..." : status === "success" ? "All Set!" : "Verification Failed"}
          </h1>
          <p className="text-sm text-zinc-500 font-medium max-w-[240px] mx-auto">
            {message}
          </p>
        </div>
      </div>

      <div className="pt-4">
        {status === "success" ? (
          <AppLink
            asLink
            href="/login"
            className="flex items-center justify-center gap-2 text-white no-underline hover:no-underline w-full px-4 py-2 rounded-xl shadow-lg shadow-gp-green/20 bg-[var(--gp-green)] font-medium text-base"
          >
            Go to Dashboard
          </AppLink>
        ) : (
          <p className="text-sm text-zinc-500">
            <AppLink
              asLink
              href="/login"
              showLinkColor
              className="font-bold underline-offset-4 flex inline-flex items-center gap-1 group"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Back to login
            </AppLink>
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center">
        <AppSpinner />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}