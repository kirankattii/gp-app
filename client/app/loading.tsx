"use client";

import { motion } from "framer-motion";
import GpSpinner from "@/components/core/Spinner/AppSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="flex items-center justify-center">
          <GpSpinner size="lg" className="scale-150" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--gp-black)]">
            Just a moment...
          </h2>
          <p className="text-sm text-zinc-500 max-w-[280px]">
            We're preparing your experience. Thank you for your patience.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
