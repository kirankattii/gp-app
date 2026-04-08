"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import AppLink from "@/components/core/link/AppLink";
import { motion } from "framer-motion";
import { AppButton } from "@/components/core/button/AppButton";
import { AppCard } from "@/components/core/card/AppCard";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--gp-surface)] p-4 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <AppCard className="text-center shadow-xl border-[var(--gp-border)]">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-gp-error/10 p-4 ring-8 ring-gp-error/5">
              <AlertCircle className="h-12 w-12 text-gp-error" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--gp-black)]">
              Something went wrong
            </h1>
            <p className="text-zinc-500">
              An unexpected error occurred. Please try again or contact support if the issue persists.
            </p>
          </div>

          {error.digest && (
            <div className="rounded-lg bg-zinc-50 p-3 text-xs font-mono text-zinc-400 mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
              Error ID: {error.digest}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <AppButton
              onClick={() => reset()}
              color="danger"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </AppButton>
            <AppLink asLink href="/" noUnderline className="w-full sm:w-auto hover:no-underline">
              <AppButton
                variant="outline"
                color="neutral"
                className="flex items-center gap-2 w-full"
              >
                <Home className="h-4 w-4" />
                Go home
              </AppButton>
            </AppLink>
          </div>
        </AppCard>
      </motion.div>
    </div>
  );
}
