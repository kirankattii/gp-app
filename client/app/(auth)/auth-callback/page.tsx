"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initializeSession } = useAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "true" && !hasTriggered.current) {
      hasTriggered.current = true;
      initializeSession.mutate(undefined, {
        onSuccess: (res) => {
          toast.success("Successfully logged in with Google!");
          // Redirect to home or dashboard. Since (dashboard) exists, 
          // but seems empty, we'll go to home "/" for now.
          router.push("/");
        },
        onError: () => {
          toast.error("Google authentication failed. Please try again.");
          router.push("/login");
        },
      });
    } else if (success !== "true") {
      router.push("/login");
    }
  }, [searchParams, initializeSession, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-8 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-[var(--gp-green)]" />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gp-black">Authenticating...</h1>
        <p className="text-zinc-500 font-medium">
          Completing your secure sign-in with Google.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-[var(--gp-green)]" />
        </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
