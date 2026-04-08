"use client";

import AppLink from "@/components/core/link/AppLink";
import { MoveLeft, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { AppButton } from "@/components/core/button/AppButton";
import { AppCard } from "@/components/core/card/AppCard";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--gp-surface)] p-4 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <AppCard className="text-center shadow-2xl border-[var(--gp-border)] py-12 px-8">
          <div className="relative flex justify-center mb-10">
            <div className="rounded-full bg-gp-green/10 p-6 ring-12 ring-gp-green/5">
              <FileQuestion className="h-16 w-16 text-gp-green" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -right-4 top-0 rounded-md bg-zinc-800 px-2 py-1 text-xs font-bold text-white shadow-lg"
            >
              404
            </motion.div>
          </div>

          <div className="space-y-4 mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-[var(--gp-black)]">
              Page Not Found
            </h1>
            <p className="mx-auto max-w-[420px] text-zinc-500">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          <div className="flex justify-center">
            <AppLink asLink href="/" noUnderline className="hover:no-underline">
              <AppButton
                size="lg"
                className="flex items-center gap-3 rounded-full px-8"
              >
                <MoveLeft className="h-5 w-5" />
                Back to Home
              </AppButton>
            </AppLink>
          </div>
        </AppCard>
      </motion.div>
    </div>
  );
}
